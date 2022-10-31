import React, { useCallback, useState } from "react";
import { TextField } from "@mui/material";
import * as s from "../styles/global";

const initialAppSettings = {
  infuraIpfsKey: '',
  infuraIpfsSecret: '',
  infuraDedicatedGateway: '',
  chainId: 0,
  webSocketUrl: '',

}

const Manage = (props) => {
  const [appSettings, setAppSettings] = useState(initialAppSettings)

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
    </s.Container>
  );
};

export default Manage;
