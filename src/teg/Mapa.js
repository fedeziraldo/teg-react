import { Stage, Layer, Image } from 'react-konva';
import useImage from 'use-image';

const drawHitFromCache = (img) => {
    if (img) {
        img.on("click", () =>{
            alert("lau cochi te amo")
        })
        img.cache();
        img.drawHitFromCache();
    }
};

function Mapa() {

    const [image] = useImage('lion.png');

    return (
        <Stage width={window.innerWidth} height={window.innerHeight} style={{backgroundColor: 'white'}}>
            <Layer>
                <Image 
                    image={image} 
                    width={200}
                    height={200}
                    ref={ (node) => { drawHitFromCache(node); }}
                />
            </Layer>
        </Stage>
    )
}

export default Mapa