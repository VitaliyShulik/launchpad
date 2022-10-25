export const STORAGE_APP_KEY = 'ido_factory'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const getCurrentDomain = () => {
  return window.location.hostname || document.location.host || ''
}

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
      const { factory, router } = contracts[chainId]

      appSettings.factory = factory
      appSettings.router = router
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

export const fetchDomainData = async (
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
