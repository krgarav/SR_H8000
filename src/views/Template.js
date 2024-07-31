
import {
  Card,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Table,
  Container,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import NormalHeader from "components/Headers/NormalHeader";
import {
  Modal,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataContext from "store/DataContext";
import axios from 'axios';
import TemplateModal from "../ui/TemplateModal";
import { fetchAllTemplate } from "helper/TemplateHelper";
import { deleteTemplate } from "helper/TemplateHelper";
import CryptoJS from 'crypto-js';
import { toast } from "react-toastify";

const Template = () => {
  const [modalShow, setModalShow] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [templateDatail, setTemplateDetail] = useState([]);
  const [toggle, setToggle] = useState(false)
  const navigate = useNavigate();
  const dataCtx = useContext(DataContext);
  useEffect(() => {

    const fetchData = async () => {
      const templates = await fetchAllTemplate();
      if(templates===undefined){
        toast.error('Error fetching templates'); 
      
      }
      const mpObj = templates?.map((item) => {
        return [{ layoutParameters: item }]
      })
      dataCtx.addToAllTemplate(mpObj);

    }
    fetchData()

  }, [toggle]);
  const showHandler = (arr) => {
    setShowDetailModal(true);
    setTemplateDetail(arr)

  }
  const editHandler = (arr, index) => {
    console.log(arr, index);
    const tempdata = arr[0].layoutParameters;

    navigate("/admin/design-template", {
      state: {
        templateIndex: index,
        timingMarks: +tempdata.timingMarks,
        totalColumns: +tempdata.totalColumns,
        templateImagePath: tempdata.templateImagePath,
        bubbleType: tempdata.bubbleType,
        iSensitivity: +tempdata.iSensitivity,
        iDifference: +tempdata.iDifference,
        iReject: tempdata.iReject,
        iFace: +tempdata.iFace,
        arr: arr,
        templateId: tempdata.id
      }

    });
  };

  const deleteImage = async (imageUrl) => {

    const cloudName = process.env.REACT_APP_CLOUD_NAME// Your Cloudinary cloud name
    const apiKey = process.env.REACT_APP_API_KEY; // Your Cloudinary API key
    const apiSecret = process.env.REACT_APP_API_SECRET; // Your Cloudinary API secret

    // Extract public ID from URL
    const urlParts = imageUrl.split('/');
    const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
    const publicIdWithFormat = urlParts.slice(versionIndex + 1).join('/'); // omrimages/dj7va6r3farwpblq6txv.jpg
    const publicId = publicIdWithFormat.split('.')[0]; // omrimages/dj7va6r3farwpblq6txv

    console.log('Extracted public ID:', publicId); // Debugging: Log the public ID

    // Create the timestamp and signature
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = CryptoJS.SHA1(stringToSign).toString();

    // Form data for the request
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp);
    formData.append('api_key', apiKey);
    formData.append('signature', signature);

    try {
      // Make the API request to delete the image
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log(response.data); // Debugging: Log the response data

      return response.data;
    } catch (error) {
      console.error('Error deleting image:', error); // Debugging: Log any error
      throw error;
    }
  };

  const deleteHandler = async (arr, index) => {
    const result = window.confirm("Are you sure you want to delete template ?");
    if (result) {
      const id = arr[0].layoutParameters.id
      const imageUrl = arr[0].layoutParameters.templateImagePath;
      const result = await deleteImage(imageUrl);
      const res = await deleteTemplate(id)
      console.log(res)
      if (res.success) {
        setToggle(prev => !prev);
        toast.success("Successfully deleted template")
      }

      // dataCtx.deleteTemplate(index)
    } else { return }

  }
  return (
    <>
      <NormalHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between">
                  <h3 className="mt-2">All Templates</h3>

                  <Button
                    className=""
                    color="primary"
                    type="button"
                    onClick={() => setModalShow(true)}
                  >
                    Create Template
                  </Button>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush mb-5" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Sno.</th>
                    <th scope="col">Template Name</th>
                    <th scope="col">Row</th>
                    <th scope="col">Col</th>
                    <th scope="col">Bubble Type</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody style={{ minHeight: "100rem" }}>
                  {dataCtx.allTemplates?.map((d, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{d[0].layoutParameters.layoutName}</td>
                      <td>{d[0].layoutParameters.timingMarks}</td>
                      <td>{d[0].layoutParameters.totalColumns}</td>
                      <td>{d[0].layoutParameters["bubbleType"]}</td>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem onClick={() => showHandler(d)}>Show</DropdownItem>
                            <DropdownItem onClick={() => editHandler(d, i)}>Edit</DropdownItem>
                            {/* <DropdownItem onClick={() => sendToBackendHandler(d, i)}>Send Data</DropdownItem> */}
                            <DropdownItem style={{ color: "red" }} onClick={() => deleteHandler(d, i)}>Delete</DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>

                  ))}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>

      {/* Template Detail Modal*/}

      {templateDatail.length !== 0 && (
        <Modal
          show={showDetailModal}
          onHide={() => setShowDetailModal(false)}
          size="lg"
          aria-labelledby="modal-custom-navbar"
          centered
        >
          <Modal.Header>
            <Modal.Title id="modal-custom-navbar">
              Template Name :  {templateDatail[0]["Template Name"]}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3">
              <Col xs={12} md={2}>
                <label htmlFor="example-text-input" style={{ fontSize: ".9rem" }}>
                  Name:
                </label>
              </Col>
              <Col xs={12} md={10}>
                <input
                  type="text"
                  className="form-control"
                  value={templateDatail[0]["Template Name"]}
                  readOnly
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={12} md={2}>
                <label htmlFor="example-text-input" style={{ fontSize: ".9rem" }}>
                  Total Row:
                </label>
              </Col>
              <Col xs={12} md={2}>
                <input
                  type="text"
                  className="form-control"
                  value={templateDatail[0]["Rows"]}
                  readOnly
                />
              </Col>
              <Col xs={12} md={2}>
                <label htmlFor="example-text-input" style={{ fontSize: ".9rem" }}>
                  Total Column:
                </label>
              </Col>
              <Col xs={12} md={2}>
                <input
                  type="text"
                  className="form-control"
                  value={templateDatail[0]["Cols"]}
                  readOnly
                />
              </Col>
              <Col xs={12} md={2}>
                <label htmlFor="example-text-input" style={{ fontSize: ".9rem" }}>
                  Bubble Type:
                </label>
              </Col>
              <Col xs={12} md={2}>
                <input
                  type="text"
                  className="form-control"
                  value={templateDatail[0]["Bubble Type"]}
                  readOnly
                />
              </Col>
            </Row>

            {templateDatail.Regions &&
              templateDatail.Regions.map((item, index) => {
                return (
                  <div key={index}>
                    <Row className="mb-3">
                      <Col xs={12} md={2}>
                        <label htmlFor="example-text-input" style={{ fontSize: ".9rem" }}>
                          Region Name:
                        </label>
                      </Col>
                      <Col xs={12} md={10}>
                        <input
                          type="text"
                          className="form-control"
                          value={item["Region name"]}
                          readOnly
                        />
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs={6} md={3}>
                        <label htmlFor="example-text-input" style={{ fontSize: ".9rem" }}>
                          Start Row:
                        </label>
                        <input className="form-control" value={item["Coordinate"]["Start Row"]} readOnly />
                      </Col>
                      <Col xs={6} md={3}>
                        <label htmlFor="example-text-input" style={{ fontSize: ".9rem" }}>
                          Start Col:
                        </label>
                        <input className="form-control" value={item["Coordinate"]["Start Col"]} readOnly />
                      </Col>
                      <Col xs={6} md={3}>
                        <label htmlFor="example-text-input" style={{ fontSize: ".9rem" }}>
                          End Row:
                        </label>
                        <input className="form-control" value={item["Coordinate"]["End Row"]} readOnly />
                      </Col>
                      <Col xs={6} md={3}>
                        <label htmlFor="example-text-input" style={{ fontSize: ".9rem" }}>
                          End Col:
                        </label>
                        <input className="form-control" value={item["Coordinate"]["End Col"]} readOnly />
                      </Col>
                    </Row>
                  </div>
                );
              })}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <TemplateModal show={modalShow} onHide={() => setModalShow(false)} />    {/* Create Template modal */}
    </>
  );
};

export default Template;
