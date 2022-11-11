import { useEffect, useState } from 'react';

import { STORAGE_APP_KEY, getCurrentDomain, ZERO_ADDRESS } from "../utils/app";

import { useStorageContract } from './useStorageContract';

const validArray = (arr) => Array.isArray(arr) && !!arr.length

const defaultSettings = () => ({
  admin: '',
  contracts: {},
  idoFactory: '',
  lockerFactory: '',
  feeToken: '',
  domain: '',
  projectName: '',
  logo: '',
  navigationLinks: [],
  menuLinks: [],
  socialLinks: [],
  disableSourceCopyright: false,
})

const parseSettings = (settings, chainId) => {
  const appSettings = defaultSettings()

  try {
    const settingsJSON = JSON.parse(settings)

    if (!settingsJSON?.[STORAGE_APP_KEY]) {
      settingsJSON[STORAGE_APP_KEY] = {}
    }
    if (!settingsJSON[STORAGE_APP_KEY]?.contracts) {
      settingsJSON[STORAGE_APP_KEY].contracts = {}
    }

    const { ido_factory: parsedSettings } = settingsJSON

    const {
      contracts,
      domain,
      projectName,
      logo,
      navigationLinks,
      menuLinks,
      socialLinks,
      disableSourceCopyright,
    } = parsedSettings

    appSettings.contracts = contracts

    if (contracts[chainId]) {
      const { idoFactory, lockerFactory, feeToken } = contracts[chainId]

      appSettings.idoFactory = idoFactory
      appSettings.lockerFactory = lockerFactory
      appSettings.feeToken = feeToken
    }

    if (domain) appSettings.domain = domain
    if (projectName) appSettings.projectName = projectName

    if (logo) appSettings.logo = logo
    if (Boolean(disableSourceCopyright)) appSettings.disableSourceCopyright = disableSourceCopyright

    if (validArray(navigationLinks)) appSettings.navigationLinks = navigationLinks
    if (validArray(menuLinks)) appSettings.menuLinks = menuLinks
    if (validArray(socialLinks)) appSettings.socialLinks = socialLinks

  } catch (error) {
    console.group('%c Storage settings', 'color: red')
    console.error(error)
    console.log('source settings: ', settings)
    console.groupEnd()
  }

  return appSettings
}

const fetchDomainData = async (
  chainId,
  storage,
) => {
  let fullData = defaultSettings()

  try {
    let currentDomain = getCurrentDomain()

    const { info, owner } = await storage.methods.getData(currentDomain).call()

    const settings = parseSettings(info || '{}', chainId || 0)

    fullData = { ...settings, admin: owner === ZERO_ADDRESS ? '' : owner }

    return fullData
  } catch (error) {
    console.group('%c Domain data request', 'color: red;')
    console.error(error)
    console.groupEnd()
    return null
  }
}


export default function useAppData() {
  const [domainData, setDomainData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storage = useStorageContract();

  const networkId = process.env.REACT_APP_networkID || 5;

  useEffect(() => {
    if (!storage) return;

    function timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    try {
      const start = async () => {
        const data = await fetchDomainData(networkId, storage);

        await timeout(5000);

        if (data) {
          setDomainData(data);
        }

        setLoading(false);
      }

      start()
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }, [networkId, storage,]);

  return { domainData, isLoading, error };
}
