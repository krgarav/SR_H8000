import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const IpModal = ({ show, onHide, onSave }) => {
  const [ip, setIp] = useState("");

  const handleSave = () => {
    onSave(ip);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Set Backend IP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Backend IP</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Backend IP"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default IpModal;
