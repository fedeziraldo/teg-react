import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Circle, Image, Text } from 'react-konva';
import useImage from 'use-image';

const colores = [
  { red: 255, green: 0, blue: 0 },
  { red: 0, green: 255, blue: 0 },
  { red: 0, green: 0, blue: 255 },
  { red: 255, green: 255, blue: 0 },
  { red: 255, green: 0, blue: 255 },
  { red: 0, green: 255, blue: 255 },
]

function Pais({ pais, setShowAtaque, setPaisSelected, socketRef }) {
  const [image] = useImage(`../paises/${pais.pais.archivo}`)
  const paisRef = useRef()

  useEffect(() => {
    if (image) {
      paisRef.current.cache();
      paisRef.current.drawHitFromCache();
    }
  }, [image]);

  const seleccionarJugada = numero => {
    setPaisSelected(numero)
    setShowAtaque(true)
  }

  return (
    <>
      <Image
        x={pais.pais.posX}
        y={pais.pais.posY}
        image={image}
        ref={paisRef}
        filters={[Konva.Filters.RGB]}
        red={colores[pais.jugador.numero].red}
        green={colores[pais.jugador.numero].green}
        blue={colores[pais.jugador.numero].blue}
        onPointerClick={() => seleccionarJugada(pais.pais.numero)}
      />
      <Circle
        x={image && (pais.pais.posX + (image.width) / 2)}
        y={image && (pais.pais.posY + (image.height) / 2)}
        radius={20} fill="white" 
      />
      <Text
        x={image && (pais.pais.posX + image.width / 2 - 10)}
        y={image && (pais.pais.posY + image.height / 2 - 5)}
        text={`${pais.fichas} - ${pais.misiles}`}
        onPointerClick={e => socketRef.current.emit('accionSimple', pais.pais.numero, e.evt.button != 1)}
      />
      
    </>
  )
}

export default Pais