import React, { useRef, useEffect,useState } from "react";
import PropTypes from "prop-types";
import styled from 'styled-components';


function Video({ stream, muted = false, autoPlay = false, ...props }) {
  const videoRef = useRef(null);
    const [isMirror, setMirror] = useState(true);
    const onClick = (event) =>{
        setMirror(!isMirror);
    }
        
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <VideoBox>
    <VideoItem onClick={onClick} isMirror={isMirror} {...props} autoPlay={autoPlay} muted={muted} ref={videoRef} />
    </VideoBox>

    );
}

const VideoBox = styled.div`
    display:flex;
    justify-content:center;
    flex: 1;
    overflow:hidden;
`;

const VideoItem = styled.video`
    /* border-radius:1000px; */
    /* object-fit:cover; */
    ${(props)=> (props.isMirror && "transform: rotateY(180deg)")};
    
    /* border: 10px solid; */
`;

Video.propTypes = {
  stream: PropTypes.object,
  muted: PropTypes.bool,
  autoPlay: PropTypes.bool
};

export default Video;
