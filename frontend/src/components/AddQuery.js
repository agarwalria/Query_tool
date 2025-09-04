import axios from 'axios';
import React, {useState, useEffect } from 'react';
import {Form, FormGroup, Label, Input, Button, Row, Col} from 'reactstrap';
import {useNavigate,useParams} from "react-router-dom";
import Header from './Header';
import alasql from 'alasql';
import ResultSqlQuery from './ResultSqlQuery';

const AddQuery = () => {
  useEffect(() => {
    document.title = "Add Query";
  }, []);
  const { connectedDatabaseType,connectedDatabaseId } = useParams();
  const [queryData, setQueryData] = useState({
    title: '',
    description: '',
    query: '',
    databaseConnection: {id : connectedDatabaseId},
    placeholders: [{ name: '', type: 'STRING' }],
    mongoCollection:''
  });
  const [error,setError]=useState('');
  const [placeholderValues,setPlaceholderValues]=useState({});
  const [queryResult,setQueryResult]=useState(null);
  const [showResult,setShowResult]=useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const router=useNavigate();

  const handlePlaceholderChange = (index, key, value) => {
    const updatedPlaceholders = [...queryData.placeholders];
    updatedPlaceholders[index][key] = value;
    setQueryData({ ...queryData, placeholders: updatedPlaceholders });
  };

  const handleTextChange = (e) => {
    const cursorPos = e.target.selectionStart; // Get cursor position
    setCursorPosition(cursorPos); // Update state with cursor position
    setQueryData({ ...queryData, query: e.target.value })
  };


  const handleDynamicPlaceholder=()=>{
    const {query}=queryData;
    const updatedQuery=query.slice(0, cursorPosition) +
    `?placeholder_name` +
    query.slice(cursorPosition);
    setQueryData({...queryData,query:updatedQuery});
  }

  const extractPlaceholders=()=>{
    const regex= /\?(\w+)/g;;
    const matches=[];
    let match;
    while((match=regex.exec(queryData.query))!==null){
        matches.push(match[1]);
    }
    return matches;
  }

  const handleUpdatePlaceholders=()=>{
    const extractedPlaceholders = extractPlaceholders();
  console.log(extractedPlaceholders);
  setQueryData((prevQueryData) => ({
    ...prevQueryData,
    placeholders: extractedPlaceholders.map((name) => ({ name, type: 'STRING' })),
  }));
  console.log(queryData.query);
  }

  const handleInputChange = (placeholderName, value) => {
    setPlaceholderValues((prevValues) => ({
      ...prevValues,
      [placeholderName]: value,
    }));
  };

  const buildSqlQuery=()=>{
    let formattedQuery=queryData.query;
    queryData.placeholders.forEach((placeholder)=>{
      const placeholderName=placeholder.name;
      const placeholderValue=placeholderValues[placeholderName];
      if(placeholderValue!==undefined){
        formattedQuery=formattedQuery.replace(
          new RegExp(`\\?${placeholderName}`,"g"),
          `${placeholderValue}`
        );
      }
    })
    const encodedQuery=encodeURIComponent(formattedQuery);
    return encodedQuery;
  }

  const handleExecute=async()=>{
    console.log(placeholderValues);
    try{
      const response = await axios.post(
        'http://localhost:9090/api/execute-query',
        {
          query: buildSqlQuery(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setQueryResult(response.data);
      setShowResult(true);
      setError('');
    }catch (error) {
      console.error("Error executing the query:", error.message);
      setError('Error in executing the query');
  }
}

  const saveQuery = async(e) => {
    console.log(queryData);
    e.preventDefault();
    try{
        const response=await axios.post('http://localhost:9090/api/sql-queries',queryData,{
            headers:{
                'Content-Type': 'application/json',
            },
        })
        router(`/query/admin/${connectedDatabaseType}/${connectedDatabaseId}`);

    }catch(error){
        alert('Something went wrong:', error);
        console.error("Error:",error.message);
    }
    console.log('Query Data:', queryData);
  };

  const isValid=()=>{
    try {
        if(alasql.parse(queryData.query)) {
            //console.log("true");
            return true;
        }
        
    } catch (error) {
        return false;

    }
    
    }

  return (
      <div style={{ marginLeft: '0.8rem' }}>
        <Header head={'Create Query'}/>
        <Button style={{width:"110px"}}  outline onClick={()=>{
                router(`/query/admin/${connectedDatabaseType}/${connectedDatabaseId}`);
            }} className='mt-3'>Back</Button>
        <Form className='p-5'>
        <FormGroup>
            <Label for="title">Title:</Label>
            <Input
            type="text"
            id="title"
            value={queryData.title}
            onChange={(e) => setQueryData({ ...queryData, title: e.target.value })}
            />
        </FormGroup>

        {connectedDatabaseType==="mongodb" &&  
        <FormGroup>
            <Label for="mongoCollection">Collection:</Label>
            <Input
            type="text"
            id="mongoCollection"
            value={queryData.mongoCollection}
            onChange={(e) => setQueryData({ ...queryData, mongoCollection: e.target.value })}
            />
        </FormGroup>}

        <FormGroup>
            <Label for="description">Description:</Label>
            <Input
            type="textarea"
            id="description"
            value={queryData.description}
            onChange={(e) => setQueryData({ ...queryData, description: e.target.value })}
            />
        </FormGroup>

        <FormGroup>
            <Label for="query">SQL Query Text:</Label>
            <Input
            type="textarea"
            id="query"
            value={queryData.query}
           // onChange={(e) => setQueryData({ ...queryData, query: e.target.value })}
            onChange={handleTextChange}
            style={{color:(connectedDatabaseType==="mongodb")?"black":(isValid())?"green":"red"}}
            />
            <Button className="mt-3" style={{width:"170px"}} color="success" onClick={handleDynamicPlaceholder}>Add Placeholder</Button>
        </FormGroup>

        <FormGroup>
            <Label for="placeholders">Placeholders</Label>
            {queryData.placeholders.map((placeholder, index) => (
                <Row key={index} className='mt-3'>
                    <Col xs={3}>
                    <Input
                    type="text"
                    id={`placeholderName${index}`}
                    value={placeholder.name}
                    disabled
                    // onChange={(e) => handlePlaceholderChange(index, 'name', e.target.value)}
                    />
                    </Col>
                    
                    <Col xs={3}>
                    <Input
                    type="select"
                    id={`placeholderType${index}`}
                    value={placeholder.type}
                    onChange={(e) => handlePlaceholderChange(index, 'type', e.target.value)}
                    >
                    <option value="STRING">String</option>
                    <option value="INT">Int</option>
                    <option value="DOUBLE">Double</option>
                    <option value="DATE">Date</option>
                    </Input>
                    </Col>
                    <Col xs={3}>
                      <Input
                      placeholder='Value for Placeholder'
                      type="text"
                      value={placeholderValues[placeholder.name] || ""}
                      onChange={(e)=>handleInputChange(placeholder.name,e.target.value)}
                      />
                    </Col>
                </Row>
            ))}
        </FormGroup>
        <Button color="success" style={{width:"170px"}} onClick={handleUpdatePlaceholders}>
            Update Placeholder
            </Button>
            {Object.keys(placeholderValues).length===queryData.placeholders.length &&
              <Button color="success" className='ms-3' style={{width:"170px"}} onClick={handleExecute}>
              Execute
              </Button>}
            <br/>
        <Button color="primary" style={{width:"170px"}} onClick={saveQuery} className="mt-3">
            Save Query
        </Button>
        </Form>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {showResult && <ResultSqlQuery result={queryResult} className="p-5"/>}
    </div>
    
  );
};

export default AddQuery;
