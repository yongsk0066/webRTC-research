import React,{useEffect, useRef, useState} from 'react';
import styled from 'styled-components';

interface VideoProps {
    mediaStream: MediaStream | undefined;
}

const VideoComponent: React.FC<VideoProps> = ({mediaStream}) =>{
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMirror, setMirror] = useState(true);
    const onClick = (event:React.MouseEvent<HTMLVideoElement,MouseEvent>):void =>{
        setMirror(!isMirror);
    }
        
    useEffect (()=>{
        if (!videoRef.current)
            return;
        console.log(videoRef.current.buffered);
        videoRef.current.srcObject = mediaStream ? mediaStream : null;
    },[mediaStream]);

    return (
        <VideoBox>
            <Video onClick={onClick} ref={videoRef} playsInline autoPlay isMirror={isMirror}></Video>
        </VideoBox>
    );
};

const VideoBox = styled.div`
    display:flex;
    justify-content:center;
    flex: 1;
    overflow:hidden;
`;

const Video = styled.video<{isMirror:boolean}>`
    /* border-radius:1000px; */
    /* object-fit:cover; */
    ${(props:any)=> (props.isMirror && "transform: rotateY(180deg)")};
    
    /* border: 10px solid; */
`;

export default VideoComponent;