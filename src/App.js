import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, Route, Routes } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import "./App.css";
import Web3ReactManager from "./components/Web3ReactManager";
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
import * as s from "./styles/global";
import { useApplicationContext } from "./context/applicationContext";
import Loader from "./components/Loader";
import Manage from "./pages/Manage";

function App() {
  const dispatch = useDispatch();
  const { active, chainId, account } = useWeb3React();

  const {
    isAppConfigured,
    domainSettings: {
      networks,
      contracts,
      isLockerEnabled
    },
    isDomainDataFetching,
    isDomainDataFetched,
  } = useApplicationContext();

  useEffect(() => {
    if (chainId && isAppConfigured) {
      dispatch(fetchContract(chainId, networks, contracts));
    }
  }, [dispatch, account, chainId, isAppConfigured, networks, contracts]);

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
        {!active ?
          <Connection />
          : (isDomainDataFetching || !isDomainDataFetched) ? (
            <s.LoaderWrapper>
              <Loader size="2.8rem" />
            </s.LoaderWrapper>
            ) : !isAppConfigured ? (
              <Manage />
            ) : (
              <>
                <Navigation />
                <s.Container ai="center">
                  <s.Container w="85%" style={{ minHeight: 600 }}>

                    <Outlet />
                    <Routes>
                      <Route path="/" element={<Launchpad />} />
                      <Route path="/launchpad" element={<Launchpad />} />
                      <Route
                        path="/home"
                        element={<Home />}
                      />
                      <Route path="/manage" element={<Manage />} />
                      <Route path="/launchpad/:idoAddress" element={<LaunchpadInfo />} />
                      <Route path="/publish" element={<Publish />} />
                      <Route path="/lock" element={<LockToken />} />
                      <Route path="/account" element={<Account />} />
                      { isLockerEnabled && <Route path="/locker" element={<Locker />} /> }
                      { isLockerEnabled && <Route path="/locker/:lockerAddress" element={<LockerInfo /> } /> }
                    </Routes>
                    <s.SpacerLarge />
                  </s.Container>
                  <Footer />
                </s.Container>
              </>
            )
        }
      </s.Screen>
    </Web3ReactManager>
  );
}

export default App;
