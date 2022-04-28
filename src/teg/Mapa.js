import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import { useNavigate, useParams } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import useImage from 'use-image';
import { Alert, Button, Form, ListGroup, Container } from 'react-bootstrap';
import JugadaInvalida from './JugadaInvalida';
import Pais from './Pais';
import Ficha from './Ficha';
const ENDPOINT = process.env.REACT_APP_BACK;

function Mapa() {
  const params = useParams();

  const [mapa] = useImage('../mapa.jpg')

  const socketRef = useRef()

  const [jugador, setJugador] = useState({})

  const [juego, setJuego] = useState({
    jugadores: [],
    paises: [],
    turno: {}
  })

  const [ataque, setAtaque] = useState({})

  const [showJugadaInvalida, setShowJugadaInvalida] = useState(false)
  const [jugadaInvalida, setJugadaInvalida] = useState("")
  const navigate = useNavigate()

  const handleAtaque = e => {
    const a = { ...ataque }
    a[e.target.name] = e.target.value
    setAtaque(a);
  };

  const accionTerminarTurno = () => {
    socketRef.current.emit('accionTerminarTurno')
  };

  const atacar = e => {
    e.preventDefault()
    socketRef.current.emit('accionDoble', ataque.numeroPaisO, ataque.numeroPaisD)
  };

  const botonEmpate = nombreJuego => {
    socketRef.current.emit('botonEmpate', nombreJuego)
  };

  const volverASala = e => {
    navigate("/sala")
  };

  useEffect(() => {
    socketRef.current = socketIOClient(`${ENDPOINT}/mapa`)

    socketRef.current.emit('validacion', localStorage.getItem("token"), params.nombreJuego)

    socketRef.current.on('loginIncorrecto', () => {
      navigate("/sala")
    })

    socketRef.current.on('loginCorrecto', jugador => {
      setJugador(jugador)
    })

    socketRef.current.on('juego', juego => {
      setJuego(juego)
    })

    socketRef.current.on('jugadaInvalida', mensaje => {
      setShowJugadaInvalida(true)
      setJugadaInvalida(mensaje)
    })

    return () => {
      socketRef.current.disconnect();
    };
  }, [navigate, params]);

  const estilos = {
    backgroundColor: 'white',
    margin: '0px',
  }

  return (
    <Container style={estilos}>
      Hola {jugador.nombre}
      <ListGroup variant="flush">
        {
          juego.jugadores.map(j => <ListGroup.Item key={j.nombre}>{j.nombre}</ListGroup.Item>)
        }
      </ListGroup>
      <Button variant="danger" onClick={accionTerminarTurno}>Terminar turno</Button>
      <Form onSubmit={atacar}>
        <Form.Select name="numeroPaisO" onChange={handleAtaque}>
          {
            juego.paises.map(p => <option value={p.pais.numero} key={p.pais.numero}>{p.pais.nombre}</option>)
          }
        </Form.Select>

        <Form.Select name="numeroPaisD" onChange={handleAtaque}>
          {
            juego.paises.map(p => <option value={p.pais.numero} key={p.pais.numero}>{p.pais.nombre}</option>)
          }
        </Form.Select>

        <Button variant="info" type="submit" onClick={atacar}>Ataca</Button>
      </Form>
      <Alert>

        Fase {
          juego.turno.faseInicial && "Inicial"
        }
        {
          juego.turno.fase4 && "4"
        }
        {
          juego.turno.fase8 && "8"
        }
        {
          juego.turno.faseJuego && "Juego"
        }
        {
          juego.turno.faseReagrupar && "Reagrupar"
        }
        {
          juego.turno.faseRefuerzos && "Refuerzos"
        }
      </Alert>
      <Alert>
        Turno {juego.jugadores[juego.turno.turno % juego.jugadores.length] &&
          juego.jugadores[juego.turno.turno % juego.jugadores.length].nombre}
      </Alert>
      <Alert>
        Fichas restantes {jugador.fichasRestantes}
      </Alert>
      <Stage width={1300} height={1182} draggable>
        <Layer listening={false}>
          <Image
            image={mapa}
          />
        </Layer>
        <Layer>
          {
            juego.paises.map(p =>
              <Pais
                key={p.pais.numero}
                pais={p}
              />)
          }
        </Layer>
        <Layer>
          {
            juego.paises.map(pais =>
              <Ficha key={pais.pais.numero}
                pais={pais}
                socketRef={socketRef}
              />
            )
          }
        </Layer>
      </Stage>
      <JugadaInvalida
        mensaje={jugadaInvalida}
        show={showJugadaInvalida}
        setShow={setShowJugadaInvalida}
      />
      <Button variant="warning" onClick={volverASala}>Volver a sala</Button>
      <Button variant="danger" onClick={() => botonEmpate(params.nombreJuego)}>Boton empate</Button>
    </Container>
  )
}

export default Mapa
