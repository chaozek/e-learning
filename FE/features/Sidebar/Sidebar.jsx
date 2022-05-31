import {
  Button,
  Li,
  StyledLink,
  StyledLinkWrapper,
  Ul,
} from "@/styling/GlobalStyledCompStyles";
import React from "react";
import { CSSTransition } from "react-transition-group";
import cx from "classnames";
const Sidebar = ({
  course,
  lesson,
  completedLessons,
  handleCollapse,
  collapse,
  setClicked,
}) => {
  const renderLinks = () => {
    return (
      <div>
        <div>
          <Ul>
            {course?.lessons?.map((less, i) => {
              return (
                <StyledLinkWrapper>
                  <StyledLink
                    className="pointer"
                    href={`/user/course/${course?.slug}/${less?.slug}/${less?._id}`}
                  >
                    <Li
                      key={i}
                      onClick={() => setClicked(i)}
                      style={{
                        background: lesson?._id === less?._id && "#D1D7DC",
                        color: "#777A7D",
                        padding: "5px",
                        borderRadius: "0px 5px 5px 0px",
                      }}
                    >
                      <div className={"flex justify-space-between no-wrap"}>
                        <p
                          className={"flex no-wrap"}
                          style={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {collapse ? less.title : i + 1}
                        </p>
                        <div className="mr-10">
                          <CSSTransition
                            in={collapse}
                            timeout={1000}
                            classNames={"fade"}
                            unmountOnExit
                          >
                            {completedLessons.includes(less._id) ? (
                              <i class="bi bi-check-circle-fill green"></i>
                            ) : (
                              <i class="bi bi-dash-circle-fill red"></i>
                            )}
                          </CSSTransition>
                        </div>
                      </div>
                    </Li>
                  </StyledLink>
                </StyledLinkWrapper>
              );
            })}
          </Ul>
        </div>
      </div>
    );
  };
  return (
    <div className={cx("sidebar", { "sidebar-closed": !collapse })}>
      <div>{renderLinks()}</div>
    </div>
  );
};

export default Sidebar;
