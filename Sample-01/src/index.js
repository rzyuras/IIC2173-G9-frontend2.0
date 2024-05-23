// Import necessary dependencies
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "@auth0/auth0-react";
import history from "./utils/history";
import { getConfig } from "./config";

// Define onRedirectCallback function
const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

// Get Auth0 configuration
const config = getConfig();

// Configuration for Auth0Provider
const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  cacheLocation: 'localstorage',
  onRedirectCallback,
  authorizationParams: {
    redirect_uri: window.location.origin,
    ...(config.audience ? { audience: config.audience } : null),
  },
};

// Render the app using the new client rendering API
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider {...providerConfig}>
        <App />
    </Auth0Provider>
  </React.StrictMode>
);

// Unregister service worker
serviceWorker.unregister();
