import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, Alert, Modal,ModalHeader,ModalBody,ModalFooter,Card,CardBody } from 'reactstrap';
import axios from 'axios';

const Login = () => {

  useEffect(()=>{
    document.title="Login"
},[])

    const [user,setUser] = useState({
        username :"",
        password:"",
        role:"admin"
    });
    const [userLogin,setUserLogin] = useState({
        username :"",
        password:"",
        role:"admin"
    });

    const [selectedOption, setSelectedOption] = useState("data-query");
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('viewer'); // Default role is viewer
  const router = useNavigate();
  const [error,setError]=useState('');
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleLogin = async() => {
    if (!userLogin.username || !userLogin.password) {
        setError('Username and password are required.');
        return;
      }
      try {
        // Replace the following with your actual authentication logic
        const response = await axios.post('http://localhost:9090/api/login',userLogin,{
            headers: {
                'Content-Type': 'application/json',
            },
          }
        );
    
        if (response.status === 200) {
          // Authentication successful, redirect to connection page
          if (selectedOption === "data-query") {
            router(`/connection/${userLogin.role}`);
          } else if (selectedOption === "message-producer") {
            router(`/kafka_template/${userLogin.role}`);
          }
        } else {
          setError('Invalid username or password. Please try again.');
        }
      } catch (error) {
        console.error('Error during authentication:', error);
        setError('An unexpected error occurred. Please try again.');
      }
  };

  const handleSignup=async()=>{
    try {
        const response = await axios.post('http://localhost:9090/api/signup',user,{
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
        // Check if the request was successful (status code 2xx)
        if (response.status >= 200 && response.status < 300) {
          const addedConnection = response.data;
          console.log('New connection added:', addedConnection);
          setIsSignupModalOpen(false);
    
          // Handle unexpected status codes
        } else {
          alert('Error adding new connection. Unexpected status:', response.status);
        }
      } catch (error) {
        alert('Something went wrong:', error.message);
      }
  };



  return (
    <div style={{ marginLeft: '0.8rem' }}>
    <Card className="my-2 bg-dark text-white">
      <CardBody className="d-flex justify-content-between align-items-center">
        <h2 className="m-3 text-center">Login Page</h2>
      </CardBody>
    </Card>
    {error && <Alert color="danger">{error}</Alert>}
      <Form className='mt-3'>
        <FormGroup>
          <Label for="username">Username:</Label>
          <Input type="text" id="username" value={userLogin.username}  onChange={(e) => setUserLogin({ ...userLogin, username: e.target.value })} />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password:</Label>
          <Input type="password" id="password" value={userLogin.password} onChange={(e) => setUserLogin({ ...userLogin, password: e.target.value })} />
        </FormGroup>
        <FormGroup>
          <Label for="role">Role:</Label>
          <Input type="select" id="role" value={userLogin.role} onChange={(e) => {
            // console.log(e.target.value);
                setUserLogin({ ...userLogin, role: e.target.value })
          }}>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </Input>
        </FormGroup>

        <FormGroup>
          <Label>
            <Input
              type="radio"
              id="dataQueryRadio"
              value="data-query"
              checked={selectedOption === "data-query"}
              onChange={() => setSelectedOption("data-query")}
            />
            Data Query
          </Label>
        </FormGroup>

        <FormGroup>
          <Label>
            <Input
              type="radio"
              id="messageProducerRadio"
              value="message-producer"
              checked={selectedOption === "message-producer"}
              onChange={() => setSelectedOption("message-producer")}
            />
            Message Producer
          </Label>
        </FormGroup>

        <Button color="success" onClick={handleLogin}>
          Login
        </Button>
        <Button color="primary" className="ms-3" onClick={()=>setIsSignupModalOpen(true)}>
          Sign Up
        </Button>
      </Form>
      <Modal isOpen={isSignupModalOpen} toggle={() => setIsSignupModalOpen(false)}>
        <ModalHeader toggle={() => setIsSignupModalOpen(false)}>Sign Up</ModalHeader>
        <ModalBody>
        <Form>
            <FormGroup>
              <Label for="signupUsername">Username</Label>
              <Input type="text" id="signupUsername" placeholder="Enter your new username" onChange={(e) => setUser({ ...user, username: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label for="signupPassword">Password</Label>
              <Input type="password" id="signupPassword" placeholder="Enter your new password" onChange={(e) => setUser({ ...user, password: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label for="signupRole">Role</Label>
              <Input type="select" id="signupRole" onChange={(e) => setUser({ ...user, role: e.target.value })}>
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSignup}>
            Sign Up
          </Button>
          <Button color="secondary" onClick={()=>setIsSignupModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

    </div>
  );
};

export default Login;
