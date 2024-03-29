import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Form, FormGroup, Input, Label, Row, Toast } from 'reactstrap';
import Header from './Header';
import axios from 'axios';
import { toast } from 'react-toastify';

const headerOptions = [
  'content-type',
  'source-system',
  'correlation-id',
  'message-type',
  'auth-token',
  'priority',
  'compression',
  'retry-count',
];
const KafkaMessageSender = () => {
        useEffect(() => {
            document.title = "Send Message";
        }, []);

    const {templateId}=useParams();
    const [template,setTemplate]=useState({
        bootstrapServers:'',
        topic:'',
        messageKey:'',
        messageTemplate:'',
        headers: [{ key: '', value: '' }],
      });

      useEffect(()=>{
        fetchTemplate();
      },[]);
  
      const router=useNavigate();
      const location=useLocation();
  
      const fetchTemplate=async()=>{
        try{
            const response=await axios.get(`http://localhost:8080/api/templates/${templateId}`);
            setTemplate(prevTemplate => ({
                ...prevTemplate,
                bootstrapServers: response.data.bootstrapServers,
                topic: response.data.topic,
                messageTemplate: response.data.messageTemplate
              }));
        }catch(error){
            console.error("Error:",error.message);
            alert("Something went wrong");
        }
      };

    const [placeholderValues, setPlaceholderValues] = useState({});

    const extractPlaceholders = (message) => {
        const regex = /\{\{(\w+)\}\}/g;
        const matches = [];
        let match;
        while ((match = regex.exec(message)) !== null) {
        matches.push(match[1]);
        }
        return matches;
    };
    const placeholders = extractPlaceholders(template.messageTemplate);

    const handleAddHeader = () => {
    setTemplate({...template,headers:[...template.headers,{key:'',value:''}]})
    };

    const handleRemoveHeader = (index) => {
        //if (template.headers.length > 1) {
        const updatedHeaders = [...template.headers];
        updatedHeaders.splice(index, 1);
        setTemplate({...template,headers:updatedHeaders});
        //}
    };

    const getCurrentTimestamp = () => {
        const currDate = new Date().toLocaleDateString();
        const currTime = new Date().toLocaleTimeString();
        return `${currDate} ${currTime}`;
    }

    const handleSendMessage = async (placeholder, value) => {
        // Update the placeholderValues state
        setPlaceholderValues((prevValues) => ({
        ...prevValues,
        [placeholder]: value,
        }));

        // Replace placeholders
        let filledMessage = template.messageTemplate;
        placeholders.forEach((ph) => {
        filledMessage = filledMessage.split(`{{${ph}}}`).join(placeholderValues[ph] || '');
        });
        // console.log(template.headers);
        // console.log(getCurrentTimestamp());

        // Send Kafka message
        try {
        const response = await axios.post('http://localhost:8080/api/kafka/post-message', {
            ...template,
            messageTemplate: filledMessage,
            headers:[...template.headers,{key:'timestamp',value:getCurrentTimestamp()}]
            
        }, {
            headers: {
            'Content-Type': 'application/json',
            },
        });
        toast.success('Kafka message sent successfully!');
        console.log(response.data);
        
        } catch (error) {
        console.error('Error:', error.message);
        }
    };

  return (
    <div style={{ marginLeft: "0.8rem" }}>
        <Header head={"Send Messsage"} />
        <Button className="mb-3 mt-3" onClick={()=>{
            router(`/kafka_template/${location.state.role}`)
          }}>
              Back
          </Button>
      <Form >
      <FormGroup>
            <Label>Sever:</Label>
            <pre>{template.bootstrapServers}</pre>
        </FormGroup>

        <FormGroup>
            <Label>Topic:</Label>
            <pre>{template.topic}</pre>
        </FormGroup>

        <FormGroup>
          <Label for="message">Kafka Message</Label>
          <pre>{template.messageTemplate}</pre>
          {placeholders.map((placeholder) => (
            <Row key={placeholder} className='mt-3'>
              <Col xs={4}>
                <Label>{placeholder}</Label>
              </Col>
              <Col xs={4}>
                <Input
                  type="text"
                  placeholder={`Enter value for ${placeholder}`}
                  onChange={(e) => setPlaceholderValues((prevValues) => ({ ...prevValues, [placeholder]: e.target.value }))}
                />
              </Col>
            </Row>
          ))}
        </FormGroup>


        <FormGroup>
          <Label for="key">Key</Label>
          <Input
            type="text"
            id="messageKey"
            placeholder="Enter Key"
            value={template.messageKey}
            onChange={(e) => setTemplate({...template,messageKey:e.target.value})}
          />
        </FormGroup>


        <FormGroup>
          <Label for="headers">Headers</Label>
          {template.headers.map((header, index) => (
            <Row key={index} className='mt-3'>
              <Col xs={4}>
                <Input
                  type="select"
                  value={header.key}
                  onChange={(e) => setTemplate({
                    ...template,
                    headers: [...template.headers.slice(0, index), { ...header, key: e.target.value }, ...template.headers.slice(index + 1)]
                  })}
                >
                  <option value="">Select Header Key</option>
                  {headerOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col xs={4}>
                <Input
                  type="text"
                  placeholder="Enter Header Value"
                  value={header.value}
                  onChange={(e) => setTemplate({
                    ...template,
                    headers: [...template.headers.slice(0, index), { ...header, value: e.target.value }, ...template.headers.slice(index + 1)]
                  })}
                />
              </Col>
              
        {/* </FormGroup>
              </Col> */}
              {template.headers.length > 1 && <Col xs={4}>
                <Button color="danger" onClick={() => handleRemoveHeader(index)}>
                  Remove
                </Button>
              </Col>}
            </Row>
          ))}
          <Button color="success" className='mt-3' onClick={handleAddHeader}>
            Add Header
          </Button>
        </FormGroup>
        <Button color="primary" onClick={handleSendMessage}>
          Send Kafka Message
        </Button>
      </Form>
    </div>
  );
};

export default KafkaMessageSender;


