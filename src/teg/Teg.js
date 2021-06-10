import { useEffect, useRef } from 'react';
import socketIOClient from "socket.io-client";
const ENDPOINT = process.env.REACT_APP_BACK;
const axios = require('axios');

function Teg() {

  const socketRef = useRef()

  const initSocket = () => {
    socketRef.current = socketIOClient(ENDPOINT)
    socketRef.current.on("time", time => {
      console.log(time)
    });
  }

  useEffect(() => {
    const getUsuarios = async () => {
      console.log(await axios.get(`${ENDPOINT}/usuarios`))
    }

    getUsuarios()
    initSocket()

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div>
      asd
    </div>
  );
}

export default Teg;
