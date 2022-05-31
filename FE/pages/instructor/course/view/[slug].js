import { useEffect, useState } from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import ReactMarkdown from "react-markdown";
import reactMarkdown from "react-markdown";
import { CardHeader } from "features/Card/components/CardList";
import { Button, Li, Ul } from "@/styling/GlobalStyledCompStyles";
const CourseView = () => {
  const router = useRouter();
  const [course, setCourse] = useState({ name: "", lessons: [{}] });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [students, setStudents] = useState(0);
  const { slug } = router.query;
  const [values, setValues] = useState({
    title: "",
    content: "",
    video: "",
  });
  const loadData = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
  };
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/course/${slug}/${course.instructor._id}`,
        values
      );
      setCourse(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadData();
  }, [slug]);

  useEffect(() => {
    course && studentCount();
  }, [course]);

  const studentCount = async () => {
    const { data } = await axios.post(`/api/instructor/student-count`, {
      courseId: course._id,
    });
    console.log(data, "ĎATA");
    setStudents(data.length);
  };
  const handleVideo = async (e) => {
    try {
      const video = e.target.files[0];
      setLoading(true);
      const videoData = new FormData();
      videoData.append("video", video);
      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round(100 * e.loaded) / e.total);
          },
        }
      );
      setValues({ ...values, video: data });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };
  console.log(progress);

  const handleVideoRemove = async () => {
    try {
      const { data } = await axios.post(
        `/api/course/remove-video/${course.instructor._id}`,
        {
          video: values.video,
        }
      );
      setValues({ ...values, video: {} });
      setProgress(0);
    } catch (error) {
      console.log(error);
    }
  };
  const handlePublish = async (e, courseId, method) => {
    if (method == "publish") {
      const { data } = await axios.put(`/api/course/publish/${courseId}`);
      toast("Your course is rdy");
      setCourse(data);
      console.log(data, "DATA");
      console.log(course, "COURSEUPDATED");
    } else {
      const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
      toast("Your course is unpublished");
      setCourse(data);
    }
  };
  const handleShow = async (e) => {};
  return (
    <InstructorRoute>
      <>
        <CardHeader>Course overview</CardHeader>
        {course && (
          <>
            <h1>{course.name}</h1>
            <ReactMarkdown>{course.description}</ReactMarkdown>
            <img src={course?.image?.Location} style={{ width: "200px" }} />
          </>
        )}
        <div style={{ display: "flex" }}>
          <p>
            Students: {students} Lessons: {course && course.lessons.length}{" "}
          </p>
        </div>
        <>
          <Button>
            {course && !course.published ? (
              <p
                style={{ fontWeight: "bold" }}
                onClick={(e) => handlePublish(e, course._id, "publish")}
              >
                Publish Course
              </p>
            ) : (
              <p
                style={{ fontWeight: "bold" }}
                onClick={(e) => handlePublish(e, course._id, "unpublish")}
              >
                Unpublish Course
              </p>
            )}
          </Button>
          <Button
            onClick={() => router.push(`/instructor/course/edit/${slug}`)}
          >
            Edit
          </Button>
          <Button onClick={() => setShow(!show)}>Add Lesson</Button>
        </>
        <div>
          {show && (
            <>
              <form>
                <label style={{ width: "100%" }}>
                  <span>Title</span>
                  <input
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={(e) => handleChange(e)}
                  />
                </label>
                <label style={{ width: "100%" }}>
                  <span>description</span>
                  <textarea
                    type="text"
                    name="content"
                    value={values.content}
                    onChange={(e) => handleChange(e)}
                  />
                </label>
                {!loading ? (
                  <div style={{ position: "relative" }}>
                    {values.video.Location && (
                      <div
                        style={{
                          backgroundColor: "red",
                          width: "20px",
                          textAlign: "center",
                          position: "absolute",
                          left: "-30px",
                          cursor: "pointer",
                          color: "white",
                          fontWeight: "bold",
                          borderRadius: "100%",
                        }}
                        onClick={() => handleVideoRemove()}
                      >
                        X
                      </div>
                    )}
                    <label style={{ width: "100%" }}>
                      <span>video</span>
                      <input
                        type="file"
                        name="video"
                        onChange={(e) => handleVideo(e)}
                        accept="video/*"
                      />
                    </label>
                  </div>
                ) : (
                  "Loading"
                )}
                <Button onClick={(e) => handleSubmit(e)}>
                  SUBMIT & Continue
                </Button>
              </form>
            </>
          )}
        </div>
      </>
      {course && course.lessons.length > 0 && (
        <>
          <h4 className="mt-3">Lessons:</h4>
          <Ul>
            {course.lessons.map((lesson, i) => {
              return (
                <>
                  <Li>
                    {i + 1}. {lesson.title}
                  </Li>
                </>
              );
            })}
          </Ul>
        </>
      )}
    </InstructorRoute>
  );
};

export default CourseView;
