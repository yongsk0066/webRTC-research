import { Socket } from "dgram";
import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import VideoComponent from "./VideoComponent";
import io from "socket.io-client";


interface webRTCProps {
    clientId:string;
    startCall:(isCaller: boolean, friendId: string, config: any)=>void;
}

const WebRTCContainer:React.FC<webRTCProps> = () => {
    const [localStream, setLocalStream] = useState<MediaStream>();

    useEffect(() => {

        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: true,
            })
            .then((stream) => {
                setLocalStream(stream);
            });




    }, []);


    return (
        <Container>
            <VideoComponent mediaStream={localStream} />
            <VideoComponent mediaStream={localStream} />
        </Container>
    );
};

const Container = styled.div`
    display:flex;
    flex-direction:row;
`;

export default WebRTCContainer;
