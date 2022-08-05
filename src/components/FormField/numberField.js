import { TextField } from "@mui/material";
import React from "react";

export default function NumberField(props) {
  const { label, onChange, value } = props;
  return (
    <TextField
      fullWidth
      type={"number"}
      onWheel={(e) => {
        e.target.blur();
      }}
      value={value}
      label={label}
      onChange={onChange}
    />
  );
}
