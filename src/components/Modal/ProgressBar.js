import React from "react";

const ProgressBar = (props) => {
  const { bgcolor = "var(--primary)", now } = props;

  const containerStyles = {
    display: "flex",
    height: 30,
    width: "100%",
    backgroundColor: "var(--card)",
    borderRadius: 20,
  };

  const fillerStyles = {
    height: "100%",
    minWidth: now <= 0 ? 0 : 20,
    width: `${now <= 100 ? now : 0}%`,
    backgroundColor: bgcolor,
    borderRadius: "inherit",
    textAlign: "right",
  };

  const labelStyles = {
    color: "var(--card)",
    fontWeight: "bold",
    fontSize: 16,
    paddingLeft: 5,
    paddingRight: 5,
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <p style={labelStyles}>{`${now <= 100 ? now : "0"}%`}</p>
      </div>
    </div>
  );
};

export default ProgressBar;
