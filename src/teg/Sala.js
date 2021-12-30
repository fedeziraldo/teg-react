import { useEffect, useRef, useState } from 'react';
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
const ENDPOINT = process.env.REACT_APP_BACK;

function Sala() {

  const navigate = useNavigate()
  const socketRef = useRef()
  const [texto, setTexto] = useState("");
  const [usuario, setUsuario] = useState({})
  const [usuarios, setUsuarios] = useState([])
  const [salas, setSalas] = useState([]);
  const [isLoading, setLoading] = useState(true)

  const handleTexto = (event) => {
    setTexto(event.target.value);
  };

  const enviarMensaje = e => {
    e.preventDefault()
    socketRef.current.emit("texto", texto)
  }

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/")
  }

  const crearSala = () => {
    socketRef.current.emit("crearSala")
  }

  const unirseSala = sala => {
    socketRef.current.emit("unirseSala", sala)
  }

  const salirSala = () => {
    socketRef.current.emit("salirSala")
  }

  const eliminarSala = () => {
    socketRef.current.emit("eliminarSala")
  }

  const irAMapa = () => {
    navigate("/mapa")
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
  
      socketRef.current.on('loginCorrecto', usuario => {
        setUsuario(usuario)
        setLoading(false)
      })

      socketRef.current.on('salas', salas => {
        setSalas(salas)
      })

      socketRef.current.on('usuarios', usuarios => {
        setUsuarios(usuarios)
      })

      socketRef.current.on('usuario', usuario => {
        setUsuario(usuario)
      })
  
      socketRef.current.on("texto", texto => {
        document.getElementById("chat").innerHTML += `<li>${texto}</li>`
      })
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
          <h3>Estas unido a la sala {usuario.nombreSala}</h3>
          <ListGroup variant="flush">
            {
              salas.map(s => 
              <ListGroup.Item>{s}
                <Button variant="primary" onClick={() => unirseSala(s)} disabled={isLoading}>Unirse a sala</Button>
              </ListGroup.Item>
            )}
          </ListGroup>
          <Button variant="success" onClick={crearSala} disabled={isLoading}>Crear sala</Button>
          {
            salas.includes(usuario._id) ?
              <>
                <Button variant="danger" onClick={eliminarSala} disabled={isLoading}>Eliminar sala</Button>
                <Button variant="warning" onClick={irAMapa} disabled={isLoading}>Iniciar juego</Button>
              </> :
              <Button variant="danger" onClick={salirSala} disabled={isLoading}>Salir sala</Button>
          }
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Usuarios conectados</h2>
          <ListGroup variant="flush">
            {
              usuarios.map(u => <ListGroup.Item>{u}</ListGroup.Item>)
            }
          </ListGroup>
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
