import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import { useNavigate, useParams } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import useImage from 'use-image';
import { Alert, Button, ListGroup, Container } from 'react-bootstrap';
import JugadaInvalida from './JugadaInvalida';
import Pais from './Pais';
import Ataque from './Ataque';
import Tarjetas from './Tarjetas';
const ENDPOINT = process.env.REACT_APP_BACK;

function Mapa() {
  const params = useParams();

  const [mapa] = useImage('../mapa.jpg')

  const socketRef = useRef()

  const [jugador, setJugador] = useState({})

  const [juego, setJuego] = useState(null)

  const [paisSelected, setPaisSelected] = useState(0)
  const [showAtaque, setShowAtaque] = useState(false)
  const [showTarjetas, setShowTarjetas] = useState(false)
  const [showJugadaInvalida, setShowJugadaInvalida] = useState(false)
  const [jugadaInvalida, setJugadaInvalida] = useState("")
  const navigate = useNavigate()

  const accionTerminarTurno = () => {
    socketRef.current.emit('accionTerminarTurno')
  };

  const verTarjetas = () => {
    setShowTarjetas(true)
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
          juego?.jugadores.map(j => <ListGroup.Item key={j.nombre}>{j.nombre}</ListGroup.Item>)
        }
      </ListGroup>
      <Button variant="danger" onClick={accionTerminarTurno}>Terminar turno</Button>
      <Button variant="success" onClick={verTarjetas}>Canje</Button>
      <Alert>

        Fase: {
          juego?.turno.faseInicial && "Inicial"
        }
        {
          juego?.turno.fase4 && "4"
        }
        {
          juego?.turno.fase8 && "8"
        }
        {
          juego?.turno.faseJuego && "Juego"
        }
        {
          juego?.turno.faseReagrupar && "Reagrupar"
        }
        {
          juego?.turno.faseRefuerzos && "Refuerzos"
        }
      </Alert>
      <Alert>
        Turno: {juego?.jugadores[juego?.turno.turno % juego?.jugadores.length].nombre}
      </Alert>
      <Alert>
        Fichas restantes: {jugador.fichasRestantes}
      </Alert>
      <Alert>
        Objetivo secreto: {jugador.objetivo?.nombre}
      </Alert>
      <Stage width={1300} height={1182} draggable>
        <Layer listening={false}>
          <Image
            image={mapa}
          />
        </Layer>
        <Layer>
          {
            juego?.paises.map(p =>
              <Pais key={p.pais.numero}
                pais={p}
                setShowAtaque={setShowAtaque}
                setPaisSelected={setPaisSelected}
                socketRef={socketRef}
              />)
          }
        </Layer>
      </Stage>
      <Button variant="warning" onClick={volverASala}>Volver a sala</Button>
      <Button variant="danger" onClick={() => botonEmpate(params.nombreJuego)}>Boton empate</Button>
      <Tarjetas
        jugador={jugador}
        show={showTarjetas}
        setShow={setShowTarjetas}
        socketRef={socketRef}
      />
      <Ataque
        paises={juego?.paises}
        paisSelected={paisSelected}
        show={showAtaque}
        setShow={setShowAtaque}
        socketRef={socketRef}
      />
      <JugadaInvalida
        mensaje={jugadaInvalida}
        show={showJugadaInvalida}
        setShow={setShowJugadaInvalida}
      />
    </Container>
  )
}

export default Mapa
