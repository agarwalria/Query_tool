import React, { useState } from 'react';
import axios from 'axios';
import CodeEditor from '../CodeEditor';
import './ExecuteQuery.css';
import Header from '../Header';
import ResultSqlQuery from '../ResultSqlQuery';
import { useNavigate, useParams } from 'react-router-dom';
import ResultMongoQuery from '../ResultMongoQuery';
import { Button } from 'reactstrap';

const ExecuteQuery = () => {
  const { connectedDatabaseType,connectedDatabaseId } = useParams();
  const [queryResult, setQueryResult] = useState(null);
  const [error, setError] = useState('');
  const [showResult,setShowResult]=useState(false);
  const router=useNavigate();

  const runQuery = async (query,collectionName) => {
    if (!query) {
      setError('Query cannot be empty');
      return;
    }
    try {
      if(isMongoQuery()){
        console.log(collectionName);
        const response = await axios.post(
          'http://localhost:9090/api/db_connection/mongo/query',
          {
              collectionName:collectionName,
              query: query,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setQueryResult(response.data);
      }
      else{
        const encodedQuery = encodeURIComponent(query);
        const response = await axios.post(
        'http://localhost:9090/api/execute-query',
        {
          query: encodedQuery,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setQueryResult(response.data);
      }
        setShowResult(true);
        setError('');
    } catch (error) {
      console.error('Error executing query:', error);
      setError('Error in executing the query');
    }
  };

  const isMongoQuery = () => {
    console.log(connectedDatabaseType);
    return connectedDatabaseType === "mongodb";
  };

  return (
    <div style={{ marginLeft: '0.8rem' }}>
      <Header head={"Execute Query"}/>
      <Button onClick={()=>{
                router(`/query/admin/${connectedDatabaseType}/${connectedDatabaseId}`);
            }} className='mt-3 mb-3'>Back</Button>
      <CodeEditor onRunQuery={runQuery} dbType={connectedDatabaseType} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {isMongoQuery() && showResult ? <ResultMongoQuery result={queryResult} /> : null}

      {!isMongoQuery() && showResult ? <ResultSqlQuery result={queryResult} /> : null}

      
    </div>
  );
};

export default ExecuteQuery;
