import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image} from 'react-konva';
import { useNavigate } from 'react-router-dom';
import  Konva from 'konva';
import socketIOClient from "socket.io-client";
import useImage from 'use-image';
const ENDPOINT_TEG = process.env.REACT_APP_BACK;

const drawHitFromCache = (img) => {
    if (img) {
        img.off('click');
        img.on("click", () =>{
            alert("lau cochi te amo")
        })
        img.cache();
        img.filters([Konva.Filters.RGB]);
        img["red"](128)
        img.drawHitFromCache();
    }
};

function Mapa() {

    const [image] = useImage('Etiopia.png');

    const styleMapa = {
        backgroundImage: 'url("mapa.jpg")',
        width: '1600px',
        height: '1182px'
    }

    const socketRef = useRef()

    const [usuario, setUsuario] = useState({})
    const navigate = useNavigate()

    useEffect(() => {    
        const initSocket = () => {
          socketRef.current = socketIOClient(`${ENDPOINT_TEG}/mapa`)
      
          socketRef.current.emit('validacion', localStorage.getItem("token"))
      
          socketRef.current.on('loginIncorrecto', () => {
            localStorage.removeItem("token");
            navigate("/")
          })
      
          socketRef.current.on('loginCorrecto', usuario => {
            setUsuario(usuario)
          })

        }

        initSocket()
    
        return () => {
          socketRef.current.disconnect();
        };
      }, [navigate]);

    return (
        <Stage width={1600} height={1182} style={styleMapa}>
            <Layer>
                <Image 
                    image={image} 
                    ref={ (node) => { drawHitFromCache(node); }}
                    width={300}
                    height={150}
                />
            </Layer>
        </Stage>
    )
}

export default Mapa