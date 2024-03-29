import React, { useState, } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { Button, Col, Form, Input, Label, Row, FormGroup } from 'reactstrap';
import alasql from 'alasql';


const CodeEditor = ({ onRunQuery, dbType }) => {
  const [query, setQuery] = useState('');
  const [collectionName,setCollectionName]=useState('');
  const [isValid, setIsValid] = useState(true);
//   const [error,setError] = useState('');

  const handleEditorChange = (newValue) => {
    setQuery(newValue);
    setIsValid(validateQuery(newValue));
  };

  const validateQuery = (query) => {
    try {
      // Attempt to validate the query using AlaSQL
      if(alasql.parse(query)){
        return true;
      };
       // Set the query as valid
    } catch (validationError) {
      return false; // Set the query as invalid
    }
  };
  

  const handleRunQuery = () => {
    console.log(query);
    onRunQuery(query,collectionName);
  };

  return (
    <div>
      {(dbType==="mongodb") && 
      
      <Row className='mb-3' style={{width:"800px"}}>
        <Col xs={2}>
        <Label>Collection:</Label>
        </Col>
        <Col xs={10}>
        <Input
        type="text"
        id="collectionName"
        placeholder='Enter Collection Name'
        value={collectionName}
        onChange={(e)=>{
          setCollectionName(e.target.value);
        }}
        />
        </Col>
      </Row>
      }
      <MonacoEditor
        width="800px"
        height="250px"
        language="sql"
        value={query}
        onChange={handleEditorChange}
        theme={(dbType==="mongodb")?"vs-dark":(isValid)?"vs-dark":"hc-black"}
        options={{
          selectOnLineNumbers: true,
        }}
      />
      <Button color="success" className='mt-3 mb-3' onClick={handleRunQuery}>
        Run
      </Button>

    </div>
  );
};

export default CodeEditor;
