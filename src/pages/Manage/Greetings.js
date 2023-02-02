import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaRegHandPeace } from 'react-icons/fa';
import * as s from "../../styles/global";
import { useApplicationContext } from '../../context/applicationContext';
import { useWeb3React } from '@web3-react/core';
import { STORAGE_NETWORK_ID, STORAGE_NETWORK_NAME } from '../../constants';
import { InjectedConnector } from '@web3-react/injected-connector';
import { switchInjectedNetwork } from '../../utils/utils';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import Loader from '../../components/Loader';
import { saveAppData } from '../../utils/storage';

const Text = styled.div`
  margin: 0.6rem 0;
  font-size: 1.2rem;
  line-height: 1.5rem;
  word-break: break-word;
  ${({ warning }) =>
    warning ? `padding: .6rem; border-radius: .3rem; background-color: var(--warning);` : ''}

  :first-child {
    margin-top: 0;
  }
`;

const Span = styled.span`
  ${({ block }) =>
    block
      ? `
    display: block;
    margin: 0.7rem 0;
  `
      : ''}
  ${({ bold }) => (bold ? 'font-weight: 600' : '')}
`;

const ButtonBlock = styled.div`
  display: flex;
`;

const ActionButton = styled(s.button)`
  font-size: 0.9rem;
  padding: 0.5rem;

  :not(:last-child) {
    margin-right: 0.5rem;
  }

  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export default function Greetings() {
  const { account, library, chainId, connector, deactivate } = useWeb3React();
  const {
    domain,
    triggerDomainData,
  } = useApplicationContext();

  const [onStorageNetwork, setOnStorageNetwork] = useState(false);

  useEffect(() => {
    setOnStorageNetwork(chainId === STORAGE_NETWORK_ID);
  }, [chainId]);

  const [isSavingDomainOwner, setIsSavingDomainOwner] = useState(false);

  const saveDomainOwner = async () => {
    if (!account) return;

    setIsSavingDomainOwner(true);

    try {
      await saveAppData({
        library,
        domain,
        owner: account || '',
        data: {},
        onReceipt: () => {
          triggerDomainData();
        },
        onHash: (hash) => {
          console.log('saveDomainOwner hash: ', hash);
        },
      })
    } catch (error) {
      console.group('%c saveDomainOwner', 'color: red');
      console.error(error);
      console.groupEnd();
    } finally {
      setIsSavingDomainOwner(false);
    }
  }

  const switchToStorage = async () => {
    if (!connector) return;

    try {
      if (connector instanceof InjectedConnector) {
        await switchInjectedNetwork(STORAGE_NETWORK_ID);
      } // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
      else if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
        connector.walletConnectProvider = undefined;
      }
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <>
      <s.IconWrapper>
        <FaRegHandPeace size="2.4rem" className="icon" />
      </s.IconWrapper>

      <Text>
        <s.Title>Hello! Let's connect this domain to your wallet address</s.Title>
        Set your address as the owner of this domain: <Span bold>{domain}</Span>?
        <Span block bold>
          {account}
        </Span>
        Only this address can access and change app settings.
      </Text>

      <Text warning>If you want to change the address, switch to another address. If you can't switch, just disconnect your wallet and connect it to the new address.</Text>

      {!onStorageNetwork && <Text warning>You have to be on {STORAGE_NETWORK_NAME}</Text>}

      <ButtonBlock>
        <ActionButton disabled={isSavingDomainOwner} secondary onClick={deactivate}>Disconnect</ActionButton>
        {!onStorageNetwork ? (
            <ActionButton onClick={switchToStorage}>
            Switch to {STORAGE_NETWORK_NAME}
            </ActionButton>
        ) : (
        <ActionButton disabled={isSavingDomainOwner} onClick={saveDomainOwner}>{isSavingDomainOwner ? <Loader /> : "Set Owner"}</ActionButton>
        )}
      </ButtonBlock>
    </>
  );
}
