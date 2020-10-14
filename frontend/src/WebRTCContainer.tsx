import React, { useState, useEffect } from "react";
import VideoComponent from "./VideoComponent";

interface webRTCProps {

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
        <div>
            <VideoComponent mediaStream={localStream} />
            <VideoComponent mediaStream={localStream} />
            <VideoComponent mediaStream={localStream} />
        </div>
    );
};

export default WebRTCContainer;
