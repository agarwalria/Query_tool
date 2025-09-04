import axios from "axios";
import React, { Fragment, useState } from "react";
import {useNavigate} from "react-router-dom";
import { Button, Container, Form, FormGroup, Input } from "reactstrap";

const DataSource=()=>{
    const [formData,setFormData]=useState({
        type:'',
        port:'',
        hostname:'',
        db_name:'',
        username:'',
        password:''
    });
    const router=useNavigate();
    // const [visible,setVisible]=useState(false);
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();

        try{
            const response = await axios.post('http://localhost:9090/api/db_connection/connect', formData, {
                headers: {
                'Content-Type': 'application/json',
                },
            }).then((data)=>{console.log(data)});
     
        }catch(error){
            alert('Error connecting to the database:', error);
        }
        finally{
            router("/execute_query");
        }
       
    };
    
    return (
        <Fragment>
             <h1 className="text-center my-3">Add Connection</h1>
        <Form className="py-3 px-md-5">
        <FormGroup>
                <label>Type of database</label>
                <Input type="text"
                placeholder="type of database"
                name="type"
                value={formData.type}
                onChange={handleChange}/>
            </FormGroup>

            <FormGroup>
                <label>Port</label>
                <Input type="text"
                placeholder="[port number]"
                name="port"
                value={formData.port}
                onChange={handleChange}/>
            </FormGroup>

            <FormGroup>
                <label>Hostname</label>
                <Input type="text"
                placeholder="Hostname"
                name="hostname"
                value={formData.hostname}
                onChange={handleChange}/>
            </FormGroup>

            <FormGroup>
                <label>Database name</label>
                <Input type="text"
                placeholder="Name of database"
                name="db_name"
                value={formData.db_name}
                onChange={handleChange}/>
            </FormGroup>

            <FormGroup>
                <label>Username</label>
                <Input type="text"
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}/>
            </FormGroup>
            
            <FormGroup>
                <label>Password</label>
                <Input 
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}/>
            </FormGroup>
            
            <div className="text-center">
                <Button color="primary" onClick={handleSubmit}>Submit</Button>
                {/* {setVisible && <ExecuteQuery/>} */}
            </div>
            
        </Form>
        </Fragment>
    );
};
export default DataSource;