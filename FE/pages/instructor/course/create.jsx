import { useState } from "react";
import InstuctorRoute from "../../../components/routes/InstructorRoute";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { CardHeader } from "features/Card/components/CardList";
import { Button, Input, Select } from "@/styling/GlobalStyledCompStyles";

const CreateCourse = () => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: 0,
    uploading: false,
    paid: false,
    loading: false,
    category: "",
  });
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("");
  const router = useRouter();
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

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
          console.log(data);
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
      const { data } = await axios.post("/api/course", { ...values, image });
      router.push("/instructor");
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleImageRemove = async () => {
    try {
      const res = await axios.post("/api/remove-image", {
        image,
      });
      setImage({});
      setPreview("");
      setUploadButtonText("Upload Image");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <InstuctorRoute>
      <CardHeader>Create Course</CardHeader>
      <form className="flex" style={{ flexDirection: "column" }}>
        <label>
          <span>Course name</span>
        </label>
        <Input
          type="text"
          name="name"
          value={values.name}
          onChange={(e) => handleChange(e)}
        />
        <label>Course free or paid</label>
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
        <Input
          type="text"
          name="description"
          value={values.description}
          onChange={(e) => handleChange(e)}
        />

        {loading ? (
          "UPLOADING..."
        ) : (
          <>
            <label>
              <span>{image.Key ? image.Key : "Upload Image"}</span>
            </label>
            <input
              type="file"
              name="image"
              onChange={(e) => handleImage(e)}
              accept="image/*"
            />
            {preview && (
              <div>
                <div
                  style={{
                    backgroundColor: "red",
                    width: "20px",
                    textAlign: "center",
                    position: "absolute",
                    cursor: "pointer",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "100%",
                  }}
                  onClick={() => handleImageRemove()}
                >
                  X
                </div>
                <img src={preview} style={{ width: "150px" }} />
              </div>
            )}
          </>
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
    </InstuctorRoute>
  );
};

export default CreateCourse;
