import { Fragment, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image, Text } from 'react-konva';
import { useNavigate } from 'react-router-dom';
import Konva from 'konva';
import socketIOClient from "socket.io-client";
import useImage from 'use-image';
import { Alert, Button, Form, ListGroup, Container } from 'react-bootstrap';
import JugadaInvalida from './JugadaInvalida';
const ENDPOINT = process.env.REACT_APP_BACK;

const colores = [
  { red: 255 },
  { green: 255 },
  { blue: 255 },
  { red: 255, green: 255 },
  { red: 255, blue: 255 },
  { green: 255, blue: 255 },
]

function Mapa() {

  const images = {}
  images['ANGOLA.png'] = useImage('ANGOLA.png')[0]
  images['EGIPTO.png'] = useImage('EGIPTO.png')[0]
  images['ETIOPIA.png'] = useImage('ETIOPIA.png')[0]
  images['MADAGASCAR.png'] = useImage('MADAGASCAR.png')[0]
  images['MAURITANIA.png'] = useImage('MAURITANIA.png')[0]
  images['NIGERIA.png'] = useImage('NIGERIA.png')[0]
  images['SAHARA.png'] = useImage('SAHARA.png')[0]
  images['SUDAFRICA.png'] = useImage('SUDAFRICA.png')[0]
  images['CUBA.png'] = useImage('CUBA.png')[0]
  images['EL_SALVADOR.png'] = useImage('EL_SALVADOR.png')[0]

  const styleMapa = {
    backgroundImage: 'url("mapa.jpg")',
    width: '1600px',
    height: '1182px'
  }

  const socketRef = useRef()

  const [jugador, setJugador] = useState({})

  const [juego, setJuego] = useState({
    jugadores: [],
    paises: [],
    turno: {}
  })
  const [iniciarJuego, setIniciarJuego] = useState(false)
  const [ataque, setAtaque] = useState({})

  const [show, setShow] = useState(false)
  const [jugadaInvalida, setJugadaInvalida] = useState("")
  const navigate = useNavigate()

  const handleAtaque = e => {
    const a = { ...ataque }
    a[e.target.name] = e.target.value
    setAtaque(a);
  };

  const drawHitFromCache = (img, p) => {
    if (img) {
      img.cache();
      img.filters([Konva.Filters.RGB]);
      const color = colores[p.jugador.numero]
      img["red"](color.red)
      img["green"](color.green)
      img["blue"](color.blue)
      img.drawHitFromCache();
    }
  };

  const accionSimple = (text, misil, p) => {
    if (text) {
      text.off('click');
      text.on("click", () => {
        socketRef.current.emit('accionSimple', p.pais.numero, misil)
      })
    }
  }

  const accionTerminarTurno = () => {
    socketRef.current.emit('accionTerminarTurno')
  };

  const atacar = e => {
    e.preventDefault()
    socketRef.current.emit('accionDoble', ataque.numeroPaisO, ataque.numeroPaisD)
  };

  useEffect(() => {
    const initSocket = () => {
      socketRef.current = socketIOClient(`${ENDPOINT}/mapa`)

      socketRef.current.emit('validacion', localStorage.getItem("token"))

      socketRef.current.on('loginIncorrecto', () => {
        localStorage.removeItem("token");
        navigate("/")
      })

      socketRef.current.on('loginCorrecto', jugador => {
        setJugador(jugador)
      })

      socketRef.current.on('iniciarJuego', juego => {
        setIniciarJuego(true)
        setJuego(juego)
      })

      socketRef.current.on('juego', juego => {
        setJuego(juego)
      })

      socketRef.current.on('jugadaInvalida', mensaje => {
        setShow(true)
        setJugadaInvalida(mensaje)
      })
    }

    initSocket()

    return () => {
      socketRef.current.disconnect();
    };
  }, [navigate]);

  const estilos = {
    backgroundColor: 'white',
    margin: '0px'
  }

  return (
    iniciarJuego ?
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
              juego.paises.map(p => <option value={p.pais.numero}>{p.pais.nombre}</option>)
            }
          </Form.Select>

          <Form.Select name="numeroPaisD" onChange={handleAtaque}>
            {
              juego.paises.map(p => <option value={p.pais.numero}>{p.pais.nombre}</option>)
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
        <Stage width={1600} height={1182} style={styleMapa}>
          <Layer>
            {
              juego.paises.map(p =>
                <Image key={p.pais.numero}
                  x={p.pais.posX}
                  y={p.pais.posY}
                  image={images[p.pais.archivo]}
                  ref={node => drawHitFromCache(node, p)}
                  width={p.pais.width || 200}
                  height={p.pais.height || 200}
                />)
            }

            {
              juego.paises.map(p =>
                <Fragment key={p.pais.numero}>
                  <Text
                    x={p.pais.posX}
                    y={p.pais.posY}
                    text={`fichas: ${p.fichas}`}
                    ref={node => accionSimple(node, false, p)}
                    draggable
                  >
                  </Text>
                  <Text
                    x={p.pais.posX}
                    y={p.pais.posY + 20}
                    text={`misiles: ${p.misiles}`}
                    ref={node => accionSimple(node, true, p)}
                    draggable
                  >
                  </Text>
                </Fragment>)
            }
          </Layer>
        </Stage>
        <JugadaInvalida
          mensaje={jugadaInvalida}
          show={show}
          setShow={setShow}
        />
      </Container>
      :
      <Alert variant="info">
        waiting for other players
      </Alert>

  )
}

export default Mapa