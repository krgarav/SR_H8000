import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import DataContext from "store/DataContext";

const MainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dataCtx = useContext(DataContext);
  const navigate = useNavigate();
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
      dataCtx.setBackendIP(email);
      navigate("/auth/login");
      setSuccess("Login successful!");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Form
        onSubmit={handleSubmit}
        className="w-100"
        style={{ maxWidth: "400px" }}
      >
        <h2 className="text-center">IP Selector</h2>
        {/* {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>} */}
        <FormGroup>
          <Label for="email">Enter Backend IP</Label>
          <Input
            type="texy"
            name="email"
            id="email"
            placeholder="Enter Backend IP"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <Button color="primary" type="submit" block>
          Set URL
        </Button>
      </Form>
    </Container>
  );
};

export default MainLogin;
