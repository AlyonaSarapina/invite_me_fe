"use client";

import TableModel from "@/stores/models/TableModel";
import { observer } from "mobx-react";
import { Instance } from "mobx-state-tree";
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import TableModal from "../TableModal";
import { useStore } from "@/stores/context";

type Props = {
  show: boolean;
  onClose: () => void;
  restaurantId: number;
  tables: Instance<typeof TableModel>[];
  onDelete: (id: number) => void;
  restaurantCapacity: number;
};

const TablesModal = ({
  show,
  restaurantId,
  onClose,
  tables,
  onDelete,
  restaurantCapacity,
}: Props) => {
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const { getTableByRestaurant } = useStore().tableStore;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Tables in Restaurant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 text-center">
          <p>
            <strong>Restaurant Capacity:</strong> {restaurantCapacity} tables
          </p>
          <p>
            <strong>Added Tables:</strong> {tables.length} tables
          </p>
        </div>
        {tables.length === 0 ? (
          <p className="text-center text-muted">No tables added yet.</p>
        ) : (
          <ul className="list-group">
            {tables.map((table) => (
              <li
                key={table.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  Table №{table.table_number} - Seats {table.table_capacity}
                </span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(table.id)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
        {showAddTableModal && (
          <TableModal
            show={showAddTableModal}
            onHide={() => setShowAddTableModal(false)}
            restaurantId={restaurantId}
            onTableAdded={async () => {
              await getTableByRestaurant(restaurantId);
            }}
          ></TableModal>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setShowAddTableModal(true)}>Add table</Button>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default observer(TablesModal);
