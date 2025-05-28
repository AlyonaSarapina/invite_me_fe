import { Modal, Button } from "react-bootstrap";

interface ConfirmModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  body?: React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  onClose,
  onConfirm,
  title = "Confirm Action",
  body = "Are you sure you want to proceed?",
}) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{body}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        Yes
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmModal;
