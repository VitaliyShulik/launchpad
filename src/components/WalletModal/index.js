// import { AbstractConnector } from '@web3-react/abstract-connector'
import {
//   UnsupportedChainIdError,
  useWeb3React
} from '@web3-react/core';
// import { InjectedConnector } from '@web3-react/injected-connector'
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import React, { useEffect, useState } from 'react';
// import { isMobile } from '../../utils/utils';
import styled from 'styled-components';
// import { CURRENCY } from 'assets/images'
// import MetamaskIcon from 'assets/images/metamask.png'
// import { ReactComponent as Close } from 'assets/images/x.svg'
import {
//   Network,
//   injected,
  SUPPORTED_NETWORKS,
//   newWalletlink,
//   newWalletConnect
} from '../../connectors';
// import { SUPPORTED_WALLETS, WALLET_NAMES } from '../../constants';
// import { switchInjectedNetwork } from 'utils/wallet'
import usePrevious from '../../hooks/usePrevious';
import useWindowSize from '../../hooks/useWindowSize';
// import useWordpressInfo from 'hooks/useWordpressInfo'
// import AccountDetails from '../AccountDetails'
// import { networks } from '../../constants/networksInfo';
import { Modal } from '@mui/material';
import { isMobile } from '../../utils/utils';
// import Option from './Option'
// import PendingView from './PendingView'
// import { useIsDarkMode } from 'state/user/hooks'

// const CloseIcon = styled.div`
//   position: absolute;
//   right: 1rem;
//   top: 1rem;

//   &:hover {
//     cursor: pointer;
//     opacity: 0.5;
//   }
// `

// const CloseColor = styled(Close)`
//   path {
//     stroke: ${({ theme }) => theme.text4};
//   }
// `

// const Wrapper = styled.div`
//   ${({ theme }) => theme.flexColumnNoWrap}
//   margin: 0;
//   padding: 0;
//   width: 100%;
// `

// const HeaderRow = styled.div`
//   ${({ theme }) => theme.flexRowNoWrap};
//   padding: 1rem 1rem;
//   font-weight: 500;
//   color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     padding: 1rem;
//   `};
// `

// const ContentWrapper = styled.div`
//   background-color: ${({ theme }) => theme.bg2};
//   padding: 2rem;
//   border-bottom-left-radius: 20px;
//   border-bottom-right-radius: 20px;

//   ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
// `

// const Title = styled.h3`
//   font-weight: 500;
//   display: flex;
//   align-items: center;
//   margin: 0 0 0.6rem;
//   padding: 0;
// `

// const UpperSection = styled.div`
//   position: relative;

//   h5 {
//     margin: 0 0 0.5rem;
//     font-size: 1rem;
//     font-weight: 400;
//   }

//   h5:last-child {
//     margin-bottom: 0;
//   }

//   h4 {
//     margin-top: 0;
//     font-weight: 500;
//   }
// `

// const OptionsWrapped = styled.div`
//   display: flex;
//   flex-direction: column;
//   overflow-y: auto;
//   max-height: 38rem;

//   .column {
//     :not(:last-child) {
//       margin-bottom: 1rem;
//     }
//   }

//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     flex-direction: column;
//   `};

//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//     max-height: 45rem;
//   `};
// `
//
// const Options = styled.div<{ disabled?: boolean; isDark: boolean }>`
//   display: flex;
//   flex-wrap: wrap;
//   overflow-y: auto;
//   max-height: 23rem;
//   padding: 0.6rem;
//   border-radius: 0.8rem;
//   border: 1px solid ${({ theme, isDark }) => (isDark ? theme.bg1 : theme.bg3)};
//   box-shadow: inset 0 0 0.2rem ${({ theme, isDark }) => (isDark ? theme.bg1 : theme.bg3)};

//   ${({ disabled }) => (disabled ? 'pointer-events: none; opacity: 0.6' : '')};
// `

// const HoverText = styled.div`
//   :hover {
//     cursor: pointer;
//   }
// `

const WALLET_VIEWS = {
  OPTIONS: 'options',
  ACCOUNT: 'account',
  PENDING: 'pending',
};

