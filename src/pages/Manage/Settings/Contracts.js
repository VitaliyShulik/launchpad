import { useState, useEffect } from 'react';
import { STORAGE_NETWORK_ID, STORAGE_NETWORK_NAME } from '../../../constants';
import { useWeb3React } from '@web3-react/core';
import { useApplicationContext } from '../../../context/applicationContext';
import { saveAppData } from '../../../utils/storage';
import { TextField, InputLabel, Select, MenuItem } from '@mui/material';
import * as s from "../../../styles/global";
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import { InjectedConnector } from '@web3-react/injected-connector';
import { SUPPORTED_NETWORKS, SUPPORTED_CHAIN_IDS } from '../../../connectors';
import { isAddress, switchInjectedNetwork } from '../../../utils/utils';

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;

  ${({ disabled }) => (disabled ? `
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.6;
    ` : ''
  )};
`

export default function Contracts() {
  const { library, chainId, account, connector } = useWeb3React();
  const {
    domain,
    domainSettings: {
      contracts
    },
    triggerDomainData,
  } = useApplicationContext();

  const [isLoading, setIsLoading] = useState(false);

  const [chainIdToSetUp, setChainIdToSetUp] = useState((chainId && !!contracts?.[chainId || 0]) ? chainId : '');
  const [FeeTokenAddress, setFeeTokenAddress] = useState(contracts?.[chainId || 0]?.FeeTokenAddress || '');
  const [IDOFactoryAddress, setIDOFactoryAddress] = useState(contracts?.[chainId || 0]?.IDOFactoryAddress || '');
  const [TokenLockerFactoryAddress, setTokenLockerFactoryAddress] = useState(contracts?.[chainId || 0]?.TokenLockerFactoryAddress || '');
  const [canSaveNetworksSettings, setCanSaveNetworksSettings] = useState(false);

  const isStorageNetwork = chainId === STORAGE_NETWORK_ID;
  const canChangeNetwork = (connector instanceof InjectedConnector);

  useEffect(() => {
    const isDifferentContracts = (
      FeeTokenAddress.toLowerCase() !== contracts?.[chainIdToSetUp || 0]?.FeeTokenAddress?.toLowerCase() ||
      IDOFactoryAddress.toLowerCase() !== contracts?.[chainIdToSetUp || 0]?.IDOFactoryAddress?.toLowerCase() ||
      TokenLockerFactoryAddress.toLowerCase() !== contracts?.[chainIdToSetUp || 0]?.TokenLockerFactoryAddress?.toLowerCase()
    );

    const isSameContractAddresses = (
      FeeTokenAddress.toLowerCase() === IDOFactoryAddress.toLowerCase() ||
      FeeTokenAddress.toLowerCase() === TokenLockerFactoryAddress.toLowerCase() ||
      IDOFactoryAddress.toLowerCase() === TokenLockerFactoryAddress.toLowerCase()
    );

    setCanSaveNetworksSettings(
      isStorageNetwork &&
      SUPPORTED_CHAIN_IDS.includes(chainIdToSetUp) &&
      isAddress(FeeTokenAddress) &&
      isAddress(IDOFactoryAddress) &&
      isAddress(TokenLockerFactoryAddress) &&
      isDifferentContracts &&
      !isSameContractAddresses
    );
  }, [contracts, FeeTokenAddress, IDOFactoryAddress, TokenLockerFactoryAddress, chainIdToSetUp, isStorageNetwork]);

  useEffect(() => {
    setFeeTokenAddress(contracts?.[chainIdToSetUp || 0]?.FeeTokenAddress || '');
    setIDOFactoryAddress(contracts?.[chainIdToSetUp || 0]?.IDOFactoryAddress || '');
    setTokenLockerFactoryAddress(contracts?.[chainIdToSetUp || 0]?.TokenLockerFactoryAddress || '');
  }, [contracts, chainIdToSetUp])


  const saveContractsData = async () => {
    setIsLoading(true);
    try {
      await saveAppData({
        library,
        domain,
        owner: account || '',
        data: {
          contracts: {
            [chainIdToSetUp]: {
              FeeTokenAddress,
              IDOFactoryAddress,
              TokenLockerFactoryAddress
            },
          },
        },
        onReceipt: () => {
            triggerDomainData();
          },
        onHash: (hash) => {
          console.log('saveContractsData hash: ', hash);
        },
      })
    } catch (error) {
      console.group('%c saveContractsData', 'color: red');
      console.error(error);
      console.groupEnd();
    } finally {
      setIsLoading(false);
    }
  }

  const switchToStorage = async () => {
    setIsLoading(true);

    try {
      await switchInjectedNetwork(STORAGE_NETWORK_ID);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ContentWrapper disabled={isLoading}>
      <s.SpacerSmall />

      <InputLabel id="selectedNetworkLablel">Selected Network</InputLabel>
      <Select
        labelId="selectedNetworkLable"
        id="selectedNetwork"
        value={chainIdToSetUp}
        label="Network"
        onChange={(e) => {
          setChainIdToSetUp(e.target.value);
        }}
      >
        {SUPPORTED_CHAIN_IDS.map((chainId) => (
          <MenuItem key={chainId} value={chainId}>{SUPPORTED_NETWORKS[chainId].name}</MenuItem>
        ))}
      </Select>

      <s.SpacerSmall />

      <TextField
        label="Fee Token Address"
        value={FeeTokenAddress}
        onChange={(e) => {
          setFeeTokenAddress(e.target.value);
        }}
        error={Boolean(FeeTokenAddress && !isAddress(FeeTokenAddress))}
      />

      <s.SpacerSmall />

      <TextField
        label="IDO Factory Address"
        value={IDOFactoryAddress}
        onChange={(e) => {
          setIDOFactoryAddress(e.target.value);
        }}
        error={Boolean(IDOFactoryAddress && !isAddress(IDOFactoryAddress))}
      />

      <s.SpacerSmall />

      <TextField
        label="Token Locker Factory Address"
        value={TokenLockerFactoryAddress}
        onChange={(e) => {
          setTokenLockerFactoryAddress(e.target.value);
        }}
        error={Boolean(TokenLockerFactoryAddress && !isAddress(TokenLockerFactoryAddress))}
      />

      <s.SpacerSmall />

      {
        isStorageNetwork ? (
          <s.button
            onClick={saveContractsData}
            disabled={!canSaveNetworksSettings}
          >
            { isLoading ? <Loader /> : 'Save Contracts Settings' }
          </s.button>
        ) : (
          <s.button
            onClick={switchToStorage}
            disabled={!canChangeNetwork}
          >
            { isLoading ? <Loader /> : `Switch to ${STORAGE_NETWORK_NAME}` }
          </s.button>
        )

      }

    </ContentWrapper>
  )
}
