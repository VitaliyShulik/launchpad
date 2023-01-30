import { useWeb3React } from "@web3-react/core";
import { NavLink } from "react-router-dom";

const CreateLocker = (props) => {
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
          to="/lock"
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
          Create locker
        </NavLink>
      ) : null}
    </div>
  );
};

export default CreateLocker;
