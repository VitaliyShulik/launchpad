import { TextField } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { useStoreContext } from "../../../../context/store";
import * as s from "../../../../styles/global";
import { utils } from "../../../../utils";

export default function TokenVerify() {
  const { library } = useWeb3React();
  const { address, tokenInformation, tokenError } = useStoreContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const fetchTokenInfo = async () => {
      if (address[0] && library?.web3) {
        setLoading(true)
        try {
          const token = await utils.getTokenData(address[0], library.web3);
          tokenInformation[1](token);
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchTokenInfo();

  }, [address[0], library]);

  return (
    <s.Container flex={1} ai="center">
      <s.TextTitle>Token Verify</s.TextTitle>
      <s.SpacerSmall />
      <TextField
        id="tokenAddress"
        onChange={(e) => {
          e.preventDefault();
          address[1](e.target.value);
        }}
        value={tokenInformation?.[0]?.tokenAddress || address[0] || ""}
        name={"tokenAddress"}
        label={"Token address"}
        fullWidth
      />
      {loading ? (
          <s.Container>
            <s.SpacerSmall />
            <Badge bg="secondary">Token Address Checking...</Badge>
          </s.Container>
        ) : <s.TextIDWarning fullWidth>{tokenError["token"]}</s.TextIDWarning>
      }
      {tokenInformation[0] && (
        <s.Container>
          <s.SpacerSmall />
          <s.TextID>Name</s.TextID>
          <s.TextDescription>{tokenInformation[0].tokenName}</s.TextDescription>
          <s.TextID>Decimals</s.TextID>
          <s.TextDescription>{tokenInformation[0].tokenDecimals}</s.TextDescription>
          <s.TextID>Total supply</s.TextID>
          <s.TextDescription>
            {BigNumber(tokenInformation[0].totalSupply)
              .dividedBy(10 ** tokenInformation[0].tokenDecimals)
              .toFixed(0)}
          </s.TextDescription>
        </s.Container>
      )}
    </s.Container>
  );
}
