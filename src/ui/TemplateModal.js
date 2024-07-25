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
import {
    rejectData,
    sizeData,
    bubbleData,
    windowNgData,
    faceData,
    directionData,
    barcodeTypeData,
    colorTypeData,
    encodingOptionData,
    rotationOptionData,
    resolutionOptionData,
    scanningSideData,
    imageStatusData,
    barcodeCategoryData,
    code39OrItfCheckDigitData,
    nw7CheckDigitData,
    upcaOptionData,
    upceOptionData,
    barcodeRejectData
} from "data/helperData";
import DataContext from 'store/DataContext';
import Select, { components } from "react-select";
import { useNavigate } from "react-router-dom";
import Slider from '@mui/material/Slider';
import ShadesOfGrey from './shadesOfGrey';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-dropdowns/styles/material.css';
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import ImageSelection from './imageSelection';
import { getScannedImage } from 'helper/TemplateHelper';
import { toast } from 'react-toastify';
import Jobcard from './Jobcard';
import DuplexJob from './DuplexJob';

const TemplateModal = (props) => {
    const [modalShow, setModalShow] = useState(false);
    const [name, setName] = useState("");
    const [size, setSize] = useState({ id: 1, name: "A4" });
    const [numberOfLines, setNumberOfLines] = useState("");
    const [imageSrc, setImageSrc] = useState('/img.jpg');

    const [sensitivity, setSensitivity] = useState(1)
    const [difference, setDifference] = useState("");
    const [barCount, setBarCount] = useState("")
    const [selectedBubble, setSelectedBubble] = useState({})
    const [reject, setReject] = useState()
    const [numberOfFrontSideColumn, setNumberOfFrontSideColumn] = useState("");
    const [windowNgOption, setWindowNgOption] = useState("");
    const [face, setFace] = useState();
    const [direction, setDirection] = useState();
    const [toggle, settoggle] = useState({});
    const [activeKey, setActiveKey] = useState("general");
    const [spanDisplay, setSpanDisplay] = useState("none");
    const dataCtx = useContext(DataContext);
    const [colorType, setColorType] = useState();
    const [encoding, setEncoding] = useState();
    const [rotation, setRotation] = useState();
    const [resolution, setResolution] = useState();
    const [scannningSide, setScanningSide] = useState();
    const [imageStatus, setImageStatus] = useState(imageStatusData[0]);
    const [barcodeReadingArea, setBarcodeReadingArea] = useState();
    const [barcodeType, setBarcodeType] = useState({});
    const [barcodeCategory, setBarcodeCategory] = useState({});
    const [barcodeRejectStatus, setBarcodeRejectStatus] = useState(barcodeRejectData[1]);
    const [checkDigit, setCheckDigit] = useState(null);
    const [barcodeRightPos, setBarcodeRightPos] = useState()
    const [barcodeLeftPos, setBarcodeLeftPos] = useState()
    const [barcodeTopPos, setBarcodeTopPos] = useState();
    const [barcodeBottomPos, setBarcodeBottomPos] = useState();
    const [option, setOption] = useState(null);
    const [selected, setSelected] = useState([]);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const columns = Array.from({ length: 48 }, (_, i) => i + 1);
    const [values, setValues] = useState(Array(48).fill(0));
    const [options, setOptions] = useState([]);
    const [colIdPattern, setColIdPattern] = useState();
    const [idNumber, setIdNumber] = useState("");
    const [imageFile, setImageFile] = useState();
    const [imageModal, setImageModal] = useState();
    const [image, setImage] = useState();
    const [imageTempFile, setTempImageFile] = useState();
    const [selectedUI, setSelectedUI] = useState("")
    const [activeTab, setActiveTab] = useState('simplex');
    const jobHandler = (e) => {
        // console.log(e)
        setSelectedUI(e)
    }
    const handleSelect = (selectedKey) => {
        console.log(selectedKey)
        setActiveTab(selectedKey);
    };
    const imageModalHandler = () => {
        setImageModal(true);
    }
    const handleColumnChange = (event) => {
        const columnIndex = event.value - 1;
        const newValues = Array(48).fill(0);
        newValues[columnIndex] = 1;
        setSelectedColumn(event.value);
        setValues(newValues);
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (props.show) {
            setModalShow(true);
        } else {
            setModalShow(false);
        }
    }, [props.show]);
    useEffect(() => {
        if (props.onHide) {
            setSelectedUI("");
        }
    }, [props.onHide]);
    const Option = (props) => {
        return (
            <components.Option {...props}>
                {props.data.icon && <span style={{ marginRight: 8 }}>{props.data.icon}</span>}
                {props.data.name}
            </components.Option>
        );
    };
    const SingleValue = (prop) => {
        return (
            <components.SingleValue {...prop}>
                {prop.data.icon && <span style={{ marginRight: 8 }}>{prop.data.icon}</span>}
                {prop.data.name}
            </components.SingleValue>
        );
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageSrc(URL.createObjectURL(file)); // Display image
            setImage(URL.createObjectURL(file))
            setTempImageFile(file);
        }
    }

    const createTemplateHandler = async () => {

        if (!name || !numberOfLines || !numberOfFrontSideColumn || !barCount) {
            settoggle((prevData) => ({
                ...prevData,
                name: !name ? true : prevData.name,
                row: !numberOfLines ? true : prevData.row,
                col: !numberOfFrontSideColumn ? true : prevData.col,
                barcode: !barCount ? true : prevData.barcode,

            }));
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('upload_preset', 'Sekonic'); // Replace with your Cloudinary upload preset

            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dje269eh5/image/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                        // Add authorization header if required (depending on your Cloudinary setup)
                        // 'Authorization': 'Bearer YOUR_CLOUDINARY_API_KEY_AND_SECRET'
                    }
                }
            );

            const imgUrl = response.data.secure_url;

            const templateData = [{
                "layoutParameters": {
                    "layoutName": name,
                    "timingMarks": +numberOfLines,
                    "barcodeCount": +barCount,
                    "iFace": +face.id,
                    "totalColumns": +numberOfFrontSideColumn,
                    "bubbleType": selectedBubble.name,
                    "templateImagePath": imgUrl,
                    "iSensitivity": +sensitivity,
                    "iDifference": +difference,
                    "ngAction": windowNgOption.id,
                    "dataReadDirection": direction.id,
                    "iReject": +reject.name,
                },
                "barcodeData": {
                    "barcodeSide": 0,
                    "barcodeColor": 0,
                    "barcodeType": barcodeType.id,
                    "barcodeCheckDigit": checkDigit !== null ? +checkDigit.id : 0,
                    "barcodeOption": option !== null ? +option.id : 0,
                    "barcodeRightPos": +barcodeRightPos,
                    "barcodeLeftPos": +barcodeLeftPos,
                    "barcodeTopPos": +barcodeTopPos,
                    "barcodeBottomPos": +barcodeBottomPos,
                },
                "imageData": {
                    "imageEnable": imageStatus ? +imageStatus.id : 0,
                    "imageColor": colorType ? +colorType.id : "",
                    "imageType": encoding ? +encoding.id : "",
                    "imageParam": 0,
                    "imageRotation": rotation ? +rotation.id : 0,
                    "imageResoMode": 0,
                    "imageResolution": resolution ? +resolution.id : 0,
                },
                "printingData": {
                    "printEnable": 0,
                    "printStartPos": 0,
                    "printDigit": 0,
                    "printStartNumber": 0,
                    "printOrientation": 0,
                    "printFontSize": 0,
                    "printFontSpace": 0,
                    "printMode": 0
                },
            }];
            const index = dataCtx.setAllTemplates(templateData);
            setModalShow(false);
            navigate("/admin/design-template", {
                state: {
                    templateIndex: index,
                    timingMarks: numberOfLines,
                    totalColumns: numberOfFrontSideColumn,
                    templateImagePath: imgUrl,
                    bubbleType: selectedBubble.name,
                    iSensitivity: sensitivity,
                    iDifference: difference,
                    barcodeCount: barCount,
                    iReject: reject.id,
                    iFace: face.id
                },
            });

        } catch (error) {
            console.error('Error uploading file: ', error);
        }
    }
    const scannerHandler = async () => {
        try {
            const response = await axios.get('https://28mdpn6d-5289.inc1.devtunnels.ms/GetScannedImage', {
                responseType: 'arraybuffer',
            });
            console.log(response)

            // const arrayBuffer = await response.arrayBuffer();
            const blob = new Blob([response?.data], { type: 'image/jpeg' });
            const imageURL = URL.createObjectURL(blob);
            // Save the file format (for example, you can derive it from the MIME type)
            const file = new File([blob], 'downloaded_image.jpeg', { type: 'image/jpeg' });
            setTempImageFile(file);
            // Set the image URL to be used in the component
            setImage(imageURL);
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }


    }
    const systemHandler = () => {
        document.getElementById('formFile').click();


    };
    const saveHandler = () => {

        if (imageTempFile) {
            setImageFile(imageTempFile);
            setImageModal(false)
        } else {
            alert("Please select image");
        }

    }
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
                <Modal.Header className="d-flex flex-column w-100">
                    <Modal.Title id="modal-custom-navbar" className="mb-2 ">
                        Create Template
                    </Modal.Title>
                    {selectedUI === "DUPLEX" && (
                        <Nav fill variant="tabs" activeKey={activeTab} onSelect={handleSelect} className="w-100">
                            <Nav.Item>
                                <Nav.Link eventKey="simplex">Front Side</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="duplex">Back Side</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    )}
                </Modal.Header>
                <Modal.Body style={{ height: '65dvh' }} >
                    {selectedUI === "" && <div className='d-flex' style={{ justifyContent: "space-evenly" }}>
                        <Jobcard text="SIMPLEX" handleJob={jobHandler} />
                        <Jobcard text={"DUPLEX"} handleJob={jobHandler} />
                        {/* <DuplexJob/> */}
                    </div>}

                    {(selectedUI === "SIMPLEX" || activeTab === "simplex" && selectedUI !== "") && <Tab.Container
                        activeKey={activeKey}
                        onSelect={(k) => setActiveKey(k)}
                    >
                        <Row>
                            <Col sm={12}>
                                {/* Adjusted column span to full width if needed */}
                                <Nav
                                    variant="pills"
                                    className="flex-row justify-content-center"
                                >
                                    <Nav.Item>
                                        <Nav.Link eventKey="general">General</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="barcode">Barcode</Nav.Link>
                                    </Nav.Item>
                                    {imageStatus.id !== "0" && <Nav.Item>
                                        <Nav.Link eventKey="image">Image</Nav.Link>
                                    </Nav.Item>
                                    }
                                </Nav>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <Tab.Content>
                                    <Tab.Pane eventKey="general">
                                        <Row className="mb-3">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 "
                                                style={{ fontSize: ".9rem" }}
                                            >
                                                Name:
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Template Name"
                                                    value={name}
                                                    onChange={(e) => {
                                                        settoggle((item) => ({ ...item, name: false }));
                                                        setName(e.target.value)
                                                    }}
                                                    style={{ border: toggle.name ? "1px solid red" : "" }}
                                                />
                                                {!name && (
                                                    <span style={{ color: "red", display: spanDisplay }}>
                                                        This feild is required
                                                    </span>
                                                )}
                                            </div>
                                        </Row>
                                        <Row className="mb-3">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 "
                                                style={{ fontSize: ".9rem" }}
                                            >
                                                Size:
                                            </label>
                                            <div className="col-md-10">
                                                <Select
                                                    value={size}
                                                    onChange={(selectedValue) => setSize(selectedValue)}
                                                    options={sizeData}
                                                    getOptionLabel={(option) => option?.name || ""}
                                                    getOptionValue={(option) =>
                                                        option?.id?.toString() || ""
                                                    }
                                                />
                                                {!size && (
                                                    <span style={{ color: "red", display: "block" }}>
                                                        This feild is required
                                                    </span>
                                                )}
                                            </div>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Row>
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-4 col-form-label"
                                                        style={{ fontSize: ".9rem" }}
                                                    >
                                                        No. of Rows :
                                                    </label>
                                                    <div className="col-md-6">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={numberOfLines}
                                                            placeholder="Enter rows"
                                                            onChange={(e) => {
                                                                settoggle((item) => ({ ...item, row: false }));
                                                                setNumberOfLines(e.target.value)
                                                            }}
                                                            style={{ border: toggle.row ? "1px solid red" : "" }}
                                                        />
                                                        {!numberOfLines && (
                                                            <span
                                                                style={{ color: "red", display: spanDisplay }}
                                                            >
                                                                This feild is required
                                                            </span>
                                                        )}
                                                    </div>
                                                </Row>
                                            </Col>
                                            <Col md={6}>
                                                <Row>
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-6 col-form-label "
                                                        style={{ fontSize: ".9rem" }}
                                                    >
                                                        Number of columns:
                                                    </label>
                                                    <div className="col-md-6">
                                                        <input
                                                            placeholder="Enter columns"
                                                            type="number"
                                                            className="form-control"
                                                            value={numberOfFrontSideColumn}
                                                            onChange={(e) => {
                                                                settoggle((item) => ({ ...item, col: false }));
                                                                setNumberOfFrontSideColumn(e.target.value)
                                                            }
                                                            }
                                                            style={{ border: toggle.col ? "1px solid red" : "" }}
                                                        />
                                                        {!numberOfFrontSideColumn && (
                                                            <span
                                                                style={{ color: "red", display: spanDisplay }}
                                                            >
                                                                This feild is required
                                                            </span>
                                                        )}
                                                    </div>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row className='mb-3'>


                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label "
                                                style={{ fontSize: ".85rem" }}
                                            >
                                                Barcode Count:
                                            </label>
                                            <div className="col-md-10">
                                                <input placeholder="Enter barcode count" type="number" className="form-control" onChange={(e) => {
                                                    settoggle((item) => ({ ...item, barcode: false }));
                                                    setBarCount(e.target.value)
                                                }}
                                                    style={{ border: toggle.barcode ? "1px solid red" : "" }}
                                                />
                                                {!selectedBubble && (
                                                    <span style={{ color: "red", display: spanDisplay }}>
                                                        This feild is required
                                                    </span>
                                                )}
                                            </div>

                                        </Row>
                                        <Row className="mb-3">
                                            <label
                                                htmlFor="bubble-variant-input"
                                                className="col-md-2  col-form-label"
                                                style={{ fontSize: ".87rem" }}
                                            >
                                                Bubble Variant:
                                            </label>
                                            <div className="col-md-10">
                                                <Select
                                                    value={selectedBubble}
                                                    onChange={(selectedValue) =>
                                                        setSelectedBubble(selectedValue)
                                                    }
                                                    options={bubbleData}
                                                    getOptionLabel={(option) => option?.name || ""}
                                                    getOptionValue={(option) =>
                                                        option?.id?.toString() || ""
                                                    }
                                                    components={{ Option, SingleValue }}
                                                />
                                                {!selectedBubble && (
                                                    <span style={{ color: "red", display: spanDisplay }}>
                                                        This feild is required
                                                    </span>
                                                )}
                                            </div>
                                        </Row>
                                        <Row className="mb-2">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                                style={{ fontSize: ".9rem" }}
                                            >
                                                Window NG
                                            </label>
                                            <div className="col-md-5">
                                                <Select
                                                    value={windowNgOption}
                                                    onChange={(selectedValue) => setWindowNgOption(selectedValue)}
                                                    options={windowNgData}
                                                    getOptionLabel={(option) => option?.showName || ""}
                                                    getOptionValue={(option) =>
                                                        option?.id?.toString() || ""
                                                    }
                                                />
                                                {!size && (
                                                    <span style={{ color: "red", display: spanDisplay }}>
                                                        This feild is required
                                                    </span>
                                                )}
                                            </div>
                                            <label
                                                htmlFor="bubble-variant-input"

                                                className="col-md-2 col-form-label  "
                                                style={{ fontSize: ".9rem", textAlign: "right" }}
                                            >
                                                Rejected:
                                            </label>
                                            <div className="col-md-3">
                                                <Select
                                                    value={reject}
                                                    onChange={(selectedValue) =>
                                                        setReject(selectedValue)
                                                    }
                                                    options={rejectData}
                                                    getOptionLabel={(option) => option?.showName || ""}
                                                    getOptionValue={(option) =>
                                                        option?.id?.toString() || ""
                                                    }
                                                />
                                                {!selectedBubble && (
                                                    <span style={{ color: "red", display: spanDisplay }}>
                                                        This feild is required
                                                    </span>
                                                )}
                                            </div>
                                        </Row>

                                        {/* <Row className="mb-3">
                                        <label
                                            htmlFor="example-text-input"
                                            className="col-md-2 col-form-label "
                                            style={{ fontSize: ".85rem" }}
                                        >
                                            Barcode Count:
                                        </label>
                                        <div className="col-md-10">
                                            <input placeholder="Enter barcode count" type="number" className="form-control" onChange={(e) => {
                                                settoggle((item) => ({ ...item, barcode: false }));
                                                setBarCount(e.target.value)
                                            }}
                                                style={{ border: toggle.barcode ? "1px solid red" : "" }}
                                            />
                                            {!selectedBubble && (
                                                <span style={{ color: "red", display: spanDisplay }}>
                                                    This feild is required
                                                </span>
                                            )}
                                        </div>
                                    </Row> */}


                                        <Row className="mb-3">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label  "
                                                style={{ fontSize: ".9rem" }}
                                            >
                                                Sensitivity :
                                            </label>
                                            <div className="col-md-5" style={{
                                                display: "flex", gap: "5px", width: "100%"
                                            }}>


                                                <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                                    <div style={{ borderRadius: "6px", overflow: "hidden" }}>
                                                        <ShadesOfGrey />
                                                    </div>

                                                    <input
                                                        type="range"
                                                        id="sensitivityRange"
                                                        min="1"
                                                        max="16"
                                                        value={sensitivity}
                                                        onChange={(e) => setSensitivity(e.target.value)}
                                                        title={sensitivity}
                                                        style={{ cursor: "pointer" }}

                                                    />
                                                </div>


                                                <input
                                                    value={sensitivity}
                                                    onChange={(e) => setSensitivity(e.target.value)}
                                                    style={{ width: "100%", padding: "2px", textAlign: "center" }}
                                                    className='form-control'
                                                    type='number'
                                                    min={1}
                                                    max={16}

                                                />

                                                {!sensitivity && (
                                                    <span
                                                        style={{ color: "red", display: spanDisplay }}
                                                    >
                                                        This feild is required
                                                    </span>
                                                )}
                                            </div>
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label "
                                                style={{ fontSize: ".9rem", textAlign: "right" }}
                                            >
                                                Difference :
                                            </label>
                                            <div className="col-md-3">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={difference}
                                                    onBlur={(e) => {
                                                        const inputValue = e.target.value;

                                                        // Check if the input value is not empty and less than sensitivity
                                                        if (inputValue !== "" && +inputValue < +sensitivity) {
                                                            alert("Entered value cannot be less than sensitivity");
                                                            setDifference('');
                                                            return;
                                                        }
                                                    }}
                                                    onChange={(e) => setDifference(e.target.value)}
                                                />

                                                {!difference && (
                                                    <span
                                                        style={{ color: "red", display: spanDisplay }}
                                                    >
                                                        This feild is required
                                                    </span>
                                                )}
                                            </div>
                                        </Row>
                                        <Row className="mb-3">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2  col-form-label "
                                                style={{ fontSize: ".9rem" }}
                                            >
                                                Face:
                                            </label>
                                            <div className="col-md-4">
                                                <Select
                                                    value={face}
                                                    onChange={(selectedValue) =>
                                                        setFace(selectedValue)
                                                    }
                                                    options={faceData}
                                                    getOptionLabel={(option) => option?.name || ""}
                                                    getOptionValue={(option) =>
                                                        option?.id?.toString() || ""
                                                    }
                                                />
                                                {!numberOfLines && (
                                                    <span
                                                        style={{ color: "red", display: spanDisplay }}
                                                    >
                                                        This feild is required
                                                    </span>
                                                )}
                                            </div>
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-3 col-form-label  "
                                                style={{ fontSize: ".9rem", textAlign: "right" }}
                                            >
                                                Page Position :
                                            </label>
                                            <div className="col-md-3">
                                                <Select
                                                    value={direction}
                                                    onChange={(selectedValue) =>
                                                        setDirection(selectedValue)
                                                    }
                                                    options={directionData}
                                                    getOptionLabel={(option) => option?.name || ""}
                                                    getOptionValue={(option) =>
                                                        option?.id?.toString() || ""
                                                    }
                                                />
                                            </div>
                                        </Row>
                                        <Row className="mb-3">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label  "
                                                style={{ fontSize: ".95rem" }}
                                            >
                                                Image Status :
                                            </label>
                                            <div className="col-md-10">
                                                <Select
                                                    value={imageStatus}
                                                    onChange={(selectedValue) =>
                                                        setImageStatus(selectedValue)
                                                    }
                                                    options={imageStatusData}
                                                    getOptionLabel={(option) => option?.name || ""}
                                                    getOptionValue={(option) =>
                                                        option?.id?.toString() || ""
                                                    }
                                                    defaultInputValue=''
                                                />
                                            </div>

                                        </Row>


                                        {/* <div>
                                        <DropDownListComponent
                                            dataSource={columns}
                                            placeholder="Select a column"
                                            change={handleColumnChange}
                                        />

                                    </div> */}


                                        {/* <Row className="mb-3">
                      <Col sm={6}>
                        <Row>
                          <label
                            htmlFor="example-text-input"
                            className="col-md-6 "
                            style={{ fontSize: ".9rem" }}
                          >
                            Number of front side of column:
                          </label>
                          <div className="col-md-6">
                            <input
                              type="number"
                              className="form-control"
                              value={numberOfFrontSideColumn}
                              onChange={(e) =>
                                setNumberOfFrontSideColumn(e.target.value)
                              }
                            />
                            {!numberOfFrontSideColumn && (
                              <span
                                style={{ color: "red", display: spanDisplay }}
                              >
                                This feild is required
                              </span>
                            )}
                          </div>
                        </Row>
                      </Col>
                      <Col sm={6}>
                        <Row>
                          <label
                            htmlFor="example-text-input"
                            className="col-md-6 "
                            style={{ fontSize: ".9rem" }}
                          >
                            Number of back side column:
                          </label>
                          <div className="col-md-6">
                            <input
                              type="number"
                              className="form-control"
                              value={numberOfBackSideColumn}
                              onChange={(e) =>
                                setNumberOfBackSideColumn(e.target.value)
                              }
                            />
                            {!numberOfBackSideColumn && (
                              <span
                                style={{ color: "red", display: spanDisplay }}
                              >
                                This feild is required
                              </span>
                            )}
                          </div>
                        </Row>
                      </Col>
                    </Row> */}

                                        {/* <Row className="mb-3">
                      <label
                        htmlFor="example-text-input"
                        className="col-md-3 "
                        style={{ fontSize: ".9rem" }}
                      >
                        Type of column display:
                      </label>
                      <div className="col-md-9">
                        <Select
                          value={typeOfColumnDisplay}
                          onChange={(selectedValue) =>
                            setTypeOfColumnDisplay(selectedValue)
                          }
                          options={typeOfColumnDisplayData}
                          getOptionLabel={(option) => option?.name || ""}
                          getOptionValue={(option) =>
                            option?.id?.toString() || ""
                          }
                        />
                        {!typeOfColumnDisplay && (
                          <span style={{ color: "red", display: spanDisplay }}>
                            This feild is required
                          </span>
                        )}
                      </div>
                    </Row> */}
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="barcode">
                                        <Row className="mb-3">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 "
                                                style={{ fontSize: ".9rem" }}
                                            >
                                                Barcode Category:
                                            </label>
                                            <div className="col-md-10">
                                                <Select
                                                    value={barcodeCategory}
                                                    onChange={(selectedValue) => setBarcodeCategory(selectedValue)}
                                                    options={barcodeCategoryData}
                                                    getOptionLabel={(option) => option?.name || ""}
                                                    getOptionValue={(option) =>
                                                        option?.id?.toString() || ""
                                                    }
                                                />
                                                {!size && (
                                                    <span style={{ color: "red", display: "block" }}>
                                                        This feild is required
                                                    </span>
                                                )}
                                            </div>
                                        </Row>
                                        {barcodeCategory.id === "hardware" &&
                                            <Row className="mb-3">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 "
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Barcode Rejection :
                                                </label>
                                                <div className="col-md-10">
                                                    <Select
                                                        value={barcodeRejectStatus}
                                                        onChange={(selectedValue) => setBarcodeRejectStatus(selectedValue)}
                                                        options={barcodeRejectData}
                                                        getOptionLabel={(option) => option?.name || ""}
                                                        getOptionValue={(option) =>
                                                            option?.id?.toString() || ""
                                                        }
                                                    />
                                                    {!size && (
                                                        <span style={{ color: "red", display: "block" }}>
                                                            This feild is required
                                                        </span>
                                                    )}
                                                </div>
                                            </Row>}


                                        <>
                                            <Row className="mb-3">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 "
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Barcode Type :
                                                </label>
                                                <div className="col-md-10">
                                                    <Select
                                                        value={barcodeType}
                                                        onChange={(selectedValue) => setBarcodeType(selectedValue)}
                                                        options={barcodeTypeData}
                                                        getOptionLabel={(option) => option?.name || ""}
                                                        getOptionValue={(option) =>
                                                            option?.id?.toString() || ""
                                                        }
                                                    />
                                                    {!size && (
                                                        <span style={{ color: "red", display: "block" }}>
                                                            This feild is required
                                                        </span>
                                                    )}
                                                </div>
                                            </Row>


                                            {(barcodeType.id === "0x1U" || barcodeType.id === "0x2U") && (
                                                <Row className="mb-3">

                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-2 "
                                                        style={{ fontSize: ".9rem" }}
                                                    >
                                                        Set check digit:
                                                    </label>

                                                    <div className="col-md-10">
                                                        <Select
                                                            value={checkDigit}
                                                            onChange={(selectedValue) => setCheckDigit(selectedValue)}
                                                            options={barcodeType.id === "0x1U" ? code39OrItfCheckDigitData : nw7CheckDigitData}
                                                            getOptionLabel={(option) => option?.name || ""}
                                                            getOptionValue={(option) =>
                                                                option?.id?.toString() || ""
                                                            }
                                                            placeholder="Select check digit"
                                                        />
                                                        {/* {(!(barcodeType.id === "0x1U" || barcodeType.id === "0x2U") || Object.keys(barcodeType).length === 0) && (
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={(barcodeType.id === "0x400U" || barcodeType.id === "0x800U") ? 0 : numberOfFrontSideColumn}
                                                        onChange={(e) => setNumberOfFrontSideColumn(e.target.value)}
                                                    />
                                                )} */}
                                                    </div>
                                                </Row>)}
                                            {(barcodeType.id === "0x400U" || barcodeType.id === "0x800U") && (
                                                <Row className="mb-3">

                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-2 "
                                                        style={{ fontSize: ".9rem" }}
                                                    >
                                                        Set option:
                                                    </label>
                                                    <div className="col-md-10">
                                                        <Select
                                                            value={option}
                                                            onChange={(selectedValue) => setOption(selectedValue)}
                                                            options={barcodeType.id === "0x400U" ? upcaOptionData : upceOptionData}
                                                            getOptionLabel={(option) => option?.name || ""}
                                                            getOptionValue={(option) =>
                                                                option?.id?.toString() || ""
                                                            }
                                                        />
                                                        {/* {(!(barcodeType.id === "0x400U" || barcodeType.id === "0x800U") || Object.keys(barcodeType).length === 0) && (
                                                    <input
                                                        type="number"
                                                        className="form-control"

                                                        // value={}
                                                        onChange={(e) => setNumberOfFrontSideColumn(e.target.value)}
                                                    />
                                                )} */}

                                                    </div>
                                                </Row>)}
                                            <Row className="mb-3">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-6 "
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Set Barcode reading area :-
                                                </label>
                                            </Row>
                                            {/* <Row className="mb-3">

                                        <label
                                            htmlFor="example-text-input"
                                            className="col-md-2 "
                                            style={{ fontSize: ".9rem" }}
                                        >
                                            Top :
                                        </label>
                                        <div className="col-md-2">
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={numberOfFrontSideColumn}
                                                onChange={(e) =>
                                                    setNumberOfFrontSideColumn(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <p>in mm</p>
                                        </div>
                                        <label
                                            htmlFor="example-text-input"
                                            className="col-md-2 "
                                            style={{ fontSize: ".9rem" }}
                                        >
                                            Bottom :
                                        </label>
                                        <div className="col-md-2">
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={numberOfFrontSideColumn}
                                                onChange={(e) =>
                                                    setNumberOfFrontSideColumn(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <p>in mm</p>
                                        </div>

                                    </Row> */}
                                            <Row className="mb-3 align-items-center">
                                                <label
                                                    htmlFor="top-input"
                                                    className="col-md-2 col-form-label"
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Top:
                                                </label>
                                                <div className="col-md-2">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="top-input"
                                                        value={barcodeTopPos}
                                                        onChange={(e) => setBarcodeTopPos(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <p className="m-0" style={{ fontSize: ".9rem" }}>in mm</p>
                                                </div>
                                                <label
                                                    htmlFor="bottom-input"
                                                    className="col-md-2 col-form-label"
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Bottom:
                                                </label>
                                                <div className="col-md-2">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="bottom-input"
                                                        value={barcodeBottomPos}
                                                        onChange={(e) => setBarcodeBottomPos(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <p className="m-0" style={{ fontSize: ".9rem" }}>in mm</p>
                                                </div>
                                            </Row>

                                            <Row className="mb-3 align-items-center">
                                                <label
                                                    htmlFor="top-input"
                                                    className="col-md-2 col-form-label"
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Left:
                                                </label>
                                                <div className="col-md-2">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="top-input"
                                                        value={barcodeLeftPos}
                                                        onChange={(e) => setBarcodeLeftPos(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <p className="m-0" style={{ fontSize: ".9rem" }}>in mm</p>
                                                </div>
                                                <label
                                                    htmlFor="bottom-input"
                                                    className="col-md-2 col-form-label"
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Right:
                                                </label>
                                                <div className="col-md-2">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="bottom-input"
                                                        value={barcodeRightPos}
                                                        onChange={(e) => setBarcodeRightPos(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <p className="m-0" style={{ fontSize: ".9rem" }}>in mm</p>
                                                </div>
                                            </Row>
                                        </>


                                    </Tab.Pane>
                                    <Tab.Pane eventKey="image">
                                        <Form>
                                            <Row className="mb-3">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-3 "
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Color Types :
                                                </label>
                                                <div className="col-md-9">
                                                    <Select
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
                                                    />

                                                </div>
                                            </Row>
                                            <Row className="mb-3">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-3 "
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Encoding Option :
                                                </label>
                                                <div className="col-md-9">
                                                    <Select
                                                        value={encoding}
                                                        onChange={(selectedValue) =>
                                                            setEncoding(selectedValue)
                                                        }
                                                        options={encodingOptionData}
                                                        getOptionLabel={(option) => option?.name || ""}
                                                        getOptionValue={(option) =>
                                                            option?.id?.toString() || ""
                                                        }
                                                        placeholder="Select an encoding option..."
                                                    />

                                                </div>
                                            </Row>
                                            <Row className="mb-3">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-3 "
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Rotation :
                                                </label>
                                                <div className="col-md-9">
                                                    <Select
                                                        value={rotation}
                                                        onChange={(selectedValue) =>
                                                            setRotation(selectedValue)
                                                        }
                                                        options={rotationOptionData}
                                                        getOptionLabel={(option) => option?.name || ""}
                                                        getOptionValue={(option) =>
                                                            option?.id?.toString() || ""
                                                        }
                                                        placeholder="Select rotation option..."
                                                    />

                                                </div>
                                            </Row>
                                            <Row className="mb-3">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-3 "
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Resolution :
                                                </label>
                                                <div className="col-md-9">
                                                    <Select
                                                        value={resolution}
                                                        onChange={(selectedValue) =>
                                                            setResolution(selectedValue)
                                                        }
                                                        options={resolutionOptionData}
                                                        getOptionLabel={(option) => option?.name || ""}
                                                        getOptionValue={(option) =>
                                                            option?.id?.toString() || ""
                                                        }
                                                        placeholder="Select rotation option..."
                                                    />

                                                </div>
                                            </Row>
                                            <Row className="mb-3">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-3 "
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Scanning Side :
                                                </label>
                                                <div className="col-md-9">
                                                    <Select
                                                        value={scannningSide}
                                                        onChange={(selectedValue) =>
                                                            setScanningSide(selectedValue)
                                                        }
                                                        options={scanningSideData}
                                                        getOptionLabel={(option) => option?.name || ""}
                                                        getOptionValue={(option) =>
                                                            option?.id?.toString() || ""
                                                        }
                                                        placeholder="Select rotation option..."
                                                    />
                                                </div>
                                            </Row>
                                        </Form>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>}

                    {(selectedUI === "DUPLEX" && activeTab === "duplex" && selectedUI !== "") &&
                        <Tab.Container
                            activeKey={activeKey}
                            onSelect={(k) => setActiveKey(k)}
                        >
                            <Row>
                                <Col sm={12}>
                                    {/* Adjusted column span to full width if needed */}
                                    <Nav
                                        variant="pills"
                                        className="flex-row justify-content-center"
                                    >
                                        <Nav.Item>
                                            <Nav.Link eventKey="general">General</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="barcode">Barcode</Nav.Link>
                                        </Nav.Item>
                                        {imageStatus.id !== "0" && <Nav.Item>
                                            <Nav.Link eventKey="image">Image</Nav.Link>
                                        </Nav.Item>
                                        }
                                    </Nav>
                                </Col>
                                <Col sm={12} className="mt-3">
                                    <Tab.Content>
                                        <Tab.Pane eventKey="general">
                                            <Row className="mb-3">
                                                <Col md={6}>
                                                    <Row>
                                                        <label
                                                            htmlFor="example-text-input"
                                                            className="col-md-4 col-form-label"
                                                            style={{ fontSize: ".9rem" }}
                                                        >
                                                            No. of Rows :
                                                        </label>
                                                        <div className="col-md-6">
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                value={numberOfLines}
                                                                placeholder="Enter rows"
                                                                onChange={(e) => {
                                                                    settoggle((item) => ({ ...item, row: false }));
                                                                    setNumberOfLines(e.target.value)
                                                                }}
                                                                style={{ border: toggle.row ? "1px solid red" : "" }}
                                                            />
                                                            {!numberOfLines && (
                                                                <span
                                                                    style={{ color: "red", display: spanDisplay }}
                                                                >
                                                                    This feild is required
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Row>
                                                </Col>
                                                <Col md={6}>
                                                    <Row>
                                                        <label
                                                            htmlFor="example-text-input"
                                                            className="col-md-6 col-form-label "
                                                            style={{ fontSize: ".9rem" }}
                                                        >
                                                            Number of columns:
                                                        </label>
                                                        <div className="col-md-6">
                                                            <input
                                                                placeholder="Enter columns"
                                                                type="number"
                                                                className="form-control"
                                                                value={numberOfFrontSideColumn}
                                                                onChange={(e) => {
                                                                    settoggle((item) => ({ ...item, col: false }));
                                                                    setNumberOfFrontSideColumn(e.target.value)
                                                                }
                                                                }
                                                                style={{ border: toggle.col ? "1px solid red" : "" }}
                                                            />
                                                            {!numberOfFrontSideColumn && (
                                                                <span
                                                                    style={{ color: "red", display: spanDisplay }}
                                                                >
                                                                    This feild is required
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Row>
                                                </Col>
                                            </Row>

                                        </Tab.Pane>
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>

                    }
                </Modal.Body>
                <Modal.Footer>
                    <div style={{ width: "50%" }}>
                        {/* <div class="mb-4" >
                        <label for="formFile" class="form-label">Upload OMR Image</label>
                        <input class="form-control" type="file" id="formFile" onChange={handleImageUpload} accept="image/*" />
                    </div> */}
                        <div>
                            {/* {imageFile?.name}  */}
                            {/* {!imageFile && <Button onClick={imageModalHandler}>Select Image</Button>}

                            {imageFile &&
                                <div >
                                    <Button variant='info' onClick={imageModalHandler}>Choose another</Button>
                                    <img src={image} alt="Fetched Thumbnail" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                </div>
                            } */}

                            <div>
                                {selectedUI && (
                                    !imageFile ? (
                                        <Button onClick={imageModalHandler}>Select Image</Button>
                                    ) : (
                                        <div>
                                            <Button variant='info' onClick={imageModalHandler}>Choose another</Button>
                                            <img src={image} alt="Fetched Thumbnail" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                        </div>
                                    )
                                )}
                            </div>

                        </div>
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
                        Create Template
                    </Button>
                </Modal.Footer>
            </Modal >
            <Modal
                show={imageModal}
                // onHide={props.onHide}
                size="lg"
                aria-labelledby="modal-custom-navbar"
                centered
                dialogClassName="modal-50w"
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title id="modal-custom-navbar">Select Image</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: '65dvh' }} >
                    {/* <Row>
                        <div class="mb-4" >
                            <label for="formFile" class="form-label">Upload OMR Image</label>
                            <input class="form-control" type="file" id="formFile" onChange={handleImageUpload} accept="image/*" />
                        </div>
                    </Row>
                    <Row>

                        <ImageSelection />
                    </Row> */}

                    <div className="container mt-4">
                        <style jsx>{`
                .upload-box {
                    cursor: pointer;
                    background-color: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 10px;
                    padding: 20px;
                    text-align: center;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .upload-box:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                }
                .upload-box h1 {
                    font-size: 1.5rem;
                    color: #333;
                }
            `}</style>
                        <Row>
                            <Col lg={6} md={6} className="mb-4">
                                <div onClick={systemHandler} className="upload-box p-4 text-center border rounded">
                                    <h1 className="fs-3 text-dark">Upload From System</h1>
                                    <label htmlFor="formFile" className="form-label sr-only">Upload OMR Image</label>
                                    <input className="form-control sr-only" type="file" id="formFile" onChange={handleImageUpload} accept="image/*" />
                                </div>
                            </Col>
                            <Col lg={6} md={6} className="mb-4">
                                <div onClick={scannerHandler} className="upload-box p-4 text-center border rounded">
                                    <h1>Upload From Scanner</h1>
                                </div>
                            </Col>
                        </Row>

                    </div>
                    <Row className="d-flex justify-content-center mt-4">
                        {image && <img src={image} alt="Scanned" width={500} height={400} />}
                        {!image && <p>Please select the image</p>}
                    </Row>


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={() => setImageModal(false)}>
                        Close
                    </Button>
                    <Button variant="success"
                        onClick={saveHandler}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default TemplateModal;