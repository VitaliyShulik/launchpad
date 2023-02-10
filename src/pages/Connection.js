import React from 'react';
import styled from 'styled-components';
import { FaWallet } from 'react-icons/fa';
// import { networks } from '../constants/networksInfo';
import { SUPPORTED_NETWORKS, SUPPORTED_CHAIN_IDS } from '../connectors';
import { Web3Status } from '../components/Web3Status';
import * as s from "../styles/global";
import { useApplicationContext } from '../context/applicationContext';
// import Panel from './Panel'
// import { ApplicationModal, setOpenModal } from '../state/application/actions'
// import { useAppState } from 'state/application/hooks'
// import { useDispatch } from 'react-redux'
// import useWordpressInfo from 'hooks/useWordpressInfo'

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

export default function Connection() {
  const {
    isAvailableNetwork,
  } = useApplicationContext();

//   const wordpressData = useWordpressInfo()
//   const dispatch = useDispatch();
//   const { admin, factory, router } = useAppState()


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
    <s.Wrapper>
      {!isAvailableNetwork ? (
        <s.BodyWrapper>
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
                {SUPPORTED_CHAIN_IDS.length && (
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
        </s.BodyWrapper>
      ) : (
        <s.BodyWrapper>
          <s.ContentWrapper>
            <WalletIconWrapper>
              <FaWallet size="2.4rem" className="icon" />
            </WalletIconWrapper>
            <Title>Connect your wallet to get started</Title>
            <NetworkStatus>
              <Web3Status />
            </NetworkStatus>
          </s.ContentWrapper>
        </s.BodyWrapper>
      )}
    </s.Wrapper>
  );
}
