import React, { useContext, useEffect, useState } from 'react';
import {
    Modal,
    Button,
    Nav,
    Form,
    Tab,
    Row,
    Col,
} from "react-bootstrap";


import { useNavigate } from "react-router-dom";

import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-dropdowns/styles/material.css';
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import ImageSelection from './imageSelection';
import { getScannedImage } from 'helper/TemplateHelper';
import { toast } from 'react-toastify';
import { fetchAllTemplate } from 'helper/TemplateHelper';
import Select, { components } from "react-select";
import Imageswitch from './Imageswitch';
import { change } from '@syncfusion/ej2-react-grids';
import { fetchAllUsers } from 'helper/userManagment_helper';
import { fileType, imageTypeData, imageColorTypeData, imageDPIData } from "data/helperData";
import { jwtDecode } from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';
import { createJob } from 'helper/job_helper';

const JobModal = (props) => {
    const [modalShow, setModalShow] = useState(false);
    const [allTemplateOptions, setAllTemplateOptions] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState()
    const [fileNames, setFileNames] = useState([]);
    const [imageEnable, setImageEnable] = useState(false);
    const [allOperators, setAllOperators] = useState([]);
    const [selectedOperator, setSelectedOperator] = useState("");
    const [dataPath, setDataPath] = useState("");
    const [dataType, setDataType] = useState("");
    const [imagePath, setImagePath] = useState("");
    const [imageType, setImageType] = useState("");
    const [imageDpi, setImageDpi] = useState("");
    const [imageColor, setImageColor] = useState("");
    const generateUUID = () => {
        return uuidv4();
    };

    const changeHandler = (val) => {
        console.log(val)
        setImageEnable(val)
    }
    useEffect(() => {
        if (props.show) {
            setModalShow(true);
        } else {
            setModalShow(false);
        }
    }, [props.show]);

    useEffect(() => {
        const getTemplates = async () => {
            const template = await fetchAllTemplate();
            const structuredTemplate = template?.map((item) => ({ id: item.id, name: item.layoutName }))

            setAllTemplateOptions(structuredTemplate);
        };
        getTemplates();
    }, []);

    useEffect(() => {
        const getUsers = async () => {
            const data = await fetchAllUsers();

            if (data?.success) {
                const structuredOperators = data.result.map((item) => {
                    if (item.userRoleList[0]?.roleName === "Operator") {
                        return { id: item.email, name: item.email }
                    }
                    return null
                }).filter((item) => item !== null);
                setAllOperators(structuredOperators);
            }
            // const structuredTemplate = template.map((item) => ({ id: item.id, name: item.layoutName }))
            // console.log(structuredTemplate)
            // setAllTemplateOptions(structuredTemplate);
        };
        getUsers();
    }, []);

    const createTemplateHandler = async () => {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        console.log(decoded);
        // return
        const jobObj = {
            "id": 0,
            "assignUser": "string",
            "templateId": selectedTemplate.id,
            "dataPath": dataPath,
            "dataType": dataType.id,
            "imagePath": imagePath,
            "imageType": imageType.id,
            "imageColor": imageColor,
            "jobStatus": "pending",
            "entryAt": new Date().toISOString(),
            "entryBy": decoded.UserName,
        }

        const response = await createJob(jobObj);
        if (response?.success) {
            // alert(response.message)
            toast.success(response.message);
            props.onHide()

        }

        console.log(response);
        const obj = {
            "id": 0,
            "assignUser": "string",
            "templateId": 0,
            "templateName": "string",
            "dataPath": "string",
            "dataType": "string",
            "imagePath": "string",
            "imageType": "string",
            "imageColor": "string",
            "jobStatus": "string",
            "jobStart": true,
            "jobComplete": true,
            "entryAt": "2024-07-23T10:06:46.790Z",
            "entryBy": "string",
            "updatedAt": "2024-07-23T10:06:46.790Z",
            "jobStartAt": "2024-07-23T10:06:46.790Z",
            "jobCompletedAt": "2024-07-23T10:06:46.790Z",
            "updatedBy": "string"
        }

    }
    const handleFileChange2 = (event) => {
        const files = Array.from(event.target.files);
        // setSelectedFiles(files);
        // For demonstration, log file names
        files.forEach(file => console.log('Selected File:', file.name));
    };

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

                <Modal.Body style={{ height: '65dvh' }}>
                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-3 "
                            style={{ fontSize: ".9rem" }}
                        >
                            Select Template:
                        </label>
                        <div className="col-md-9">
                            <Select
                                value={selectedTemplate}
                                onChange={(selectedValue) =>
                                    setSelectedTemplate(selectedValue)
                                }
                                options={allTemplateOptions}
                                getOptionLabel={(option) => option?.name || ""}
                                getOptionValue={(option) =>
                                    option?.id?.toString() || ""
                                }
                                placeholder="Select template..."
                            />

                        </div>
                    </Row>

                    {/* <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-3 "
                            style={{ fontSize: ".9rem" }}
                        >
                            Choose Operator:
                        </label>
                        <div className="col-md-9">
                            <Select
                                value={selectedOperator}
                                onChange={(selectedValue) =>
                                    setSelectedOperator(selectedValue)
                                }
                                options={allOperators}
                                getOptionLabel={(option) => option?.name || ""}
                                getOptionValue={(option) =>
                                    option?.id?.toString() || ""
                                }
                                placeholder="Select operator..."
                            />

                        </div>
                    </Row> */}
                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-3  col-form-label"
                            style={{ fontSize: ".9rem" }}
                        >
                            Data Path:
                        </label>
                        <div className="col-md-3">
                            <input type='text' value={dataPath} className="form-control" placeholder='Enter the data path' onChange={(e) => setDataPath(e.target.value)} />

                        </div>
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2  col-form-label"
                            style={{ fontSize: ".9rem" }}
                        >
                            Data Type:
                        </label>
                        <div className="col-md-4">
                            <Select
                                value={dataType}
                                onChange={(selectedValue) =>
                                    setDataType(selectedValue)
                                }
                                options={fileType}
                                getOptionLabel={(option) => option?.name || ""}
                                getOptionValue={(option) =>
                                    option?.id?.toString() || ""
                                }
                                placeholder="Select file type..."
                            />
                        </div>
                    </Row>
                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-3  col-form-label"
                            style={{ fontSize: ".9rem" }}
                        >
                            IMAGE
                        </label>
                        <div className="col-md-9">
                            <Imageswitch onChange={(val) => changeHandler(val)} />
                            {/* <Select
                                value={colorType}
                                onChange={(selectedValue) =>
                                    setColorType(selectedValue)
                                }
                                options={colorTypeData}
                                getOptionLabel={(option) => option?.name || ""}
                                getOptionValue={(option) =>
                                    option?.id?.toString() || ""
                                }
                                placeholder="Select color type..."
                            /> */}

                        </div>
                    </Row>

                    {imageEnable && <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-3  col-form-label"
                            style={{ fontSize: ".9rem" }}
                        >
                            Image Path:
                        </label>

                        <div className="col-md-3">
                            <input type='text' className="form-control" value={imagePath} placeholder='Enter the data path' onChange={(e) => { setImagePath(e.target.value) }} />
                        </div>
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2  col-form-label"
                            style={{ fontSize: ".9rem" }}
                        >
                            Image Type:
                        </label>
                        <div className="col-md-4">
                            <Select
                                value={imageType}
                                onChange={(selectedValue) =>
                                    setImageType(selectedValue)
                                }
                                options={imageTypeData}
                                getOptionLabel={(option) => option?.name || ""}
                                getOptionValue={(option) =>
                                    option?.id?.toString() || ""
                                }
                                placeholder="Select image type..."
                            />
                        </div>
                    </Row>}
                    {imageEnable && <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-3  col-form-label"
                            style={{ fontSize: ".9rem" }}
                        >
                            Image DPI:
                        </label>

                        <div className="col-md-3">
                            <Select
                                value={imageDpi}
                                onChange={(selectedValue) =>
                                    setImageDpi(selectedValue)
                                }
                                options={imageDPIData}
                                getOptionLabel={(option) => option?.name || ""}
                                getOptionValue={(option) =>
                                    option?.id?.toString() || ""
                                }
                                placeholder="Select dpi..."
                            />
                        </div>
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2  col-form-label"
                            style={{ fontSize: ".9rem" }}
                        >
                            Image Color:
                        </label>
                        <div className="col-md-4">
                            <Select
                                value={selectedOperator}
                                onChange={(selectedValue) =>
                                    setSelectedOperator(selectedValue)
                                }
                                options={imageColorTypeData}
                                getOptionLabel={(option) => option?.name || ""}
                                getOptionValue={(option) =>
                                    option?.id?.toString() || ""
                                }
                                placeholder="Select file type..."
                            />
                        </div>
                    </Row>}

                </Modal.Body>
                <Modal.Footer>
                    <div style={{ width: "50%" }}>
                        {/* <div class="mb-4" >
                        <label for="formFile" class="form-label">Upload OMR Image</label>
                        <input class="form-control" type="file" id="formFile" onChange={handleImageUpload} accept="image/*" />
                    </div> */}

                    </div>

                    <div className="w-20 flex-shrink-0" style={{
                        content: "", width: "12%"
                    }}></div> {/* Spacer div */}
                    <Button variant="secondary" onClick={props.onHide}>
                        Close
                    </Button>
                    <Button
                        variant="success"
                        onClick={createTemplateHandler}
                    >

                        Add Job
                    </Button>
                </Modal.Footer>
            </Modal >

        </>

    )
}

export default JobModal;