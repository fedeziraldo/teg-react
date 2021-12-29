import { useEffect, useRef, useState } from 'react';
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
const ENDPOINT = process.env.REACT_APP_BACK;

function Sala() {

  const navigate = useNavigate()
  const socketRef = useRef()
  const [texto, setTexto] = useState("");
  const [usuario, setUsuario] = useState({})
  const [usuarios, setUsuarios] = useState([])
  const [sala, setSala] = useState(null);
  const [salas, setSalas] = useState([]);
  const [isLoading, setLoading] = useState(true)

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
    navigate("/")
  }

  const crearSala = () => {
    socketRef.current.emit("crearSala")
  }

  useEffect(() => {
    const getUsuarios = async () => {
      console.log(await axios.get(`${ENDPOINT}/usuarios`))
    }

    const initSocket = () => {
      socketRef.current = socketIOClient(ENDPOINT)
  
      socketRef.current.emit('validacion', localStorage.getItem("token"))
  
      socketRef.current.on('loginIncorrecto', () => {
        localStorage.removeItem("token");
        navigate("/")
      })
  
      socketRef.current.on('loginCorrecto', ({usuario, salas, usuarios}) => {
        setUsuario(usuario)
        setSalas(salas)
        setUsuarios(usuarios)
        setLoading(false)
      })
  
      socketRef.current.on("texto", texto => document.getElementById("chat").innerHTML += `<li>${texto}</li>`)
    }

    getUsuarios()
    initSocket()

    return () => {
      socketRef.current.disconnect();
    };
  }, [navigate]);

  const estilos = {
    backgroundColor: 'white'
  }

  return (
    <Container style={estilos}>
      <Row>
        <Col>
          <h2>Hola {usuario.nombre}</h2>
          <Button variant="danger" onClick={logOut} disabled={isLoading}>Salir</Button>
        </Col>
        <Col>
          <h2>Salas</h2>
          <h3>Estas unido a la sala {usuario && usuario.nombreSala}</h3>
          <ul>
            {
              salas.map(s => <li>{s}</li>)
            }
          </ul>
          <Button variant="primary" onClick={crearSala} disabled={isLoading}>Crear sala</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Usuarios conectados</h2>
          <ul>
            {
              usuarios.map(u => <li>{u}</li>)
            }
          </ul>
        </Col>
        <Col>
          <ul id="chat"></ul>
          <Form onSubmit={enviarMensaje}>
            <Form.Group controlId="formBasicEmail">
              <Form.Control placeholder="Ingrese su manesaje" name="email" onChange={handleTexto} />
            </Form.Group>
            <Button variant="info" type="submit" disabled={isLoading}>Enviar</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Sala;
