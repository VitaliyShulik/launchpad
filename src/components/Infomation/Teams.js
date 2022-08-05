import React from "react";
import * as s from "../../styles/global";
import profile from "../../assets/profile_js.jpg";

const Teams = (props) => {
    return(
        <s.Container jc="space-evenly" ai="center">
            <img alt="Jarupak Srisuchat" src={profile} className="image-cover"></img>
            <s.TextDescription>Jarupak Srisuchat</s.TextDescription>
            <s.TextID>Developer</s.TextID>
        </s.Container>
    );
};
export default Teams;