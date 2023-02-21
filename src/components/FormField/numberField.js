import { TextField, InputAdornment } from "@mui/material";
import React from "react";

export default function NumberField(props) {
  const { label, onChange, value, adornment, ...otherProps } = props;
  return (
    <TextField
      type="number"
      fullWidth
      onWheel={(e) => {
        e.target.blur();
      }}
      value={value}
      label={label}
      onChange={onChange}
      InputProps={{
        endAdornment: <InputAdornment position="end">{adornment || ''}</InputAdornment>,
        inputProps: {
          min: 0,
        }
      }}

      {...otherProps}
    />
  );
}
