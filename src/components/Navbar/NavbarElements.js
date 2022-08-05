import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
    height: 50px;
    display: flex;
    padding: 10px;
    align-items: center;
    z-index: 12;
    background: transparent;
`;

export const NavLogoCollapse = styled(Link)`
  display: flex;
  cursor: pointer;
  color: #fff;
  font-size: 2rem;
`;

export const NavLogo = styled(Link)`
  cursor: pointer;
  color: #fff;
  font-size: 2rem;
  @media screen and (max-width: 900px) {
    display: none;
    position: flex;
    float: left;
    top: 0;
    right: 0;
    font-size: 2rem;
    cursor: pointer;
  }

`;

export const NavLink = styled(Link)`
color: #fff;
display: flex;
align-items: center;
text-decoration: none;
padding: 0 1rem;
height: 100%;
cursor: pointer;
&.active {
  color:white;
}
&:hover {
  color: grey;
}
`;

export const Bars = styled(FaBars)`
  display: none;
  color: #fff;
  float: right;
  @media screen and (max-width: 900px) {
    display: flex;
    position: absolute;
    margin: 20px;
    right: ${({ m }) => ( m ? m : "none" )};;
    font-size: 1.8rem;
    cursor: pointer;
  }
`;


export const NavMenuCollapse = styled.div`
  display: none;
  @media screen and (max-width: 900px) {
    display: flex;
    position: absolute;
    width: 80%;
    height: 100%;
    text-align: center;
    flex-direction: column;
    background-color: #1A1A1D;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;

  @media screen and (max-width: 900px) {
    display: none;
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-right: 24px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtnLink = styled(Link)`
  border-radius: 4px;
  background: transparent;
  padding: 10px 22px;
  color: #fff;
  outline: none;
  border: 1px solid #fff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  margin-left: 24px;
  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #808080;
  }
`;