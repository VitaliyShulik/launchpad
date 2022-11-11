import React, { useState } from "react";
import { useSelector } from "react-redux";
import { TextField, Alert } from "@mui/material";
import * as s from "../styles/global";

const initialAppSettings = {
  infuraIpfsKey: '',
  infuraIpfsSecret: '',
  infuraDedicatedGateway: '',
  chainId: 0,
  webSocketRPC: '',

}

const Manage = () => {
  const [appSettings, setAppSettings] = useState(initialAppSettings)

  const { account } = useSelector((state) => state.blockchain);
  const { owner } = useSelector((state) => state.appSettings);

  const setSetting = (e) => {
    setAppSettings((prevAppSettings) => {
      const newAppSettings = {
        ...prevAppSettings,
        [e.target.id]: e.target.value,
      }
      return newAppSettings;
    })
  }

  return (
    <s.Container ai="center">
      <s.TextTitle>Manage Page</s.TextTitle>
      {
        account?.toLowerCase() === owner?.toLowerCase() ? (
          <>
            <s.SpacerMedium />
            <TextField
              fullWidth
              id="infuraIpfsKey"
              label="Infura IPFS Key"
              value={appSettings.infuraIpfsKey}
              onChange={setSetting}
            />
            <s.SpacerSmall />
            <TextField
              fullWidth
              id="infuraIpfsSecret"
              label="Infura IPFS Secret"
              value={appSettings.infuraIpfsSecret}
              onChange={setSetting}
            />
            <s.SpacerSmall />
            <TextField
              fullWidth
              id="infuraDedicatedGateway"
              label="Infura Dedicated Gateway"
              value={appSettings.infuraDedicatedGateway}
              onChange={setSetting}
            />
            <s.SpacerSmall />
          </>
        ) : (
          <>
            <s.SpacerMedium />
            <Alert severity="warning">You have not access to this page</Alert>
          </>
        )
      }
    </s.Container>
  );
};

export default Manage;
