import BigNumber from "bignumber.js";
import { create } from "ipfs-http-client";
import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../../../../context/store";
import * as s from "../../../../styles/global";
import { chainRouter } from "../../../../utils/chainInfo";
import SocialMediaModal from "../../../Modal/socialmediaModal";
import { useApplicationContext } from "../../../../context/applicationContext";
import { useTokenContract } from "../../../../hooks/useContract";
import ReadMore from "../../readMore";
import { isAddress } from "../../../../utils/utils";

const projectId = process.env.REACT_APP_INFURA_IPFS_KEY;
const projectSecret = process.env.REACT_APP_INFURA_IPFS_SECRET;
const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString('base64');

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
      authorization: auth,
  },
});

export default function Preview() {
  const context = useStoreContext();
  const token = context.tokenInformation[0];
  const { account, chainId, library } = useWeb3React();
  const {
    baseCurrencySymbol,
    IDOFactoryContract,
    IDOFactoryAddress,
    TokenLockerFactoryAddress,
    FeeTokenContract,
    FeeTokenSymbol,
    FeeTokenApproveToFactory,
    triggerUpdateAccountData,
    isFeeTokenDataFetching,
  } = useApplicationContext();
  const navigate = useNavigate();

  const tokenAddress = context.address[0];
  const tokenContract = useTokenContract(tokenAddress);
  const icon = context.icon[0];
  const [IDOFactoryFee, sesIDOFactoryFee] = useState("0");
  const [tokenApprove, setTokenApprove] = useState("");
  const [isTokenApprovalFetching, setIsTokenApprovalFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const tokenRate = BigNumber(context.tokenRate[0]);
  const hardCap = BigNumber(context.hardCap[0]);
  const {
    isAddLiquidityEnabled: [isAddLiquidityEnabled],
  } = context;
  const listingRate = BigNumber(isAddLiquidityEnabled ? context.listingRate[0] : 0);
  const lp = BigNumber(isAddLiquidityEnabled ? context.liquidityPercentage[0] : 0);
  const requiredToken = tokenRate
    .times(hardCap)
    .plus(hardCap.times(lp).dividedBy(100).times(listingRate))
    .times(
      BigNumber(10).pow(
        BigNumber(parseInt(context.tokenInformation[0].tokenDecimals))
      )
    );

  useEffect(() => {
    const checkTokenApproval = async () => {
      setIsTokenApprovalFetching(true);
      try {
        let tokenApproval = await tokenContract.methods
          .allowance(account, IDOFactoryAddress)
          .call();
        setTokenApprove(tokenApproval);
      } catch (error) {
        console.log('checkTokenApproval error: ', error);
      } finally {
        setIsTokenApprovalFetching(false);
      }
    }
    if (isAddress(tokenAddress) && tokenContract) {
      checkTokenApproval();
    } else {
      setTokenApprove("");
    }
  }, [account, library, IDOFactoryAddress, tokenContract, tokenAddress]);

  useEffect(() => {
    const fetchIDOFactoryFee = async () => {
      console.log('IDOFactoryContract', IDOFactoryContract)
      const IDOFactoryFee = await IDOFactoryContract?.feeAmount().call() || "0";
      console.log('IDOFactoryFee', IDOFactoryFee)
      sesIDOFactoryFee(IDOFactoryFee);
    }

    fetchIDOFactoryFee();
  }, []);

  const pinJSONToIPFS = async (JSONBody) => {
    try {
      const JSONBodyString = JSON.stringify(JSONBody);
      const response = await ipfs.add(JSONBodyString);
      return {
        success: true,
        ipfsHash:
          response.path,
      };

    } catch (error) {

      console.log(error);
      return {
        success: false,
        message: error.message,
      };

    }
  };

  const createIDO = async () => {
    setLoading(true);

    const iconAdded = await ipfs.add(icon);

    const metadata = {
      imageHash: iconAdded.path,
      description: context.description[0],
      links: {
        website: context.website[0],
        discord: context.discord[0],
        telegram: context.telegram[0],
        twitter: context.twitter[0],
      }
    };

    const ipfsResonse = await pinJSONToIPFS(metadata);

    if (!ipfsResonse.success) {
      return {
        success: false,
        status: "😢 Something went wrong while uploading your tokenURI.",
      };
    }
    const tokenURI = ipfsResonse.ipfsHash;

    const rewardToken = context.address[0];
    const tokenRate = library.utils.toWei(context.tokenRate[0]);
    const listingRate = library.utils.toWei(isAddLiquidityEnabled ? context.listingRate[0] : "0");
    const finInfo = [
      tokenRate,
      library.utils.toWei(context.softCap[0]),
      library.utils.toWei(context.hardCap[0]),
      library.utils.toWei(context.minETH[0]),
      library.utils.toWei(context.maxETH[0]),
      listingRate,
      parseInt(isAddLiquidityEnabled ? context.liquidityPercentage[0] : 0),
    ];
    const timestamps = [
      BigNumber(context.start[0].getTime()).div(1000).decimalPlaces(0, 1).toNumber(),
      BigNumber(context.end[0].getTime()).div(1000).decimalPlaces(0, 1).toNumber(),
      BigNumber(context.unlock[0].getTime()).div(1000).decimalPlaces(0, 1).toNumber(),
    ];
    const dexInfo = [
      chainRouter[chainId][0].ROUTER,
      chainRouter[chainId][0].FACTORY,
      chainRouter[chainId][0].WETH,
    ];

    IDOFactoryContract
      .createIDO(
        rewardToken,
        finInfo,
        timestamps,
        dexInfo,
        TokenLockerFactoryAddress,
        tokenURI
      )
      .send({
        from: account,
      })
      .once("error", (err) => {
        setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log(receipt);
        triggerUpdateAccountData();
        if (receipt?.events?.IDOCreated?.returnValues?.idoPool){
          navigate(`../locker/${receipt.events.IDOCreated.returnValues.idoPool}`)
        }
      });
  };

  const approveToken = async (amount, tokenContract) => {
    setLoading(true);
    const token = tokenContract
    token.methods
      .approve(IDOFactoryAddress, amount)
      .send({
        from: account,
      })
      .once("error", (err) => {
        setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log(receipt);
        setTokenApprove(amount);
        triggerUpdateAccountData();
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
          baseCurrencySymbol +
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
              baseCurrencySymbol}
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextID>Hard Cap</s.TextID>
          <s.TextDescription>
            {BigNumber(context.hardCap[0]).toFormat(2) +
              " $" +
              baseCurrencySymbol}
          </s.TextDescription>
          <s.SpacerSmall />
          {/* <s.TextID>Pool router</s.TextID>
          <s.TextDescription>
            {
              chainRouter[chainId][context.router[0]]
                .name
            }
          </s.TextDescription> */}
        </s.Container>
        <s.Container flex={1} style={{ marginLeft: 10, marginRight: 10 }}>
          <s.TextID>Minimum Buy</s.TextID>
          <s.TextDescription>
            {BigNumber(context.minETH[0]).toFormat(2) +
              " $" +
              baseCurrencySymbol}
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextID>Maximum Buy</s.TextID>
          <s.TextDescription>
            {BigNumber(context.maxETH[0]).toFormat(2) +
              " $" +
              baseCurrencySymbol}
          </s.TextDescription>
          {
            isAddLiquidityEnabled && <>
              <s.SpacerSmall />
              <s.TextID>Liquidity %</s.TextID>
              <s.TextDescription>
                {BigNumber(context.liquidityPercentage[0]).toFixed(0) + " %"}
              </s.TextDescription>
            </>
          }
        </s.Container>
      </s.Container>
      {
        isAddLiquidityEnabled && <>
          <s.TextID>Listing rate</s.TextID>
          <s.TextDescription>
            {"1 $" +
              baseCurrencySymbol +
              " -> " +
              BigNumber(context.listingRate[0]).toFormat(2) +
              " $" +
              token.tokenSymbol}
          </s.TextDescription>
          (TokenRate * HardCap) + ((HardCap * LP%) * ListingRate)
        </>
      }
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
        {BigNumber(FeeTokenApproveToFactory).lt(BigNumber(IDOFactoryFee)) ? (
          <s.button
            style={{ marginTop: 20 }}
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              approveToken(IDOFactoryFee, FeeTokenContract);
            }}
          >
            {loading ? ". . ." : `APPROVE ${FeeTokenSymbol}`}
          </s.button>
        ) : BigNumber(tokenApprove).lt(BigNumber(requiredToken)) ? (
          <s.button
            style={{ marginTop: 20 }}
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              approveToken(BigNumber(requiredToken).toFixed(0), tokenContract);
            }}
          >
            {loading ? ". . ." : `APPROVE ${token.tokenSymbol}`}
          </s.button>
        ) : (
          <s.button
            style={{ marginTop: 20 }}
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              createIDO();
            }}
          >
            {loading ? ". . ." : "Create IDO Poll"}
          </s.button>
        )}
      </s.Container>

      {IDOFactoryFee && IDOFactoryFee !== "0" && `Create IDO fee : ${library.utils.fromWei(IDOFactoryFee)} ${FeeTokenSymbol}`}
    </s.Container>
  );
}
