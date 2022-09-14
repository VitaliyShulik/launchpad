import React from "react";
import { SocialIcon } from "react-social-icons";
import IDOFactory from "../../contracts/IDOFactory.json";
import LockerFactory from "../../contracts/TokenLockerFactory.json";
import {
  Box,
  Column,
  Container,
  FooterLink,
  Heading,
  Row,
} from "./FooterStyle";

const Footer = () => {
  return (
    <Box>
      <hr
        style={{
          color: "#ffffff",
          backgroundColor: "#ffffff",
          height: 1,
          borderColor: "#ffffff",
        }}
      />
      <Container style={{ padding: 30 }}>
        <Row jc="space-evenly" style={{ flexWrap: "wrap" }}>
          <Column className="text-collapse">
            <Heading>Contract Addresses</Heading>
            <p>IDO Factory: </p>
            <FooterLink
              target="_blank"
              href={
                process.env.REACT_APP_Explorer +
                "address/" +
                IDOFactory.networks[process.env.REACT_APP_networkID].address
              }
            >
              {IDOFactory.networks[process.env.REACT_APP_networkID].address}
            </FooterLink>
            {
              process.env.REACT_APP_ENABLE_LOCKER === 'true' && (
                <>
                  <p>Locker Factory: </p>
                  <FooterLink
                    target="_blank"
                    href={
                      process.env.REACT_APP_Explorer +
                      "address/" +
                      LockerFactory.networks[process.env.REACT_APP_networkID].address
                    }
                  >
                    {LockerFactory.networks[process.env.REACT_APP_networkID].address}
                  </FooterLink>
                </>
              )

            }
            {/*  */}
          </Column>
          <Column fd="row" jc="space-evenly">
            <SocialIcon
              network="email"
              url="mailto:support@onout.org?subject=IDOFactory&body=Hello, write you from IDOFactory demo..."
              target="_blank"
              bgColor="#fff"
              fgColor="#000000"
            />
            <SocialIcon
              network="telegram"
              url="https://t.me/swaponline"
              target="_blank"
              bgColor="#fff"
              fgColor="#000000"
            />
            <SocialIcon
              network="discord"
              url="https://discord.gg/ukkgCUsU5c"
              target="_blank"
              bgColor="#fff"
              fgColor="#000000"
            />
            <SocialIcon
              url="https://tools.onout.org/"
              target="_blank"
              bgColor="#fff"
              fgColor="#000000"
            />
          </Column>
        </Row>
      </Container>
    </Box>
  );
};
export default Footer;
