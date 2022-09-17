import { TextField } from "@mui/material";
import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { useStoreContext } from "../../../../context/store";
import * as s from "../../../../styles/global";
import { utils } from "../../../../utils";

export default function TokenVerify({ formProps, blockchain }) {

  const { web3 } = blockchain
  const context = useStoreContext();
  const data = context.tokenInformation;
  const address = context.address;
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const fetchTokenInfo = async() => {
      if (address?.[0] !== "" && web3) {
        setLoading(true)
        try {
          const token = await utils.getTokenData(address[0], web3);
          data[1](token);
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchTokenInfo();

  }, [address[0], web3]);

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
        value={address[0]}
        defaultValue={data[0] ? data[0].tokenAddress : ""}
        name={"tokenAddress"}
        label={"Token address"}
        fullWidth
      />
      {loading ? (
          <Badge bg="secondary">Token Address Checking...</Badge>
        ) : <s.TextIDWarning fullWidth>{context.tokenError["token"]}</s.TextIDWarning>
      }
      {data[0] ? (
        <s.Container style={{}}>
          <s.SpacerSmall />
          <s.TextID>Name</s.TextID>
          <s.TextDescription>{data[0].tokenName}</s.TextDescription>
          <s.TextID>Decimals</s.TextID>
          <s.TextDescription>{data[0].tokenDecimals}</s.TextDescription>
          <s.TextID>Total supply</s.TextID>
          <s.TextDescription>
            {BigNumber(data[0].totalSupply)
              .dividedBy(10 ** data[0].tokenDecimals)
              .toFixed(0)}
          </s.TextDescription>
        </s.Container>
      ) : null}
    </s.Container>
  );
}
