import BigNumber from "bignumber.js";
import { create } from "ipfs-http-client";
import React, { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useStoreContext } from "../../../../context/store";
import ERC20 from "../../../../contracts/ERC20.json";
import { fetchData } from "../../../../redux/data/dataActions";
import * as s from "../../../../styles/global";
import { chainRouter } from "../../../../utils/chainInfo";
import SocialMediaModal from "../../../Modal/socialmediaModal";
import ReadMore from "../../readMore";
const axios = require("axios");

const projectId = process.env.REACT_APP_INFURA_IPFS_KEY;
const projectSecret = process.env.REACT_APP_INFURA_IPFS_SECRET;
const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString('base64');
console.log('auth', auth)

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
      authorization: auth,
  },
});

const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;

export default function Preview() {
  const context = useStoreContext();
  const token = context.tokenInformation[0];
  const blockchain = useSelector((state) => state.blockchain);
  const dispatch = useDispatch();

  const address = context.address[0];
  const icon = context.icon[0];
  const [tokenApprove, setTokenApprove] = useState("");
  const [loading, setLoading] = useState(false);
  const tokenRate = BigNumber(context.tokenRate[0]);
  const listingRate = BigNumber(context.listingRate[0]);
  const hardCap = BigNumber(context.hardCap[0]);
  const lp = BigNumber(context.liquidityPercentage[0]);
  const requiredToken = tokenRate
    .times(hardCap)
    // .plus(hardCap.times(lp).dividedBy(100).times(listingRate))
    .times(
      BigNumber(10).pow(
        BigNumber(parseInt(context.tokenInformation[0].tokenDecimals))
      )
    );
  useEffect(async () => {
    if (blockchain.web3) {
      if (blockchain.web3.utils.isAddress(address)) {
        const web3 = blockchain.web3;
        const token = new web3.eth.Contract(ERC20.abi, address);
        let tokenApproval = await token.methods
          .allowance(blockchain.account, blockchain.IDOFactory._address)
          .call();
        setTokenApprove(tokenApproval);
      }
    } else {
      setTokenApprove("");
    }
  }, [blockchain.web3]);

  const pinJSONToIPFS = async (JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
    return axios
      .post(url, JSONBody, {
        headers: {
          pinata_api_key: key,
          pinata_secret_api_key: secret,
        },
      })
      .then(function (response) {
        return {
          success: true,
          pinataUrl:
            "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
        };
      })
      .catch(function (error) {
        console.log(error);
        return {
          success: false,
          message: error.message,
        };
      });
  };

  const createIDO = async () => {
    setLoading(true);
    const iconAdded = await ipfs.add(icon);
    let iconURL = `https://ipfs.infura.io/ipfs/${iconAdded.path}`;
    const metadata = new Object();
    metadata.image = iconURL;
    metadata.description = context.description[0];
    metadata.links = new Object();
    metadata.links.website = context.website[0];
    metadata.links.discord = context.discord[0];
    metadata.links.telegram = context.telegram[0];
    metadata.links.twitter = context.twitter[0];
    const pinataResponse = await pinJSONToIPFS(metadata);
    if (!pinataResponse.success) {
      return {
        success: false,
        status: "😢 Something went wrong while uploading your tokenURI.",
      };
    }
    const tokenURI = pinataResponse.pinataUrl;

    blockchain.IDOFactory.methods
      .createIDO(
        context.address[0],
        blockchain.web3.utils.toWei(context.tokenRate[0]),
        blockchain.web3.utils.toWei("0"),
        [
          blockchain.web3.utils.toWei(context.softCap[0]),
          blockchain.web3.utils.toWei(context.hardCap[0]),
          blockchain.web3.utils.toWei(context.minETH[0]),
          blockchain.web3.utils.toWei(context.maxETH[0]),
        ],
        [
          BigNumber(context.start[0].getTime()).div(1000).decimalPlaces(0, 1).toNumber(),
          BigNumber(context.end[0].getTime()).div(1000).decimalPlaces(0, 1).toNumber(),
          BigNumber(context.unlock[0].getTime()).div(1000).decimalPlaces(0, 1).toNumber(),
        ],
        [
          chainRouter[process.env.REACT_APP_networkID][0].ROUTER,
          chainRouter[process.env.REACT_APP_networkID][0].FACTORY,
          chainRouter[process.env.REACT_APP_networkID][0].WETH,
        ],
        [parseInt("60"), blockchain.LockerFactory._address],
        tokenURI
      )
      .send({
        from: blockchain.account,
      })
      .once("error", (err) => {
        setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log(receipt);
        dispatch(fetchData(blockchain.account));
      });
  };

  const approveToken = async (_address, amount) => {
    setLoading(true);
    const web3 = blockchain.web3;
    const token = await new web3.eth.Contract(ERC20.abi, _address);
    token.methods
      .approve(blockchain.IDOFactory._address, amount)
      .send({
        from: blockchain.account,
      })
      .once("error", (err) => {
        setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log(receipt);
        setTokenApprove(amount);
        dispatch(fetchData(blockchain.account));
      });
  };

  return (
    <s.Container flex={1}>
      <s.TextTitle fullWidth>Token information</s.TextTitle>
      <s.Container ai="center">
        <div
          style={{
            display: "flex",
            width: 140,
            height: 140,
            borderRadius: 20,
            margin: 20,
            backgroundColor: "var(--upper-card)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <s.iconUpload
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              e.preventDefault();
              const file = e.target.files[0];
              context.icon[1](file);
            }}
          ></s.iconUpload>
          {context.icon[0] !== "" ? (
            <img
              style={{ width: 100, height: 100, borderRadius: 20 }}
              src={URL.createObjectURL(context.icon[0])}
            />
          ) : (
            <FaImage style={{ width: 100, height: 100, padding: 20 }} />
          )}
        </div>
      </s.Container>
      <SocialMediaModal
        website={context.website[0]}
        discord={context.discord[0]}
        telegram={context.telegram[0]}
        twitter={context.twitter[0]}
      />
      <s.SpacerSmall />
      <s.TextID>Description</s.TextID>
      <ReadMore>{context.description[0]}</ReadMore>

      <s.TextID>Token address</s.TextID>
      <s.TextDescriptionEllipsis>
        {token.tokenAddress}
      </s.TextDescriptionEllipsis>
      <s.TextID>Token name</s.TextID>
      <s.TextDescription>{token.tokenName}</s.TextDescription>
      <s.TextID>Total supply</s.TextID>
      <s.TextDescription>
        {BigNumber(token.totalSupply)
          .dividedBy(10 ** token.tokenDecimals)
          .toFormat(0) +
          " $" +
          token.tokenSymbol}
      </s.TextDescription>
      <s.TextTitle fullWidth>IDO information</s.TextTitle>
      <s.TextID>Token rate</s.TextID>
      <s.TextDescription>
        {"1 $" +
          process.env.REACT_APP_CURRENCY +
          " -> " +
          BigNumber(context.tokenRate[0]).toFormat(2) +
          " $" +
          token.tokenSymbol}
      </s.TextDescription>
      <s.Container fd={"row"} jc="space-between">
        <s.Container flex={1} style={{ marginLeft: 10, marginRight: 10 }}>
          <s.TextID>Soft Cap</s.TextID>
          <s.TextDescription>
            {BigNumber(context.softCap[0]).toFormat(2) +
              " $" +
              process.env.REACT_APP_CURRENCY}
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextID>Hard Cap</s.TextID>
          <s.TextDescription>
            {BigNumber(context.hardCap[0]).toFormat(2) +
              " $" +
              process.env.REACT_APP_CURRENCY}
          </s.TextDescription>
          <s.SpacerSmall />
          {/* <s.TextID>Pool router</s.TextID>
          <s.TextDescription>
            {
              chainRouter[process.env.REACT_APP_networkID][context.router[0]]
                .name
            }
          </s.TextDescription> */}
        </s.Container>
        <s.Container flex={1} style={{ marginLeft: 10, marginRight: 10 }}>
          <s.TextID>Minimum Buy</s.TextID>
          <s.TextDescription>
            {BigNumber(context.minETH[0]).toFormat(2) +
              " $" +
              process.env.REACT_APP_CURRENCY}
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextID>Maximum Buy</s.TextID>
          <s.TextDescription>
            {BigNumber(context.maxETH[0]).toFormat(2) +
              " $" +
              process.env.REACT_APP_CURRENCY}
          </s.TextDescription>
          <s.SpacerSmall />
          {/* <s.TextID>Liquidity %</s.TextID>
          <s.TextDescription>
            {BigNumber(context.liquidityPercentage[0]).toFixed(0) + " %"}
          </s.TextDescription> */}
        </s.Container>
      </s.Container>
      {/* <s.TextID>Listing rate</s.TextID>
      <s.TextDescription>
        {"1 $" +
          process.env.REACT_APP_CURRENCY +
          " -> " +
          BigNumber(context.listingRate[0]).toFormat(2) +
          " $" +
          token.tokenSymbol}
      </s.TextDescription> */}
      {/* (TokenRate * HardCap) + ((HardCap * LP%) * ListingRate) */}
      <s.TextDescription fullWidth style={{ color: "var(--primary)" }}>
        {"Required " +
          requiredToken
            .dividedBy(
              BigNumber(10).pow(
                BigNumber(parseInt(context.tokenInformation[0].tokenDecimals))
              )
            )
            .toFormat() +
          " $" +
          token.tokenSymbol}
      </s.TextDescription>
      <s.Container ai="center">
        {BigNumber(tokenApprove).gte(BigNumber(requiredToken)) ? (
          <s.button
            style={{ marginTop: 20 }}
            onClick={(e) => {
              e.preventDefault();
              createIDO();
            }}
          >
            {loading ? ". . ." : "CREATE LAUNCHPAD"}
          </s.button>
        ) : (
          <s.button
            style={{ marginTop: 20 }}
            onClick={(e) => {
              e.preventDefault();
              approveToken(address, BigNumber(requiredToken).toFixed(0));
            }}
          >
            {loading ? ". . ." : "APPROVE TOKEN"}
          </s.button>
        )}
      </s.Container>
    </s.Container>
  );
}
