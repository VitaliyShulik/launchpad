import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { useWeb3React } from '@web3-react/core';
import * as s from "../../styles/global";
import { FaWrench } from 'react-icons/fa';
import { saveAppData } from '../../utils/storage';
import { useApplicationContext } from '../../context/applicationContext';
import { shortenAddress } from '../../utils/utils';
import { STORAGE_NETWORK_NAME } from '../../constants';

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-radius: 0.5rem;
  border: 1px solid #3a3d47;
  width: 100%;
`;

const Tab = styled.button`
  flex: 1;
  cursor: pointer;
  padding: 0.4rem 0.7rem;
  font-size: 1em;
  border: none;
  background-color: ${({ active }) => (active ? "#27292e" : 'transparent')};
  color: #fff;

  :first-child {
    border-top-left-radius: inherit;
    border-bottom-left-radius: inherit;
  }

  :last-child {
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit;
  }
`;

const TabContent = styled.div`
  border-radius: 1rem;
`;

export default function Settings() {
  const { library, account } = useWeb3React();
  const {
    domainSettings,
    chainName,
  } = useApplicationContext();
  const [isLockerEnabled, setIsLockerEnabled] = useState(domainSettings?.isLockerEnabled);

  const [tab, setTab] = useState('main')

  const returnTabs = () => {
    const tabs = [
      { tabKey: 'main', tabName: 'Main' },
      { tabKey: 'contracts', tabName: 'Contracts' },
      { tabKey: 'interface', tabName: 'Interface' },
    ]

    // if (chainId === STORAGE_NETWORK_ID) {
    //   tabs.push({ tabKey: 'migration', tabName: 'Migration' })
    // }

    return tabs.map((info, index) => {
      return (
        <Tab key={index} active={tab === info.tabKey} onClick={() => setTab(info.tabKey)}>
          {info.tabName}
        </Tab>
      )
    })
  }

  return (
    <>
      <s.IconWrapper>
        <FaWrench size="2.4rem" className="icon" />
      </s.IconWrapper>

      <s.Title>Manage Page</s.Title>

      {account && (
        <>
          <Row>
            <span>Storage Network:</span><span>{STORAGE_NETWORK_NAME}</span>
          </Row>
          <Row>
            <span>Connected Network:</span><span>{chainName}</span>
          </Row>
          <Row>
            <span>Account:</span><span>{shortenAddress(account)}</span>
          </Row>
          <s.SpacerSmall />
        </>
      )}

      <Tabs>{returnTabs()}</Tabs>

      <TabContent>
        {tab === 'main' && (
          <>Main Settings</>
        )}
        {tab === 'contracts' && (
          <>Contracts Settings</>
        )}
        {tab === 'interface' && (
          <>Interface Settings</>
        )}
        {/* {tab === 'migration' && <Migration />} */}
      </TabContent>
    </>
  )
}
