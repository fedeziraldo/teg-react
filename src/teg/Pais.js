import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';

const colores = [
  { red: 255, green: 0, blue: 0 },
  { red: 0, green: 255, blue: 0 },
  { red: 0, green: 0, blue: 255 },
  { red: 255, green: 255, blue: 0 },
  { red: 255, green: 0, blue: 255 },
  { red: 0, green: 255, blue: 255 },
]

function Pais({ pais, setShowAtaque, setPaisSelected }) {
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
  )
}

export default Pais