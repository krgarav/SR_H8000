/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// reactstrap components
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
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import NormalHeader from "components/Headers/NormalHeader";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import Select from "react-select"
import * as url from "../helper/url_helper"
import { toast } from "react-toastify";
import axios from "axios";
import { getUserRoles } from "helper/userManagment_helper";
import { createUser } from "helper/userManagment_helper";
import { fetchAllUsers } from "helper/userManagment_helper";
import { updateUser } from "helper/userManagment_helper";
import { removeUser } from "helper/userManagment_helper";

const UserManagment = () => {

    const [modalShow, setModalShow] = useState(false);
    const [createModalShow, setCreateModalShow] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectecdRole, setSelectedRole] = useState({});
    const [roles, setRoles] = useState([]);
    const [password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [spanDisplay, setSpanDisplay] = useState("none");
    const [allUsers, setAllUsers] = useState([]);
    const [id, setId] = useState("");



    const fetchRoles = async () => {
        try {
            const data = await getUserRoles();
            console.log(data)
            if (data?.success) {
                console.log(roles.result)
                setRoles(data?.result);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }

    }
    const fetchUsers = async () => {
        try {
            const data = await fetchAllUsers();
            console.log(data)
            if (data?.success) {
                console.log(roles.result)
                setAllUsers(data?.result);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
    useEffect(() => {
        fetchRoles();
        fetchUsers();

    }, []);
    const handleSelectRole = selectedValue => {
        // console.log(selectedValue);
        setSelectedRole(selectedValue);
    }

    const handleUpdate = async () => {
        if (!name || !email || !phoneNumber || !selectecdRole) {
            setSpanDisplay("inline")

        }
        else {
            try {
                // const { data } = await axios.post("https://rb5xhrfq-5289.inc1.devtunnels.ms/UserRegistration", { name, email, phoneNumber, role, password, ConfirmPassword });
                let role = selectecdRole.roleName;
                const data = await updateUser({ id, name, email, phoneNumber, role })
                if (data?.success) {
                    console.log(data.message);
                    toast.success(data?.message);
                    setName("");
                    setEmail("")
                    setPhoneNumber("")
                    setSelectedRole("")
                    setCreateModalShow(false)
                    fetchAllUsers();
                }
                else {
                    toast.error(data?.message);
                }
            } catch (error) {
                toast.error("Something went wrong");
            }
        }
    };


    const handleCreate = async () => {
        if (!name || !email || !phoneNumber || !selectecdRole || !password || !ConfirmPassword) {
            setSpanDisplay("inline")

        }
        else {
            if (password !== ConfirmPassword) {
                toast.error("Passwod did not match");
            }

            try {
                // const { data } = await axios.post("https://rb5xhrfq-5289.inc1.devtunnels.ms/UserRegistration", { name, email, phoneNumber, role, password, ConfirmPassword });
                let userRole = selectecdRole.roleName
                const data = await createUser({ name, email, phoneNumber, userRole, password, ConfirmPassword })
                if (data?.success) {
                    console.log(data.message);
                    toast.success(data?.message);
                    setName("");
                    setEmail("")
                    setPhoneNumber("")
                    setSelectedRole("")
                    setPassword("")
                    setConfirmPassword("")
                    setCreateModalShow(false)
                }
                else {
                    console.log()
                    toast.error(data?.message);
                }
            } catch (error) {
                toast.error("Something went wrong");
            }
        }
    };

    const deleteUser = async (d) => {
        try {

            const data = await removeUser(d.id)
            if (data?.success) {
                toast.success(data.message);
                fetchUsers();

            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    }



    const handleRowClick = d => {
        // e.preventDefault();
        console.log(d)
        setName(d.name);
        setEmail(d.email);
        setPhoneNumber(d.phoneNumber);
        setSelectedRole(d?.userRoleList[0]);
        setModalShow(true);
        setId(d.id);
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
                                    <h3 className="mt-2">All Users</h3>
                                    <Button className="" color="primary" type="button" onClick={() => setCreateModalShow(true)}>
                                        Create User
                                    </Button>
                                </div>
                            </CardHeader>
                            <Table className="align-items-center table-flush mb-5" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Sno.</th>
                                        <th scope="col">Username</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Phone Number</th>
                                        <th scope="col">Role</th>
                                        <th scope="col" />
                                    </tr>
                                </thead>
                                <tbody style={{ minHeight: "100rem" }}>
                                    {allUsers?.map((d, i) => (
                                        <>
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{d.name}</td>
                                                <td>
                                                    {d.email}
                                                </td>
                                                <td>
                                                    {d.phoneNumber}
                                                </td>
                                                <td>
                                                    {d?.userRoleList[0]?.roleName}
                                                </td>
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
                                                            <DropdownItem
                                                                href="#pablo"
                                                                onClick={() => handleRowClick(d)}
                                                            >
                                                                Edit
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                href="#pablo"
                                                                onClick={(e) => deleteUser(d)}
                                                            >
                                                                Delete
                                                            </DropdownItem>

                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </td>
                                            </tr>
                                        </>
                                    ))}



                                </tbody>
                            </Table>
                            {/* <CardFooter className=" py-4">
                                <nav aria-label="...">
                                    <Pagination
                                        className="pagination justify-content-end mb-0"
                                        listClassName="justify-content-end mb-0"
                                    >
                                        <PaginationItem className="disabled">
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                                tabIndex="-1"
                                            >
                                                <i className="fas fa-angle-left" />
                                                <span className="sr-only">Previous</span>
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem className="active">
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                1
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                2 <span className="sr-only">(current)</span>
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                3
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                <i className="fas fa-angle-right" />
                                                <span className="sr-only">Next</span>
                                            </PaginationLink>
                                        </PaginationItem>
                                    </Pagination>
                                </nav>
                            </CardFooter> */}
                        </Card>
                    </div>
                </Row>

            </Container>


            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit User
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Name
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter User Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)} />
                            {!name && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                        </div>
                    </Row>
                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Email
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter Email Id"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                            {!email && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                        </div>
                    </Row>
                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Phone Number
                        </label>
                        <div className="col-md-10">
                            <input type="Number"
                                className='form-control'
                                placeholder="Enter Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)} />
                            {!phoneNumber && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                        </div>
                    </Row>



                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Role
                        </label>
                        <div className="col-md-10">

                            <Select
                                value={selectecdRole}
                                onChange={handleSelectRole}
                                options={roles}
                                getOptionLabel={option => option?.roleName || ""}
                                getOptionValue={option => option?.id?.toString() || ""}
                            />
                            {!selectecdRole && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                        </div>

                    </Row>



                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => setModalShow(false)} className="waves-effect waves-light">Close</Button>{" "}
                    <Button type="button" color="success" onClick={handleUpdate} className="waves-effect waves-light">Update</Button>{" "}

                </Modal.Footer>
            </Modal>

            <Modal
                show={createModalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Create User
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Name
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter User Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)} />
                            {!name && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                        </div>
                    </Row>
                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Email
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter Email Id"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                            {!email && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                        </div>
                    </Row>
                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Phone Number
                        </label>
                        <div className="col-md-10">
                            <input type="Number"
                                className='form-control'
                                placeholder="Enter Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)} />
                            {!phoneNumber && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                        </div>
                    </Row>



                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Role
                        </label>
                        <div className="col-md-10">

                            <Select
                                value={selectecdRole}
                                onChange={handleSelectRole}
                                options={roles}
                                getOptionLabel={option => option?.roleName || ""}
                                getOptionValue={option => option?.id?.toString() || ""}
                            />
                            {!selectecdRole && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                        </div>

                    </Row>

                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Password
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                            {!password && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                        </div>
                    </Row>

                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Confirm Password
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter Password"
                                value={ConfirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} />
                            {!ConfirmPassword && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                        </div>
                    </Row>



                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => setCreateModalShow(false)} className="waves-effect waves-light">Close</Button>{" "}
                    <Button type="button" color="success" onClick={handleCreate} className="waves-effect waves-light">Create</Button>{" "}

                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UserManagment;
