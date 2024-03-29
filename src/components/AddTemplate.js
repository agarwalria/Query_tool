import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTemplate = () => {
  useEffect(() => {
    document.title = 'Add Template';
  }, []);

  const [template, setTemplate] = useState({
    bootstrapServers: '',
    topic: '',
    messageTemplate: ''
  });

  const [cursorPosition, setCursorPosition] = useState(0);

  const router = useNavigate();

  const handleTextChange = (e) => {
    const cursorPos = e.target.selectionStart; // Get cursor position
    setCursorPosition(cursorPos); // Update state with cursor position
    setTemplate({ ...template, messageTemplate: e.target.value })
  };

//   const addPlaceholder = (placeholder) => {
//     const updatedMessageTemplate = `${template.messageTemplate} {{${placeholder}}}`;
//     setTemplate({ ...template, messageTemplate: updatedMessageTemplate });
//   };
const addPlaceholder = (placeholder) => {
    const { messageTemplate } = template;
    const updatedMessageTemplate =
      messageTemplate.slice(0, cursorPosition) +
      `{{${placeholder}}}` +
      messageTemplate.slice(cursorPosition);

    setTemplate({
      ...template,
      messageTemplate: updatedMessageTemplate,
    });

    // Move the cursor to the end of the inserted placeholder
    setCursorPosition(cursorPosition + placeholder.length + 4); // Adjust for the added "{{}}" characters
  };

  const saveTemplate = async () => {
    console.log(template);
    try {
      const response = await axios.post('http://localhost:8080/api/templates', template, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      router(`/kafka_template/admin`)
    } catch (error) {
      alert("Something went wrong");
      console.error("Error:", error.message);
    }
  };

  return (
    <div style={{ marginLeft: '0.8rem' }}>
      <Header head={'Create Template'} />
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
            onChange={(e) => setTemplate({ ...template, bootstrapServers: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label>Topic</Label>
          <Input
            type="text"
            id="topic"
            value={template.topic}
            onChange={(e) => setTemplate({ ...template, topic: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label>Message Template</Label>
          <Input
            type="textarea"
            id="messageTemplate"
            value={template.messageTemplate}
            onChange={handleTextChange}
          />
          <Button
            color="success"
            className="mt-3"
            onClick={() => addPlaceholder('your_placeholder')}
          >
            Add Placeholder
          </Button>
        </FormGroup>
        <Button color="primary" className="mt-3" onClick={saveTemplate}>
          Save
        </Button>
      </Form>
    </div>
  );
};

export default AddTemplate;


