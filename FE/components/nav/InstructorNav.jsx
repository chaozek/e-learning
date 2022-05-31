import React from "react";
import Link from "next/link";
import styled from "styled-components";

const InstructorNav = () => {
  return (
    <InstructorMenu style={{ color: "#00000" }}>
      <div style={{ padding: "1rem" }}>
        <ul>
          <li>
            <Link style={{ display: "block" }} href="/instructor/">
              Instructor dashBoard
            </Link>
          </li>
          <li>
            <Link style={{ display: "block" }} href="/instructor/course/create">
              Create Course
            </Link>
          </li>
          <li>
            <Link style={{ display: "block" }} href="/instructor/revenue">
              revenue
            </Link>
          </li>
        </ul>
      </div>
    </InstructorMenu>
  );
};
const InstructorMenu = styled.div`
  padding: 0;
  background-color: #777a7d;
  height: calc(100vh - 90px);
  border-radius: 0px 10px 0px 0px;
  li {
    list-style: none;
  }
  ul {
    padding: 0;
  }
  a {
    color: white;
    :hover {
      color: #1c1d1f;
    }
  }
`;
export default InstructorNav;
