

// core components
import Header from "components/Headers/Header.js";
import NormalHeader from "components/Headers/NormalHeader";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

import {
    Badge,
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Pagination,
    PaginationItem,
    PaginationLink,
    Progress,
    Table,
    Container,
    Row,
    UncontrolledTooltip,
    Button,
    Col,
} from "reactstrap";
import { getAssignedJob } from "helper/job_helper";
import { jwtDecode } from 'jwt-decode';
const JobQueue = () => {
    const [allJob, setAllJob] = useState([]);
    useEffect(() => {
        const token= localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const UserId = decoded.UserId
        console.log(decoded.UserId)
        const fetchAssignedJobs = async () => {
            const response = await getAssignedJob(UserId)
        }
        fetchAssignedJobs();
    }, [])
    useEffect(() => {
       const token= localStorage.getItem("token");
        const decoded = jwtDecode(token);
        console.log(decoded.UserId)
    }, [])
    const ALLJOBS = allJob.map((item, index) => {
        let assignuser = "Not Assigned"
        if (item.assignUser !== "string" || item.assignUser !== "") {
            assignuser = item.assignUser
        }
        return <tr key={index}>
            <td>{index + 1}</td>
            <td>{`Job ${index + 1}`}</td>
            <td>{item.templateName}</td>
            <td>{assignuser}</td>
            <td>{item.imageType ? item.imageType : "Disabled"}</td>
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
                        <DropdownItem >Assign</DropdownItem>
                        <DropdownItem  >Edit</DropdownItem>
                        <DropdownItem >Delete</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </td>
        </tr>
    })

    return (
        <>
            <NormalHeader />

            <Container className="mt--7" fluid >

                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <div className="d-flex justify-content-between">
                                    <h3 className="mt-2"> Job Queue</h3>
                                </div>
                            </CardHeader>
                            <Table className="align-items-center table-flush mb-5" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Sno.</th>
                                        <th scope="col">Job Name</th>
                                        <th scope="col">Template</th>
                                        <th scope="col">Operator </th>
                                        <th scope="col">Image</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody style={{ minHeight: "100rem" }}>

                                    {ALLJOBS}
                                </tbody>
                            </Table>
                        </Card>
                    </div>
                </Row>
            </Container>


            {/* <div className=" head">
                <div className="table-main">
                    <table className=" ">
                        <thead>
                            <tr className="JobQueueTableTr">
                                <th className="JobQueueTableTh">Region</th>
                                <th className="JobQueueTableTh">District</th>
                                <th>School</th>
                                <th>Candidate</th>
                                {[...Array(40).keys()].map(i => (
                                    <th key={i}>Q{i + 1}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((item, index) => (
                                <tr className="JobQueueTableTr" key={index}>
                                    {Object.values(item).map((value, i) => (
                                        <td key={i}>{value}</td>
                                    ))}
                                </tr>
                            ))}

                            {[...Array(20).keys()].map(i => (
                                <tr className="JobQueueTableTr" key={i}>
                                    {[...Array(44).keys()].map(i => (
                                        <td key={i}>  </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="functions mt-2 d-flex justify-content-end">
                    <Button className="" color="success" type="button" onClick={handleStart}>
                        Start
                    </Button>
                    <Button className="" color="warning" type="button" onClick={handleRefresh}>
                        Refresh
                    </Button>
                </div>
            </div> */}
        </>
    );
};

export default JobQueue;


