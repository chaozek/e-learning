import React, { useState, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Context } from "../context";
import { useRouter } from "next/router";
const login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    code: "",
  });
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const { state, dispatch } = useContext(Context);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const email = formData.email;
      const data = await axios.post(`/api/forgot-password`, { email });
      setOk(true);
      setLoading(false);
      toast.success(data.data.user.name + "Check your email", {
        icon: "🚀",
      });
    } catch (error) {
      toast.error(error.response, {
        icon: false,
      });
      setLoading(false);
    }
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await axios.post(`/api/reset-password`, formData);
      setOk(false);
      setLoading(false);
      setFormData({
        email: "",
        password: "",
        code: "",
      });
      toast.success("You can login now", {
        icon: "🚀",
      });
    } catch (error) {
      toast.error(error.response, {
        icon: false,
      });
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <>
      <div>
        <div>
          <div>
            <form>
              <label>
                <span>e-mail</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleChange(e)}
                  disabled={ok}
                />
              </label>
              {ok && (
                <>
                  <label>
                    <span>code</span>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={(e) => handleChange(e)}
                    />
                  </label>
                  <label>
                    <span>password</span>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => handleChange(e)}
                    />
                  </label>
                </>
              )}
            </form>
          </div>
          <button
            onClick={(e) => (ok ? handleChangePassword(e) : handleSubmit(e))}
            disabled={!formData.email || loading}
          >
            {loading ? "LOADING" : "SEND PASSWORD"}
          </button>
        </div>
      </div>
    </>
  );
};

export default login;
