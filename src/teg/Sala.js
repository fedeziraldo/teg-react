import { useEffect, useRef, useState } from 'react';
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
const ENDPOINT = process.env.REACT_APP_BACK;
const SIN_SALA = 'sin sala'

function Sala() {

  const history = useHistory()
  const socketRef = useRef()
  const [texto, setTexto] = useState("");
  const [usuario, setUsuario] = useState({})
  const [sala, setSala] = useState(null);

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
      <Row>
        <Col>
          <h2>Hola {usuario.nombre}</h2>
          <Button variant="danger" onClick={logOut}>Salir</Button>
        </Col>
        <Col>
          <h2>Salas</h2>
          <h3>Estas unido a la sala {sala ? sala.crador.nombre : SIN_SALA}</h3>
          <ul id="salas"></ul>
          <Button variant="primary" onClick={crearSala}>Crear sala</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Usuarios conectados</h2>
          <ul id="conectados"></ul>
        </Col>
        <Col>
          <ul id="chat"></ul>
          <Form onSubmit={enviarMensaje}>
            <Form.Group controlId="formBasicEmail">
              <Form.Control placeholder="Ingrese su manesaje" name="email" onChange={handleTexto} />
            </Form.Group>
            <Button variant="info" type="submit">Enviar</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Sala;
