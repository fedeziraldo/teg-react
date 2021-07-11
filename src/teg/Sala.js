import { useEffect, useRef, useState } from 'react';
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
const ENDPOINT = process.env.REACT_APP_BACK;

function Sala() {

  const history = useHistory()

  const socketRef = useRef()

  const [texto, setTexto] = useState("");

  const [usuario, setUsuario] = useState({})

  const handleTexto = (event) => {
    setTexto(event.target.value);
  };

  const enviarMensaje = e => {
    e.preventDefault()
    document.getElementById("chat").innerHTML += `<li>${usuario.nombre}: ${texto}</li>`
    socketRef.current.emit("texto", texto)
  }

  const logOut = () => {
    localStorage.removeItem("token");
    history.push("/")
  }

  const crearSala = () => {
    socketRef.current.emit("crearSala")
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

  const estilos = {
    backgroundColor: 'white' 
  }

  return (
    <Container style={estilos}>
      <div>Hola {usuario.nombre}</div>
      <ul id="chat"></ul>
      <div>
        <Form onSubmit={enviarMensaje}>
          <Form.Group controlId="formBasicEmail">
            <Form.Control placeholder="Ingrese su manesaje" name="email" onChange={handleTexto} />
          </Form.Group>

          <Button variant="primary" type="submit">Enviar</Button>
        </Form>
        <button onClick={crearSala}>Crear sala</button>
        <button onClick={logOut}>Salir</button>
      </div>
    </Container>
  );
}

export default Sala;