export default function WalletModal(props) {
  const {
    isOpen,
    closeModal,
  } = props;
  const { height } = useWindowSize();

  // important that these are destructed from the account-specific web3-react context
  const { active, chainId, account, connector, activate, error } = useWeb3React();
//   const isDark = useIsDarkMode()
//   const wordpressData = useWordpressInfo()
  const [availableNetworks, setAvailableNetworks] = useState([]);
  const [currentChainId, setCurrentChainId] = useState(0);

  useEffect(() => {
    const networks = Object.values(SUPPORTED_NETWORKS).filter(({ chainId }) => {
    //   if (wordpressData?.wpNetworkIds?.length) {
    //     return wordpressData.wpNetworkIds.includes(chainId)
    //   }

      return true;
    });

    setAvailableNetworks(networks);
  }, [
    // wordpressData
  ]);

  useEffect(() => {
    if (availableNetworks.length === 1) {
      setCurrentChainId(availableNetworks[0].chainId);
    }
  }, [availableNetworks]);

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);
//   const [pendingWallet, setPendingWallet] = useState();
//   const [pendingError, setPendingError] = useState();

  const previousAccount = usePrevious(account);

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && isOpen && closeModal) {
      closeModal();
    }
  }, [account, previousAccount, closeModal, isOpen]);

  // always reset to account view
  useEffect(() => {
    if (isOpen) {
    //   setPendingError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [isOpen]);

  // close modal when a connection is successful
  const activePrevious = usePrevious(active);
  const connectorPrevious = usePrevious(connector);
  useEffect(() => {
    if (isOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [setWalletView, active, error, connector, isOpen, activePrevious, connectorPrevious]);

//   const tryActivation = async (connector) => {
//     setPendingWallet(connector) // set wallet for pending view
//     setWalletView(WALLET_VIEWS.PENDING)

//     if (connector instanceof InjectedConnector) {
//       const result = await switchInjectedNetwork(currentChainId)

//       if (!result) {
//         return setWalletView(WALLET_VIEWS.ACCOUNT)
//       }
//     } // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
//     else if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
//       connector.walletConnectProvider = undefined
//     }

//     connector &&
//       activate(connector, undefined, true).catch((error) => {
//         if (error instanceof UnsupportedChainIdError) {
//           activate(connector) // a little janky...can't use setError because the connector isn't set
//         } else {
//           setPendingError(true)
//         }
//       })
//   }

//   function getNetworkOptions() {
//     return availableNetworks.map(({ chainId }) => (
//       <Option
//         onClick={() => setCurrentChainId(Number(chainId))}
//         id={`connect-network-${chainId}`}
//         key={chainId}
//         active={currentChainId === Number(chainId)}
//         color={networks[chainId]?.color || ''}
//         header={networks[chainId].name}
//         subheader={null}
//         icon={CURRENCY[chainId] ?? ''}
//         size={45}
//       />
//     ))
//   }

//   function returnUpdatedConnector(option) {
//     switch (option.name) {
//       case WALLET_NAMES.WALLET_CONNECT:
//         return newWalletConnect(currentChainId)
//       case WALLET_NAMES.WALLET_LINK:
//         return newWalletlink(currentChainId)
//       default:
//         return
//     }
//   }

//   function getAvailableWallets() {
//     const isMetamask = window.ethereum && window.ethereum.isMetaMask
//     const availableOptions = Object.keys(SUPPORTED_WALLETS).map((key) => {
//       const option = SUPPORTED_WALLETS[key]

//       if (option.name !== WALLET_NAMES.METAMASK && currentChainId) {
//         const newConnector = returnUpdatedConnector(option)

//         if (newConnector) option.connector = newConnector
//       }

//       // check for mobile options
//       if (isMobile) {
//         if (!window.web3 && !window.ethereum && option.mobile) {
//           return (
//             <Option
//               onClick={() => {
//                 ;(currentChainId !== chainId || option.connector !== connector) &&
//                   !option.href &&
//                   tryActivation(option.connector)
//               }}
//               id={`connect-${key}`}
//               key={key}
//               active={option.connector && option.connector === connector}
//               color={option.color}
//               link={option.href}
//               header={option.name}
//               subheader={null}
//               size={45}
//               icon={require('../../assets/images/' + option.iconName)}
//             />
//           )
//         }
//         return null
//       }

//       // overwrite injected when needed
//       if (option.connector === injected) {
//         // don't show injected if there's no injected provider
//         if (!(window.web3 || window.ethereum)) {
//           if (option.name === WALLET_NAMES.METAMASK) {
//             return (
//               <Option
//                 id={`connect-${key}`}
//                 key={key}
//                 color={'#E8831D'}
//                 header={'Install Metamask'}
//                 subheader={null}
//                 link={'https://metamask.io/'}
//                 icon={MetamaskIcon}
//                 size={45}
//               />
//             )
//           }

//           return null //dont want to return install twice
//         }
//         // don't return metamask if injected provider isn't metamask
//         else if (option.name === WALLET_NAMES.METAMASK && !isMetamask) {
//           return null
//         }
//         // likewise for generic
//         else if (option.name === WALLET_NAMES.INJECTED && isMetamask) {
//           return null
//         }
//       }

//       // return rest of options
//       return (
//         !isMobile &&
//         !option.mobileOnly && (
//           <Option
//             id={`connect-${key}`}
//             onClick={() => {
//               ;(currentChainId !== chainId || option.connector !== connector) &&
//                 !option.href &&
//                 tryActivation(option.connector)
//             }}
//             key={key}
//             active={option.connector === connector}
//             color={option.color}
//             link={option.href}
//             header={option.name}
//             subheader={null} //use option.descriptio to bring back multi-line
//             icon={require('../../assets/images/' + option.iconName)}
//             size={45}
//           />
//         )
//       )
//     })

//     return availableOptions
//   }

//   function getModalContent() {
//     if (error) {
//       return (
//         <UpperSection>
//           <CloseIcon onClick={closeModal}>
//             <CloseColor />
//           </CloseIcon>
//           <HeaderRow>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error connecting'}</HeaderRow>
//           <ContentWrapper>
//             {error instanceof UnsupportedChainIdError ? (
//               <h5>Please switch your network or connect to the appropriate network.</h5>
//             ) : (
//               'Error connecting. Try refreshing the page.'
//             )}
//           </ContentWrapper>
//         </UpperSection>
//       )
//     }

//     if (account && walletView === WALLET_VIEWS.ACCOUNT) {
//       return (
//         <AccountDetails
//           toggleWalletModal={closeModal}
//           pendingTransactions={pendingTransactions}
//           confirmedTransactions={confirmedTransactions}
//           ENSName={ENSName}
//           openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
//         />
//       )
//     }

//     const networkOptions = getNetworkOptions()
//     const availableWallets = getAvailableWallets()
//     const hasWallet = availableWallets.some((option) => option !== null)

//     return (
//       <UpperSection>
//         <CloseIcon onClick={closeModal}>
//           <CloseColor />
//         </CloseIcon>
//         {walletView !== WALLET_VIEWS.ACCOUNT ? (
//           <HeaderRow color="blue">
//             <HoverText
//               onClick={() => {
//                 setPendingError(false)
//                 setWalletView(WALLET_VIEWS.ACCOUNT)
//               }}
//             >
//               Back
//             </HoverText>
//           </HeaderRow>
//         ) : (
//           <HeaderRow>
//             <HoverText>{t('connectWallet')}</HoverText>
//           </HeaderRow>
//         )}
//         <ContentWrapper>
//           {walletView === WALLET_VIEWS.PENDING ? (
//             <PendingView
//               connector={pendingWallet}
//               error={pendingError}
//               setPendingError={setPendingError}
//               tryActivation={tryActivation}
//             />
//           ) : (
//             <>
//               {!Boolean(hasWallet) ? (
//                 t('noConnectionMethodsAvailable')
//               ) : (
//                 <OptionsWrapped>
//                   {availableNetworks.length > 1 ? (
//                     <>
//                       <div className="column">
//                         <Title>1. {t('chooseNetwork')}</Title>
//                         <Options isDark={isDark}>{networkOptions}</Options>
//                       </div>
//                       <div className="column">
//                         <Title>2. {t('chooseWallet')}</Title>
//                         <Options isDark={isDark} disabled={!currentChainId}>
//                           {availableWallets}
//                         </Options>
//                       </div>
//                     </>
//                   ) : (
//                     <div className="column">
//                       <Title>{t('chooseWallet')}</Title>
//                       <Options isDark={isDark} disabled={!currentChainId}>
//                         {availableWallets}
//                       </Options>
//                     </div>
//                   )}
//                 </OptionsWrapped>
//               )}
//             </>
//           )}
//         </ContentWrapper>
//       </UpperSection>
//     )
//   }

//   const CUSTOM_WINDOW_OVERFLOW_HEIGHT = 750

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
    //   overflow={height && height < CUSTOM_WINDOW_OVERFLOW_HEIGHT ? 'auto' : undefined}
    //   mobile={() => isMobile()}
    //   maxWidth={
    //     (walletView === WALLET_VIEWS.ACCOUNT && !active) || walletView === WALLET_VIEWS.OPTIONS ? 700 : undefined
    //   }
    >
      <p>I'm Open</p>
      {/* <Wrapper>{getModalContent()}</Wrapper> */}
    </Modal>
  )
}
