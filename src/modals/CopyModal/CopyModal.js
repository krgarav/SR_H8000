import React, { useContext, useEffect, useRef, useState } from "react";
import { Row } from "reactstrap";
import { Modal, Button, Col } from "react-bootstrap";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
const CopyModal = (props) => {
    const [modalShow, setModalShow] = useState(false);
    return (
        <Modal
            show={props.show}
            fullscreen={true}
            size="sm"
            // onHide={() => setModalShow(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title
                    style={{
                        display: "flex",
                        width: "80%",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    Select the copying area
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
                style={{ width: "100%", height: "65dvh", overflow: "auto" }}
            >
                <FormControl>
                    <FormLabel id="demo-form-control-label-placement">Label placement</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-form-control-label-placement"
                        name="position"
                        defaultValue="top"
                    >
                        <FormControlLabel
                            value="top"
                            control={<Radio />}
                            label="Top"
                            labelPlacement="top"
                        />
                        <FormControlLabel
                            value="start"
                            control={<Radio />}
                            label="Start"
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value="bottom"
                            control={<Radio />}
                            label="Bottom"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel value="end" control={<Radio />} label="End" />
                    </RadioGroup>
                </FormControl>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type="button"
                    variant="danger"
                    onClick={() => props.onHide()}
                    className="waves-effect waves-light"
                >
                    Close
                </Button>
                <Button
                    type="button"
                    variant="success"
                    // onClick={saveRegionHandler}
                    className="waves-effect waves-light"
                >
                    Copy
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CopyModal