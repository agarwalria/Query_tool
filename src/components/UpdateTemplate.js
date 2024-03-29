import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";

const UpdateTemplate=()=>{
    useEffect(() => {
        document.title = "Update Page";
      }, []);

      const router=useNavigate();
      const {templateId}=useParams();
      const [template,setTemplate]=useState({
        bootstrapServers:'',
        topic:'',
        message:''
      })

      useEffect(()=>{
        fetchTemplate();
      },[]);

      const fetchTemplate=async()=>{
        try{
            const response=await axios.get(`http://localhost:8080/api/templates/${templateId}`);
            setTemplate(response.data);
        }catch(error){
            console.error("Error:",error.message);
            alert("Something went wrong");
        }
      }

      const handleUpdate=async()=>{
        try{
            const response=await axios.put(`http://localhost:8080/api/templates/${templateId}`,template,{
                headers:{
                    'Content-Type':'application/json',
                },
            });
            console.log("Template Updated Successfully:",response.data);
            router(`/kafka_template/admin`)
        }catch(error){
            console.error("Error:",error.message);
        }
      }

      return(
        <div style={{ marginLeft: '0.8rem' }}>
            <Header head={'Update Template'}/>
            <Button className="mt-3" onClick={()=>{
        router(`/kafka_template/admin`)
      }}>Back</Button>
            <Form className='p-5'>
                <FormGroup>
                    <Label>Servers</Label>
                    <Input
                    type="text"
                    id="bootstrapServers"
                    value={template.bootstrapServers}
                    onChange={(e)=>setTemplate({...template,bootstrapServers:e.target.value})}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Topic</Label>
                    <Input
                    type="text"
                    id="topic"
                    value={template.topic}
                    onChange={(e)=>setTemplate({...template,topic:e.target.value})}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Message Template</Label>
                    <Input
                    type="text"
                    id="messageTemplate"
                    value={template.messageTemplate}
                    onChange={(e)=>setTemplate({...template,messageTemplate:e.target.value})}
                    />
                </FormGroup>
                <Button color="primary" className="mt-3" onClick={handleUpdate}>
                    Update
                </Button>
            </Form>

        </div>
      );
}
export default UpdateTemplate;