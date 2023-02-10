// import { AbstractConnector } from '@web3-react/abstract-connector'
import {
  UnsupportedChainIdError,
  useWeb3React
} from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import React, { useEffect, useState } from 'react';
// import { isMobile } from '../../utils/utils';
import styled from 'styled-components';
import { CURRENCY } from '../../assets/images';
import MetamaskIcon from '../../assets/images/metamask.png';
import { ReactComponent as Close } from '../../assets/images/x.svg'
import {
//   Network,
  injected,
  SUPPORTED_NETWORKS,
//   newWalletlink,
  newWalletConnect
} from '../../connectors';
import { SUPPORTED_WALLETS, WALLET_NAMES } from '../../constants';
import usePrevious from '../../hooks/usePrevious';
// import useWindowSize from '../../hooks/useWindowSize';
// import useWordpressInfo from 'hooks/useWordpressInfo'
// import AccountDetails from '../AccountDetails'
import { networks } from '../../constants/networksInfo';
import { Dialog, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { isMobile, switchInjectedNetwork } from '../../utils/utils';

import * as s from "../../styles/global";
import Option from './Option';
import PendingView from './PendingView';
// import { useIsDarkMode } from 'state/user/hooks'

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 1rem;

  &:hover {
    cursor: pointer;
    opacity: 0.5;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: white;
  }
`

// const Wrapper = styled.div`
//   ${({ theme }) => theme.flexColumnNoWrap}
//   margin: 0;
//   padding: 0;
//   width: 100%;
// `

const HeaderRow = styled.div`
  flex-flow: row nowrap;
  padding: 1rem 1rem;
  font-weight: 500;
  color: 'inherit';
  @media (max-width: 960px) {
    padding: 1rem;
  };
`;

const ContentWrapper = styled.div`
  background-color: #232227;
  padding: 1rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  @media (max-width: 960px) {
    padding: 1rem;
  };
`;

const YourAccount = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`;

const InfoCard = styled.div`
  padding: 1rem;
  border: 1px solid var(--secondary-color);
  border-radius: 20px;
  position: relative;
  display: grid;
  grid-row-gap: 12px;
  margin-bottom: 20px;
`;

const AccountGroupingRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  color: var(--text);

  div {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
`;

const WalletName = styled.div`
  width: initial;
  font-size: 0.825rem;
  font-weight: 500;
  color: var(--secondary-color);
`;

const AccountControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  width: 100%;
  font-weight: 500;
  font-size: 1.3rem;

  a:hover {
    text-decoration: underline;
  }

  p {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Title = styled.h4`
  font-weight: 500;
  display: flex;
  align-items: center;
  margin: 0 0 0.6rem;
  padding: 0;
`;

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`;

const OptionsWrapped = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 38rem;

  .column {
    :not(:last-child) {
      margin-bottom: 1rem;
    }
  }

  @media (max-width: 720px) {
    flex-direction: column;
  };

  @media (max-width: 540px) {
    max-height: 45rem;
  };
`;

const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  max-height: 23rem;
  padding: 0.6rem;
  border-radius: 0.8rem;
  border: 1px solid #232227;
  box-shadow: inset 0 0 0.2rem #232227;

  ${({ disabled }) => (disabled ? 'pointer-events: none; opacity: 0.6' : '')};
`;

const HoverText = styled.div`
  :hover {
    cursor: pointer;
  }
`;

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
//   const { height } = useWindowSize();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // important that these are destructed from the account-specific web3-react context
  const { active, chainId, account, connector, activate, deactivate, error } = useWeb3React();
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
  const [pendingWallet, setPendingWallet] = useState();
  const [pendingError, setPendingError] = useState();

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
      setPendingError(false)
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

  const tryActivation = async (connector) => {
    setPendingWallet(connector) // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING)

    if (connector instanceof InjectedConnector) {
      const result = await switchInjectedNetwork(currentChainId)

      if (!result) {
        return setWalletView(WALLET_VIEWS.ACCOUNT)
      }
    } // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    else if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
      connector.walletConnectProvider = undefined
    }

    connector &&
      activate(connector, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector) // a little janky...can't use setError because the connector isn't set
        } else {
          setPendingError(true)
        }
      })
  }

  function getNetworkOptions() {
    return availableNetworks.map(({ chainId }) => (
      <Option
        onClick={() => setCurrentChainId(Number(chainId))}
        id={`connect-network-${chainId}`}
        key={chainId}
        active={currentChainId === Number(chainId)}
        color={networks[chainId]?.color || ''}
        header={networks[chainId].name}
        subheader={null}
        icon={CURRENCY[chainId] ?? ''}
        size={45}
      />
    ))
  }

  function returnUpdatedConnector(option) {
    switch (option.name) {
      case WALLET_NAMES.WALLET_CONNECT:
        return newWalletConnect(currentChainId)
    //   case WALLET_NAMES.WALLET_LINK:
    //     return newWalletlink(currentChainId)
      default:
        return
    }
  }

  function getAvailableWallets() {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask
    const availableOptions = Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key]

      if (option.name !== WALLET_NAMES.METAMASK && currentChainId) {
        const newConnector = returnUpdatedConnector(option)

        if (newConnector) option.connector = newConnector
      }

      // check for mobile options
      if (isMobile) {
        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              onClick={() => {
                ;(currentChainId !== chainId || option.connector !== connector) &&
                  !option.href &&
                  tryActivation(option.connector)
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null}
              size={45}
              icon={require('../../assets/images/' + option.iconName)}
            />
          )
        }
        return null
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === WALLET_NAMES.METAMASK) {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={'Install Metamask'}
                subheader={null}
                link={'https://metamask.io/'}
                icon={MetamaskIcon}
                size={45}
              />
            )
          }

          return null //dont want to return install twice
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === WALLET_NAMES.METAMASK && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === WALLET_NAMES.INJECTED && isMetamask) {
          return null
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              ;(currentChainId !== chainId || option.connector !== connector) &&
                !option.href &&
                tryActivation(option.connector)
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} //use option.descriptio to bring back multi-line
            icon={require('../../assets/images/' + option.iconName)}
            size={45}
          />
        )
      )
    })

    return availableOptions
  }

  function formatConnectorName() {
    const { ethereum } = window
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK'))
      )
      .map((k) => SUPPORTED_WALLETS[k].name)[0]
    return (
      <WalletName>
        Connected with {name}
      </WalletName>
    )
  }

  function getModalContent() {
    if (error) {
      return (
        <UpperSection>
          <CloseIcon onClick={closeModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error connecting'}</HeaderRow>
          <ContentWrapper>
            {error instanceof UnsupportedChainIdError ? (
              <h5>Please switch your network or connect to the appropriate network.</h5>
            ) : (
              'Error connecting. Try refreshing the page.'
            )}
          </ContentWrapper>
        </UpperSection>
      )
    }

    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <UpperSection>
          <CloseIcon onClick={closeModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>Account</HeaderRow>
          <ContentWrapper>
            <YourAccount>
              <InfoCard>
                <AccountGroupingRow>
                  {formatConnectorName()}
                    <div>
                      <s.button
                        secondary
                        style={{ padding: '4px 6px', fontSize: '.825rem', fontWeight: 400, marginRight: '8px' }}
                        onClick={() => {
                          deactivate();
                        }}
                      >
                        Disconnect
                      </s.button>
                      <s.button
                        secondary
                        style={{ padding: '4px 6px', fontSize: '.825rem', fontWeight: 400 }}
                        onClick={() => {
                          setWalletView(WALLET_VIEWS.OPTIONS);
                        }}
                    >
                      Change
                    </s.button>
                  </div>
                </AccountGroupingRow>

                <AccountGroupingRow>
                  <AccountControl>
                    <p>{account}</p>
                  </AccountControl>
                </AccountGroupingRow>

              </InfoCard>
            </YourAccount>
          </ContentWrapper>
        </UpperSection>
      )
    }

    const networkOptions = getNetworkOptions()
    const availableWallets = getAvailableWallets()
    const hasWallet = availableWallets.some((option) => option !== null)

    return (
      <UpperSection>
        <CloseIcon onClick={closeModal}>
          <CloseColor />
        </CloseIcon>
        {walletView !== WALLET_VIEWS.ACCOUNT ? (
          <HeaderRow>
            <HoverText
              onClick={() => {
                setPendingError(false)
                setWalletView(WALLET_VIEWS.ACCOUNT)
              }}
            >
              Back
            </HoverText>
          </HeaderRow>
        ) : (
          <HeaderRow>
            Connect Wallet
          </HeaderRow>
        )}
        <ContentWrapper>
          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              connector={pendingWallet}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : (
            <>
              {!Boolean(hasWallet) ? (
                "No connection methods available"
              ) : (
                <OptionsWrapped>
                  {availableNetworks.length > 1 ? (
                    <>
                      <div className="column">
                        <Title>1. Choose Network</Title>
                        <Options>{networkOptions}</Options>
                      </div>
                      <div className="column">
                        <Title>2. Choose Wallet</Title>
                        <Options disabled={!currentChainId}>
                          {availableWallets}
                        </Options>
                      </div>
                    </>
                  ) : (
                    <div className="column">
                      <Title>Choose Wallet</Title>
                      <Options disabled={!currentChainId}>
                        {availableWallets}
                      </Options>
                    </div>
                  )}
                </OptionsWrapped>
              )}
            </>
          )}
        </ContentWrapper>
      </UpperSection>
    )
  }

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      fullScreen={fullScreen}
    //   overflow={height && height < CUSTOM_WINDOW_OVERFLOW_HEIGHT ? 'auto' : undefined}
    //   mobile={() => isMobile()}
    //   maxWidth={
    //     (walletView === WALLET_VIEWS.ACCOUNT && !active) || walletView === WALLET_VIEWS.OPTIONS ? 700 : undefined
    //   }
    >
      {getModalContent()}
  </Dialog>
  )
}
