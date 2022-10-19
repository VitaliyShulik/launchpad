import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect } from "react";
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
import { fetchContract } from "./redux/contract/contractAction";
import { checkConnection } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/global";
function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  useEffect(() => {
    if (blockchain.account !== null) {
      dispatch(fetchData(blockchain.account));
    }
    fetchContract();
  }, [dispatch, blockchain.account]);

  useEffect(() => {
    dispatch(fetchContract());
    checkConnection(dispatch)
  }, []);

  return (
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
            <Route
              path="/home"
              element={<Home blockchain={blockchain} data={data} />}
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
  );
}

export default App;
