import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PoolInfoRenderer from "../components/Card/poolInfoRenderer";
import IDOAction from "../components/Modal/idoActionModal";
import Loader from "../components/Loader";
import * as s from "../styles/global";
import { usePoolContext } from "../context/poolContext";
import { useIDOPoolContract } from "../hooks/useContract";
import { Typography } from "@mui/material";
import { isAddress, isValidPool } from "../utils/utils";

const LaunchpadInFo = () => {
  const { idoAddress } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [prompt, setPromt] = useState('');

  const idoInfo = usePoolContext().allPools[idoAddress];
  const IDOPoolContract = useIDOPoolContract(idoAddress);

  useEffect(() => {
    const checkPoolByContract = async () => {
      try {
        const hasRewardToken = await IDOPoolContract.rewardToken();
        if (isAddress(hasRewardToken)) {
          setPromt('Wait for the pool data is loaded... It may take more than 30 seconds.')
        } else {
          setIsLoading(false);
          return setPromt('Address is not valid...');
        }
      } catch (error) {
        console.log('CheckPoolByContract Error:', error)
        setIsLoading(false);
        return setPromt('Address is not valid...');
      }
    }

    if (IDOPoolContract === null) {
      setIsLoading(false);
      return setPromt('Address is not valid...');
    }

    if (!idoInfo && IDOPoolContract) {
      return checkPoolByContract();
    }

    const isValidPoolData = !!idoInfo && isValidPool(idoInfo);

    if (isValidPoolData) {
      setIsLoading(false);
      return setPromt('');
    } else {
      setIsLoading(false);
      return setPromt('Pool is not valid...');
    }


  },[IDOPoolContract, idoInfo])


  return (
    <s.Container ai="center">
      <s.TextTitle>Launchpad</s.TextTitle>
      <s.SpacerMedium />
      {
        isLoading || prompt ? (
          <s.Container ai="center">
            {isLoading && <Loader size="2rem" />}
            {prompt && <Typography>{prompt}</Typography>}
          </s.Container>
        ): (
          <s.Container jc="space-around" fd="row">
            <PoolInfoRenderer idoAddress={idoAddress} />
            <IDOAction idoAddress={idoAddress} />
          </s.Container>
        )
      }
    </s.Container>
  );
};

export default LaunchpadInFo;
