import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { Button, Table} from 'reactstrap';
import { OverlayTrigger,Tooltip} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';

const SqlQuery = () => {
  const { role,connectedDatabaseType,connectedDatabaseId } = useParams();
  const [queries, setQueries] = useState([]);

  useEffect(()=>{
    document.title="Queries"
  },[])

  useEffect(() => {
    if (connectedDatabaseId) {
      fetchQueries(connectedDatabaseId);
    }
  }, [connectedDatabaseId]);

  const fetchQueries = async (databaseConnectionId) => {
    try {
        //console.log(databaseConnectionId);
      const response = await axios.get(`http://localhost:9090/api/sql-queries/by-database-connection?databaseConnectionId=${databaseConnectionId}`);
      setQueries(response.data);
      console.log("queries:",response.data);
    } catch (error) {
      console.error('Error fetching queries:', error.message);
    }
  };

  const router=useNavigate();

  const handleDelete=async(queryId)=>{
    try{
        const response=await axios.delete(`http://localhost:9090/api/sql-queries/${queryId}`);
        fetchQueries(connectedDatabaseId);

    }catch(error){
        console.error("Error:",error.message);
        alert("Something went wrong");
    }

  }

  const isMongoQuery = () => {
    return connectedDatabaseType === "mongodb";
  };

  return (
    <div style={{ marginLeft: '0.8rem' }}>
      {(queries.length>1)? 
        <Header head={'Queries'}/>:<Header head={'Query'}/>}
      <Button onClick={()=>{
                router(`/connection/${role}`);
            }} className='mt-3 mb-3' style={{width:"110px"}}  outline>Back</Button>
            {role === 'admin' && 
           <Button color='secondary' outline className='ms-3' style={{width:"110px"}} onClick={()=>{
                router(`/add_query/${connectedDatabaseType}/${connectedDatabaseId}`)
            }}>Add Query</Button>
           }
      <Table striped bordered>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            {/* <th>Description</th> */}
            <th>Query</th>
            {isMongoQuery() && (
              <th>Collection Name</th>
            )}
            <th>PlaceholderName</th>
            <th>PlaceholderType</th>
            <th style={{width:"200px"}}>Actions</th>
          </tr>
        </thead>
        <tbody>
            {queries.map(query=>(
                <tr key={query.id}>
                    <td>{queries.indexOf(query)+1}</td>
                    <td>
                        <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-${query.id}`}>{query.description}</Tooltip>}
                        >
                        <span>{query.title}</span>
                        </OverlayTrigger>
                    </td>
                    {/* <td>{query.description}</td> */}
                    <td>{query.query}</td>
                    {isMongoQuery() && <td> {query.mongoCollection}</td>}
                    <td>
                        {query.placeholders.map((placeholder) => (
                        <div key={placeholder.name}>{placeholder.name}</div>
                        ))}
                    </td>
                    <td>
                        {query.placeholders.map((placeholder) => (
                        <div key={placeholder.name}>{placeholder.type}</div>
                        ))}
                    </td>
                    <td>
                      {role === 'admin' &&<div>
                        <div>
                          <Button color='info' outline className="w-50" onClick={()=>{
                              router(`/update_query/${query.id}`,{state:{type:connectedDatabaseType,id:connectedDatabaseId}})
                          }}>Edit</Button>
                        </div>
                          
                        <div>
                          <Button color='danger' outline className="w-50 mt-1" onClick={()=>handleDelete(query.id)}>Delete</Button>
                        </div>

                      </div> 
                        }
                        
                        
                        <Button color="success" outline className="w-50 mt-1" onClick={() => {
                                if (connectedDatabaseType === "mysql") {
                                    router(`/execute_sql_query/${query.id}`,{state:{id:connectedDatabaseId, role:role}});
                                } else if (isMongoQuery()) {
                                    router(`/execute_mongo_query/${query.id}`,{state:{id:connectedDatabaseId, role:role}});
                                } else {
                                    alert("Unknown query type");
                                }
                            }}
                        > Execute </Button>
                    </td>
                </tr>
            ))}


        </tbody>
        </Table>
        </div>
    
  );
};

export default SqlQuery;
