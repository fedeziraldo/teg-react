import { Modal, Button } from "react-bootstrap"

function JugadaInvalida({ mensaje, show, setShow }) {

    const handleClose = () => setShow(false);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Jugada invalida</Modal.Title>
            </Modal.Header>
            <Modal.Body>{mensaje}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Ups!
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default JugadaInvalida