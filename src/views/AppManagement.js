import React, { useContext, useEffect, useState } from "react";
import {
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
  Form,
  FormGroup,
  Label,
  Input,
  CardBody,
} from "reactstrap";
import SmallHeader from "components/Headers/SmallHeader";
import DataContext from "store/DataContext";
import { useNavigate } from "react-router-dom";
import NormalHeader from "components/Headers/NormalHeader";
import axios from "axios";
import { toast } from "react-toastify";
import getBaseUrl from "services/BackendApi";
const AppManagement = () => {
  const [email, setEmail] = useState("");
  const [baseURL, setBaseURL] = useState("Loading...");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dataCtx = useContext(DataContext);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUrl = async () => {
      const URL = await getBaseUrl();
      setBaseURL(URL);
    };
    fetchUrl()
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would typically handle form submission, e.g., call an API
    if (email === "") {
      setError("Entered IP cannot be blank.");
    } else {
      //   console.log(email);
      const res = window.confirm(
        `Are You sure you want to connect to ${email} IP`
      );
      if (!res) {
        return;
      }
      const Obj = {
        backendUrl: email,
      };
      const res2 = axios.post("http://localhost/api/config", Obj);
      if (res2) {
        toast.success("Changed Ip");
      }
      // localStorage.setItem("backendIP", email); // Save the IP to localStorage
      // sessionStorage.setItem("protocol",protocol)
      setTimeout(() => {
        window.location.reload(); // Reload the page
      }, 400);
      //   dataCtx.setBackendIP(email);
      //   navigate("/auth/login");
      //   setSuccess("Login successful!");
    }
  };
  const applicationId = localStorage.getItem("backendIP");
  return (
    <>
      <NormalHeader />
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between">
                  <h3 className="mt-2">Set Application IP</h3>
                  <Button
                    color="primary"
                    type="button"
                    // onClick={() => setModalShow(true)}
                  >
                    Add Job
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <Row className="justify-content-center">
                  <Col md={10} lg={8}>
                    <Form onSubmit={handleSubmit} className="w-100">
                      <FormGroup>
                        <Label for="email">Enter Application IP</Label>
                        <Input
                          type="text"
                          name="email"
                          id="email"
                          placeholder="Enter Application IP"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </FormGroup>
                      <Button color="primary" type="submit" block>
                        Set App IP
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <Row className="justify-content-center mb-3">
                  <Col xs="auto">
                    {" "}
                    {/* Use xs="auto" to size the column based on its content */}
                    <label className="text-center d-block">
                      Current App IP ={baseURL}
                      {/* {applicationId ? applicationId : "localhost"} */}
                    </label>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AppManagement;
