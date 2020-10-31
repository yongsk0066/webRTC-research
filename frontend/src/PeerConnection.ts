import { Socket } from "socket.io-client";

const pcConfig = { 
    iceServers: [{ 
        urls: ['stun:stun.l.google.com:19302'] 
    }] 
};

let pc = new RTCPeerConnection(pcConfig);

export default PeerConnection;