import axios from "axios";
import { CardHeader } from "features/Card/components/CardList";
import Layout from "Layouts/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import StudentRoute from "../../../components/routes/StudentRoute";
import styled, { keyframes } from "styled-components";
import { Animated } from "react-animated-css";

import {
  Button,
  Li,
  StyledLink,
  StyledLinkWrapper,
  Ul,
} from "@/styling/GlobalStyledCompStyles";
import Sidebar from "features/Sidebar/Sidebar";

const LessonName = () => {
  const router = useRouter();
  const [lesson, setLesson] = useState({});
  const [course, setCourse] = useState("");
  const [collapse, setCollapse] = useState(false);
  const [clicked, setClicked] = useState(1);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [updateState, setUpdateState] = useState(false);
  const query = router.query.lessonName;
  const lessonIdSlug = query && query[2];
  const lessonSlug = query && query[1];
  const courseSlug = query && query[0];
  const getLesson = async () => {
    const { data } = await axios.get(
      `/api/course/user/${courseSlug}/${lessonSlug}/${lessonIdSlug}`
    );
    setLesson(data.lesson);
    setCourse(data.course);
  };

  useEffect(() => {
    if (lessonSlug && courseSlug) {
      getLesson();
      console.log(lesson, "LESSON");
    }
  }, [lessonSlug, courseSlug]);
  const markComplete = async (lessonId) => {
    const { data } = await axios.post(`/api/mark-complete`, {
      courseId: course._id,
      lessonId,
    });
    setCompletedLessons([...completedLessons, lessonId]);
    console.log(completedLessons, "COMPLETED");
  };

  const handleCollapse = (mode) => {
    localStorage.setItem("userMenu", JSON.stringify(mode));
    setCollapse(mode);
  };

  useEffect(() => {
    if (course) loadCompletedLessons();
  }, [course, updateState]);

  useEffect(() => {
    const collapse = localStorage.getItem("userMenu");
    const parsedCollapse = JSON.parse(collapse);
    setCollapse(parsedCollapse);
  }, []);

  const loadCompletedLessons = async () => {
    const { data } = await axios.post(`/api/list-completed`, {
      courseId: course._id,
    });
    if (data) {
      setCompletedLessons(data);
    }
  };
  const markIncomplete = async (lessonId) => {
    try {
      const { data } = await axios.post(`/api/mark-incompleted`, {
        courseId: course._id,
        lessonId,
      });
      const all = completedLessons;
      const index = all.indexOf(lessonId);
      if (index > -1) {
        all.splice(index, 1);
        setCompletedLessons(all);
        setUpdateState(!updateState);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <StudentRoute>
      <CardHeader className="mt-5">{course.name}</CardHeader>
      <HeaderText>{lesson?.title}</HeaderText>
      {!course.lessons ? (
        "LOADING"
      ) : (
        <div style={{ display: "flex" }}>
          <Sidebar
            course={course}
            lesson={lesson}
            completedLessons={completedLessons}
            handleCollapse={handleCollapse}
            collapse={collapse}
            setClicked={setClicked}
          />
          <div style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#EFEFEF",
                fontWeight: "bold",
                color: "#616161",
                cursor: "pointer",
                borderRadius: "5px",
                padding: "2px",
              }}
            >
              <Button small radius onClick={() => handleCollapse(!collapse)}>
                {collapse ? (
                  <i class="bi bi-chevron-bar-left"></i>
                ) : (
                  <i class="bi bi-chevron-bar-right"></i>
                )}
              </Button>
              {completedLessons.includes(course.lessons[clicked]._id) ? (
                <p onClick={() => markIncomplete(course.lessons[clicked]._id)}>
                  Mark As Incomplete <i class="bi bi-dash-circle-fill red"></i>
                </p>
              ) : (
                <p onClick={() => markComplete(course.lessons[clicked]._id)}>
                  Mark As Completed{" "}
                  <i class="bi bi-check-circle-fill green"></i>
                </p>
              )}
            </div>
            <ReactPlayer
              url={lesson?.video?.Location}
              width="100%"
              controls
              onEnded={() => markComplete(lessons._id)}
            />
            <p>{course.lessons[clicked].content}</p>
          </div>
        </div>
      )}
    </StudentRoute>
  );
};

const fadeIn = keyframes`
   0% {
    opacity: 0;
    transform: translateY(2rem);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;
export const HeaderText = styled.h3`
  text-align: center;
  font-style: italic;
  font-weight: bold;
`;

export const Slider = styled.div`
  animation: fadeIn 0.2s ease-in-out;
`;
export default LessonName;
