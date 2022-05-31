import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { H4Header, StyledLink } from "../../../styling/GlobalStyledCompStyles";
import { SimpleButton, Button } from "@/styling/GlobalStyledCompStyles";
const Card = ({ course, myCourses = false }) => {
  return (
    <StyledLink href={`course/${course.slug}`}>
      <CardStyled>
        {console.log(myCourses, "FALSE")}
        <div>
          <Row>
            <Image src={course.image.Location} />
            <AlignCenter className="ml-10">
              <H4Header>{course.name}</H4Header>
            </AlignCenter>
          </Row>
          <Text className="mt-10 fw-light">{course.description}</Text>
          <AlignCenter className="my-10 space-between">
            <div>{course.lessons.length} Lekcí</div>
            {course.paid && !course.bought && (
              <CardPrice>{course.price} $</CardPrice>
            )}
            {!myCourses && !course.paid && !course.bought ? (
              <CardBadge>Free</CardBadge>
            ) : (
              course.bought && <CardBadge orange>Enrolled</CardBadge>
            )}
          </AlignCenter>
          <Button>{myCourses ? "Continue" : "Go to course"}</Button>
        </div>
      </CardStyled>
    </StyledLink>
  );
};

const CardStyled = styled.div`
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  border-radius: 10px;
  padding: 1rem;
  height: 100%;
  cursor: pointer;
`;
const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 15px;
  object-fit: cover;
`;
const Text = styled.p`
  color: var(--text-gray);
  text-transform: capitalize;
`;
const CardPrice = styled.p`
  color: var(--text-gray);
  text-transform: capitalize;
  font-weight: bold;
`;
const Row = styled.div`
  display: flex;
`;
export const CardBadge = styled.div`
  display: inline-block;
  display: flex;
  background-color: ${(props) => (props.orange ? "#f05400" : "#026d21")};
  color: white;
  padding: 1px 10px;
  border-radius: 3px;
  width: fit-content;
  margin-left: 5px;
`;
const AlignCenter = styled.div`
  display: flex;
  align-items: center;
`;

export default Card;
