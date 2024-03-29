import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { Form,FormGroup, Input, Label, Button } from "reactstrap";
import axios from "axios";

const SendMessage=()=>{
    useEffect(() => {
        document.title = "Send Message";
      }, []);
    
    const {templateId}=useParams();
    const [template,setTemplate]=useState({
      bootstrapServers:'',
      topic:'',
      message:''
    });
    
    useEffect(()=>{
      fetchTemplate();
    },[]);

    const router=useNavigate();
    const location=useLocation();

    const fetchTemplate=async()=>{
      try{
          const response=await axios.get(`http://localhost:8080/api/templates/${templateId}`);
          setTemplate(response.data);
      }catch(error){
          console.error("Error:",error.message);
          alert("Something went wrong");
      }
    };

    const handleSend=async()=>{
      try{
        const response=await axios.post("http://localhost:8080/api/kafka/post-message",template,{
          headers:{
            'Content-Type':'application/json'
          }
        })
        console.log(response.data);
      }catch(error){
        console.error("Error:", error.message);
      }
    }

    return(
      <div style={{ marginLeft: "0.8rem" }}>
        <Header head={"Send Messsage"} />
        <Form>
          <FormGroup>
            <Label>Sever:</Label>
            <pre>{template.bootstrapServers}</pre>
          </FormGroup>

          <FormGroup>
            <Label>Topic:</Label>
            <pre>{template.topic}</pre>
          </FormGroup>

          <FormGroup>
              <Label>Message :</Label>
              <Input
              type="text"
              id="messageTemplate"
              value={template.messageTemplate}
              onChange={(e)=>setTemplate({...template,messageTemplate:e.target.value})}
              />
          </FormGroup>
          <Button color="success" className="mt-3" onClick={handleSend}>
              SendMessage
          </Button>
          <Button className="ms-3 mt-3" onClick={()=>{
            router(`/kafka_template/${location.state.role}`)
          }}>
              Back
          </Button>
        </Form>

      </div>
    );


}
export default SendMessage;