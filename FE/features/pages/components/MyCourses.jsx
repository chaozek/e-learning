// @flow
import Link from "next/link";
import React from "react";
import { CardList } from "../../Card";
const MyCourses = ({ courses, header, myCourses }) => {
  return <CardList myCourses={myCourses} courses={courses} header={header} />;
};

export default MyCourses;
