import { useState, useEffect } from 'react';
import { useWeb3React } from "@web3-react/core";
import { getCurrentDomain } from '../utils/utils';
import { useStorageContract } from './useContract';
import { STORAGE_APP_KEY, ZERO_ADDRESS } from '../constants';

const defaultSettings = () => ({
  isLockerEnabled: true,
  admin: '',
});

const parseSettings = (settings, chainId) => {
  const appSettings = defaultSettings()

  try {
    const settingsJSON = JSON.parse(settings);

    if (!settingsJSON?.[STORAGE_APP_KEY]) {
      settingsJSON[STORAGE_APP_KEY] = {};
    }

    const { [STORAGE_APP_KEY]: parsedSettings } = settingsJSON;

    const {
      isLockerEnabled,
    } = parsedSettings;

    if (isLockerEnabled) appSettings.isLockerEnabled = isLockerEnabled;

  } catch (error) {
    console.group('%c Storage settings', 'color: red')
    console.error(error)
    console.log('source settings: ', settings)
    console.groupEnd()
  }

  return appSettings
}

export default function useDomainData() {
  const { chainId } = useWeb3React();

  const [domainSettings, setDomainSettings] = useState(null);
  const [isDomainDataFetching, setIsDomainDataFetching] = useState(false);
  const [isDomainDataFetched, setIsDomainDataFetched] = useState(false);
  const [domainDataTrigger, setDomainDataTrigger] = useState(false);
  const triggerDomainData = () => setDomainDataTrigger(!domainDataTrigger);

  const storageContract = useStorageContract();

  const domain = getCurrentDomain();

  useEffect(() => {
    const fetchDomainData = async () => {
      setIsDomainDataFetching(true);
      try {
        const { info, owner } = await storageContract.methods.getData(domain).call();

        const settings = parseSettings(info || '{}', chainId || 0);

        const admin = owner === ZERO_ADDRESS ? '' : owner;

        setDomainSettings({ ...settings, admin });

        setIsDomainDataFetched(true);
      } catch (error) {
        console.log('fetchDomainData Error: ', error)
      } finally {
        setIsDomainDataFetching(false);
      }
    }

    if (chainId && domain) {
        fetchDomainData();
    }
  }, [chainId, domainDataTrigger]);

  return {
    domain,
    domainSettings,
    isDomainDataFetching,
    isDomainDataFetched,

    triggerDomainData,
  };
}
