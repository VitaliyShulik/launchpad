import { withStyles } from "@material-ui/core/styles";
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import BigNumber from "bignumber.js";
import { create } from "ipfs-http-client";
import React, { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { FaImage } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import ERC20 from "../../contracts/ERC20.json";
import { fetchData } from "../../redux/data/dataActions";
import * as s from "../../styles/global";
import { utils } from "../../utils";

const chainRouter = {
  56: {
    Pancakeswap: {
      name: "pancakeswap",
      info: {
        FACTORY: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        WETH: "0xc778417e063141139fce010982780140aa0cd5ab",
        ROUTER: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      },
    },
  },
  3: {
    0: {
      name: "uniswap",
      info: {
        FACTORY: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        WETH: "0xc778417e063141139fce010982780140aa0cd5ab",
        ROUTER: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      },
    },
  },
};

const styles = {
  root: {
    border: 0,
    borderRadius: 10,
    color: "white",
    padding: "20px",
  },
};

const PublishForm = (props) => {
  const { classes } = props;
  const key = process.env.REACT_APP_PINATA_KEY;
  const secret = process.env.REACT_APP_PINATA_SECRET;
  const axios = require("axios");
  const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });
  const [iconImage, setIconImage] = useState(null);
  const [icon, setIcon] = useState("");
  const [website, setWebsite] = useState("");
  const [discord, setDiscord] = useState("");
  const [telegram, setTelegram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [address, setAddress] = useState("");
  const [tokenApprove, setTokenApprove] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [decimals, setDecimals] = useState(-1);
  const [price, setPrice] = useState("");
  const [router, setRouter] = useState("");
  const [start, setStart] = useState(parseInt(Date.now() / 1000));
  const [end, setEnd] = useState(parseInt(Date.now() / 1000));
  const [claimDate, setClaimDate] = useState(parseInt(Date.now() / 1000));
  const [unlockDate, setUnlockDate] = useState(parseInt(Date.now() / 1000));
  const [minETH, setMinETH] = useState("");
  const [maxETH, setMaxETH] = useState("");
  const [tokenDistributed, setTokenDistributed] = useState("0");
  const [tokenDistributedInput, setTokenDistributedInput] = useState(0);
  const [tokenLP, setTokenLP] = useState("0");
  const [tokenLPInput, setTokenLPInput] = useState(0);
  const [loading, setLoading] = useState(false);
  const blockchain = useSelector((state) => state.blockchain);
  const dispatch = useDispatch();

  useEffect(() => {
    if (decimals > 0) {
      setDistributed();
    } else {
      setTokenDistributed("0");
      setTokenLP("0");
    }
  }, [tokenDistributedInput, decimals, tokenLPInput]);

  useEffect(async () => {
    if (blockchain.web3 && tokenName) {
      if (blockchain.web3.utils.isAddress(address)) {
        const web3 = blockchain.web3;
        const token = new web3.eth.Contract(ERC20.abi, address);
        let tokenApproval = await token.methods
          .allowance(blockchain.account, blockchain.IDOFactory._address)
          .call();
        setTokenApprove(tokenApproval);
      }
    } else {
      setTokenApprove("");
    }
  }, [tokenName, tokenApprove]);

  if (blockchain.account == null) {
    return null;
  }

  const web3 = blockchain.web3;

  const setDistributed = () => {
    if (decimals > 0) {
      setTokenDistributed(
        BigNumber(tokenDistributedInput)
          .times(10 ** decimals)
          .toFixed(0)
      );
      setTokenLP(
        BigNumber(tokenLPInput)
          .times(10 ** decimals)
          .toFixed(0)
      );
    }
  };

  const pinJSONToIPFS = async (JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
    return axios
      .post(url, JSONBody, {
        headers: {
          pinata_api_key: key,
          pinata_secret_api_key: secret,
        },
      })
      .then(function (response) {
        return {
          success: true,
          pinataUrl:
            "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
        };
      })
      .catch(function (error) {
        console.log(error);
        return {
          success: false,
          message: error.message,
        };
      });
  };

  const getDecimals = async (tokenAddress) => {
    if (web3.utils.isAddress(tokenAddress)) {
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
          .allowance(blockchain.account, blockchain.IDOFactory._address)
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
    setLoading(true);
    const web3 = blockchain.web3;
    const token = await new web3.eth.Contract(ERC20.abi, _address);
    token.methods
      .approve(blockchain.IDOFactory._address, amount)
      .send({
        from: blockchain.account,
      })
      .once("error", (err) => {
        setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log(receipt);
        setTokenApprove(amount);
        dispatch(fetchData(blockchain.account));
      });
  };

  const createIDO = async () => {
    setLoading(true);
    const iconAdded = await ipfs.add(icon);
    let iconURL = `https://ipfs.infura.io/ipfs/${iconAdded.path}`;
    const metadata = new Object();
    metadata.image = iconURL;
    metadata.description = description;
    metadata.links = new Object();
    metadata.links.website = website;
    metadata.links.discord = discord;
    metadata.links.telegram = telegram;
    metadata.links.twitter = twitter;
    const pinataResponse = await pinJSONToIPFS(metadata);
    if (!pinataResponse.success) {
      return {
        success: false,
        status: "😢 Something went wrong while uploading your tokenURI.",
      };
    }

    let poolInfoStruct = new Object();
    poolInfoStruct.startTimestamp = start;
    poolInfoStruct.finishTimestamp = end;
    poolInfoStruct.startClaimTimestamp = claimDate;
    poolInfoStruct.lpWithdrawTimestamp = unlockDate;
    poolInfoStruct.minEthPayment = minETH;
    poolInfoStruct.maxEthPayment = maxETH;
    poolInfoStruct.maxDistributedTokenAmount = tokenDistributed;
    const tokenURI = pinataResponse.pinataUrl;
    console.log([
      start,
      end,
      claimDate,
      unlockDate,
      minETH,
      maxETH,
      tokenDistributed,
    ]);
    console.log([
      chainRouter[process.env.REACT_APP_networkID][0].info["FACTORY"],
      chainRouter[process.env.REACT_APP_networkID][0].info["ROUTER"],
      chainRouter[process.env.REACT_APP_networkID][0].info["WETH"],
    ]);
    blockchain.IDOFactory.methods
      .createIDO(
        web3.utils.toWei(price),
        address,
        [start, end, claimDate, unlockDate, minETH, maxETH, tokenDistributed],
        [
          chainRouter[process.env.REACT_APP_networkID][0].info["FACTORY"],
          chainRouter[process.env.REACT_APP_networkID][0].info["ROUTER"],
          chainRouter[process.env.REACT_APP_networkID][0].info["WETH"],
        ],
        tokenLP,
        tokenURI,
        blockchain.LockerFactory._address
      )
      .send({
        from: blockchain.account,
      })
      .once("error", (err) => {
        setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log(receipt);
        dispatch(fetchData(blockchain.account));
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
      <s.TextTitle>Create IDO Poll</s.TextTitle>
      <s.Container ai="center">
        <div
          style={{
            display: "flex",
            width: 140,
            height: 140,
            borderRadius: 20,
            margin: 20,
            backgroundColor: "var(--upper-card)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <s.iconUpload
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              e.preventDefault();
              const file = e.target.files[0];
              setIcon(file);
            }}
          ></s.iconUpload>
          {icon !== "" ? (
            <img
              style={{ width: 100, height: 100, borderRadius: 20 }}
              src={URL.createObjectURL(icon)}
            />
          ) : (
            <FaImage style={{ width: 100, height: 100, padding: 20 }} />
          )}
        </div>
      </s.Container>
      <s.TextDescription style={{ marginBottom: 20 }}>
        {decimals > 0 &&
        tokenName !== "" &&
        tokenSymbol !== "" &&
        totalSupply !== "" ? (
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
        ) : address !== "" ? (
          <Badge bg="danger">{"Contract not valid"}</Badge>
        ) : (
          ""
        )}
      </s.TextDescription>
      <TextField
        fullWidth
        id="contract-address"
        label={"Token address"}
        onChange={(e) => {
          e.preventDefault();
          if (getDecimals(e.target.value)) {
            setAddress(e.target.value);
            setDistributed();
          }
        }}
      ></TextField>
      <s.SpacerSmall />
      <TextField
        fullWidth
        id="text"
        label="Description"
        multiline
        rows={4}
        maxLength="1000"
        onChange={(e) => {
          e.preventDefault();
          setDescription(e.target.value);
        }}
      ></TextField>
      <s.SpacerSmall />
      <TextField
        fullWidth
        id="website"
        label="Website"
        onChange={(e) => {
          e.preventDefault();
          setWebsite(e.target.value);
        }}
      ></TextField>
      <s.SpacerSmall />
      <TextField
        fullWidth
        id="discord"
        label="Discord"
        onChange={(e) => {
          e.preventDefault();
          setDiscord(e.target.value);
        }}
      ></TextField>
      <s.SpacerSmall />
      <TextField
        fullWidth
        id="telegram"
        label="Telegram"
        onChange={(e) => {
          e.preventDefault();
          setTelegram(e.target.value);
        }}
      ></TextField>
      <s.SpacerSmall />
      <TextField
        fullWidth
        id="twitter"
        label="Twitter"
        onChange={(e) => {
          e.preventDefault();
          setTwitter(e.target.value);
        }}
      ></TextField>
      <s.SpacerSmall />
      <TextField
        fullWidth
        id="price"
        type={"number"}
        onWheel={(e) => {
          e.target.blur();
        }}
        label="Price"
        variant={"outlined"}
        onChange={(e) => {
          e.preventDefault();
          let val = BigNumber(e.target.value).absoluteValue().toFixed(18);
          if (!isNaN(val)) {
            setPrice(val);
          } else {
            setPrice("0");
          }
        }}
      ></TextField>
      <s.Container fd="row" jc="space-between">
        <s.Container
          flex={"1 0 25%"}
          ai="center"
          style={{ marginTop: 30, paddingLeft: 10, paddingRight: 10 }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              renderInput={(props) => <TextField fullWidth {...props} />}
              label="Start date"
              value={new Date(start * 1000)}
              onChange={(e) => {
                setStart(Math.floor(new Date(e).getTime() / 1000));
              }}
            />
          </LocalizationProvider>
        </s.Container>
        <s.Container
          flex={"1 0 25%"}
          ai="center"
          style={{ marginTop: 30, paddingLeft: 10, paddingRight: 10 }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              renderInput={(props) => <TextField fullWidth {...props} />}
              label="End date"
              value={new Date(end * 1000)}
              onChange={(e) => {
                setEnd(Math.floor(new Date(e).getTime() / 1000));
              }}
            />
          </LocalizationProvider>
        </s.Container>
        <s.Container
          flex={"1 0 25%"}
          ai="center"
          style={{ marginTop: 30, paddingLeft: 10, paddingRight: 10 }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              renderInput={(props) => <TextField fullWidth {...props} />}
              label="Claim date"
              value={new Date(claimDate * 1000)}
              onChange={(e) => {
                setClaimDate(Math.floor(new Date(e).getTime() / 1000));
              }}
            />
          </LocalizationProvider>
        </s.Container>
      </s.Container>
      <s.SpacerSmall />
      <s.TextID>Router</s.TextID>
      <Select
        style={{ paddingLeft: 10, paddingRight: 10 }}
        value={router}
        input={<OutlinedInput id="select-multiple-chip" label="Router" />}
        onChange={(e) => {
          setRouter(e.target.value);
        }}
        fullWidth
      >
        <MenuItem value={0}>
          {chainRouter[process.env.REACT_APP_networkID][0].name}
        </MenuItem>
      </Select>
      <s.SpacerMedium />
      <s.Container flex={"1"} ai="center">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            renderInput={(props) => <TextField fullWidth {...props} />}
            label="Unlock LP date"
            value={new Date(claimDate * 1000)}
            onChange={(e) => {
              setUnlockDate(Math.floor(new Date(e).getTime() / 1000));
            }}
          />
        </LocalizationProvider>
      </s.Container>
      <s.SpacerSmall />
      <s.Container fd="row" jc="space-between">
        <s.Container flex={"1 0 39%"} style={{ margin: 10 }}>
          <TextField
            fullWidth
            id="price"
            label={"Min " + process.env.REACT_APP_CURRENCY + " Purchase"}
            type={"number"}
            onWheel={(e) => {
              e.target.blur();
            }}
            onChange={(e) => {
              e.preventDefault();
              let val = BigNumber(e.target.value).absoluteValue().toFixed(18);
              if (!isNaN(val)) {
                setMinETH(web3.utils.toWei(val));
              } else {
                setMinETH("0");
              }
            }}
          />
        </s.Container>
        <s.Container flex={"1 0 39%"} style={{ margin: 10 }}>
          <TextField
            id="price"
            fullWidth
            label={"Max " + process.env.REACT_APP_CURRENCY + " Purchase"}
            type={"number"}
            onWheel={(e) => {
              e.target.blur();
            }}
            onChange={(e) => {
              e.preventDefault();
              let val = BigNumber(e.target.value).absoluteValue().toFixed(18);
              if (!isNaN(val)) {
                setMaxETH(web3.utils.toWei(val));
              } else {
                setMaxETH("0");
              }
            }}
          />
        </s.Container>
      </s.Container>
      <s.SpacerSmall />
      <TextField
        fullWidth
        id="amount"
        label="Max token distributed"
        onWheel={(e) => {
          e.target.blur();
        }}
        type={"number"}
        onChange={async (e) => {
          e.preventDefault();
          let val = BigNumber(e.target.value).absoluteValue();
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
        id="amount"
        label="Token amount for provide liquidity"
        onWheel={(e) => {
          e.target.blur();
        }}
        type={"number"}
        onChange={async (e) => {
          e.preventDefault();
          let val = BigNumber(e.target.value).absoluteValue();
          if (!isNaN(val)) {
            setTokenLPInput(val);
          } else {
            setTokenLPInput("0");
          }
        }}
      />
      <s.Container ai="center">
        {BigNumber(tokenApprove).gte(
          BigNumber(tokenDistributed).plus(BigNumber(tokenLP))
        ) && tokenDistributed !== "0" ? (
          <s.button
            style={{ marginTop: 20 }}
            onClick={(e) => {
              e.preventDefault();
              createIDO();
            }}
          >
            {loading ? ". . ." : "Create IDO Poll"}
          </s.button>
        ) : (
          <s.button
            disabled={
              !address || address == "" || tokenDistributed <= 0 || tokenLP <= 0
            }
            style={{ marginTop: 20 }}
            onClick={(e) => {
              e.preventDefault();
              approveToken(
                address,
                BigNumber(tokenDistributed).plus(BigNumber(tokenLP)).toFixed(0)
              );
            }}
          >
            {loading ? ". . ." : "APPROVE TOKEN"}
          </s.button>
        )}
      </s.Container>
      {/* <PreviewForm /> */}
      {}
    </s.Card>
  );
};
export default withStyles(styles)(PublishForm);
