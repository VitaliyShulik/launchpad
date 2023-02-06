import { useState, useEffect } from 'react';
import { STORAGE_NETWORK_ID, STORAGE_NETWORK_NAME } from '../../../constants';
import { useWeb3React } from '@web3-react/core';
import { useApplicationContext } from '../../../context/applicationContext';
import { isWebUri } from '../../../utils/url';
import { saveAppData } from '../../../utils/storage';
import { TextField, Typography, InputLabel, Select, MenuItem } from '@mui/material';
import * as s from "../../../styles/global";
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import { InjectedConnector } from '@web3-react/injected-connector';
import { SUPPORTED_NETWORKS, SUPPORTED_CHAIN_IDS } from '../../../connectors';
import { switchInjectedNetwork } from '../../../utils/utils';

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

export default function Main() {
  const { library, chainId, account, connector } = useWeb3React();
  const {
    domain,
    domainSettings,
    triggerDomainData,
  } = useApplicationContext();

  const [isLoading, setIsLoading] = useState(false);

  const [networkToSetUp, setNetworkToSetUp] = useState(SUPPORTED_CHAIN_IDS.includes(chainId) ? chainId : STORAGE_NETWORK_ID);

  const {
    ipfsInfuraDedicatedGateway: stateIpfsInfuraDedicatedGateway,
    ipfsInfuraProjectId: stateIpfsInfuraProjectId,
    ipfsInfuraProjectSecret: stateIpfsInfuraProjectSecret,
  } = domainSettings;

  const [ipfsInfuraDedicatedGateway, setIpfsInfuraDedicatedGateway] = useState(stateIpfsInfuraDedicatedGateway);
  const [ipfsInfuraProjectId, setIpfsInfuraProjectId] = useState(stateIpfsInfuraProjectId);
  const [ipfsInfuraProjectSecret, setIpfsInfuraProjectSecret] = useState(stateIpfsInfuraProjectSecret);

  const currentStrSettings = JSON.stringify({
    ipfsInfuraDedicatedGateway: stateIpfsInfuraDedicatedGateway,
    ipfsInfuraProjectId: stateIpfsInfuraProjectId,
    ipfsInfuraProjectSecret: stateIpfsInfuraProjectSecret,
  });

  const [settingsChanged, setSettingsChanged] = useState(false);

  useEffect(() => {
    const newStrSettings = JSON.stringify({
      ipfsInfuraDedicatedGateway,
      ipfsInfuraProjectId,
      ipfsInfuraProjectSecret,
    });

    setSettingsChanged(newStrSettings !== currentStrSettings);
  }, [
    currentStrSettings,
    ipfsInfuraDedicatedGateway,
    ipfsInfuraProjectId,
    ipfsInfuraProjectSecret,
  ]);


  const isStorageNetwork = chainId === STORAGE_NETWORK_ID;
  const canChangeNetwork = (connector instanceof InjectedConnector);
  const canAndShouldSwitchToStorageNetwork = canChangeNetwork && !isStorageNetwork;

  const [cannotSaveSettings, setCannotSaveSettings] = useState(true);

  useEffect(() => {
    setCannotSaveSettings(
        (!isStorageNetwork && !canChangeNetwork) ||
        (isStorageNetwork && !settingsChanged)
    );
  }, [
    settingsChanged,
    isStorageNetwork,
    canChangeNetwork,
]);

  const saveMainSettings = async () => {
    setIsLoading(true);

    try {
      const newSettings = {
        ipfsInfuraDedicatedGateway,
        ipfsInfuraProjectId,
        ipfsInfuraProjectSecret,
      };

      await saveAppData({
        library,
        domain,
        owner: account || '',
        data: newSettings,
        onReceipt: () => {
          triggerDomainData();
        },
        onHash: (hash) => {
          console.log('saveMainSettings hash: ', hash);
        },
      })
    } catch (error) {
      console.group('%c saveMainSettings', 'color: red');
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
      <Typography>Infura IPFS</Typography>

      <s.SpacerSmall />

      <TextField
        label="Dedicated Gateway Subdomain"
        value={ipfsInfuraDedicatedGateway}
        onChange={(e) => {
          setIpfsInfuraDedicatedGateway(e.target.value);
        }}
        error={Boolean(ipfsInfuraDedicatedGateway && !isWebUri(ipfsInfuraDedicatedGateway))}
      />

      <s.SpacerSmall />

      <TextField
        label="Project ID"
        value={ipfsInfuraProjectId}
        onChange={(e) => {
          setIpfsInfuraProjectId(e.target.value);
        }}
      />

      <s.SpacerSmall />

      <TextField
        label="API Key Secret"
        value={ipfsInfuraProjectSecret}
        onChange={(e) => {
          setIpfsInfuraProjectSecret(e.target.value);
        }}
      />

      <s.SpacerSmall />

      <Typography>Networks</Typography>

      <s.SpacerSmall />

      <InputLabel id="selectedNetworkLablel">Selected Network</InputLabel>
      <Select
        labelId="selectedNetworkLable"
        id="selectedNetwork"
        value={networkToSetUp}
        label="Network"
        onChange={(e) => {
          setNetworkToSetUp(e.target.value);
        }}
      >
        {SUPPORTED_CHAIN_IDS.map((chainId) => (
          <MenuItem key={chainId} value={chainId}>{SUPPORTED_NETWORKS[chainId].name}</MenuItem>
        ))}
      </Select>

      <s.SpacerSmall />

      <s.button
        onClick={canAndShouldSwitchToStorageNetwork ? switchToStorage : saveMainSettings}
        disabled={cannotSaveSettings}
      >
        { isLoading
          ? <Loader />
          : isStorageNetwork
            ? 'Save Settings'
            : `Switch to ${STORAGE_NETWORK_NAME}`
        }
      </s.button>
    </ContentWrapper>
  )
}
