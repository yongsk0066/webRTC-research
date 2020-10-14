import React,{useEffect, useRef} from 'react';
import styled from 'styled-components';

interface VideoProps {
    mediaStream: MediaStream | undefined;
}

const VideoComponent: React.FC<VideoProps> = ({mediaStream}) =>{
    const videoRef = useRef<HTMLVideoElement>(null);
        
    useEffect (()=>{
        if (!videoRef.current)
            return;
        console.log(videoRef.current.buffered);
        // videoRef.current.srcObject = "https://www.youtube.com/watch?v=m6xJL_e8-Gg";
        videoRef.current.srcObject = mediaStream ? mediaStream : null;
    },[mediaStream]);

    return (
            <Video ref={videoRef} playsInline autoPlay></Video>
    );
};

const Video = styled.video`
    border-radius:1000px;
    object-fit:cover;
    width: 300px;
    height: 300px;
    transform: rotateY(180deg);
    /* border: 10px solid; */
`;

export default VideoComponent;