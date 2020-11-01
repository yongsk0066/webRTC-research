import React, { useState, useEffect } from "react";
import styled from "styled-components";
import VideoComponent from "./VideoComponent";
// import io from "socket.io-client";
import socket from "./socket";

interface webRTCProps {
    clientId: string;
    startCall: (isCaller: boolean, friendId: string, config: any) => void;
}

const WebRTCContainer: React.FC<webRTCProps> = () => {
    const [localStream, setLocalStream] = useState<MediaStream>();
    const [remoteStream, setRemoteStream] = useState<MediaStream>();
    const [room, setRoom] = useState<string>("foo");
    const [isChannelReady, setIsChannelReady] = useState<boolean>(false);
    const [isInitiator, setIsInitiator] = useState<boolean>(false);
    const [isStarted, setIsStarted] = useState<boolean>(false);
    let pc: any;

    const pcConfig = { 
        iceServers: [{ 
            urls: ['stun:stun.l.google.com:19302'] 
        }] 
    };

    function maybeStart(): void {
        console.log(">>>>>>> maybeStart() ", isStarted, localStream, isChannelReady);
        console.log(localStream);
        if (!isStarted && typeof localStream !== "undefined") {
            console.log(">>>>>> creating peer connection");
            createPeerConnection();
            pc.addStream(localStream);
            setIsStarted(true);
            console.log("isInitiator", isInitiator);
            if (isInitiator) {
                doCall();
            }
        }
    }

    function sendMessage(message: any): void {
        socket.emit("message", message);
    }
    function createPeerConnection() {
        try {
            pc = new RTCPeerConnection(pcConfig);
            pc.onicecandidate = handleIceCandidate;
            pc.onaddstream = handleRemoteStreamAdded;
            pc.onremovestream = handleRemoteStreamRemoved;
            console.log("Created RTCPeerConnnection");
        } catch (e) {
            console.log("Failed to create PeerConnection, exception: " + e.message);
            alert("Cannot create RTCPeerConnection object.");
            return;
        }
    }

    function handleIceCandidate(event: any): void {
        console.log("icecandidate event: ", event);
        if (event.candidate) {
            sendMessage({
                type: "candidate",
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate,
            });
        } else {
            console.log("End of candidates.");
        }
    }

    function handleRemoteStreamAdded(event: any): void {
        console.log("리모트 받았다.")
        console.log(event);
        setRemoteStream(event);
    }

    function handleRemoteStreamRemoved(event: any): void {
        console.log("remote stream removed");
    }
    function doCall(): void {
        console.log("전화간다")
        pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
    }
    function doAnswer() {
        console.log("Sending answer to peer.");
        pc.createAnswer().then(setLocalAndSendMessage, onCreateSessionDescriptionError);
    }
    function setLocalAndSendMessage(sessionDescription: any): void {
        pc.setLocalDescription(sessionDescription);
        console.log("setLocalAndSendMessage sending message", sessionDescription);
        sendMessage(sessionDescription);
    }

    function handleCreateOfferError(event: any): void {
        console.log("createOffer() error: ", event);
    }

    function onCreateSessionDescriptionError(error: any) {
        console.log("Failed to create session description: " + error.toString());
    }

    useEffect(() => {
        // 방 만들기
        if (room !== "") {
            socket.emit("create or join", room);
            console.log("enter room");
        }

        // 방 만들어짐
        socket.on("created", (room: string) => {
            console.log("Created room : " + room);
            // 개설자 확인
            setIsInitiator(true);
        });

        // 방 꽉참
        socket.on("full", (room: string) => {
            console.log("Room " + room + " is Full");
        });

        // 방 참가
        socket.on("join", (room: string) => {
            console.log("트루루루루루" );
            setIsChannelReady(true);
        });

   

        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: true,
            })
            .then((stream) => {
                setLocalStream(stream);
                sendMessage("got user media");
            });

        socket.emit("message", "hello~~ im react");
        socket.on("log", (message: any) => {
            console.log(message);
        });
    }, []);

    useEffect(() => {
        if (isInitiator) {
            maybeStart();
        }
    }, [localStream]);


    useEffect(()=>{
        socket.on("message", (message: any) => {
            if (message === "got user media") {
                maybeStart();
            } else if (message.type === "offer") {
                if (!isInitiator && !isStarted) {
                    maybeStart();
                }
                pc.setRemoteDescription(new RTCSessionDescription(message));
                doAnswer();
            }else if(message.type ==='answer' && isStarted){
                pc.setRemoteDescription(new RTCSessionDescription(message));
              }else if(message.type ==='candidate' &&isStarted){
                const candidate = new RTCIceCandidate({
                  sdpMLineIndex : message.label,
                  candidate:message.candidate
                });
            
                pc.addIceCandidate(candidate);
              }
        });
    }, [isInitiator,isStarted, isChannelReady]);

    return (
        <Container>
            <VideoComponent mediaStream={localStream} />
            <VideoComponent mediaStream={remoteStream} />
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: row;
`;

export default WebRTCContainer;
