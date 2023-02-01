import React from 'react';
import styled from 'styled-components';
import { FaWrench } from 'react-icons/fa';
import * as s from "../../styles/global";
import { useApplicationContext } from '../../context/applicationContext';
import Greetings from './Greetings';

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
            <s.Wrapper>
              <s.BodyWrapper>
                <s.ContentWrapper>
                  The app is not configured
                </s.ContentWrapper>
              </s.BodyWrapper>
            </s.Wrapper>
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
