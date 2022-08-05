import React from "react";
import {
  FaDiscord,
  FaExternalLinkSquareAlt,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";
import * as s from "../../styles/global";

const SocialMediaModal = (props) => {
  const { website, discord, twitter, telegram } = props;

  return (
    <s.Container
      fd="row"
      jc="space-around"
      flex={3}
      style={{ paddingRight: 20, flexWrap: "nowrap", marginLeft: 20 }}
    >
      <s.ButtonSquare
        disabled={website == "" || !website}
        onClick={(e) => {
          e.preventDefault();
          window.open(website, "_blank");
        }}
      >
        <FaExternalLinkSquareAlt size={30}></FaExternalLinkSquareAlt>
      </s.ButtonSquare>
      <s.ButtonSquare
        disabled={discord == "" || !discord}
        onClick={(e) => {
          e.preventDefault();
          window.open(discord, "_blank");
        }}
      >
        <FaDiscord size={30}></FaDiscord>
      </s.ButtonSquare>
      <s.ButtonSquare
        disabled={telegram == "" || !telegram}
        onClick={(e) => {
          e.preventDefault();
          window.open(telegram, "_blank");
        }}
      >
        <FaTelegram size={30}></FaTelegram>
      </s.ButtonSquare>
      <s.ButtonSquare
        disabled={twitter == "" || !twitter}
        onClick={(e) => {
          e.preventDefault();
          window.open(twitter, "_blank");
        }}
      >
        <FaTwitter size={30}></FaTwitter>
      </s.ButtonSquare>
    </s.Container>
  );
};

export default SocialMediaModal;
