import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import blockchainReducer from "./blockchain/blockchainReducer";
import contractReducer from "./contract/contractReducer";
import userDataReducer from "./userData/dataReducer";

const rootReducer = combineReducers({
  blockchain: blockchainReducer,
  userData: userDataReducer,
  contract: contractReducer,
});

const middleware = [thunk];
const composeEnhancers = compose(applyMiddleware(...middleware));

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers);
};

const store = configureStore();

export default store;
