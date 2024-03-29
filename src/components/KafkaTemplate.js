import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Table, Button } from "reactstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const KafkaTemplate=()=>{
    const [templates,setTemplates]=useState([]);
    const {role}=useParams();
    const router=useNavigate();
    useEffect(()=>{
        document.title="Templates"
    },[])

    useEffect(()=>{
        fetchTemplates();
    },[]);

    const fetchTemplates =async()=>{
        try{
            const response=await axios.get('http://localhost:8080/api/templates');
            setTemplates(response.data);
            console.log("templates:",response.data);

        }catch(error){
            console.error("Error fetching templates:",error.message);
        }
    };

    const handleDelete = async(templateId)=>{
        try{
            const response=await axios.delete(`http://localhost:8080/api/templates/${templateId}`);
            fetchTemplates();
        }catch(error){
            console.error("Error:",error.message);
            alert("Something went wrong");
        }

    };
    return(
        <div style={{ marginLeft: '0.8rem' }}>
        <Header head={'Templates'} />
        <Table striped bordered className="mt-3">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Servers</th>
                    <th>Topic</th>
                    <th>Message Template</th>
                    <th style={{width:"275px"}}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {templates.map(template=>(
                    <tr key={template.id}>
                        <td>{templates.indexOf(template)+1}</td>
                        <td>{template.bootstrapServers}</td>
                        <td>{template.topic}</td>
                        <td>{template.messageTemplate}</td>
                        <td>
                      {role === 'admin' && <div>
                        <div>
                            <Button color="info" outline className="w-50" onClick={()=>{
                                router(`/update_template/${template.id}`)
                            }}>Edit</Button>
                        </div>
                        <div>
                            <Button color="danger" outline className='w-50 mt-1' onClick={()=>handleDelete(template.id)}>Delete</Button>
                        </div>
                      </div> 
                    }
                        <Button color="success" outline className="mt-1 w-50" onClick={() => {
                               router(`/send_message/${template.id}`,{state:{role:role}})
                        }}> Send Message </Button> 
                        
                    </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        <div>
        {role === 'admin' && <Button color='secondary' outline onClick={()=>{
                router(`/add_template`)
            }}>Add Template</Button>}
        </div>

        </div>
    );

}
export default KafkaTemplate;