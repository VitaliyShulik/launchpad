import React from 'react';
import styled from 'styled-components';
import { FaWrench } from 'react-icons/fa';
import * as s from "../../styles/global";
import { useApplicationContext } from '../../context/applicationContext';
import Greetings from './Greetings';
import { Web3Status } from '../../components/Web3Status';

const ContentBody = styled.div`
  width: 80%;
`;

// const MANAGE_SCREENS = {
//   MAIN: 'main',
//   CONTRACTS: 'contracts',
//   INTERFACE: 'interface',
// }

export default function Manage() {
  const {
    isAdmin,
    isAppConfigured,
    domainSettings,
  } = useApplicationContext();

//   const [manageScreen, setManageScreen] = useState(MANAGE_SCREENS.MAIN);

  return (
    <s.Wrapper>
      <s.BodyWrapper>
        <s.ContentWrapper>
          {(!domainSettings?.admin) ? (
            <Greetings />
          ) : (!isAdmin) ? (
            isAppConfigured ? (
              <>
                Connect to the Admin account to gain access to the management page.
              </>
            ) : (
              <>
                <p>The application is not yet prepared. Connect to the Admin account and configure the main settings.</p>
                <s.SpacerSmall />
                <Web3Status />
              </>
            )
          ) : (
            <>
              <s.IconWrapper>
                <FaWrench size="2.4rem" className="icon" />
              </s.IconWrapper>
              <s.Title>Manage Page</s.Title>
              <ContentBody>
                <></>
              </ContentBody>
            </>
          )}
          </s.ContentWrapper>
        </s.BodyWrapper>
    </s.Wrapper>
  );
}
