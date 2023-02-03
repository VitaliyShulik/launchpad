import React from 'react';
import styled from 'styled-components';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';

const InfoCard = styled.button`
  background-color: ${({ active }) => (active ? '#3a3d47' : '#424149')};
  padding: 1rem;
  outline: none;
  border-radius: 1rem;
  width: 100%;
  min-width: 7rem;

  @media (max-width: 540px) {
    min-width: 6rem;
  };

  @media (max-width: 340px) {
    min-width: 5rem;
  };
`;

const OptionCard = styled(InfoCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0.4rem;
  padding: 0.6rem;
`;

const OptionCardClickable = styled(OptionCard)`
  position: relative;
  width: 16%;
  border: 1px solid transparent;

  background-color: #3a3d47;

  &:hover {
    ${({ color, clickable }) =>
      clickable ? (color ? `border-color: ${color}; cursor: pointer;` : 'cursor: pointer;') : ''};
  }
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
  transition: 0.1s;

  @media (max-width: 540px) {
    width: 4%;
  };

  @media (max-width: 340px) {
    width: 40%;
  };
`;

const CheckMarkWrapper = styled.div`
  position: absolute;
  top: 7%;
  left: 7%;
  border-radius: 50%;
  width: 1.4rem;
  height: 1.4rem;
  background-color: #27AE60;
  color: #ffffff;

  svg {
    vertical-align: inherit;
  }
`;

const Text = styled.div`
  display: flex;
  flex-flow: row nowrap;
  color: #ffffff;
  font-size: 0.7rem;
  line-height: 1.2rem;
  font-weight: 500;

  @media (max-width: 540px) {
    font-size: 0.6rem;
  };

  @media (max-width: 340px) {
    font-size: 0.54rem;
  };
`;

const SubHeader = styled.div`
  color: white;
  margin-top: 10px;
  font-size: 12px;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-bottom: 0.4rem;
  align-items: center;
  justify-content: center;

  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '24px')};
    width: ${({ size }) => (size ? size + 'px' : '24px')};
  }

  @media (max-width: 960px) {
    align-items: flex-end;
  };

  @media (max-width: 540px) {
    & > img,
    span {
      height: ${({ size }) => (size ? size - size / 4 + 'px' : '18px')};
      width: ${({ size }) => (size ? size - size / 4 + 'px' : '18px')};
    }
  };

  @media (max-width: 340px) {
    & > img,
    span {
      height: ${({ size }) => (size ? size - size / 3 + 'px' : '16px')};
      width: ${({ size }) => (size ? size - size / 3 + 'px' : '16px')};
    }
  };
`;

export default function Option({
  link = null,
  clickable = true,
  size,
  onClick = null,
  color,
  widthPercent = 17,
  header,
  subheader = null,
  icon,
  active = false,
  id,
}) {

  const content = (
    <OptionCardClickable
      id={id}
      onClick={onClick}
      clickable={clickable && !active}
      active={active}
      color={color}
      widthPercent={widthPercent}
    >
      {active && (
        <CheckMarkWrapper>
          <IoIosCheckmarkCircleOutline size="100%" />
        </CheckMarkWrapper>
      )}

      <IconWrapper size={size}>
        <img src={icon} alt={'Icon'} />
      </IconWrapper>
      <Text>{header}</Text>
      {subheader && <SubHeader>{subheader}</SubHeader>}
    </OptionCardClickable>
  )
  if (link) {
    return (
      <a
        target = '_blank'
        href={link}
        rel = 'noopener noreferrer'
      >
        {content}
      </a>
    )
  }

  return content
}
