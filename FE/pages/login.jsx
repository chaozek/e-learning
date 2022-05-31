import styled from "styled-components";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Context } from "../context";
import { useRouter } from "next/router";
import Link from "next/link";

import Layout from "Layouts/Layout";
import {
  AlignPage,
  Button,
  Form,
  Input,
} from "@/styling/GlobalStyledCompStyles";
const login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useContext(Context);
  const router = useRouter();
  const something = (event) => {
    if (event.keyCode === 13) {
      console.log("enter");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await axios.post(`/api/login`, formData);
      console.log(data, "DATA");
      dispatch({
        type: "LOGIN",
        payload: data.data.user,
      });
      toast.success(data.data.user.name + "," + " " + "WELCOME", {
        icon: "🚀",
      });
      setLoading(false);
      router.push("/");
    } catch (error) {
      console.log("ERR", error.response);
      toast.error(error.response.data.error, {
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
        <h2>Login</h2>
        <Form onSubmit={(e) => handleSubmit(e)}>
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
          <Button type="submit" disabled={!formData.email || loading}>
            {loading ? "LOADING" : "LOGIN"}
          </Button>
        </Form>
        <p>
          <Link href="/forgot-password">Forgot password?</Link>
        </p>
      </AlignPage>
    </Layout>
  );
};

export default login;
