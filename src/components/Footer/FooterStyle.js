import styled from 'styled-components';
   
export const Box = styled.div`
  padding-top: 0;
  bottom: 0;
  width: 100%;
`;
   
export const Container = styled.div`
    display: flex;
    flex-direction: ${({ fd }) => (fd ? fd : "column")};
    justify-content: ${({ jc }) => (jc ? jc : "center")};
    max-width: 1000px;
    margin: 0 auto;
    /* background: red; */
`
   
export const Column = styled.div`
  display: flex;
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "center")};
  width:  ${({ w }) => ( w ? w : "50%" )};
  text-align: left;
  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`;
   
export const Row = styled.div`
  display: ${({ display }) => (display ? display : "flex")};
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "row")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background-color: ${({ test }) => (test ? test : "none")};
  width:  ${({ w }) => ( w ? w : "100%" )};
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  margin: ${({ m }) => ( m ? m : "none" )};
  padding: ${({ p }) => ( p ? p : "none" )};
  max-width: ${({ mxw }) => ( mxw ? mxw : "none" )};
  max-height: ${({ mxh }) => ( mxh ? mxh : "none" )};
  min-width: ${({ mnw }) => ( mnw ? mnw : "none" )};
  min-height: ${({ mnh }) => ( mnh ? mnh : "none" )};
`;
   
export const FooterLink = styled.a`
  color: #fff;
  font-size: 18px;
  text-decoration: none;
   
  &:hover {
      color:  var(--primary);
      transition: 200ms ease-in;
  }
`;
   
export const Heading = styled.p`
  font-size: 24px;
  color: #fff;
  margin-bottom: 0.25rem;
  font-weight: bold;
`;