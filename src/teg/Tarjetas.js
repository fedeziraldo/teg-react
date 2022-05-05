import { useState } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap"

function Ataque({ tarjetas, show, setShow, socketRef }) {

    const handleClose = () => setShow(false);

    const [seleccion] = useState([])

    const canjear = e => {
        e.preventDefault()
        socketRef.current.emit('accionCanje', seleccion)
        handleClose()
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Tarjetas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup variant="flush">
                {
                    tarjetas?.map(t => 
                    <ListGroup.Item key={t.pais.pais.numero}>{t.pais.pais.nombre}
                        
                    </ListGroup.Item>
                )}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={canjear}>
                    Canjear
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Ataque