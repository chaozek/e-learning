import React, { useContext } from "react";
import { StyledLink } from "styling/GlobalStyledCompStyles";
import { Li, Logo, NavBar, Ul } from "./Nav";
import styled from "styled-components";
import { Context } from "context";
import CloseLinkButton from "./helpers/CloseLinkButton";

const MobileMenu = ({
  toggleHamburgerMenu,
  setToggleHamburgerMenu,
  handleLogout,
}) => {
  const { state, dispatch } = useContext(Context);
  const { user } = state;

  return (
    <MobileMenuWrapper>
      <Ul>
        <div>
          {user && user.role && user.role.includes("Instructor") ? (
            <Li>
              <CloseLinkButton
                onClick={() => setToggleHamburgerMenu(!toggleHamburgerMenu)}
                href={"/instructor/course/create"}
                toggleHamburgerMenu={toggleHamburgerMenu}
                setToggleHamburgerMenu={setToggleHamburgerMenu}
              >
                Create course
              </CloseLinkButton>
            </Li>
          ) : (
            <Li>
              <CloseLinkButton
                onClick={() => setToggleHamburgerMenu(!toggleHamburgerMenu)}
                href={"/user/become-instructor"}
                toggleHamburgerMenu={toggleHamburgerMenu}
                setToggleHamburgerMenu={setToggleHamburgerMenu}
              >
                Become Instructor
              </CloseLinkButton>
            </Li>
          )}
        </div>
        <Li>
          {!user ? (
            <CloseLinkButton
              onClick={() => setToggleHamburgerMenu(!toggleHamburgerMenu)}
              href={"/user/become-instructor"}
              toggleHamburgerMenu={toggleHamburgerMenu}
              setToggleHamburgerMenu={setToggleHamburgerMenu}
            >
              Home
            </CloseLinkButton>
          ) : (
            <CloseLinkButton
              onClick={() => setToggleHamburgerMenu(!toggleHamburgerMenu)}
              href={"/user"}
              toggleHamburgerMenu={toggleHamburgerMenu}
              setToggleHamburgerMenu={setToggleHamburgerMenu}
            >
              Dashboard
            </CloseLinkButton>
          )}
        </Li>
        {!user && (
          <>
            <Li>
              <CloseLinkButton
                onClick={() => setToggleHamburgerMenu(!toggleHamburgerMenu)}
                href={"/register"}
                toggleHamburgerMenu={toggleHamburgerMenu}
                setToggleHamburgerMenu={setToggleHamburgerMenu}
              >
                Register
              </CloseLinkButton>
            </Li>
            <Li>
              <CloseLinkButton
                onClick={() => setToggleHamburgerMenu(!toggleHamburgerMenu)}
                href={"/login"}
                toggleHamburgerMenu={toggleHamburgerMenu}
                setToggleHamburgerMenu={setToggleHamburgerMenu}
              >
                login
              </CloseLinkButton>
            </Li>
          </>
        )}
        {user && (
          <Li onClick={(e) => handleLogout(e)}>
            <CloseLinkButton
              onClick={() => setToggleHamburgerMenu(!toggleHamburgerMenu)}
              href={"#"}
              toggleHamburgerMenu={toggleHamburgerMenu}
              setToggleHamburgerMenu={setToggleHamburgerMenu}
            >
              Logout
            </CloseLinkButton>
          </Li>
        )}
      </Ul>
    </MobileMenuWrapper>
  );
};
export const MobileMenuWrapper = styled.div`
  position: absolute;
  height: calc(100% - 40px);
  width: 100%;
  background-color: gray;
  transition: margin 0.5s; //fix
  margin: ${(props) => {
    props.value === true ? "-240px 0 0 0" : "0 0 0 0";
  }};
`;
export default MobileMenu;
