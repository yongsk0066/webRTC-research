import React, { useState, useRef, useEffect, useReducer } from "react";
import styled from "styled-components";
import Room from "./Room";
import {
  useUserMediaFromContext
} from "@vardius/react-user-media";
import Video from "./Video";
import RoomForm from "./RoomForm";
// import { usePeerData } from "react-peer-data";

const Container = styled.div`
    display: flex;
    flex-direction: row;
`;


const WebRTCContainer = () => {
    const [username, setUsername] = useState(null);
    const { stream, error } = useUserMediaFromContext();

    const handleJoin = (values) => {
        setUsername(Math.floor( Math.random() * 100 ));
    };
    useEffect(()=>{
        const ranInt = Math.floor( Math.random() * 100 );
        // setUsername(ranInt);
    },[]);


    return (
        <Container>
            {username ? (
                <>
                <Room stream={stream} />
                </>
            ) : (
                <>
                    <div className="row justify-content-center mt-2">
                        <RoomForm onJoin={handleJoin} />
                    </div>

                    {stream && (
                        <div className="row justify-content-center mt-2">
                            <Video stream={stream} autoPlay muted />
                        </div>
                    )}
                </>
            )}
        </Container>
    );
};

export default WebRTCContainer;
