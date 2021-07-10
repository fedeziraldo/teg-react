import { useEffect, useRef, useState } from 'react';
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const ENDPOINT = process.env.REACT_APP_BACK;

function Sala() {

  const history = useHistory()

  const socketRef = useRef()

  const [texto, setTexto] = useState("");

  const [usuario, setUsuario] = useState({})

  const handleTexto = (event) => {
    setTexto(event.target.value);
  };

  const enviar = () => {
    document.getElementById("chat").innerHTML += `<li>${texto}</li>`
    socketRef.current.emit("texto", texto)
  }

  const logOut = () => {
    localStorage.removeItem("token");
    history.push("/")
  }

  const initSocket = () => {
    socketRef.current = socketIOClient(ENDPOINT)

    socketRef.current.emit('validacion', localStorage.getItem("token"))

    socketRef.current.on('loginIncorrecto', () => {
      localStorage.removeItem("token");
      history.push("/")
    })

    socketRef.current.on('loginCorrecto', usuario => {
      setUsuario(usuario)
    })

    socketRef.current.on("texto", texto => document.getElementById("chat").innerHTML += `<li>${texto}</li>`)
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
      <div>Hola {usuario.nombre}</div>
      <ul id="chat"></ul>
      <input
        value={texto}
        onChange={handleTexto}
      />
      <button onClick={enviar}>Enviar</button>
      <button onClick={logOut}>Salir</button>
    </div>
  );
}

export default Sala;
