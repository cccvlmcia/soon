import React from "react";
import ReactDOM from "react-dom/client";
import {RecoilRoot} from "recoil";
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import {createTheme, ThemeProvider} from "@mui/material";
import App from "./App";
import {GoogleOAuthProvider} from "@react-oauth/google";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#FFF",
      contrastText: "#000",
    },
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RecoilRoot>
    <Init />
  </RecoilRoot>,
);

function Init() {
  return (
    <React.StrictMode>
      <GoogleOAuthProvider clientId={"948373234906-avr2p1att0h7q7iof09q54i9f9ntnhom.apps.googleusercontent.com"}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </ThemeProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
}
