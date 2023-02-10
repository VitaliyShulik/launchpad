import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../../../../context/store";
import * as s from "../../../../styles/global";
import { chainRouter } from "../../../../constants/networksInfo";
import SocialMediaModal from "../../../Modal/socialmediaModal";
import { useApplicationContext } from "../../../../context/applicationContext";
import { useTokenContract } from "../../../../hooks/useContract";
import ReadMore from "../../readMore";
import { isAddress } from "../../../../utils/utils";
import { useIPFS } from "../../../../hooks/useIPFS";

export default function Preview() {
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

  const {
    tokenInformation: [tokenInfo],
    address: [tokenAddress],
    icon: [icon, setIcon],
    tokenRate: [tokenRate],
    hardCap: [hardCap],
    softCap: [softCap],
    minETH: [minETH],
    maxETH: [maxETH],
    listingRate: [listingRate],
    liquidityPercentage: [liquidityPercentage],
    isAddLiquidityEnabled: [isAddLiquidityEnabled],
    start: [start],
    end: [end],
    unlock: [unlock],

    description: [description],
    website: [website],
    discord: [discord],
    telegram: [telegram],
    twitter: [twitter],
  } = useStoreContext();

  const ipfs = useIPFS();

  const tokenContract = useTokenContract(tokenAddress);
  const [IDOFactoryFee, sesIDOFactoryFee] = useState("0");
  const [tokenApprove, setTokenApprove] = useState("");
  const [isTokenApprovalFetching, setIsTokenApprovalFetching] = useState(false);
  const [loading, setLoading] = useState(false);

  const tokenRateBN = BigNumber(tokenRate);
  const hardCapBN = BigNumber(hardCap);
  const listingRateBN = BigNumber(isAddLiquidityEnabled ? listingRate : 0);
  const lp = BigNumber(isAddLiquidityEnabled ? liquidityPercentage : 0);

  const requiredToken = tokenRateBN
    .times(hardCapBN)
    .plus(hardCapBN.times(lp).dividedBy(100).times(listingRateBN))
    .times(
      BigNumber(10).pow(
        BigNumber(parseInt(tokenInfo.tokenDecimals))
      )
    );

  useEffect(() => {
    const checkTokenApproval = async () => {
      setIsTokenApprovalFetching(true);
      try {
        let tokenApproval = await tokenContract.allowance(account, IDOFactoryAddress);
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
      const IDOFactoryFee = await IDOFactoryContract?.feeAmount() || "0";
      sesIDOFactoryFee(IDOFactoryFee.toString());
    }

    fetchIDOFactoryFee();
  }, [IDOFactoryContract]);

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

    try {
      const iconAdded = await ipfs.add(icon);

      const metadata = {
        imageHash: iconAdded.path,
        description,
        links: {
          website,
          discord,
          telegram,
          twitter,
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

      const rewardToken = tokenAddress;
      const tokenRateWei = library.web3.utils.toWei(tokenRate);
      const listingRateWei = library.web3.utils.toWei(isAddLiquidityEnabled ? listingRate : "0");
      const finInfo = [
        tokenRateWei,
        library.web3.utils.toWei(softCap),
        library.web3.utils.toWei(hardCap),
        library.web3.utils.toWei(minETH),
        library.web3.utils.toWei(maxETH),
        listingRateWei,
        parseInt(isAddLiquidityEnabled ? liquidityPercentage : 0),
      ];
      const timestamps = [
        BigNumber(start.getTime()).div(1000).decimalPlaces(0, 1).toNumber(),
        BigNumber(end.getTime()).div(1000).decimalPlaces(0, 1).toNumber(),
        BigNumber(unlock.getTime()).div(1000).decimalPlaces(0, 1).toNumber(),
      ];
      const dexInfo = [
        chainRouter[chainId][0].ROUTER,
        chainRouter[chainId][0].FACTORY,
        chainRouter[chainId][0].WETH,
      ];

      const tx = await IDOFactoryContract
        .createIDO(
          rewardToken,
          finInfo,
          timestamps,
          dexInfo,
          TokenLockerFactoryAddress,
          tokenURI,
          {
            from: account,
          },
        );

      const receipt = await tx.wait();

      console.log('createIDO receipt', receipt);

      triggerUpdateAccountData();
      const IDOCreatedIndex = receipt?.events?.findIndex?.((i) => i?.event === "IDOCreated");
      if (IDOCreatedIndex || IDOCreatedIndex === 0){
        navigate(`../launchpad/${receipt.events[IDOCreatedIndex].args.idoPool}`)
      }
    } catch (error) {
      console.log("createIDO Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const approveToken = async (amount, tokenContract) => {
    if (!tokenContract) {
      return;
    }
    setLoading(true);

    try {
      const tx = await tokenContract.approve(IDOFactoryAddress, amount, {
        from: account,
      });

      await tx.wait();

      setTokenApprove(amount);
      triggerUpdateAccountData();
    } catch (error) {
      console.log("approveToken Error: ", error);
    } finally {
      setLoading(false);
    }
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
              setIcon(file);
            }}
          ></s.iconUpload>
          {icon !== "" ? (
            <img
              style={{ width: 100, height: 100, borderRadius: 20 }}
              src={URL.createObjectURL(icon)}
            />
          ) : (
            <FaImage style={{ width: 100, height: 100, padding: 20 }} />
          )}
        </div>
      </s.Container>
      <SocialMediaModal
        website={website}
        discord={discord}
        telegram={telegram}
        twitter={twitter}
      />
      <s.SpacerSmall />
      <s.TextID>Description</s.TextID>
      <ReadMore max={2000}>{description}</ReadMore>

      <s.TextID>Token address</s.TextID>
      <s.TextDescriptionEllipsis>
        {tokenInfo.tokenAddress}
      </s.TextDescriptionEllipsis>
      <s.TextID>Token name</s.TextID>
      <s.TextDescription>{tokenInfo.tokenName}</s.TextDescription>
      <s.TextID>Total supply</s.TextID>
      <s.TextDescription>
        {BigNumber(tokenInfo.totalSupply)
          .dividedBy(10 ** tokenInfo.tokenDecimals)
          .toFormat(0) +
          " $" +
          tokenInfo.tokenSymbol}
      </s.TextDescription>
      <s.TextTitle fullWidth>IDO information</s.TextTitle>
      <s.TextID>Token rate</s.TextID>
      <s.TextDescription>
        {"1 $" +
          baseCurrencySymbol +
          " -> " +
          tokenRateBN.toFormat(2) +
          " $" +
          tokenInfo.tokenSymbol}
      </s.TextDescription>
      <s.Container fd={"row"} jc="space-between">
        <s.Container flex={1} style={{ marginLeft: 10, marginRight: 10 }}>
          <s.TextID>Soft Cap</s.TextID>
          <s.TextDescription>
            {BigNumber(softCap).toFormat(2) +
              " $" +
              baseCurrencySymbol}
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextID>Hard Cap</s.TextID>
          <s.TextDescription>
            {hardCapBN.toFormat(2) +
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
            {BigNumber(minETH).toFormat(2) +
              " $" +
              baseCurrencySymbol}
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextID>Maximum Buy</s.TextID>
          <s.TextDescription>
            {BigNumber(maxETH).toFormat(2) +
              " $" +
              baseCurrencySymbol}
          </s.TextDescription>
          {
            isAddLiquidityEnabled && <>
              <s.SpacerSmall />
              <s.TextID>Liquidity %</s.TextID>
              <s.TextDescription>
                {BigNumber(liquidityPercentage).toFixed(0) + " %"}
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
              BigNumber(listingRate).toFormat(2) +
              " $" +
              tokenInfo.tokenSymbol}
          </s.TextDescription>
          (TokenRate * HardCap) + ((HardCap * LP%) * ListingRate)
        </>
      }
      <s.TextDescription fullWidth style={{ color: "var(--primary)" }}>
        {"Required " +
          requiredToken
            .dividedBy(
              BigNumber(10).pow(
                BigNumber(parseInt(tokenInfo.tokenDecimals))
              )
            )
            .toFormat() +
          " $" +
          tokenInfo.tokenSymbol}
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
            {loading ? ". . ." : `APPROVE ${tokenInfo.tokenSymbol}`}
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

      {IDOFactoryFee && IDOFactoryFee !== "0" && `Create IDO fee : ${library.web3.utils.fromWei(IDOFactoryFee)} ${FeeTokenSymbol}`}
    </s.Container>
  );
}
