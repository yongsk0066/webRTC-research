import socket from './socket';

const pcConfig = { 
    iceServers: [{ 
        urls: ['stun:stun.l.google.com:19302'] 
    }] 
};











export default RTCPeerConnection;