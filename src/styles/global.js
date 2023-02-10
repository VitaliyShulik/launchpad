import styled from "styled-components";

// Used for wrapping a page component
export const Screen = styled.div`
  background-color: var(--background);
  background-size: 200vh;
  background-position: top 30vh left 50%;
  background-repeat: no-repeat;
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-item: center;
  padding: ${({ p }) => (p ? p : "none")};
`;

export const iconUpload = styled.input`
  opacity: 0;
  display: block;
  position: absolute;
  width: 100px;
  height: 100px;
`;

// Used for providing space between components
export const SpacerXSmall = styled.div`
  height: 8px;
  width: 8px;
`;

// Used for providing space between components
export const SpacerSmall = styled.div`
  height: 16px;
  width: 16px;
`;

// Used for providing space between components
export const SpacerMedium = styled.div`
  height: 24px;
  width: 24px;
`;

// Used for providing space between components
export const SpacerLarge = styled.div`
  height: 32px;
  width: 32px;
`;

// Used for providing a wrapper around a component
export const Container = styled.div`
  display: ${({ display }) => (display ? display : "flex")};
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background-color: ${({ test }) => (test ? test : "none")};
  width: ${({ w }) => (w ? w : "100%")};
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  margin: ${({ m }) => (m ? m : "none")};
  padding: ${({ p }) => (p ? p : "none")};
  flex-wrap: wrap;
`;

export const Wrapper = styled.section`
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

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 30rem;
  width: 100%;
  border-radius: 1.2rem;
  box-shadow: rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px,
  rgba(0, 0, 0, 0.01) 0px 24px 32px;

  background-color: #232227;

  @media (max-width: 540px) {
    width: 90%;
  };
`;

export const ContentWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1.8rem;
`;

export const LoaderWrapper = styled.div`
  position: absolute;
  z-index: 4;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #232227;
`;

export const IconWrapper = styled.div`
  padding: 0.6rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.text2};

  .icon {
    color: white;
  }
`;

export const Title = styled.h1`
  line-height: 1.6rem;
  font-size: 1.4rem;
  text-align: center;
`;


export const Card = styled.div`
  display: ${({ display }) => (display ? display : "flex")};
  flex: ${({ flex }) => (flex ? flex : "1 0 25%")};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background-color: ${({ test }) => (test ? test : "var(--card)")};
  width: ${({ w }) => (w ? w : "100%")};
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  border-radius: 20px;
  background-position: center;
  margin: ${({ m }) => (m ? m : "0px")};
  padding: ${({ p }) => (p ? p : "30px")};
  max-width: 1000px;
  max-height: ${({ mxh }) => (mxh ? mxh : "none")};
  min-width: ${({ mnw }) => (mnw ? mnw : "none")};
  min-height: ${({ mnh }) => (mnh ? mnh : "none")};
  flex-wrap: wrap;
`;

export const UpperCard = styled.div`
  display: ${({ display }) => (display ? display : "flex")};
  flex: ${({ flex }) => (flex ? flex : "1 0 25%")};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background-color: ${({ test }) => (test ? test : "var(--upper-card)")};
  width: ${({ w }) => (w ? w : "100%")};
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  border-radius: 20px;
  background-position: center;
  margin: ${({ m }) => (m ? m : "0px")};
  padding: ${({ p }) => (p ? p : "15px")};
  max-width: ${({ mxw }) => (mxw ? mxw : "none")};
  max-height: ${({ mxh }) => (mxh ? mxh : "none")};
  min-width: ${({ mnw }) => (mnw ? mnw : "none")};
  min-height: ${({ mnh }) => (mnh ? mnh : "none")};
  flex-wrap: wrap;
`;

export const Slideshow = styled.div`
  transition: ease 1000ms;
`;

export const LogoTitle = styled.img`
  width: auto;
  height: 50px;
  margin-right: 1rem;
`;

export const Text = styled.div`
  margin: 0.6rem 0;
  font-size: 1.2rem;
  line-height: 1.5rem;
  word-break: break-word;

  ${({ small }) =>
    small ? 'font-size: 0.8rem;' : ''
  }

  ${({ medium }) =>
    medium ? 'font-size: 1rem;' : ''
  }

  ${({ warning }) =>
    warning ? `padding: .6rem; border-radius: .3rem; background-color: var(--warning);` : ''
  }

  ${({ success }) =>
    success ? `padding: .6rem; border-radius: .3rem; background-color: var(--success);` : ''
  }

  ${({ error }) =>
    error ? `padding: .6rem; border-radius: .3rem; background-color: var(--error);` : ''
  }

  :first-child {
    margin-top: 0;
  }
