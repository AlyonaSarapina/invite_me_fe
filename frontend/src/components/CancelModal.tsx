import { Dispatch, SetStateAction } from "react";
import { Modal, Button } from "react-bootstrap";

interface CancelModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const CancelModal: React.FC<CancelModalProps> = ({
  show,
  onClose,
  onConfirm,
}) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Cancel Booking</Modal.Title>
    </Modal.Header>
    <Modal.Body>Are you sure you want to cancel this booking?</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        Yes, Cancel Booking
      </Button>
    </Modal.Footer>
  </Modal>
);

export default CancelModal;
