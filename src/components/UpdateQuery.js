import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {Form, FormGroup, Label, Input, Button} from 'reactstrap';
import Header from "./Header";
import axios from "axios";

const UpdateQuery=()=>{
    useEffect(()=>{
        document.title="Update Page"
      },[])

    const location = useLocation();

    const {queryId}=useParams();

    const [query,setQuery] = useState({
        title: '',
        description: '',
        query: '',
        placeholders: [{ name: '', type: 'STRING' }],
        mongoCollection:''
    })

    useEffect(()=>{
        fetchQuery()
    },[])

    const fetchQuery=async()=>{
        try{
            const response=await axios.get(`http://localhost:9090/api/sql-queries/${queryId}`);
            setQuery(response.data);
        }catch(error){
            alert("Something went wrong");
            console.error("Error:",error.message);
        }

    }

    const router=useNavigate();

    const handlePlaceholderChange = (index, key, value) => {
        const updatedPlaceholders = [...query.placeholders];
        updatedPlaceholders[index] = {
          ...updatedPlaceholders[index],
          [key]: value,
        };
        setQuery((prevQuery) => ({
          ...prevQuery,
          placeholders: updatedPlaceholders,
        }));
      };

      const handleUpdate = async () => {
        try {
          const response = await axios.put(
            `http://localhost:9090/api/sql-queries/${queryId}`,
            query,  // Send the updated query object
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('Query updated successfully:', response.data);
          router(`/query/admin/${location.state.type}/${location.state.id}`);
        } catch (error) {
          console.error('Error:', error.message);
        }
      };
      

    return(
        <div style={{ marginLeft: '0.8rem' }}>
        <Header head={'Update Query'}/>
        <Button style={{width:"110px"}}  outline onClick={()=>{
                router(`/query/admin/${location.state.type}/${location.state.id}`);
            }} className='mt-3'>Back</Button>
        <Form className='p-5'>
        <FormGroup>
            <Label for="title">Title:</Label>
            <Input
            type="text"
            id="title"
            value={query.title}
            onChange={(e) => setQuery({ ...query, title: e.target.value })}
            />
        </FormGroup>

        {location.state.type==="mongodb" && 
        <FormGroup>
            <Label for="mongoCollection">Collection:</Label>
            <Input
            type="text"
            id="mongoCollection"
            value={query.mongoCollection}
            onChange={(e) => setQuery({ ...query, mongoCollection: e.target.value })}
            />
        </FormGroup>}

        <FormGroup>
            <Label for="description">Description:</Label>
            <Input
            type="textarea"
            id="description"
            value={query.description}
            onChange={(e) => setQuery({ ...query, description: e.target.value })}
            />
        </FormGroup>

        <FormGroup>
            <Label for="query">SQL Query Text:</Label>
            <Input
            type="textarea"
            id="query"
            value={query.query}
            onChange={(e) => setQuery({ ...query, query: e.target.value })}
            />
        </FormGroup>

            <h4>Placeholders:</h4>
            {query.placeholders.map((placeholder, index) => (
            <div key={index}>
                <FormGroup>
                <Label for={`placeholderName${index}`}>Name:</Label>
                <Input
                    type="text"
                    id={`placeholderName${index}`}
                    value={placeholder.name}
                     onChange={(e) => handlePlaceholderChange(index, 'name', e.target.value)}
                />
                </FormGroup>

                <FormGroup>
                <Label for={`placeholderType${index}`}>Type:</Label>
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
                </FormGroup>

            </div>
            ))}
        <Button style={{width:"110px"}} color="primary" className="mt-3" onClick={handleUpdate}>
            Update
        </Button>
        </Form>
    </div>
    );
}
export default UpdateQuery;