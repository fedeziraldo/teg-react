import { useEffect, useRef, useState } from 'react';
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

  const styleMapa = {
    backgroundImage: 'url("mapa.jpg")',
    width: '1600px',
    height: '1182px'
  }

  const socketRef = useRef()

  const [jugador, setJugador] = useState({})
  const [jugadores, setJugadores] = useState([])
  const [paises, setPaises] = useState([])
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
      img.off('click');
      img.on("click", () => {
        socketRef.current.emit('accionSimple', p.numero)
      })
      img.cache();
      img.filters([Konva.Filters.RGB]);
      const color = colores[p.jugador.numero]
      img["red"](color.red)
      img["green"](color.green)
      img["blue"](color.blue)
      img.drawHitFromCache();
    }
  };

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
        setPaises(juego.paises)
        setJugadores(juego.jugadores)
      })

      socketRef.current.on('paises', paises => {
        // for (let pais of paises) {
        //   const img = {...images}
        //   img[pais.archivo] = useImage(pais.archivo)
        //   setImages(img)
        // }
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
        Hola {jugador.usuario && jugador.usuario.email}
        <ListGroup variant="flush">
          {
            jugadores.map(j => <ListGroup.Item key={j.usuario._id}>{j.usuario._id}</ListGroup.Item>)
          }
        </ListGroup>
        <Button variant="danger" onClick={accionTerminarTurno}>Terminar turno</Button>
        <Form onSubmit={atacar}>
          <Form.Group controlId="formBasicEmail">
            <Form.Control type="number" placeholder="paisO" name="numeroPaisO" onChange={handleAtaque} />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Control type="number" placeholder="paisO" name="numeroPaisD" onChange={handleAtaque} />
          </Form.Group>

          <Button variant="info" type="submit" onClick={atacar}>Ataca</Button>
        </Form>
        <Stage width={1600} height={1182} style={styleMapa}>
          <Layer>
            {
              paises.map(p =>
                <>
                  <Image key={p.pais.numero}
                    x={p.pais.posX}
                    y={p.pais.posY}
                    draggable
                    image={images[p.pais.archivo]}
                    ref={node => drawHitFromCache(node, p)}
                    width={p.pais.width || 200}
                    height={p.pais.height || 200}
                  />
                  <Text
                    x={p.pais.posX}
                    y={p.pais.posY}
                    text={`fichas: ${p.fichas}`}
                  >
                  </Text>
                  <Text
                    x={p.pais.posX + 20}
                    y={p.pais.posY}
                    text={`misiles: ${p.misiles}`}
                  >
                  </Text>
                </>)
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