import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaWallet } from 'react-icons/fa';
import { useWeb3React } from '@web3-react/core';
// import { networks } from '../constants/networksInfo';
import { SUPPORTED_NETWORKS } from '../connectors';
import { Web3Status } from '../components/Web3Status';
import * as s from "../styles/global";
// import Panel from './Panel'
// import { ApplicationModal, setOpenModal } from '../state/application/actions'
// import { useAppState } from 'state/application/hooks'
// import { useDispatch } from 'react-redux'
// import useWordpressInfo from 'hooks/useWordpressInfo'


const Wrapper = styled.section`
  width: 100%;
  padding: 6vh 0 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
`;

const BodyWrapper = styled.div`
  position: relative;
  max-width: 30rem;
  width: 100%;
  border-radius: 1.2rem;
  box-shadow: rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px,
  rgba(0, 0, 0, 0.01) 0px 24px 32px;

  background-color: #1d1f24;

  @media (max-width: 540px) {
    width: 90%;
  };
`;

const ContentWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1.8rem;
`;

const WalletIconWrapper = styled.div`
  padding: 0.6rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.text2};

  .icon {
    color: white;
  }
`;

const Title = styled.h3`
  margin: 1.6rem 0;
  text-align: center;
  font-weight: 500;
`;

const NetworkStatus = styled.div`
  width: 80%;
`;

const SupportedNetworksWrapper = styled.div`
  padding: 0.7rem 1.4rem;
`;

const SupportedNetworksList = styled.ul`
  margin: 0;
  padding: 0.6rem 0;
  list-style: none;

  li {
    margin: 0.4rem 0;
    padding: 0.4rem 0.8rem;
    border-radius: 0.4rem;
    background-color: ${({ theme }) => theme.bg2};
  }
`;


// const unavailableOrZeroAddr = value => !value || value === ZERO_ADDRESS;

export default function Connection({
    // domainData,
    isAvailableNetwork,
    // setDomainDataTrigger
  }) {
  const {
    active,
    // chainId,
    // account
  } = useWeb3React();

//   const wordpressData = useWordpressInfo()
//   const dispatch = useDispatch();
//   const { admin, factory, router } = useAppState()

  const [needToConfigure, setNeedToConfigure] = useState(false);

  useEffect(() => {
    if (
      active && false
    //   && (!domainData || unavailableOrZeroAddr(admin) || unavailableOrZeroAddr(factory) || unavailableOrZeroAddr(router))
    ) {
      setNeedToConfigure(true);
    }
  }, [active]);

  useEffect(() => {
    if (isAvailableNetwork && !needToConfigure) {
        console.log('Open Connection Modal');
    //   dispatch(setOpenModal(ApplicationModal.WALLET))
    }
  }, [isAvailableNetwork, needToConfigure]);

//   const [changeAllowed, setChangeAllowed] = useState(false)

//   useEffect(() => {
//     setChangeAllowed(
//       wordpressData?.wpAdmin
//         ? wordpressData.wpAdmin.toLowerCase() === account?.toLowerCase()
//         : admin && admin !== ZERO_ADDRESS
//         ? admin.toLowerCase() === account?.toLowerCase()
//         : true
//     )
//   }, [needToConfigure, wordpressData, account, admin])

  return (
    <Wrapper>
      {!isAvailableNetwork ? (
        <BodyWrapper>
          <SupportedNetworksWrapper>
            {
            // chainId && wordpressData?.wpNetworkIds?.length && !wordpressData.wpNetworkIds.includes(chainId) ? (
            //   <>
            //     <h3>{t('youCanNotUseThisNetwork')}</h3>
            //     <div>
            //       <SubTitle>
            //         {wordpressData.wpNetworkIds.length > 1
            //           ? t('pleaseSelectOneOfTheFollowingNetworks')
            //           : t('pleaseSelectTheFollowingNetwork')}
            //         :
            //       </SubTitle>
            //       {wordpressData.wpNetworkIds.map((id) =>
            //         !!id ? (
            //           <NetworkRow key={id}>
            //             {/* @ts-ignore */}
            //             {networks[id]?.name} (ID: {networks[id]?.chainId})
            //           </NetworkRow>
            //         ) : null
            //       )}
            //     </div>
            //   </>
            // ) : (
            ( <>
                <h3>Sorry, you can not use this network</h3>
                {SUPPORTED_NETWORKS.length && (
                  <>
                    <p>Available Networks</p>
                    <SupportedNetworksList>
                      {Object.values(SUPPORTED_NETWORKS).map(({ name, chainId }) => (
                        <li key={chainId}>
                          {chainId} - {name}
                        </li>
                      ))}
                    </SupportedNetworksList>
                  </>
                )}
              </>
            )}
          </SupportedNetworksWrapper>
        </BodyWrapper>
      ) : needToConfigure ? (
        <>
          {/* {changeAllowed ? (
            <Panel setDomainDataTrigger={setDomainDataTrigger} />
          ) : ( */}
            {(<BodyWrapper>
              <SupportedNetworksWrapper>
                <h3>The app isn't ready yet</h3>
              </SupportedNetworksWrapper>
            </BodyWrapper>
          )}
        </>
      ) : (
        <BodyWrapper>
          <ContentWrapper>
            <WalletIconWrapper>
              <FaWallet size="2.4rem" className="icon" />
            </WalletIconWrapper>
            <Title>Connect your wallet to get started</Title>
            <NetworkStatus>
              <Web3Status />
            </NetworkStatus>
          </ContentWrapper>
        </BodyWrapper>
      )}
    </Wrapper>
  );
}
