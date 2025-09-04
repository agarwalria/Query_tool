import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Col, Row} from 'reactstrap';
import Header from './Header';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ResultMongoQuery from './ResultMongoQuery';

const ExecuteMongoQuery = () => {
    useEffect(() => {
        document.title = "Execute Page";
      }, []);
    
      const { queryId } = useParams();
    
      const [query, setQuery] = useState({
        title: "",
        description: "",
        query: "",
        placeholders: [{ name: "", type: "STRING" }],
        mongoCollection : ""
      });
    
      useEffect(() => {
        fetchQuery(queryId);
      }, []);
    
      const fetchQuery = async (queryId) => {
        try {
          const response = await axios.get(
            `http://localhost:9090/api/sql-queries/${queryId}`
          );
          setQuery(response.data);
        } catch (error) {
          alert("Something went wrong");
          console.error("Error:", error.message);
        }
      };
    
      const [placeholderValues, setPlaceholderValues] = useState({});
      const [queryResult, setQueryResult] = useState(null);
      const [error, setError] = useState('');
      const [showResult, setShowResult] = useState(false);
    
      const handleInputChange = (placeholderName, value) => {
        setPlaceholderValues((prevValues) => ({
          ...prevValues,
          [placeholderName]: convertToType(value, getPlaceholderType(placeholderName)),
        }));
      };
    
      const getPlaceholderType = (placeholderName) => {
        const placeholder = query.placeholders.find((p) => p.name === placeholderName);
        return placeholder ? placeholder.type : "STRING"; // Default to "STRING" if type is not found
      };
    
      const convertToType = (value, type) => {
        switch (type) {
          case "INT":
            return parseInt(value, 10);
          case "DOUBLE":
            return parseFloat(value);
          case "DATE":
            return new Date(value);
          // Add more cases as needed for other types
          default:
            return value.toString(); // Default to string
        }
      };
    
      const location = useLocation();
      const router = useNavigate();
    
      const buildSqlQuery = () => {
        let formattedQuery = query.query;
    
        query.placeholders.forEach((placeholder) => {
          const placeholderName = placeholder.name;
          const placeholderValue = placeholderValues[placeholderName];
    
          if (placeholderValue !== undefined) {
            // Replace placeholders with user-provided values
            formattedQuery = formattedQuery.replace(
              new RegExp(`\\?${placeholderName}`, "g"),
              `${placeholderValue}`
            );
          }
        });
        // console.log(placeholderValues);
        // console.log(formattedQuery);
        //const encodedQuery = encodeURIComponent(formattedQuery);
    
        return formattedQuery;
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await axios.post(
            'http://localhost:9090/api/db_connection/mongo/query',
            {
                collectionName:query.mongoCollection,
                query: buildSqlQuery()
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          console.log("Query executed successfully:", response.data);
          setQueryResult(response.data);
          setShowResult(true);
          setError('');
          // Handle the result as needed, you can display it on the UI
        } catch (error) {
          console.error("Error executing the query:", error.message);
          setError('Error in executing the query');
          // Handle the error as needed
        }
      };
    
      return (
        <div style={{ marginLeft: "0.8rem" }}>
          <Header head={"Execute Mongo Query"} />
          <Button
              className="mb-3 mt-3" style={{width:"110px"}}  outline
              onClick={() => {
                router(`/query/${location.state.role}/mongodb/${location.state.id}`);
              }}
            >
              Back
            </Button>
          <form>
            <h3>{query.title}</h3>
            <p>{query.description}</p>
            <label>Collection:</label>
            <pre>{query.mongoCollection}</pre>
            <label>Query:</label>
            <pre>{query.query}</pre>
    
            {query.placeholders.map((placeholder,index) => (
              <Row key={index} className='mt-2'>
                <Col xs={2}>
                <label>
                  {placeholder.name} ({placeholder.type}):{" "}
                </label>
                </Col>
                <Col xs={1}>
                  <input
                    type="text"
                    value={placeholderValues[placeholder.name] || ""}
                    onChange={(e) =>
                      handleInputChange(placeholder.name, e.target.value)
                    }
                  />
                </Col>
              </Row>
            ))}
    
            <Button color="success" type="submit" className='mt-3' onClick={handleSubmit}>
              Execute Query
            </Button>
            
          </form>
    
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {showResult && <ResultMongoQuery result={queryResult}/>}
        </div>
      );
};

export default ExecuteMongoQuery;

