import { Fragment, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image, Text } from 'react-konva';
import { useNavigate, useParams } from 'react-router-dom';
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

const drawHitFromCache = (img, p) => {
  if (img) {
    img.cache();
    img.filters([Konva.Filters.RGB]);
    const color = colores[p.jugador.numero]
    color.red && img["red"](color.red)
    color.green && img["green"](color.green)
    color.blue && img["blue"](color.blue)
    img.drawHitFromCache();
  }
};

function Mapa() {
  const params = useParams();

  const mapa = useImage('../mapa.jpg')[0]


  // for (let i=0; i<72; i++) {
  //   imageRefs.push(useRef())
  // }

  const images = {}
  const angola = useImage('../ANGOLA.png')[0]
  const imageRef = useRef()
  images['ANGOLA.png'] = angola
  images['EGIPTO.png'] = useImage('../EGIPTO.png')[0]
  images['ETIOPIA.png'] = useImage('../ETIOPIA.png')[0]
  images['MADAGASCAR.png'] = useImage('../MADAGASCAR.png')[0]
  images['MAURITANIA.png'] = useImage('../MAURITANIA.png')[0]
  images['NIGERIA.png'] = useImage('../NIGERIA.png')[0]
  images['SAHARA.png'] = useImage('../SAHARA.png')[0]
  images['SUDAFRICA.png'] = useImage('../SUDAFRICA.png')[0]
  images['CUBA.png'] = useImage('../CUBA.png')[0]
  images['EL_SALVADOR.png'] = useImage('../EL_SALVADOR.png')[0]

  useEffect(() => {
    if (angola) {
      imageRef.current.cache();
      // const color = colores[p.jugador.numero]
      // color.red && imageRef.current["red"](color.red)
      // color.green && imageRef.current["green"](color.green)
      // color.blue && imageRef.current["blue"](color.blue)
      imageRef.current.drawHitFromCache();
      imageRef.current.getLayer().batchDraw();
    }
  }, [angola]);

  const socketRef = useRef()

  const [jugador, setJugador] = useState({})

  const [juego, setJuego] = useState({
    jugadores: [],
    paises: [],
    turno: {}
  })

  const [ataque, setAtaque] = useState({})

  const [show, setShow] = useState(false)
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
    const initSocket = () => {
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
        setShow(true)
        setJugadaInvalida(mensaje)
      })
    }

    initSocket()

    return () => {
      socketRef.current.disconnect();
    };
  }, [navigate, params]);

  const estilos = {
    backgroundColor: 'white',
    margin: '0px'
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
            width={1600}
            heigth={1182}
            ref={node => node && node.cache()}
            perfectDrawEnabled={false}
          />
        </Layer>
        <Layer>
          <Image key={0}
            x={200}
            y={200}
            image={angola}
            //ref={node => drawHitFromCache(node, p)}
            width={ 200}
            height={ 200}
            perfectDrawEnabled={false}
            ref={imageRef}
            filters={[Konva.Filters.RGB]}
            red={colores[0].red}
            green={colores[0].green}
            blue={colores[0].blue}
          />
          {
            juego.paises.map(p =>
              <Image key={p.pais.numero}
                x={p.pais.posX}
                y={p.pais.posY}
                image={images[p.pais.archivo]}
                //ref={node => drawHitFromCache(node, p)}
                width={p.pais.width || 200}
                height={p.pais.height || 200}
                perfectDrawEnabled={false}
                ref={imageRef}
                filters={[Konva.Filters.RGB]}
                red={colores[0].red}
                green={colores[0].green}
                blue={colores[0].blue}
              />)
          }
        </Layer>
        <Layer>
          {
            juego.paises.map(p =>
              <Fragment key={p.pais.numero}>
                <Text
                  x={p.pais.posX}
                  y={p.pais.posY}
                  text={`fichas: ${p.fichas}`}
                  onPointerClick={() => socketRef.current.emit('accionSimple', p.pais.numero, false)}
                >
                </Text>
                <Text
                  x={p.pais.posX}
                  y={p.pais.posY + 20}
                  text={`misiles: ${p.misiles}`}
                  onPointerClick={() => socketRef.current.emit('accionSimple', p.pais.numero, false)}
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
      <Button variant="warning" onClick={volverASala}>Volver a sala</Button>
      <Button variant="danger" onClick={() => botonEmpate(params.nombreJuego)}>Boton empate</Button>
    </Container>
  )
}

export default Mapa
