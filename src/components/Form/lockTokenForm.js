import { withStyles } from "@material-ui/core/styles";
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from "@mui/material/TextField";
import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ERC20 from "../../contracts/ERC20.json";
import * as s from "../../styles/global";
import { utils } from "../../utils";
import { useApplicationContext } from "../../context/applicationContext";

const styles = {
  root: {
    border: 0,
    borderRadius: 10,
    color: "white",
    padding: "20px",
  },
};

const LockTokenForm = (props) => {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [tokenApprove, setTokenApprove] = useState("0");
  const [tokenName, setTokenName] = useState("");
  const [fee, setFee] = useState("0");
  const [totalSupply, setTotalSupply] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [decimals, setDecimals] = useState(-1);
  const [withdrawer, setWithdrawer] = useState("");
  const [withdrawTime, setWithdrawTime] = useState(
    parseInt(Date.now() / 1000 + 60)
  );
  const [tokenDistributed, setTokenDistributed] = useState("0");
  const [tokenDistributedInput, setTokenDistributedInput] = useState(0);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { web3, account, LockerFactory, } = useSelector((state) => state.blockchain);

  const navigate = useNavigate();

  const {
    triggerUpdateAccountData,
    baseCurrencySymbol,
  } = useApplicationContext();

  useEffect(() => {
    if (decimals > 0) {
      setDistributed();
    } else {
      setTokenDistributed("0");
    }
  }, [tokenDistributedInput, decimals]);

  useEffect(() => {
    const fethcLockerFee = async () => {
      if (LockerFactory) {
        const lockerFee = await LockerFactory.methods.fee().call();
        setFee(lockerFee);
      } else {
        setFee("0");
      }
    }
    fethcLockerFee();
  }, [LockerFactory]);

  if (account == null) {
    return null;
  }

  const setDistributed = () => {
    if (decimals > 0) {
      setTokenDistributed(
        BigNumber(tokenDistributedInput)
          .times(10 ** decimals)
          .toFixed(0)
      );
    }
  };

  const checkAndSetTokensDetails = async (tokenAddress) => {
    if (web3.utils.isAddress(tokenAddress)) {
      setTokenLoading(true);
      try {
        const token = await new web3.eth.Contract(ERC20.abi, tokenAddress);
        if (token.methods.decimals()) {
          await token.methods
            .decimals()
            .call()
            .then(async (e) => {
              setDecimals(parseInt(e));
            });
          await token.methods
            .name()
            .call()
            .then(async (e) => {
              setTokenName(e);
            });
          await token.methods
            .totalSupply()
            .call()
            .then(async (e) => {
              setTotalSupply(e);
            });
          await token.methods
            .symbol()
            .call()
            .then(async (e) => {
              setTokenSymbol(e);
              return true;
            });
          await token.methods
            .allowance(account, LockerFactory._address)
            .call()
            .then(async (e) => {
              setTokenApprove(e);
              return true;
            });
        } else {
          setDecimals(-1);
          await utils.timeout(100);
          return false;
      }
      } catch (error) {
        setDecimals(-1);
        await utils.timeout(100);
        return false;
      } finally {
        setTokenLoading(false)
      }

    } else {
      setDecimals(-1);
      await utils.timeout(100);
      return false;
    }
  };

  const approveToken = async (_address, amount) => {
    if (!_address || _address == "") {
      return false;
    }
    const token = await new web3.eth.Contract(ERC20.abi, _address);
    token.methods
      .approve(LockerFactory._address, amount)
      .send({
        from: account,
      })
      .once("error", (err) => {
        setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log(receipt);
        setTokenApprove(amount);
        triggerUpdateAccountData();
      });
  };

  const createLocker = async () => {
    setLoading(true);
    LockerFactory.methods
      .createLocker(address, name, tokenDistributed, withdrawer, withdrawTime)
      .send({
        from: account,
        value: fee,
      })
      .once("error", (err) => {
        setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        triggerUpdateAccountData();
        if (receipt?.events?.LockerCreated?.returnValues?.lockerAddress){
          navigate(`../locker/${receipt.events.LockerCreated.returnValues.lockerAddress}`)
        }
      });
  };

  return (
    <s.Card
      fd="column"
      jc="space-evenly"
      style={{
        maxWidth: 1000,
      }}
    >
      <s.TextTitle>Lock token</s.TextTitle>
      <s.SpacerSmall />
      <s.TextDescription style={{ marginBottom: 20 }}>
        {tokenLoading ? (
          <Badge bg="secondary">Token Address Checking...</Badge>
        ) : (decimals > 0 &&
        tokenName !== "" &&
        tokenSymbol !== "" &&
        totalSupply !== "") ? (
          <s.Container fd="row" style={{ flexWrap: "wrap" }}>
            <Badge bg="success">{"Name: " + tokenName}</Badge>
            <s.SpacerXSmall />
            <Badge bg="success">{"Decimal: " + decimals}</Badge>
            <s.SpacerXSmall />
            <Badge bg="success">
              {"Total supply: " +
                BigNumber(totalSupply)
                  .dividedBy(10 ** decimals)
                  .toFormat()}
            </Badge>
            <s.SpacerXSmall />
            <Badge bg="success">{"Symbol: " + tokenSymbol}</Badge>
          </s.Container>
        ) :  address !== "" ? (
          <Badge bg="danger">{"Contract not valid"}</Badge>
        ) : (
          ""
        )}
      </s.TextDescription>
      <TextField
        fullWidth
        id="name"
        label={"Locker name"}
        onChange={(e) => {
          e.preventDefault();
          setName(e.target.value);
        }}
      ></TextField>
      <s.SpacerSmall />
      <TextField
        fullWidth
        id="address"
        label={"Token address"}
        onChange={(e) => {
          e.preventDefault();
          if (checkAndSetTokensDetails(e.target.value)) {
            setAddress(e.target.value);
            setDistributed();
          }
        }}
      ></TextField>
      <s.SpacerSmall />
      <TextField
        fullWidth
        id="amount"
        label="Lock amount"
        onWheel={(e) => {
          e.target.blur();
        }}
        type={"number"}
        onChange={async (e) => {
          e.preventDefault();
          const val = BigNumber(e.target.value).absoluteValue();
          if (!isNaN(val)) {
            setTokenDistributedInput(val);
          } else {
            setTokenDistributedInput("0");
          }
        }}
      />

      <s.SpacerSmall />
      <TextField
        fullWidth
        id="contract-address"
        label="Withdrawer"
        onWheel={(e) => {
          e.target.blur();
        }}
        onChange={async (e) => {
          e.preventDefault();
          setWithdrawer(e.target.value);
        }}
      />
      <s.SpacerMedium />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          renderInput={(props) => <TextField fullWidth {...props} />}
          id={"address"}
          label="Withdraw Date"
          value={new Date(withdrawTime * 1000)}
          onChange={(e) => {
            setWithdrawTime(Math.floor(new Date(e).getTime() / 1000));
          }}
        />
      </LocalizationProvider>

      <s.Container ai="center">
        {BigNumber(tokenApprove) >= BigNumber(tokenDistributed) &&
        tokenDistributed !== "0" ? (
          <s.button
            disabled={
              loading ||
              !web3.utils.isAddress(withdrawer) ||
              !web3.utils.isAddress(address) ||
              !(BigNumber(tokenDistributed) > 0) ||
              withdrawTime <= Date.now() / 1000
            }
            style={{ marginTop: 20 }}
            onClick={(e) => {
              e.preventDefault();
              createLocker();
            }}
          >
            {loading ? ". . ." : "LOCK"}
          </s.button>
        ) : (
          <s.button
            disabled={
              loading ||
              !address ||
              tokenDistributed <= 0 ||
              decimals <= 0
            }
            style={{ marginTop: 20 }}
            onClick={(e) => {
              e.preventDefault();
              approveToken(
                address,
                tokenDistributed
              );
            }}
          >
            {loading ? ". . ." : "APPROVE TOKEN"}
          </s.button>
        )}
      </s.Container>
      {"Fee : " +
        web3.utils.fromWei(fee) +
        " " +
        baseCurrencySymbol}
    </s.Card>
  );
};
export default withStyles(styles)(LockTokenForm);
