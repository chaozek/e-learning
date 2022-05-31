import Link from "next/link";
import styled from "styled-components";

const H4Header = styled.h4`
  font-size: 1.25rem;
  border-radius: 10px;
  text-transform: capitalize;
  margin: 0;
`;

const StyledLink = styled(Link)`
  ${(props) => {
    props.color === "primary" && "--primary-gray";
  }}
  position: relative;
`;
const StyledLinkWrapper = styled.div`
  cursor: pointer;
`;
const SimpleButton = styled.p`
  color: var(--text-blue);
  font-weight: bold;
  text-transform: capitalize;
  cursor: pointer;
`;
const AlignPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const Button = styled.button`
  background-color: ${(p) => (p.filled ? "#1C1D1F" : "white")};
  color: ${(p) => (p.filled ? "white" : "1C1D1F")};
  border: 2px solid #555555;
  padding: ${(p) => (p.small ? 1 : 10)}px;
  border-radius: ${(p) => (p.radius ? 5 : 0)}px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
  :hover {
    background-color: ${(p) => (p.filled ? "white" : "#555555")};
    color: ${(p) => (p.filled ? "#555555" : "white")};
  }
`;
const Form = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  &:focus {
    outline: none;
  }
`;
const Input = styled.input`
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  &:focus {
    outline: none;
  }
`;
const Select = styled.select`
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  &:focus {
    outline: none;
  }
`;
const Textarea = styled.textarea`
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  &:focus {
    outline: none;
  }
`;
const Li = styled.li`
  list-style: none;
  a {
    color: #777a7d;
  }
`;
const Ul = styled.ul`
  padding: 0;
`;
export {
  H4Header,
  StyledLink,
  StyledLinkWrapper,
  SimpleButton,
  AlignPage,
  Button,
  Form,
  Input,
  Li,
  Ul,
  Select,
  Textarea,
};
