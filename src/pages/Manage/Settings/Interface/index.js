import { useState, useEffect } from 'react';
import { STORAGE_NETWORK_ID, STORAGE_NETWORK_NAME } from '../../../../constants';
import { useWeb3React } from '@web3-react/core';
import { useApplicationContext } from '../../../../context/applicationContext';
import { isWebUri } from '../../../../utils/url';
import { saveAppData } from '../../../../utils/storage';
import { TextField, Stack, Typography, Switch } from '@mui/material';
import * as s from "../../../../styles/global";
import styled from 'styled-components';
import Loader from '../../../../components/Loader';
import { InjectedConnector } from '@web3-react/injected-connector';
import { switchInjectedNetwork } from '../../../../utils/utils';
import SocialLinks from './SocialLinks';

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

export default function Interface() {
  const { library, chainId, account, connector } = useWeb3React();
  const {
    domain,
    domainSettings,
    triggerDomainData,
  } = useApplicationContext();

  const [isLoading, setIsLoading] = useState(false);

  const {
    projectName: stateProjectName,
    logoUrl: stateLogoUrl,
    disableSourceCopyright: stateDisableSourceCopyright,
    isLockerEnabled: stateIsLockerEnabled,
    // favicon: stateFavicon,
    // backgroundUrl: stateBackgroundUrl,
    // brandColor: stateBrandColor,
    // backgroundColorDark: stateBackgroundColorDark,
    // backgroundColorLight: stateBackgroundColorLight,
    // textColorDark: stateTextColorDark,
    // textColorLight: stateTextColorLight,
    // navigationLinks: stateNavigationLinks,
    socialLinks: stateSocialLinks,
  } = domainSettings;

  const [projectName, setProjectName] = useState(stateProjectName);
  const [logoUrl, setLogoUrl] = useState(stateLogoUrl);
  const [disableSourceCopyright, setDisableSourceCopyright] = useState(stateDisableSourceCopyright);
  const [isLockerEnabled, setIsLockerEnabled] = useState(stateIsLockerEnabled);
  const [isValidLogo, setIsValidLogo] = useState(Boolean(isWebUri(stateLogoUrl)));
//   const [faviconUrl, setFaviconUrl] = useState(stateFavicon)
//   const [isValidFavicon, setIsValidFavicon] = useState(Boolean(validUrl.isUri(stateFavicon)))

  useEffect(() => {
    setIsValidLogo(logoUrl ? Boolean(isWebUri(logoUrl)) : true);
  }, [logoUrl]);

//   useEffect(() => {
//     setIsValidFavicon(faviconUrl ? Boolean(validUrl.isUri(faviconUrl)) : true)
//   }, [faviconUrl])

//   const [backgroundUrl, setBackgroundUrl] = useState(stateBackground)
//   const [isValidBackground, setIsValidBackground] = useState(Boolean(validUrl.isUri(backgroundUrl)))

//   useEffect(() => {
//     setIsValidBackground(backgroundUrl ? Boolean(validUrl.isUri(backgroundUrl)) : true)
//   }, [backgroundUrl])

//   const [brandColor, setBrandColor] = useState(stateBrandColor)
//   const [brandColorValid, setBrandColorValid] = useState(false)

//   const [backgroundColorDark, setBackgroundColorDark] = useState(stateBackgroundColorDark)
//   const [bgColorDarkValid, setBgColorDarkValid] = useState(false)

//   const [backgroundColorLight, setBackgroundColorLight] = useState(stateBackgroundColorLight)
//   const [bgColorLightValid, setBgColorLightValid] = useState(false)

//   const [textColorDark, setTextColorDark] = useState(stateTextColorDark)
//   const [textColorDarkValid, setTextColorDarkValid] = useState(false)

//   const [textColorLight, setTextColorLight] = useState(stateTextColorLight)
//   const [textColorLightValid, setTextColorLightValid] = useState(false)

//   const ColorType = {
//     BRAND: 'brand',
//     BACKGROUND_LIGHT: 'bg-l',
//     BACKGROUND_DARK: 'bg-d',
//     TEXT_COLOR_LIGHT: 'tc-l',
//     TEXT_COLOR_DARK: 'tc-d',
//   }

//   const updateColor = (value, type) => {
//     switch (type) {
//       case ColorType.BRAND:
//         setBrandColor(value)
//         break
//       case ColorType.BACKGROUND_LIGHT:
//         setBackgroundColorLight(value)
//         break
//       case ColorType.BACKGROUND_DARK:
//         setBackgroundColorDark(value)
//         break
//       case ColorType.TEXT_COLOR_LIGHT:
//         setTextColorLight(value)
//         break
//       case ColorType.TEXT_COLOR_DARK:
//         setTextColorDark(value)
//     }
//   }

//   const [areColorsValid, setAreColorsValid] = useState(false)

//   useEffect(() => {
//     setAreColorsValid(
//       brandColorValid && bgColorDarkValid && bgColorLightValid && textColorDarkValid && textColorLightValid
//     )
//   }, [brandColorValid, bgColorDarkValid, bgColorLightValid, textColorDarkValid, textColorLightValid])

//   const [navigationLinks, setNavigationLinks] = useState(stateNavigationLinks)
  const [socialLinks, setSocialLinks] = useState(stateSocialLinks)

  const currentStrSettings = JSON.stringify({
    projectName: stateProjectName,
    logoUrl: stateLogoUrl,
    disableSourceCopyright: stateDisableSourceCopyright,
    isLockerEnabled: stateIsLockerEnabled,
    // faviconUrl: stateFavicon,
    // backgroundUrl: stateBackgroundUrl,
    // brandColor: stateBrandColor,
    // backgroundColorDark: stateBackgroundColorDark,
    // backgroundColorLight: stateBackgroundColorLight,
    // textColorDark: stateTextColorDark,
    // textColorLight: stateTextColorLight,
    // navigationLinks: stateNavigationLinks,
    socialLinks: stateSocialLinks,
  });

  const [settingsChanged, setSettingsChanged] = useState(false);

  useEffect(() => {
    const newStrSettings = JSON.stringify({
      projectName,
      logoUrl,
      disableSourceCopyright,
      isLockerEnabled,
    //   faviconUrl,
    //   backgroundUrl,
    //   brandColor,
    //   backgroundColorDark,
    //   backgroundColorLight,
    //   textColorDark,
    //   textColorLight,
    //   navigationLinks,
      socialLinks,
    });

    setSettingsChanged(newStrSettings !== currentStrSettings);
  }, [
    currentStrSettings,
    projectName,
    logoUrl,
    disableSourceCopyright,
    isLockerEnabled,
    // faviconUrl,
    // backgroundUrl,
    // brandColor,
    // backgroundColorDark,
    // backgroundColorLight,
    // textColorDark,
    // textColorLight,
    // navigationLinks,
    socialLinks,
  ]);


  const isStorageNetwork = chainId === STORAGE_NETWORK_ID;
  const canChangeNetwork = (connector instanceof InjectedConnector);
  const canAndShouldSwitchToStorageNetwork = canChangeNetwork && !isStorageNetwork;

  const [cannotSaveSettings, setCannotSaveSettings] = useState(true);

  useEffect(() => {
    setCannotSaveSettings(
        (!isStorageNetwork && !canChangeNetwork) ||
        (isStorageNetwork && !settingsChanged) ||
        !isValidLogo
        // !isValidFavicon ||
        // !isValidBackground ||
        // !areColorsValid
    );
  }, [
    settingsChanged,
    isValidLogo,
    // isValidFavicon,
    // isValidBackground,
    // areColorsValid,
    isStorageNetwork,
    canChangeNetwork,
]);

  const saveInterfaceSettings = async () => {
    setIsLoading(true);

    try {
      const newSettings = {
        projectName,
        logoUrl,
        disableSourceCopyright,
        isLockerEnabled,
        // faviconUrl,
        // backgroundUrl,
        // brandColor,
        // addressesOfTokenLists,
        // backgroundColorDark,
        // backgroundColorLight,
        // textColorDark,
        // textColorLight,
        // navigationLinks,
        socialLinks,
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
          console.log('saveInterfaceSettings hash: ', hash);
        },
      })
    } catch (error) {
      console.group('%c saveInterfaceSettings', 'color: red');
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
      <TextField
        label="Project Name"
        value={projectName}
        onChange={(e) => {
          setProjectName(e.target.value);
        }}
      />

      <s.SpacerSmall />

      <TextField
        label="Logo URL"
        value={logoUrl}
        onChange={(e) => {
          setLogoUrl(e.target.value);
        }}
        error={!isValidLogo}
      />

      <s.SpacerSmall />

      <SocialLinks
        socialLinks={socialLinks}
        setSocialLinks={setSocialLinks}
      />

      <s.SpacerSmall />

      <Stack
        direction="row"
        justifyContent="space-between"
      >
        <Typography>Deactivate Source Copyright</Typography>
        <Switch
          checked={!!disableSourceCopyright}
          onChange={() => {
            setDisableSourceCopyright((prevState) => !prevState);
          }}
        />
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
      >
        <Typography>Activate Token Locker Functionality</Typography>
        <Switch
          checked={!!isLockerEnabled}
          onChange={() => {
            setIsLockerEnabled((prevState) => !prevState);
          }}
        />
      </Stack>

      <s.SpacerSmall />

      {/* <OptionWrapper>
        <TextField
          label={`${t('faviconUrl')}`}
          value={faviconUrl}
          onChange={setFaviconUrl}
          error={!isValidFavicon}
        />
      </OptionWrapper> */}

      {/* <OptionWrapper flex>
        <InputPanel
          label={`${t('backgroundUrl')}`}
          value={backgroundUrl}
          onChange={setBackgroundUrl}
          error={!isValidBackground}
        />
      </OptionWrapper> */}

      {/* <OptionWrapper>
        <MenuLinksFactory
          title={t('navigationLinks')}
          items={navigationLinks}
          setItems={setNavigationLinks}
          isValidItem={(item: LinkItem) => Boolean(validUrl.isUri(item.source))}
        />
      </OptionWrapper> */}

      {/* <Accordion title={t('colors')} margin="0.5rem 0">
        <OptionWrapper margin={0.4}>
          <ColorSelector
            name={t('primaryColor')}
            defaultColor={stateBrandColor}
            onColor={(color, valid) => {
              setBrandColorValid(valid)
              updateColor(color, ColorType.BRAND)
            }}
          />
        </OptionWrapper>

        <OptionWrapper margin={0.4}>
          <h4>{t('backgroundColor')}</h4>
          <ColorSelector
            name={t('light')}
            defaultColor={backgroundColorLight}
            onColor={(color, valid) => {
              setBgColorLightValid(valid)
              updateColor(color, ColorType.BACKGROUND_LIGHT)
            }}
          />
          <ColorSelector
            name={t('dark')}
            defaultColor={backgroundColorDark}
            onColor={(color, valid) => {
              setBgColorDarkValid(valid)
              updateColor(color, ColorType.BACKGROUND_DARK)
            }}
          />
        </OptionWrapper>

        <OptionWrapper margin={0.5}>
          <h4>{t('textColor')}</h4>
          <ColorSelector
            name={t('light')}
            defaultColor={textColorLight}
            onColor={(color, valid) => {
              setTextColorLightValid(valid)
              updateColor(color, ColorType.TEXT_COLOR_LIGHT)
            }}
          />
          <ColorSelector
            name={t('dark')}
            defaultColor={textColorDark}
            onColor={(color, valid) => {
              setTextColorDarkValid(valid)
              updateColor(color, ColorType.TEXT_COLOR_DARK)
            }}
          />
        </OptionWrapper>
      </Accordion> */}

      <s.button
        onClick={canAndShouldSwitchToStorageNetwork ? switchToStorage : saveInterfaceSettings}
        disabled={cannotSaveSettings}
      >
        { isLoading
          ? <Loader />
          : isStorageNetwork
            ? 'Save Interface Settings'
            : `Switch to ${STORAGE_NETWORK_NAME}`
        }
      </s.button>
    </ContentWrapper>
  )
}
