import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Route, Routes } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import "./App.css";
import Web3ReactManager from "./components/Web3ReactManager";
import { SUPPORTED_CHAIN_IDS } from "./connectors";
import Connection from "./pages/Connection";
import Footer from "./components/Footer/Footer";
import Navigation from "./components/Navbar";
import Account from "./pages/account";
import Home from "./pages/home.js";
import Launchpad from "./pages/launchpad.js";
import LaunchpadInfo from "./pages/launchpadInfo";
import Locker from "./pages/locker";
import LockerInfo from "./pages/lockerInfo";
import LockToken from "./pages/lockToken";
import Publish from "./pages/publish";
import { fetchContract } from "./redux/contract/contractAction";
import { checkConnection } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/global";

function App() {
  const dispatch = useDispatch();
  const { active, chainId, library, account, error } = useWeb3React()
  console.log('App > active', active)
  console.log('App > chainId', chainId)
  console.log('App > library', library)
  console.log('App > account', account)
  console.log('App > error', error)
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  const [isAvailableNetwork, setIsAvailableNetwork] = useState(true)

  const isLockerEnabled = process.env.REACT_APP_ENABLE_LOCKER === 'true';

  useEffect(() => {
    if (blockchain.account !== null) {
      dispatch(fetchData(blockchain.account));
    }
    fetchContract();
  }, [dispatch, blockchain.account]);

  useEffect(() => {
    if (chainId) {
      // const lowerAcc = account?.toLowerCase()
      // const appAdmin = wordpressData?.wpAdmin
      //   ? wordpressData?.wpAdmin?.toLowerCase() === lowerAcc
      //   : admin && admin !== ZERO_ADDRESS
      //   ? admin.toLowerCase() === lowerAcc
      //   : true

      // const accessToStorageNetwork = appAdmin && chainId === STORAGE_NETWORK_ID

      // const networkIsFine =
      //   !wordpressData?.wpNetworkIds?.length
      //   || accessToStorageNetwork
      //   || wordpressData.wpNetworkIds.includes(chainId);

      setIsAvailableNetwork(
        Boolean(SUPPORTED_CHAIN_IDS.includes(Number(chainId))
        // && networkIsFine
      ))
    }
  }, [
    chainId,
    // domainDataTrigger,
    // wordpressData,
    // admin,
    // account
  ])

  useEffect(() => {
    dispatch(fetchContract());
    checkConnection(dispatch)
  }, []);

  return (
    <Web3ReactManager>
      <s.Screen>
        {/* <s.Container ai="center">
          <div
            style={{
              border: "1px solid var(--secondary)",
              marginBottom: 30,
              width: "92%",
            }}
          />
        </s.Container> */}
        {active ? (
          <>
            <Navigation />
            <s.Container ai="center">
              <s.Container w="85%" style={{ minHeight: 600 }}>
                <s.Container ai="center">
                  <s.TextID style={{ color: "red" }}>
                    {blockchain.errorMsg !== "" ? blockchain.errorMsg : null}
                  </s.TextID>
                </s.Container>

                <Outlet />
                <Routes>
                  <Route path="/" element={<Launchpad />} />
                  <Route path="/launchpad" element={<Launchpad />} />
                  <Route
                    path="/home"
                    element={<Home blockchain={blockchain} data={data} />}
                  />
                  <Route path="/launchpad/:idoAddress" element={<LaunchpadInfo />} />
                  <Route path="/publish" element={<Publish />} />
                  <Route path="/lock" element={<LockToken />} />
                  <Route path="/account" element={<Account />} />
                  { isLockerEnabled && <Route path="/locker" element={<Locker />} /> }
                  { isLockerEnabled && <Route path="/locker/:lockerAddress" element={<LockerInfo /> } /> }
                </Routes>
                <s.SpacerLarge />
                <s.SpacerLarge />
                <s.SpacerLarge />
              </s.Container>
              <Footer />
            </s.Container>
          </>
        ) : (
          <Connection
            isAvailableNetwork={isAvailableNetwork}
          />
        )}
      </s.Screen>
    </Web3ReactManager>
  );
}

export default App;
