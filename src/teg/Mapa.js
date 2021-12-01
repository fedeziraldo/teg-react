import { Stage, Layer, Image} from 'react-konva';
import  Konva from 'konva';
import useImage from 'use-image';

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