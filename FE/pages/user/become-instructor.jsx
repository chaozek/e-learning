import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useContext } from "react";
import { Context } from "../../context";
import UserRouter from "../../components/routes/UserRoute";
const BecomeInstructor = () => {
  const {
    state: { user },
    dispatch,
  } = useContext(Context);
  const handleClick = () => {
    axios
      .post("/api/make-instructor")
      .then((res) => {
        window.location.href = res.data;
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.status, {
          icon: false,
        });
      });
  };
  return (
    <UserRouter>
      <h1>Create Course</h1>
      <button onClick={(e) => handleClick(e)}>Become Instructor</button>
    </UserRouter>
  );
};

export default BecomeInstructor;
