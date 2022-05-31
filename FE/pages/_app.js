import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import React from "react";
import Hero from "./../components/Hero";
import Layout from "../Layouts/Layout";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { Provider } from "../context/index";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "../components/nav/Nav";
import { GlobalStyles } from "../styling/GlobalStyles";
import "../styling/styles.global.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider>
      <Head>
        <title>SSR styled-components with Next.js Starter</title>
        <link rel="shortcut icon" href="../favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
        />
      </Head>
      <GlobalStyles />
      <ToastContainer />
      <Nav />
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
