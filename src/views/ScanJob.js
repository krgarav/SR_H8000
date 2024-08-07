import Header from "components/Headers/Header.js";
import NormalHeader from "components/Headers/NormalHeader";
import { Modal } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { fetchProcessData } from "helper/Booklet32Page_helper";
import { toast } from "react-toastify";
import { Button, Card, CardHeader, Container, Row, Table } from "reactstrap";
import { refreshScanner } from "helper/Booklet32Page_helper";
import { scanFiles } from "helper/Booklet32Page_helper";
// import { GridComponent, ColumnsDirective, ColumnDirective, Sort, Inject, Toolbar, Page, Filter, Edit } from '@syncfusion/ej2-react-grids';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Sort,
  Inject,
  Toolbar,
  ExcelExport,
  PdfExport,
  ToolbarItems,
  Page,
  FilterSettingsModel,
  EditSettingsModel,
  Filter,
  Edit,
} from "@syncfusion/ej2-react-grids";

import { fetchAllTemplate } from "helper/TemplateHelper";
// import Select, { components } from "react-select";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import { cancelScan } from "helper/TemplateHelper";

const ScanJob = () => {
  const [count, setCount] = useState(true);
  const [processedData, setProcessedData] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [headData, setHeadData] = useState(["OrderID"]);
  const filterSettings = { type: "Excel" };
  // const toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'ExcelExport', 'CsvExport'];
  const editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
  };
  const [items, setItems] = useState([]);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState();
  const [toolbar, setToolbar] = useState(["ExcelExport", "CsvExport"]);
  const [services, setServices] = useState([
    Sort,
    Toolbar,
    ExcelExport,
    Filter,
  ]);
  const gridRef = useRef();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(location.state === null);
    if (!location.state) {
      navigate("/operator/job-queue", { replace: true });
      return;
    }
    const { templateId } = location?.state;
    if (templateId) {
      setSelectedValue(templateId);
    }
  }, [location]);
  console.log(selectedValue);
  // useEffect(() => {
  //     const interval = setInterval(() => {
  //         setItems(prevItems => {
  //             const nextIndex = prevItems.length;
  //             if (nextIndex < data.length) {
  //                 return [...prevItems, data[nextIndex]];
  //             } else {
  //                 clearInterval(interval);
  //                 return prevItems;
  //             }
  //         });
  //     }, 1000);

  //     return () => clearInterval(interval); // Cleanup on unmount
  // }, [data]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    if (decoded.Role === "Operator") {
      setToolbar([
        "Add",
        "Edit",
        "Delete",
        "Update",
        "Cancel",
        "ExcelExport",
        "CsvExport",
      ]);
      setServices([Sort, Toolbar, ExcelExport, Filter, Edit]);
    } else {
      setToolbar(["ExcelExport", "CsvExport"]);
      setServices([Sort, Toolbar, ExcelExport, Filter]);
    }
  }, []);
  const getScanData = async () => {
    try {
      // Fetch data based on selected value ID
      const data = await fetchProcessData(selectedValue);
      console.log(data);

      // Check if the data fetch was successful
      if (data?.result?.success) {
        // Extract keys from the first item in the data array
        const newDataKeys = Object.keys(data.result.data[0]).map((key) => {
          return key.endsWith(".") ? key.slice(0, -1) : key;
        });

        // Add a serial number to each entry
        let num = 1;
        const updatedData = data.result.data.map((item) => {
          const newItem = {};

          // Iterate over the keys of the item
          for (const key in item) {
            // Check if the key ends with a dot
            const newKey = key.endsWith(".") ? key.slice(0, -1) : key;
            // Assign the value to the new key in newItem
            newItem[newKey] = item[key];
          }

          // Add the Serial No property
          newItem["Serial No"] = num++;
          return newItem;
        });

        // Set headData with the new keys, ensuring "Serial No" is included as a heading
        setHeadData(["Serial No", ...newDataKeys]);

        // Update the data state with the fetched data
        setProcessedData(updatedData);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");

      // Set scanning to false in case of error
      // setScanning(false);
    }
  };
  console.log(scanning);
  useEffect(() => {
    const fetchData = async () => {
      const template = await fetchAllTemplate();
      const optionObject = template?.map((item) => {
        return { id: item.id, value: item.layoutName };
      });
      setTemplateOptions(optionObject);
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (!scanning) return;

    const intervalId = setInterval(() => {
      if (scanning) {
        getScanData();
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [scanning]);

  const intervalCreation = (data) => {
    const interval = setInterval(() => {
      setItems((prevItems) => {
        const nextIndex = prevItems.length;
        if (nextIndex < data.length) {
          return [...prevItems, data[nextIndex]];
        } else {
          clearInterval(interval);
          return prevItems;
        }
      });
    }, 1000);
  };

  const handleStart = async () => {
    if (!selectedValue) {
      alert("Choose Template");
      return;
    }
    if (scanning) {
      setScanning(false);
      return;
    }
    setProcessedData([]);
    setTimeout(async () => {
      setScanning(true);
    }, 6000);
    const response = await scanFiles(selectedValue);
    console.log(response);
    if (!response?.result?.success) {
      toast.error(response?.result?.message);
    } else {
      toast.success(response?.result?.message);
    }
    if (response) {
      setScanning(false);
    }
    if (response === undefined) {
      toast.error("Request Timeout");
    }
  };

  const handleSave = (args) => {
    if (args.data) {
      const updatedData = [...processedData];
      console.log(updatedData);
      const index = updatedData.findIndex(
        (item) => item["Serial No"] == args.data["Serial No"]
      );
      if (index > -1) {
        updatedData[index] = args.data;
        console.log(updatedData);
        setProcessedData(updatedData);
      }
    }
  };

  const handleRefresh = () => {
    try {
      refreshScanner();
    } catch (error) {
      console.log(error);
      toast.error("Error in Refresh");
    }
  };

  const dataBound = () => {
    if (gridRef.current) {
      const grid = gridRef.current;
      const lastIndex = grid.dataSource.length - 1;

      // Ensure data source is not empty
      if (lastIndex >= 0) {
        setTimeout(() => {
          const gridContent = grid?.getContent()?.firstElementChild;
          gridContent.scrollTo({
            top: gridContent.scrollHeight,
            behavior: "smooth",
          });
        }, 500); // Delay to ensure the grid is fully rendered before scrolling
      }
    }
  };
  const handleToolbarClick = (args) => {
    if (args.item.id.includes("excelexport")) {
      gridRef.current.refresh(); // Ensure the grid data is refreshed
      gridRef.current.excelExport();
    }
    if (args.item.id.includes("pdfexport")) {
      gridRef.current.refresh(); // Ensure the grid data is refreshed
      gridRef.current.pdfExport();
    }
    if (args.item.id.includes("csvexport")) {
      gridRef.current.refresh(); // Ensure the grid data is refreshed
      gridRef.current.csvExport();
    }
  };
  const handleStop = async () => {
    try {
      const cancel = await cancelScan();

      setTimeout(() => {
        setScanning(false);
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };
  const columnsDirective = headData.map((item, index) => {
    return (
      <ColumnDirective
        field={item}
        key={index}
        headerText={item}
        width="120"
        textAlign="Center"
      ></ColumnDirective>
    );
  });

  return (
    <>
      <NormalHeader />
      <Container className="mt--7" fluid>
        <br />
        <div className="control-pane">
          <div className="control-section">
            <GridComponent
              ref={gridRef}
              dataBound={dataBound}
              actionComplete={handleSave}
              dataSource={processedData}
              height="350"
              allowSorting={false}
              editSettings={editSettings}
              allowFiltering={false}
              filterSettings={filterSettings}
              toolbar={toolbar}
              toolbarClick={handleToolbarClick}
              allowExcelExport={true}
              allowPdfExport={true}
              allowEditing={false}
            >
              <ColumnsDirective>{columnsDirective}</ColumnsDirective>
              <Inject services={services} />
            </GridComponent>
            <div className="m-2" style={{ float: "right" }}>
              <Button
                className=""
                color={scanning ? "warning" : "success"}
                type="button"
                onClick={handleStart}
              >
                {scanning ? "Stop" : "Start"}
              </Button>
              {/* <Button className="" color="danger" type="button" onClick={handleRefresh} >Refresh</Button> */}
              {scanning && (
                <Button
                  className=""
                  color="danger"
                  type="button"
                  onClick={handleStop}
                >
                  Cancel Scanning
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ScanJob;
