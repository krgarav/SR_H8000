import React from 'react'
import { Modal, Button, Col, Table } from "react-bootstrap";
import Placeholder from 'ui/Placeholder';

const FieldDetails = (props) => {
    const placeHolderJobs = new Array(8).fill(null).map((_, index) => (
        <tr key={index}>
            <td>
                <Placeholder width="20%" height="1.5em" />
            </td>
            <td>
                <Placeholder width="60%" height="1.5em" />
            </td>
            <td>
                <Placeholder width="60%" height="1.5em" />
            </td>
            <td>
                <Placeholder width="60%" height="1.5em" />
            </td>
            <td>
                <Placeholder width="60%" height="1.5em" />
            </td>
            <td> <Placeholder width="15%" height="1.5em" /></td>
        </tr>
    ));
    return (
        <Modal
            show={props.show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    All Fields
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: "60vh", overflow: "auto" }}>
                <Table
                    className="align-items-center table-flush mb-5 table-hover"
                    responsive
                >
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">SL no.</th>
                            <th scope="col">Field Name</th>
                            <th scope="col">Field Type</th>
                            <th scope="col">Col</th>
                            <th scope="col">Bubble Type</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {placeHolderJobs}
                        {/* {templateLoading ? placeHolderJobs : LoadedTemplates} */}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type="button"
                    variant="danger"
                    onClick={() => props.onHide()}
                    className="waves-effect waves-light"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="success"
                    // onClick={saveHandler}
                    // onClick={() => setImageModalShow(false)}
                    className="waves-effect waves-light"
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default FieldDetails