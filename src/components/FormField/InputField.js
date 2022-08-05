import { TextField } from "@mui/material";
import { useField } from "formik";
import { at } from "lodash";
import React from "react";

export default function InputField(props) {
  const { errorText, ...rest } = props;
  const [field, meta] = useField(props);

  function _renderHelperText() {
    const [touched, error] = at(meta, "touched", "error");
    if (touched && error) {
      return error;
    }
  }

  return (
    <TextField
      type="text"
      error={meta.touched && meta.error && true}
      helperText={_renderHelperText()}
      {...field}
      {...rest}
    />
  );
}
