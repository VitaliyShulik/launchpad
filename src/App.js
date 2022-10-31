import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
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
import Manage from "./pages/manage";
import { fetchContract } from "./redux/contract/contractAction";
import { checkConnection } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/userData/dataActions";

import { useStorageContract } from './hooks/useStorageContract';
import { fetchDomainData } from "./utils/app";

import * as s from "./styles/global";
import Loader from "./components/Loader";

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);

  const [loading, setLoading] = useState(true);

  const storage = useStorageContract();

  const networkId = process.env.REACT_APP_networkID || 5

  useEffect(() => {
    if (blockchain.account !== null) {
      dispatch(fetchData(blockchain.account));
    }
    fetchContract();
  }, [dispatch, blockchain.account]);

  useEffect(() => {
    if (!storage) return

    function timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    try {
      const start = async () => {
        const data = await fetchDomainData(networkId, storage);

        await timeout(5000)

        if (data) {
          console.log("domainData", data);
        }

        setLoading(false);
      }

      start()
    } catch (error) {
      console.error(error)
    }
  }, [networkId, storage,])

  useEffect(() => {
    dispatch(fetchContract());
    checkConnection(dispatch);

  }, []);

  return (
    loading ? (
      <s.LoaderWrapper>
        <Loader size="2.8rem" />
      </s.LoaderWrapper>
    ) : (
      <s.Screen>
        <Navigation />
        {/* <s.Container ai="center">
          <div
            style={{
              border: "1px solid var(--secondary)",
              marginBottom: 30,
              width: "92%",
            }}
          />
        </s.Container> */}
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
              <Route path="/manage" element={<Manage />} />
              <Route
                path="/home"
                element={<Home />}
              />
              <Route path="/launchpad/:idoAddress" element={<LaunchpadInfo />} />
              <Route path="/publish" element={<Publish />} />
              <Route path="/lock" element={<LockToken />} />
              <Route path="/account" element={<Account />} />
              <Route path="/locker" element={<Locker />} />
              <Route path="/locker/:lockerAddress" element={<LockerInfo /> } />
            </Routes>
            <s.SpacerLarge />
            <s.SpacerLarge />
            <s.SpacerLarge />
          </s.Container>
          <Footer />
        </s.Container>
      </s.Screen>
  ));
}

export default App;
