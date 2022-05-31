import styled from "styled-components";
import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { Context } from "../../context/index";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import { StyledLink } from "styling/GlobalStyledCompStyles";
import {
  useWindowSize,
  useWindowWidth,
  useWindowHeight,
} from "@react-hook/window-size";
import MobileMenu from "./MobileMenu";
const Nav = () => {
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  const [loading, setLoading] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(true);
  const [toggleHamburgerMenu, setToggleHamburgerMenu] = useState(false);
  const router = useRouter();
  const [width, height] = useWindowSize();
  console.log(user, "USEEERR");

  useEffect(() => {
    if (width > 647) {
      setToggleMenu(false);
    } else {
      setToggleMenu(true);
    }
  }, [width]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await axios.get(`/api/logout`);
      dispatch({
        type: "LOGOUT",
      });
      toast.warning(data.data.message, {
        icon: "🚀",
      });
      setLoading(false);
      router.push("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.response, {
        icon: false,
      });
      setLoading(false);
    }
  };

  const handleToggleHamburgerMenu = () => {
    setToggleHamburgerMenu(!toggleHamburgerMenu);
  };
  if (loading) return <p>Loading</p>;
  switch (toggleMenu) {
    case true:
      return (
        <>
          <NavBar>
            <Logo>e-learning</Logo>
            <div
              style={{ zIndex: "50" }}
              onClick={() => handleToggleHamburgerMenu()}
            >
              <p style={{ marginRight: "5px" }}>
                {toggleHamburgerMenu ? "Close" : "Open"}
              </p>
            </div>
          </NavBar>
          {toggleHamburgerMenu && (
            <MobileMenu
              setToggleHamburgerMenu={setToggleHamburgerMenu}
              toggleHamburgerMenu={toggleHamburgerMenu}
              handleLogout={handleLogout}
            />
          )}
        </>
      );
    case false:
      return (
        <NavBar>
          <StyledLink href="/">
            <Logo>e-learning</Logo>
          </StyledLink>
          <Ul>
            <div>
              {user && user.role && user.role.includes("Instructor") ? (
                <Li>
                  <StyledLink href="/instructor/">
                    Instructor Dashboard
                  </StyledLink>
                </Li>
              ) : (
                <Li>
                  <StyledLink href="/user/become-instructor">
                    Become Instructor
                  </StyledLink>
                </Li>
              )}
            </div>
            <Li>
              {!user ? (
                <StyledLink href="/user/become-instructor">Home</StyledLink>
              ) : (
                <StyledLink href="/user">My Courses</StyledLink>
              )}
            </Li>
            {!user && (
              <>
                <Li>
                  <StyledLink href="/register">Register</StyledLink>
                </Li>
                <Li>
                  <StyledLink href="/login">login</StyledLink>
                </Li>
              </>
            )}
            {user && (
              <Li onClick={(e) => handleLogout(e)}>
                <StyledLink color="primary" href="#">
                  Logout
                </StyledLink>
              </Li>
            )}
          </Ul>
        </NavBar>
      );
  }
};

export const Ul = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;
export const Li = styled.li`
  margin-right: 20px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  a {
    color: var(--primary-gray);
    :hover {
      color: #777a7d;
    }
  }
`;
export const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
  margin-bottom: 3rem;
`;

export const Logo = styled.div`
  padding-left: 10px;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
`;
export default Nav;
