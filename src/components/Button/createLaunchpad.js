import { useWeb3React } from "@web3-react/core";
import { NavLink } from "react-router-dom";

const CreateLaunchpad = () => {
  const { library } = useWeb3React();

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flex: 1,
        justifyContent: "center",
      }}
    >
      {library ? (
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
          Create IDO Poll
        </NavLink>
      ) : null}
    </div>
  );
};

export default CreateLaunchpad;
