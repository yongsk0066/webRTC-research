import React, { useState, useEffect } from "react";
import styled from "styled-components";
import VideoComponent from "./VideoComponent";
import io from "socket.io-client";

interface webRTCProps {
    clientId: string;
    startCall: (isCaller: boolean, friendId: string, config: any) => void;
}

const WebRTCContainer: React.FC<webRTCProps> = () => {
    const [localStream, setLocalStream] = useState<MediaStream>();
    const [remoteStream, setRemoteStream] = useState<MediaStream>();
    const [isChannelReady, setChannelReady] = useState<boolean>(false);
    const [isInitiator, setInitiator] = useState<boolean>(false);
    const [isStarted, setStarted] = useState<boolean>(false);
    const [room, setRoom] = useState<string>("foo");

    useEffect(() => {
        let socket = io.connect("http://3.34.127.50:8080");
        let pc: any;
        if (room !== "") {
            socket.emit("create or join", room);
            console.log("enter room");
        }

        socket.on("created", (room: string) => {
            console.log("Created room" + room);
            setInitiator(true);
        });

        socket.on("full", (room: string) => {
            console.log("Room " + room + " is Full");
        });

        socket.on("join", (room: string) => {
            setChannelReady(true);
        });

        function sendMessage(message: any): void {
            socket.emit("message", message);
        }
        function createPeerConnection() {
            try {
                pc = new RTCPeerConnection();
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

        function handleRemoteStreamAdded(event:any):void{
            setRemoteStream(event.stream);
        }

        function handleRemoteStreamRemoved(evnet:any):void{
            console.log('remote stream removed');
        }


        function maybeStart(): void {
            console.log(">>>>>>> maybeStart() ", isStarted, localStream, isChannelReady);
            if (!isStarted && typeof localStream !== "undefined" && isChannelReady) {
                console.log(">>>>>> creating peer connection");
                createPeerConnection();
                pc.addStream(localStream);
                setStarted(true);
                console.log("isInitiator", isInitiator);
                if (isInitiator) {
                    doCall();
                }
            }
        }

        function doCall():void{
            pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
        }
        function doAnswer() {
            console.log('Sending answer to peer.');
            pc.createAnswer().then(
              setLocalAndSendMessage,
              onCreateSessionDescriptionError
            );
          }
        function setLocalAndSendMessage(sessionDescription:any):void {
            pc.setLocalDescription(sessionDescription);
            console.log('setLocalAndSendMessage sending message', sessionDescription);
            sendMessage(sessionDescription);
          }

          function handleCreateOfferError(event:any):void {
            console.log('createOffer() error: ', event);
          }

          function onCreateSessionDescriptionError(error:any) {
            console.log('Failed to create session description: ' + error.toString());
          }

        socket.on("message", (message: any) => {
            if (message === "got user media") {
                maybeStart();
            } else if (message.type === "offer") {
                if (!isInitiator && !isStarted) {
                    maybeStart();
                }
                pc.setRemoteDescription(new RTCSessionDescription(message));
                doAnswer();
            }
        });

        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: true,
            })
            .then((stream) => {
                setLocalStream(stream);
            });

        socket.emit("message", "hello~~im react");
        socket.on("log", (message: any) => {
            console.log(message);
        });
    }, []);

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
