import React, { useState, useEffect } from "react";
import "./App.css";
import sokcetIO from "socket.io-client";

const socket = sokcetIO("http://localhost:3010/");

function App() {
  const [message, setMessage] = useState("");
  const [recive, setRecive] = useState([]);
  const [roommsg, setRoommsg] = useState([]);
  const [r, setR] = useState();
  const [normal,setNormal] = useState([]);
  useEffect(() => {
    socket.on("disp", (data) => {
      setRecive([...recive, data]);
    });
    socket.on("userroom", (data) => {
      setRoommsg([...roommsg, data.message]);
    });
    console.log("useeffect is working");
    socket.on('sendfs',(data)=>{
      setNormal([...normal,data])
    })
  }, [recive, roommsg, r,normal]);

  const sendmsg = () => {
    console.log("message sendeing to all ", message);
    socket.emit("send_all", message);
  };

  const joinroom = (room) => {
    console.log("message sending from room", room);
    socket.emit("unsubsribe", room === 1 ? 2 : 1);
    setR(room);
    socket.emit("subscribe", room);
  };
  const sendroom = (room) => {
    socket.emit("roommsg", { message: message, roomno: room });
  };

  const send = ()=>{
    socket.emit('send',message)
    console.log("sending normal message");
  }

  return (
    <div className="App">
      <div className="msg">
        <div className="pad">
          <input
            type="text"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button onClick={sendmsg}> BRODCATING </button>
          <button onClick={send}>send msg</button>
          <button onClick={() => sendroom(r)}>send to room</button>
          {normal.map((data) => (
          <p>{data}</p>
        ))}
        </div>
        <button onClick={() => joinroom(1)}>room 1</button>
        <button onClick={() => joinroom(2)}>room 2</button>
      </div>
      <div >
        <h1>BRODCATING MSG</h1>
        {recive.map((data) => (
          <p>{data}</p>
        ))}
      </div>
      <div>
        <h2>room message</h2>
        {roommsg.map((data) => (
          <p>{data}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
