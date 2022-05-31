import { useReducer, createContext, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const initialState = {
  user: null,
};

const Context = createContext();

const rootReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT": {
      localStorage.removeItem("user");
      return {
        ...state,
        user: null,
      };
    }
    default:
      return state;
  }
};

//context provider
const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: "LOGIN",
      payload: JSON.parse(localStorage.getItem("user")),
    });
  }, []);

  // Add a response interceptor
  axios.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    function (error) {
      let res = error.response;
      console.log(res, "ERROR");
      if (
        res &&
        res.status &&
        (res.status === 401 || res.status === 403) &&
        res.config &&
        !res.config.__isRetryRequest
      ) {
        return new Promise((resolve, reject) => {
          axios
            .get("/api/logout")
            .then((data) => {
              dispatch({ type: "LOGOUT" });
              window.localStorage.removeItem("user");
              router.push("/login");
            })
            .catch((err) => {
              console.log("AXIOS", err);
              reject(err);
            });
        });
      }
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const getCsrf = async () => {
      const { data } = await axios.get("/api/csrf-token");
      axios.defaults.headers["X-CSRF-Token"] = data.csrfToken;
    };
    getCsrf();
  }, []);

  return (
    <Context.Provider value={{ state, dispatch }}> {children}</Context.Provider>
  );
};
export { Provider, Context };
