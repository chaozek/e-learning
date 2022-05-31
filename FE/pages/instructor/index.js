import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import InstructorRoute from "../../components/routes/InstructorRoute";
import styled from "styled-components";
import { Button } from "@/styling/GlobalStyledCompStyles";
import { CardHeader } from "features/Card/components/CardList";

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);
  const getCourses = async () => {
    let { data } = await axios.get("/api/instructor-courses");
    setCourses(data);
  };
  useEffect(() => {
    getCourses();
  }, []);
  return (
    <InstructorRoute>
      <CardHeader>Created courses</CardHeader>
      <HorizontalList>
        {courses &&
          courses.map((course, i) => {
            return (
              <HorizontalListItem key={i} className="py-2">
                <div style={{ textAlign: "left" }}>
                  <img
                    src={course.image && course.image.Location}
                    style={{
                      width: "130px",
                      height: "130px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <p>{course.name}</p>
                <p>{course.price} $</p>
                <p>{course.lessons.length} </p>
                <div>
                  <Link href={`/instructor/course/view/${course.slug}`}>
                    <Button>Edit</Button>
                  </Link>
                </div>
              </HorizontalListItem>
            );
          })}
      </HorizontalList>
    </InstructorRoute>
  );
};
export const HorizontalList = styled.div`
  display: flex;
  flex-direction: column;
`;
export const HorizontalListItem = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  text-align: center;
  transition-duration: 0.2s;

  & p,
  img,
  Link,
  div {
    flex: 1 1 0px;
    flex-basis: 100%;
  }
  :hover {
    background-color: #777a7d;
    & p {
      color: white;
    }
  }
`;
export default InstructorIndex;
