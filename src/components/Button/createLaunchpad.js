import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const CreateLaunchpad = (props) => {
  const blockchain = useSelector((state) => state.blockchain);

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flex: 1,
        justifyContent: "center",
      }}
    >
      {blockchain.web3 ? (
        <NavLink
          to="/publish"
          style={{
            whiteSpace: "nowrap",
            backgroundColor: "var(--primary)",
            padding: 10,
            borderRadius: 20,
            fontWeight: 700,
            paddingLeft: 30,
            paddingRight: 30,
            textDecoration: "none",
            color: "var(--card)",
          }}
        >
          Create launchpad
        </NavLink>
      ) : null}
    </div>
  );
};

export default CreateLaunchpad;
