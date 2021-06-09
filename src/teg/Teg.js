import { useEffect } from 'react';
import socketIOClient from "socket.io-client";
const ENDPOINT = "https://teg-node.herokuapp.com";
const axios = require('axios');

async function getUsuarios() {
  try {
    const response = await axios.get('https://teg-node.herokuapp.com/usuarios');
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
