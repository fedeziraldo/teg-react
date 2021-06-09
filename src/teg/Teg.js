import { useEffect } from 'react';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3000";
const axios = require('axios');

async function getUsuarios() {
  try {
    const response = await axios.get('http://127.0.0.1:3000/usuarios');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

function Teg() {

  useEffect(() => {
    getUsuarios()
    const socket = socketIOClient(ENDPOINT)
    socket.on("time", time => {
      console.log(time)
    });
  }, []);

  return (
    <div>
      asd
    </div>
  );
}

export default Teg;
