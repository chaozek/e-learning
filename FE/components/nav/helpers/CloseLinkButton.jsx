import { StyledLink, StyledLinkWrapper } from "styling/GlobalStyledCompStyles";

const CloseLinkButton = ({
  children,
  href,
  setToggleHamburgerMenu,
  toggleHamburgerMenu,
}) => {
  console.log(toggleHamburgerMenu);
  return (
    <StyledLinkWrapper>
      <StyledLink href={href}>
        <div onClick={() => setToggleHamburgerMenu(!toggleHamburgerMenu)}>
          {children}
        </div>
      </StyledLink>
    </StyledLinkWrapper>
  );
};
export default CloseLinkButton;
