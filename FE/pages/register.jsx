import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  AlignPage,
  Button,
  Form,
  Input,
} from "@/styling/GlobalStyledCompStyles";
import Layout from "Layouts/Layout";

const register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await axios.post(`/api/register`, formData);
      console.log(data);
      toast.success(data.data.email + "WELCOME", {
        icon: "🚀",
      });
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.message, "MSG");
      toast.error(error.response.data.message, {
        icon: false,
      });
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <Layout>
      <AlignPage>
        <h2>Register</h2>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <label>
            <span>Nick Name</span>
          </label>
          <Input
            type="name"
            name="name"
            value={formData.name}
            onChange={(e) => handleChange(e)}
          />
          <label>
            <span>Email</span>
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange(e)}
          />
          <label>
            <span>Password</span>
          </label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => handleChange(e)}
          />
          <label>
            <span>Repeat Password</span>
          </label>
          <Input
            type="password"
            name="passwordRepeat"
            value={formData.passwordRepeat}
            onChange={(e) => handleChange(e)}
          />
          <Button
            type="submit"
            disabled={!formData.name || !formData.email || loading}
          >
            {loading ? "LOADING" : "REGISTER"}
          </Button>
        </Form>
      </AlignPage>
    </Layout>
  );
};

export default register;
