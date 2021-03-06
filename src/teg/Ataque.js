import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap"

function Ataque({ paises, paisSelected, show, setShow, socketRef }) {

    const handleClose = () => setShow(false);

    const [ataque, setAtaque] = useState(0)

    const atacar = e => {
        e.preventDefault()
        socketRef.current.emit('accionDoble', paisSelected, ataque, false)
        handleClose()
    };

    const lanzarMisil = e => {
        e.preventDefault()
        socketRef.current.emit('accionDoble', paisSelected, ataque, true)
        handleClose()
    };

    const handleAtaque = e => {
        setAtaque(e.target.value);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Ataque de {paises && paises[paisSelected-1]?.pais.nombre} a:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Select value={ataque} onChange={handleAtaque}>
                    {
                        paises?.map(p => <option value={p.pais.numero} key={p.pais.numero}>{p.pais.nombre}</option>)
                    }
                </Form.Select>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={atacar}>
                    Atacar
                </Button>
                <Button variant="secondary" onClick={lanzarMisil}>
                    Lanzar misil
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Ataque