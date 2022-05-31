import { useEffect, useState } from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import ReactPlayer from "react-player";
import { CardHeader } from "features/Card/components/CardList";
import {
  Button,
  Input,
  Li,
  Select,
  Textarea,
  Ul,
} from "@/styling/GlobalStyledCompStyles";
import { List } from "pages/course/[slug]";

const EditCourse = () => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: 9.99,
    uploading: false,
    paid: false,
    loading: false,
    category: "",
    image: "",
    instructor: "",
    lessons: [],
  });
  const [preview, setPreview] = useState("");
  const [course, setCourse] = useState("");
  const [image, setImage] = useState({});
  const [current, setCurrent] = useState({ title: "", content: "", video: "" });
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("");
  const router = useRouter();
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleChangeCurrent = (e) => {
    setCurrent({ ...current, [e.target.name]: e.target.value });
  };

  const { slug } = router.query;

  const handleImage = (e) => {
    setValues({ ...values, loading: true });
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);

    Resizer.imageFileResizer(
      file,
      720,
      500,
      "JPEG",
      100,
      0,
      async (url) => {
        try {
          setLoading(true);
          let { data } = await axios.post("/api/image-upload", {
            image: url,
          });
          setValues({ ...values, loading: false });
          setImage(data);
          setLoading(false);
        } catch (error) {
          console.log(error.response);
          setLoading(false);
          toast("ERROR, IMAGE NOT UPLOADED");
          setValues({ ...values, loading: false });
        }
      },
      "base64"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      router.push("/instructor");
      toast("Course Updated");
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    if (data && data.image) setImage(data.image);
    setValues(data);
  };
  const handleDrag = (e, i) => {
    e.dataTransfer.setData("itemIndex", i);
  };
  const handleDrop = async (e, i) => {
    const movingItemIndex = e.dataTransfer.getData("itemIndex");
    const targetItemIndex = i;
    let allLessons = values.lessons;
    let movingItem = allLessons[movingItemIndex]; //clicked dragged item to re-order
    allLessons.splice(movingItemIndex, 1); //remove one item from given index
    allLessons.splice(targetItemIndex, 0, movingItem);
    setValues({ ...values, lessons: [...allLessons] });
    const { data } = await axios.put(`/api/course/${slug}`, {
      ...values,
      image,
    });
    toast("LESSONS REARANGED");
  };
  useEffect(() => {
    loadCourse();
  }, [slug]);

  const handleDelete = async (e, i) => {
    const answer = window.confirm("Sure u wanna Delete?");
    if (!answer) return;
    let allLessons = values.lessons;
    const removed = allLessons.splice(i, 1);
    setValues({ ...values, lessons: allLessons });
    const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`);
    setCurrent({ ...current, video: data });
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    const { data } = await axios.put(
      `/api/course/lesson/${slug}/${current._id}`,
      { current: current }
    );
    toast("LESSON UPDATED");
    console.log(data, "DATA");

    if (data.ok) {
      let arr = values.lessons;
      const index = arr.findIndex((el) => el._id === current._id);
      arr[index] = current;
      setValues({ ...values, lessons: arr });
    }
  };

  const handleVideo = async (e) => {
    if (current.video && current.video.Location) {
      const res = await axios.post(
        `/api/course/remove-video/${values.instructor._id}`,
        { video: current.video }
      );
      setCourse(data);
    }
    const file = e.target.files[0];
    const videoData = new FormData();
    videoData.append("video", file);
    console.log(videoData, "FILE");
    console.log("values._id", values._id);
    videoData.append("courseId", values._id);

    const { data } = await axios.post(
      `/api/course/video-upload/${values.instructor._id}`,
      videoData,
      {
        onUploadProgress: (e) => {
          setProgress(Math.round((100 * e.loaded) / e.total));
        },
      }
    );
    setCurrent({ ...current, video: data });
  };
  return (
    <InstructorRoute>
      {!values ? (
        "LOADING"
      ) : (
        <>
          <CardHeader>Edit Course</CardHeader>
          <form className="flex" style={{ flexDirection: "column" }}>
            <label>
              <span>Course name</span>
            </label>
            <Input
              type="text"
              style={{ flex: "auto" }}
              name="name"
              value={values.name}
              onChange={(e) => handleChange(e)}
            />
            <label>
              <span>Course free or paid</span>
            </label>
            <Select
              onChange={(e) => {
                setValues({
                  ...values,
                  paid: JSON.parse(e.target.value),
                  price: 0,
                });
              }}
            >
              <option value={false}>Free</option>
              <option value={true}>Paid</option>
            </Select>
            {values.paid === true && (
              <>
                <label>
                  <span>Price</span>
                </label>
                <Input
                  type="number"
                  name="price"
                  value={values.price}
                  onChange={(e) => handleChange(e)}
                />
              </>
            )}
            <label style={{ width: "100%" }}>
              <span>Description</span>
            </label>
            <Textarea
              type="text"
              name="description"
              value={values.description}
              onChange={(e) => handleChange(e)}
            />

            {loading ? (
              "UPLOADING..."
            ) : (
              <div>
                <label>
                  <span>{image.Key ? image.Key : "Upload Image"}</span>
                </label>
                <div
                  style={{
                    borderRadius: "20px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="file"
                    name="image"
                    onChange={(e) => handleImage(e)}
                    accept="image/*"
                    className="py-2"
                  />
                </div>
                {!preview && (
                  <img
                    style={{ width: "100px" }}
                    src={values.image && values.image.Location}
                  />
                )}

                {preview && (
                  <div className="mb-5">
                    <img src={preview} style={{ width: "100px" }} />
                  </div>
                )}
              </div>
            )}

            <label>
              <span>category</span>
            </label>
            <Input
              type="text"
              name="category"
              value={values.category}
              onChange={(e) => handleChange(e)}
            />
            <Button onClick={(e) => handleSubmit(e)}>SUBMIT & Continue</Button>
          </form>
          {values && values.lessons.length > 0 && (
            <>
              <Ul onDragOver={(e) => e.preventDefault()}>
                <h1>{values && values.lessons.length} Lessons</h1>
                {values.lessons.map((lesson, i) => {
                  return (
                    <List full>
                      <Li
                        style={{
                          cursor: "move",
                        }}
                        draggable
                        onDragStart={(e) => handleDrag(e, i)}
                        onDrop={(e) => handleDrop(e, i)}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            {i + 1}. {lesson.title}
                          </div>
                          <div>
                            <div
                              style={{ display: "inline-block", color: "red" }}
                              onClick={(e) => handleDelete(e, i)}
                              className="px-2 pointer"
                            >
                              <i class="bi bi-trash3"></i>
                            </div>
                            <div
                              style={{ display: "inline-block" }}
                              className="px-2 pointer"
                              onClick={() => {
                                setVisible(true);
                                setCurrent(lesson);
                              }}
                            >
                              <i class="bi bi-tools"></i>
                            </div>
                          </div>
                        </div>
                      </Li>
                    </List>
                  );
                })}
                {visible && (
                  <div>
                    <form className="flex " style={{ flexDirection: "column" }}>
                      <label>
                        <span>Title</span>
                      </label>
                      <Input
                        type="text"
                        name="title"
                        value={current.title}
                        onChange={(e) => handleChangeCurrent(e)}
                      />
                      <label>
                        <span>description</span>
                      </label>
                      <Textarea
                        type="text"
                        name="content"
                        value={current.content}
                        onChange={(e) => handleChangeCurrent(e)}
                      />
                      <div style={{ position: "relative" }}>
                        {current.video && current.video.Location && (
                          <ReactPlayer
                            url={current.video.Location}
                            width="410px"
                            height="240px"
                            controls
                          />
                        )}
                        <label>
                          <span>video</span>
                        </label>
                        <Input
                          type="file"
                          name="video"
                          onChange={(e) => handleVideo(e)}
                          accept="video/*"
                        />
                      </div>
                      <div className="flex align-center">
                        <label style={{ display: "block" }}>FREE PREVIEW</label>
                        <Input
                          className=" mx-3"
                          type="checkbox"
                          onChange={(e) =>
                            setCurrent({
                              ...current,
                              free_preview: !current.free_preview,
                            })
                          }
                        />
                      </div>
                      <span className="slider round" />
                      <Button onClick={(e) => handleUpdateLesson(e)}>
                        Update Lesson
                      </Button>
                    </form>
                  </div>
                )}
              </Ul>
            </>
          )}
        </>
      )}
    </InstructorRoute>
  );
};

export default EditCourse;
