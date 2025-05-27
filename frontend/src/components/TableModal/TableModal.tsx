import React, { useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/context";
import { toast } from "react-toastify";

interface TableModalProps {
  show: boolean;
  onHide: () => void;
  restaurantId: number;
  onTableAdded: () => void;
}

const TableModal: React.FC<TableModalProps> = observer(
  ({ show, onHide, restaurantId, onTableAdded }) => {
    const { tableStore } = useStore();

    const [tableNumber, setTableNumber] = useState<number>(1);
    const [tableCapacity, setTableCapacity] = useState<number>(2);
    const [error, setError] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      try {
        await tableStore.createTable({
          restaurant_id: restaurantId,
          table_number: tableNumber,
          table_capacity: tableCapacity,
        });

        toast.success("Table successfully added");
        onTableAdded();
        onHide();
      } catch (err) {
        setError(tableStore.error || "Failed to create table");
      }
    };

    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Table</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3" controlId="tableNumber">
              <Form.Label>Table Number</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={tableNumber}
                onChange={(e) => {
                  setTableNumber(Number(e.target.value));
                  setError("");
                }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="tableCapacity">
              <Form.Label>Table Capacity</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={10}
                value={tableCapacity}
                onChange={(e) => setTableCapacity(Number(e.target.value))}
                required
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={onHide}
              disabled={tableStore.loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={tableStore.loading}
            >
              {tableStore.loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Add Table"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
);

export default TableModal;
