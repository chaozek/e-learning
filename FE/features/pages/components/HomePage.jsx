// @flow
import Link from "next/link";
import React from "react";
import { CardList } from "../../Card";
const Homepage = ({ courses, header, response }) => {
  return <CardList response={response} courses={courses} header={header} />;
};

export default Homepage;
