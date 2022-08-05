import React from "react";
const Badge = (props) => {
  const {
    bgcolor = "var(--primary)",
    fontSize = 12,
    p = 5,
    fontColor = "var(--card)",
    children,
  } = props;

  const containerStyles = {
    backgroundColor: "var(--primary)",
    borderRadius: 10,
    fontSize: fontSize,
    padding: p,
    fontWeight: "bold",
    color: fontColor,
  };

  return <div style={containerStyles}>{children}</div>;
};

export default Badge;
