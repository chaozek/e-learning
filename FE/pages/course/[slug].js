import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Modal from "react-modal";
import { Context } from "../../context";
import { loadStripe } from "@stripe/stripe-js";
import Layout from "Layouts/Layout";
import { AlignPage, Button } from "@/styling/GlobalStyledCompStyles";
import { CardHeader } from "features/Card/components/CardList";
import styled from "styled-components";
import { CardBadge } from "features/Card/components/Card";
import ReactTooltip from "react-tooltip";
import Link from "next/link";

Modal.setAppElement("#__next");

const CoursePageView = ({ course }) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "50%",
      height: "50%",
      padding: "0",
      overflow: "hidden",
    },
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };
  const router = useRouter();
  const {
    state: { user },
  } = useContext(Context);
  const [enroll, setEnroll] = useState("");
  const [clicked, setClicked] = useState(-1);
  const [modalIsOpen, setIsOpen] = useState(false);

  const handlePaidEnrollment = async (e) => {
    try {
      if (!user) {
        router.push("/login");
      }
      if (enroll.status)
        return router.push(`/user/course/${enroll.course.slug}`);

      const { data } = await axios.post(`/api/paid-enrollment/${course._id}`);
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
      stripe.redirectToCheckout({ sessionId: data });
    } catch (error) {
      console.log(error.response, "ERR");
    }
  };
  const handleFreeEnrollment = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        router.push("/login");
      }
      if (enroll.status)
        return router.push(`/user/course/${enroll.course.slug}`);
      const { data } = await axios.post(`/api/free-enrollment/${course._id}`);
      return router.push(`/user/course/${data.course.slug}`);
    } catch (error) {
      console.log(error);
    }
  };

  const checkEnrollment = async () => {
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
    setEnroll(data);
  };
  useEffect(() => {
    if (user && course) {
      checkEnrollment();
    }
  }, [user, course]);
  console.log(course, "COURSSSS");
  return (
    <>
      <CourseHero className="p-10">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <ReactPlayer
            url={course.lessons[0].video.Location}
            width="100%"
            height="100%"
            controls
          />
        </Modal>
        <Layout>
          <>
            <div
              style={{
                display: "flex",
              }}
            >
              <div
                className="white-text mr-5"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "70%",
                  whiteSpace: "initial",
                  wordWrap: "break-word",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexBasis: "auto",
                    alignItems: "center",
                  }}
                >
                  <h1 className="white-text">{course.name}</h1>
                  {course.paid ? (
                    <CardBadge orange red className="white-text">
                      PAID
                    </CardBadge>
                  ) : (
                    <CardBadge className="white-text">FREE</CardBadge>
                  )}
                </div>
                {course.paid && (
                  <h2 className="white-text">{course.price} $</h2>
                )}
                <p className="white-text">{course.description}</p>
              </div>
              <div
                style={{
                  width: "30%",
                }}
              ></div>
            </div>
          </>
        </Layout>
      </CourseHero>
      <Layout>
        <CourseContent>
          <Left>
            <div className=" p-10">
              {course.lessons.map((lesson) => {
                return enroll.status ? (
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
                    {lesson.free_preview && (
                      <div
                        onClick={() => openModal()}
                        className="pointer mx-3 flex align-center"
                      >
                        <div
                          className="flex align-center px-2 br-2"
                          style={{
                            backgroundColor: "green",
                            color: "white",
                          }}
                        >
                          <p className="pr-2" style={{ fontSize: "10px" }}>
                            preview
                          </p>
                          <i class="bi bi-play-circle-fill"></i>
                        </div>
                      </div>
                    )}
                  </List>
                ) : (
                  <List>
                    <div
                      className="flex pt-10 p-2"
                      style={{
                        textOverflow: "ellipsis",
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
                      {lesson.free_preview && (
                        <div
                          onClick={() => openModal()}
                          className="pointer ml-5 flex align-center"
                        >
                          <div
                            className="flex align-center px-2 br-2"
                            style={{ backgroundColor: "green", color: "white" }}
                          >
                            <p className="pr-2" style={{ fontSize: "10px" }}>
                              preview
                            </p>
                            <i class="bi bi-play-circle-fill"></i>
                          </div>
                        </div>
                      )}
                      <ReactTooltip />
                    </div>
                  </List>
                );
              })}
            </div>
          </Left>
          <Right>
            <div
              className="flex"
              style={{
                flexDirection: "column",
                color: "white",
                zIndex: "5",
                width: "250px",
              }}
            >
              {course.lessons[0].free_preview ? (
                <ReactPlayer
                  url={course.lessons[0].video.Location}
                  width="100%"
                  height="167px"
                  controls
                  light={course?.image?.Location}
                />
              ) : (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <img
                    style={{
                      height: "167px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                    src={course?.image?.Location}
                  />
                </div>
              )}
              <Button
                className="mt-5"
                filled
                onClick={
                  course.paid ? handlePaidEnrollment : handleFreeEnrollment
                }
              >
                {user
                  ? enroll.status
                    ? "GO to Course"
                    : "enroll"
                  : "login to enroll"}
              </Button>
            </div>
          </Right>
        </CourseContent>
      </Layout>
    </>
  );
};
export const CourseHero = styled.div`
  background-color: #1c1d1f;
  color: white;
  z-index: 1;
  min-height: 167px;

  h1 {
    font-weight: bold;
  }
`;
export const Left = styled.div`
  width: 70%;
`;

export const ListItem = styled.div`
  width: 100%;
`;

export const Right = styled.div`
  margin-top: -167px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
`;
export const CourseContent = styled.div`
  display: flex;
`;
export const List = styled.div`
  border-bottom: 1px solid #d6d6d6;
  width: ${(p) => (p.full ? "100%" : "50%")};

  :hover {
    background-color: #1c1d1f;
    color: white;
  }
`;

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(
    `http://localhost:3000/api/course/${query.slug}`
  );

  return {
    props: {
      course: data,
    },
  };
}

export default CoursePageView;
