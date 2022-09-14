import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter as Router } from "react-router-dom";
import App from "./App";
import { PoolContextProvider } from "./context/poolContext";
import { StoreContextProvider } from "./context/store";
import "./index.css";
import store from "./redux/store";
import reportWebVitals from "./reportWebVitals";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#27C498",
    },
    secondary: {
      main: "#232227",
    },
    text: { main: "#FFFFFF" },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontSize: 14,
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          height: 0,
        },
      },
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <StoreContextProvider>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <PoolContextProvider>
            <Router>
              <App />
            </Router>
          </PoolContextProvider>
        </Provider>
      </ThemeProvider>
    </StoreContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
