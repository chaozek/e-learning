import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { List, ListItem } from "pages/course/[slug]";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import StudentRoute from "../../../components/routes/StudentRoute";
const SingleCourse = () => {
  const router = useRouter();
  const [course, setCourse] = useState({});
  const [clicked, setClicked] = useState(1);
  const [collapse, setCollapse] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [updateState, setUpdateState] = useState(false);
  const { slug } = router.query;
  const getCourse = async () => {
    const { data } = await axios.get(`/api/course/user/${slug}`);
    setCourse(data);
  };
  console.log(course, "course");
  useEffect(() => {
    if (slug) {
      getCourse();
    }
  }, [slug]);
  console.log(course);
  const markComplete = async (lessonId) => {
    const { data } = await axios.post(`/api/mark-complete`, {
      courseId: course._id,
      lessonId,
    });
    setCompletedLessons([...completedLessons, lessonId]);
  };

  useEffect(() => {
    if (course) loadCompletedLessons();
  }, [course, updateState]);

  const loadCompletedLessons = async () => {
    const { data } = await axios.post(`/api/list-completed`, {
      courseId: course._id,
    });
    setCompletedLessons(data);
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

  useEffect(() => {
    const collapse = localStorage.getItem("userMenu");
    const parsedCollapse = JSON.parse(collapse);
    setCollapse(parsedCollapse);
  }, []);
  const handleCollapse = (mode) => {
    localStorage.setItem("userMenu", JSON.stringify(mode));
    setCollapse(mode);
  };
  return (
    <StudentRoute>
      <div>
        <div>
          <div className="w-100 flex justify-content-center flex-column align-center">
            {course?.lessons?.map((lesson) => {
              return (
                <List className="flex justify-content-between">
                  <Link href={`/user/course/${course.slug}/${lesson.slug}`}>
                    <ListItem
                      className="flex pt-10 p-2"
                      style={{
                        textOverflow: "ellipsis",
                        cursor: "pointer",
                      }}
                    >
                      <i class="bi bi-play-fill"></i>
                      <p
                        data-tip="You have to buy this course first"
                        style={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {lesson.title}
                      </p>
                    </ListItem>
                  </Link>
                </List>
              );
            })}
          </div>
        </div>
      </div>
    </StudentRoute>
  );
};

export default SingleCourse;
