import React,{useEffect,  useState} from 'react';
import './App.css';
import WebRTCContainer from './WebRTCContainer';
import socket from './socket';



function App() {
  const [clientId, setClientId] = useState<string>("");

  useEffect(()=>{
    socket.on("init", (data:any)=> setClientId(data.id)).emit("init");
  },[]);

  const startCall = (isCaller: boolean, friendId: string, config: any) => {
    socket.on("init", (data: any) => {
      console.log(data);
      setClientId(data.id);
    });
  };

  return (
    <div className="App">
      <WebRTCContainer clientId={clientId} startCall = {startCall}></WebRTCContainer>
    </div>
  );
}

export default App;
