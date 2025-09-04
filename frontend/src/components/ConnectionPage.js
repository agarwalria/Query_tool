import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button,Modal,ModalHeader,ModalBody,ModalFooter,Form,FormGroup,Label,Input,Row,Col} from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';

const ConnectionPage = () => { 
  const {role}=useParams();
  const [connections, setConnections] = useState([]);            //store the already exist connections fetched from db 
  const [newConnectionModalOpen, setNewConnectionModalOpen] = useState(false); 
  const [newConnection, setNewConnection] = useState({
    type: 'mysql',
    port: '',
    hostname: '',
    db_name: '',
    username: '',
    password: '',
  });

  useEffect(() => {
    fetch('http://localhost:9090/api/db_connection')
      .then(response => response.json())
      .then(data => setConnections(data))
      .catch(error => console.error('Error fetching the connection details:', error));
  },[]);

  const router=useNavigate();

  const handleConnect = async(connection) => {
    try{
        const response = await axios.post('http://localhost:9090/api/db_connection/connect',connection,{
              headers: {
                'Content-Type': 'application/json',
              },
            });
      
          // Check if the request was successful
          if (response.status === 200) {
            const connectionStatus = response.data;
            console.log('Connection status:', connectionStatus);
            router(`/query/${role}/${connectionStatus.type}/${connectionStatus.id}`);
            // alert('Connected successfully!');
          }
      
         // Handle unexpected status codes
         else {
            alert('Error connecting to the database. Unexpected status:', response.status);
          }
    }catch(error){
        alert('Something went wrong:', error.message);
    }
    // finally{
    //     router("/sql_query");
    // }
  };

  const handleNewConnection = async () => {
    try {
      const response = await axios.post('http://localhost:9090/api/db_connection',newConnection,{
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
      // Check if the request was successful (status code 2xx)
      if (response.status >= 200 && response.status < 300) {
        const addedConnection = response.data;
        console.log('New connection added:', addedConnection);
        setNewConnectionModalOpen(false);
  
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
        <Header head={'Database Connections'} />
        <div className='mt-3 ms-2'>
        {connections.map((connection) => (
          <Row className='mt-2'>
            <Col xs={5} key={connection.id}>
              {/* <ListGroupItem key={connection.id}> */}
              {connection.type} - {connection.hostname} - {connection.username}-{connection.db_name}
              {/* </ListGroupItem> */}
            </Col>
            <Col xs={3}>
              <Button color="primary" className="ms-3" onClick={() => handleConnect(connection)}>
                Connect
              </Button>
            </Col>
          </Row>
        ))}
        </div>
        {role === 'admin' && 
        <Button color="success" className='mt-3' onClick={() => setNewConnectionModalOpen(true)}>
        Add New Connection
        </Button>
        }

        {/* Modal for adding a new connection */}
        <Modal isOpen={newConnectionModalOpen} toggle={() => setNewConnectionModalOpen(false)}>
        <ModalHeader toggle={() => setNewConnectionModalOpen(false)}>Add New Connection</ModalHeader>
        <ModalBody>
            <Form>
            <FormGroup>
                <Label for="connectionType">Type:</Label>
                <Input
                type="select"
                id="connectionType"
                value={newConnection.type}
                onChange={(e) => setNewConnection({ ...newConnection, type: e.target.value })}
                >
                <option value="mysql">MySQL</option>
                <option value="mongodb">MongoDB</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="connectionPort">Port:</Label>
                <Input
                type="text"
                id="connectionPort"
                value={newConnection.port}
                onChange={(e) => setNewConnection({ ...newConnection, port: e.target.value })}
                />
            </FormGroup>
            <FormGroup>
                <Label for="connectionHostname">Hostname:</Label>
                <Input
                type="text"
                id="connectionHostname"
                value={newConnection.hostname}
                onChange={(e) => setNewConnection({ ...newConnection, hostname: e.target.value })}
                />
            </FormGroup>
            <FormGroup>
                <Label for="connectionDBName">Database Name:</Label>
                <Input
                type="text"
                id="connectionDBName"
                value={newConnection.db_name}
                onChange={(e) => setNewConnection({ ...newConnection, db_name: e.target.value })}
                />
            </FormGroup>
            <FormGroup>
                <Label for="connectionUsername">Username:</Label>
                <Input
                type="text"
                id="connectionUsername"
                value={newConnection.username}
                onChange={(e) => setNewConnection({ ...newConnection, username: e.target.value })}
                />
            </FormGroup>
            <FormGroup>
                <Label for="connectionPassword">Password:</Label>
                <Input
                type="password"
                id="connectionPassword"
                value={newConnection.password}
                onChange={(e) => setNewConnection({ ...newConnection, password: e.target.value })}
                />
            </FormGroup>
            {/* Add other necessary input fields for connection details */}
            </Form>
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={handleNewConnection}>
            Save Connection
            </Button>
            <Button color="secondary" onClick={() => setNewConnectionModalOpen(false)}>
            Cancel
            </Button>
        </ModalFooter>
        </Modal>
    </div>
  );
};

export default ConnectionPage;
