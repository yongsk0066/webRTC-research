import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { PeerDataProvider } from "react-peer-data";
import { UserMediaProvider } from "@vardius/react-user-media";
import { EventDispatcher } from "peer-data";

const dispatcher = new EventDispatcher();
const iceServers = [
  {
    url: "stun:stun.1.google.com:19302",
    // url: "stun:74.125.142.127:19302",
  }
];
ReactDOM.render(
  <PeerDataProvider
    servers={{ iceServers }}
    constraints={{ ordered: true }}
    signaling={{
      dispatcher: dispatcher,
      url:
        process.env.NODE_ENV !== "production" ? "https://yongseok.shop:443" : "https://yongseok.shop",
    }}
  >
    <UserMediaProvider constraints={{ audio: true, video: true }}>
      <App />
    </UserMediaProvider>
  </PeerDataProvider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