`;

export const TextTitle = styled.p`
  color: var(--text);
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "none")};
  text-align: center;
  line-height: 1;
  font-size: 42px;
  font-weight: 500;
  text-align: center;
`;

export const TextSubTitle = styled.p`
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "none")};
  text-align: center;
  color: var(--text);
  font-size: 24px;
  font-weight: 500;
`;

export const TextDescription = styled.p`
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "none")};
  text-align: center;
  color: var(--text);
  font-size: ${({ fs }) => (fs ? fs : "20px")};
  font-weight: ${({ fw }) => (fw ? fw : "500")};
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
`;

export const TextDescriptionEllipsis = styled.p`
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "none")};
  text-align: center;
  color: var(--text);
  font-size: ${({ fs }) => (fs ? fs : "20px")};
  font-weight: ${({ fw }) => (fw ? fw : "500")};
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
`;

export const TextID = styled.p`
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "none")};
  text-align: center;
  color: var(--secondary-color);
  font-size: 16px;
  font-weight: 700;
`;

export const TextIDWarning = styled.p`
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "none")};
  text-align: center;
  color: red;
  line-height: 1;
  font-size: 16px;
  font-weight: 300;
`;

export const StyledClickable = styled.div`
  :active {
    opacity: 0.6;
  }
`;

export const Input = styled.input`
  outline: 0;
  background: transparent;
  color: var(--text);
  border: var(--search) 0.125em solid;
  padding: 0.25em 1em;
  border-radius: 0.25em;
  width: 100%;
  :disabled {
    border-color: grey;
  }

  :read-only {
    border-color: transparent;
  }

  ::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
`;

export const Textarea = styled.textarea`
  outline: 0;
  background: transparent;
  color: var(--text);
  border: var(--search) 0.125em solid;
  padding: 0.75em;
  border-radius: 0.25em;
  width: 100%;
  line-height: 1;

  :disabled {
    border-color: grey;
  }

  :read-only {
    border-color: transparent;
  }

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
`;

export const button = styled.button`
  background-color: ${({ secondary }) => (secondary ? "inherit" : "var(--primary)")};
  border: ${({ secondary }) => (secondary ? "var(--secondary-color)" : "var(--primary)")} 0.125em solid;
  font-weight: 700;
  padding: 5px 20px;
  border-radius: 20px;
  color: ${({ secondary }) => (secondary ? "var(--secondary-color)" : "var(--card)")};

  ${({ fullWidth }) =>
    fullWidth ? 'width: 100%;' : ''
  }

  :disabled {
    background-color: transparent;
    box-shadow: none;
    color: var(--disable);
    border: var(--disable) 0.125em solid;
    text-shadow: none;
  }
  :hover {
    border: ${({ secondary }) => (secondary ? "var(--white)" : "none")} 0.125em solid;
    color: ${({ secondary }) => (secondary ? "var(--white)" : "none")};
  }
`;

export const ButtonSquare = styled.button`
  background-color: var(--primary);
  border: var(--primary) 0.125em solid;
  font-weight: 700;
  padding: 15px 15px;
  border-radius: 15px;
  color: var(--card);
  line-height: 1;
  :disabled {
    background-color: transparent;
    box-shadow: none;
    color: var(--disable);
    border: var(--disable) 0.125em solid;
    text-shadow: none;
  }
`;

export const profilePic = styled.div`
  background-image: url(${({ src }) => (src ? src : "")};);
  width: 150px;
  height: 150px;
`;

export const TextField = styled.div`
  width: 100%;
  position: relative;
  font-size: 16px;
  color: var(--text);
  height: 80px;
  border-radius: 20px;
  overflow: hidden;
  text-overflow: hidden;
  overflow-wrap: anywhere;
`;

export const TextDescriptionWrap = styled.div`
  width: 100%;
  font-size: 16px;
  color: var(--text);
  overflow-wrap: anywhere;
`;

export const BlurTextField = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: block;
  width: 100%;
  height: 40px;
  background-image: linear-gradient(to bottom, transparent, var(--card));
  overflow: hidden;
  text-overflow: ellipsis;
`;
