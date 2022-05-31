import styled from "styled-components";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Layout = ({ children, ...otherProps }) => {
  const router = useRouter();
  return <HeroWrapper {...otherProps}>{children}</HeroWrapper>;
};
const HeroWrapper = styled.div`
  margin-right: auto;
  margin-left: auto;
  max-width: 1320px;
`;
export default Layout;
