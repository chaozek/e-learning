import Link from "next/link";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Card from "./Card";
import styled from "styled-components";
import { devices } from "responsive/devices";

const CardList = ({ courses, header = "Header", myCourses, response }) => {
  return (
    <>
      <CardHeader className="mt-5">{header}</CardHeader>
      {response}
      <CardListWrapper>
        {courses &&
          courses.map((course, i) => (
            <Card myCourses={myCourses} key={i} course={course} />
          ))}
      </CardListWrapper>
    </>
  );
};
const CardListWrapper = styled.div`
  margin: 0 auto;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  padding: 1rem;
`;
export const CardHeader = styled.h2`
  text-align: center;
  font-style: italic;
  font-weight: 100;
  margin-bottom: 0;
`;
export default CardList;
