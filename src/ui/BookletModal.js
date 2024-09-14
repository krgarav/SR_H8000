import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Nav, Form, Tab, Row, Col } from "react-bootstrap";
import TemplateModal from "./TemplateModal";
import Jobcard from "./Jobcard";

const BookletModal = (props) => {
  const [modalShow, setModalShow] = useState(false);
  useEffect(() => {
    if (props.show) {
      setModalShow(true);
    } else {
      setModalShow(false);
    }
  }, [props.show]);
  const handleJob = () => {};
  return (
    <>
      <Modal
        show={modalShow}
        onHide={props.onHide}
        size="lg"
        aria-labelledby="modal-custom-navbar"
        centered
        dialogClassName="modal-90w"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title id="modal-custom-navbar">Create Job</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ overflow: "auto" }}>
          <Row md={12}>
            <Col md={4}>
              <Jobcard handleJob={handleJob} text={"Simplex"} />
            </Col>
            <Col md={4}>
              <Jobcard handleJob={handleJob} text={"Duplex"} />
            </Col>
            <Col md={4}>
              <Jobcard handleJob={handleJob} text={"Booklet"} />
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <TemplateModal show={modalShow} onHide={() => setModalShow(false)} />{" "} */}
    </>
  );
};

export default BookletModal;
