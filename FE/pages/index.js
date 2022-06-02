import React, { useContext, useEffect } from "react";
import axios from "axios";
import { Homepage } from "../features/pages/Homepage_page";
import Layout from "../Layouts/Layout";
import { Context } from "context";
import { useRouter } from "next/router";
const Index = ({ courses, req, cookies }) => {
  const router = useRouter();
  useEffect(() => {
    console.log(req, "REQ", cookies, "COK");
    if (req && !cookies) {
      dispatch({
        type: "LOGOUT",
      });
      router.push("/login");
    }
  }, []);
  const {
    state: { user },
    dispatch,
  } = useContext(Context);
  console.log(req, "REQ");

  return (
    <Layout>
      <Homepage courses={courses} header="Courses" />;
    </Layout>
  );
};
export async function getServerSideProps(context) {
  const { params, req, res } = context;
  console.log(req.cookies.user, "req.cookies.user");
  if (req.cookies.user || req.cookies.token) {
    const token = context.req.cookies.token;
    const { data } = await axios.get(
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/api/courses/${req.cookies.user}`
        : `${process.env.NEXT_PUBLIC_API}/api/courses/${req.cookies.user}`
    );
    return {
      props: {
        courses: data,
        req: true,
        cookies: req.cookies.user,
      },
    };
  } else if (req.cookies.user && !req.cookies.token) {
    return;
  } else {
    const token = context.req.cookies.token;
    const { data } = await axios.get(
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/api/courses/`
        : `${process.env.NEXT_PUBLIC_API}/api/courses`
    );
    return {
      props: {
        courses: data,
        req: false,
      },
    };
  }
}

export default Index;
