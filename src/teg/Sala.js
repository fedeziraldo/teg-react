import { useEffect, useRef, useState } from 'react';
import socketIOClient from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
const ENDPOINT = process.env.REACT_APP_BACK;

function Sala() {

  const navigate = useNavigate()
  const socketRef = useRef()
  const [texto, setTexto] = useState("");
  const [user, setUser] = useState({})
  const [usuarios, setUsuarios] = useState([])
  const [salas, setSalas] = useState([]);
  const [isLoading, setLoading] = useState(true)

  const handleTexto = (event) => {
    setTexto(event.target.value);
  };

  const enviarMensaje = e => {
    e.preventDefault()
    socketRef.current.emit("texto", texto)
    setTexto("")
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

  const crearJuego = () => {
    socketRef.current.emit("crearJuego")
  }

  const irJuego = nombrejuego => {
    navigate(`/mapa/${nombrejuego}`)
  }

  useEffect(() => {
    const initSocket = () => {
      socketRef.current = socketIOClient(`${ENDPOINT}/sala`)
  
      socketRef.current.emit('validacion', localStorage.getItem("token"))
  
      socketRef.current.on('loginIncorrecto', () => {
        localStorage.removeItem("token");
        navigate("/")
      })
  
      socketRef.current.on('loginCorrecto', user => {
        setUser(user)
        setLoading(false)
      })

      socketRef.current.on('salas', salas => {
        setSalas(salas)
      })

      socketRef.current.on('usuarios', usuarios => {
        setUsuarios(usuarios)
      })

      socketRef.current.on('user', user => {
        setUser(user)
      })
  
      socketRef.current.on("texto", texto => {
        document.getElementById("chat").innerHTML += `<li>${texto}</li>`
      })

      socketRef.current.on("iniciarJuego", () => {
        navigate("/mapa")
      })
    }

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
          <h2>Hoda {user.usuario?.email}</h2>
          <Button variant="danger" onClick={logOut} disabled={isLoading}>Salir</Button>
        </Col>
        <Col>
          <h2>Salas</h2>
          <h3>Estas unido a la sala {user.nombreSala}</h3>
          <ListGroup variant="flush">
            {
              Object.keys(salas).map(s => 
              <ListGroup.Item key={s}>{s}
                <Button variant="primary" onClick={() => unirseSala(s)} disabled={isLoading}>Unirse a sala</Button>
              </ListGroup.Item>
            )}
          </ListGroup>
          <Button variant="success" onClick={crearSala} disabled={isLoading}>Crear sala</Button>
          {
            Object.keys(salas).includes(user.usuario?.email) ?
              <>
                <Button variant="danger" onClick={eliminarSala} disabled={isLoading}>Eliminar sala</Button>
                <Button variant="warning" onClick={crearJuego} disabled={isLoading}>Iniciar juego</Button>
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
              usuarios.map(u => <ListGroup.Item key={u}>{u}</ListGroup.Item>)
            }
          </ListGroup>
        </Col>
        <Col>
          <ul id="chat"></ul>
          <Form onSubmit={enviarMensaje}>
            <Form.Group controlId="formBasicEmail">
              <Form.Control placeholder="Ingrese su manesaje" name="texto" value={texto} onChange={handleTexto} />
            </Form.Group>
            <Button variant="info" type="submit" disabled={isLoading}>Enviar</Button>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Juegos</h2>
          <ListGroup variant="flush">
            {
              user.usuario &&user.juegos.map(j => 
                  <ListGroup.Item key={j}>
                    {j}
                    <Button variant="warning" onClick={() => irJuego(j)} disabled={isLoading}>Ir al juego</Button>
                  </ListGroup.Item>
              )
            }
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default Sala;