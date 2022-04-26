import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';

const colores = [
  { red: 255 },
  { green: 255 },
  { blue: 255 },
  { red: 255, green: 255 },
  { red: 255, blue: 255 },
  { green: 255, blue: 255 },
]

function Pais({ pais }) {
  const image = useImage(`../${pais.pais.archivo}`)[0]
  const paisRef = useRef()

  useEffect(() => {
    if (image) {
      paisRef.current.cache();
      paisRef.current.drawHitFromCache();
    }
  }, [image]);

  return (
    <Image
      x={pais.pais.posX}
      y={pais.pais.posY}
      image={image}
      width={pais.pais.width || 200}
      height={pais.pais.height || 200}
      perfectDrawEnabled={false}
      ref={paisRef}
      filters={[Konva.Filters.RGB]}
      red={colores[pais.jugador.numero].red}
      green={colores[pais.jugador.numero].green}
      blue={colores[pais.jugador.numero].blue}
    />
  )
}

export default Pais