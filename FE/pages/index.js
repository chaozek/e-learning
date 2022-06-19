import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Homepage } from "../features/pages/Homepage_page";
import Layout from "../Layouts/Layout";
import { Context } from "context";
import { useRouter } from "next/router";
import { useRef } from "react";
import { io } from "socket.io-client";

const Index = ({ courses, req, cookies }) => {
  const router = useRouter();
  const [response, setResponse] = useState("");
  const [socket, setSocket] = useState("");

  useEffect(() => {
    setSocket(
      io.connect(
        "localhost:8000",
        { transports: ["websocket"] },
        {
          path: "/socket/index.js",
          cors: {
            origin: "http://localhost:8000",
            methods: ["GET", "POST"],
          },
        }
      )
    );
  }, []);

  useEffect(() => {
    socket &&
      socket?.on("welcome", (message) => {
        console.log(message);
      });
  }, [socket]);
  console.log(socket, "socket");
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
      <Homepage response={response} courses={courses} header="Courses" />;
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
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${req.cookies.user}`
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
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses`
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
