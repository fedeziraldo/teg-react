import { Text } from "react-konva";

function Ficha({ pais, socketRef }) {
  return (
    <>
      <Text
        x={pais.pais.posX}
        y={pais.pais.posY}
        text={`fichas: ${pais.fichas}`}
        onPointerClick={() => socketRef.current.emit('accionSimple', pais.pais.numero, false)}
      >
      </Text>
      <Text
        x={pais.pais.posX}
        y={pais.pais.posY + 20}
        text={`misiles: ${pais.misiles}`}
        onPointerClick={() => socketRef.current.emit('accionSimple', pais.pais.numero, false)}
      >
      </Text>
    </>
  )
}

export default Ficha