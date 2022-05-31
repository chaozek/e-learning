import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context";
import axios from "axios";
import UserRoute from "../components/routes/UserRoute";
import Link from "next/link";
import { MyCourses } from "features/pages/MyCourses_page";
import Layout from "Layouts/Layout";
const user = () => {
  const [courses, setCourses] = useState([]);
  const {
    state: { user },
    dispatch,
  } = useContext(Context);
  const loadCourses = async () => {
    const { data } = await axios.get(`/api/user-courses`);
    setCourses(data);
  };
  useEffect(() => {
    loadCourses();
  }, []);
  return (
    <Layout>
      <MyCourses myCourses={true} courses={courses} header={"My Courses"} />
    </Layout>
  );
};

export default user;
