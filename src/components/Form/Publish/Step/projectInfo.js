import { TextField } from "@mui/material";
import React from "react";
import { FaImage } from "react-icons/fa";
import { useStoreContext } from "../../../../context/store";
import * as s from "../../../../styles/global";
export default function ProjectInfo() {
  const context = useStoreContext();

  return (
    <s.Container flex={1} ai="center">
      <s.TextTitle>Project Information</s.TextTitle>
      <s.Container ai="center">
        <div
          style={{
            display: "flex",
            width: 140,
            height: 140,
            borderRadius: 20,
            margin: 20,
            backgroundColor: "var(--upper-card)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <s.iconUpload
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              e.preventDefault();
              const file = e.target.files[0];
              context.icon[1](file);
            }}
          ></s.iconUpload>
          {context.icon[0] !== "" ? (
            <img
              style={{ width: 100, height: 100, borderRadius: 20 }}
              src={URL.createObjectURL(context.icon[0])}
            />
          ) : (
            <FaImage style={{ width: 100, height: 100, padding: 20 }} />
          )}
        </div>
      </s.Container>
      <TextField
        fullWidth
        id="text"
        label="Description"
        multiline
        rows={4}
        value={context.description[0]}
        maxLength="1000"
        onChange={(e) => {
          e.preventDefault();
          context.description[1](e.target.value);
        }}
      ></TextField>
      <s.SpacerSmall />
      <TextField
        fullWidth
        id="website"
        label="Website"
        value={context.website[0]}
        onChange={(e) => {
          e.preventDefault();
          context.website[1](e.target.value);
        }}
      ></TextField>
      <s.SpacerSmall />
      <TextField
        fullWidth
        value={context.discord[0]}
        id="discord"
        label="Discord"
        onChange={(e) => {
          e.preventDefault();
          context.discord[1](e.target.value);
        }}
      ></TextField>
      <s.SpacerSmall />
      <TextField
        fullWidth
        value={context.telegram[0]}
        id="telegram"
        label="Telegram"
        onChange={(e) => {
          e.preventDefault();
          context.telegram[1](e.target.value);
        }}
      ></TextField>
      <s.SpacerSmall />
      <TextField
        fullWidth
        id="twitter"
        label="Twitter"
        value={context.twitter[0]}
        onChange={(e) => {
          e.preventDefault();
          context.twitter[1](e.target.value);
        }}
      ></TextField>
    </s.Container>
  );
}
