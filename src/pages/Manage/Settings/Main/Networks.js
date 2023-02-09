import { useState, useEffect } from 'react';
import { STORAGE_NETWORK_ID, STORAGE_NETWORK_NAME } from '../../../../constants';
import { useWeb3React } from '@web3-react/core';
import { useApplicationContext } from '../../../../context/applicationContext';
import { saveAppData } from '../../../../utils/storage';
import { TextField, Typography, InputLabel, Select, MenuItem } from '@mui/material';
import * as s from "../../../../styles/global";
import styled from 'styled-components';
import Loader from '../../../../components/Loader';
import { InjectedConnector } from '@web3-react/injected-connector';
import { SUPPORTED_NETWORKS, SUPPORTED_CHAIN_IDS } from '../../../../connectors';
import { switchInjectedNetwork } from '../../../../utils/utils';

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

export default function Networks() {
  const { library, chainId, account, connector } = useWeb3React();
  const {
    domain,
    domainSettings: {
      networks
    },
    triggerDomainData,
  } = useApplicationContext();

  const [isLoading, setIsLoading] = useState(false);

  const [chainIdToSetUp, setChainIdToSetUp] = useState((chainId && !!networks?.[chainId || 0]) ? chainId : '');
  const [webSocketRPC, setWebSocketRPC] = useState(networks?.[chainId || 0]?.webSocketRPC || '');
  const [canSaveNetworksSettings, setCanSaveNetworksSettings] = useState(false);

  const isStorageNetwork = chainId === STORAGE_NETWORK_ID;
  const canChangeNetwork = (connector instanceof InjectedConnector);

  useEffect(() => {
    const isDifferentSettings =
      webSocketRPC.toLowerCase() !== networks?.[chainIdToSetUp || 0]?.webSocketRPC?.toLowerCase();

    setCanSaveNetworksSettings(
      isStorageNetwork &&
      SUPPORTED_CHAIN_IDS.includes(chainIdToSetUp) &&
      webSocketRPC &&
      // TODO: add isValidWebSocketRPC with connecting to the ws and check the related chainIdToSetUp
      isDifferentSettings
    );
  }, [networks, webSocketRPC, chainIdToSetUp, isStorageNetwork]);

  useEffect(() => {
    setWebSocketRPC(networks?.[chainIdToSetUp || 0]?.webSocketRPC || '');
  }, [networks, chainIdToSetUp])


  const saveNetworksData = async () => {
    setIsLoading(true);

    try {
      await saveAppData({
        library,
        domain,
        owner: account || '',
        data: {
          networks: {
            [chainIdToSetUp]: {
              webSocketRPC,
            },
          },
        },
        onReceipt: () => {
            triggerDomainData();
          },
        onHash: (hash) => {
          console.log('saveNetworksData hash: ', hash);
        },
      })
    } catch (error) {
      console.group('%c saveNetworksData', 'color: red');
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
      <Typography variant="h6">Networks</Typography>

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
        label="Web Socket RPC"
        value={webSocketRPC}
        onChange={(e) => {
          setWebSocketRPC(e.target.value);
        }}
      />

      <s.SpacerSmall />

      {
        isStorageNetwork ? (
          <s.button
            onClick={saveNetworksData}
            disabled={!canSaveNetworksSettings}
          >
            { isLoading ? <Loader /> : 'Save Networks Settings' }
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
