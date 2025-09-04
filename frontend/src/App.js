import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SqlQuery from './components/Query';
import AddQuery from './components/AddQuery';
import ConnectionPage from './components/ConnectionPage';
import UpdateQuery from './components/UpdateQuery';
import ExecuteSqlQuery from './components/ExecuteSqlQuery';
import ExecuteMongoQuery from './components/ExecuteMongoQuery';
import Login from './components/Login';
import KafkaTemplate from './components/KafkaTemplate';
import UpdateTemplate from './components/UpdateTemplate';
import AddTemplate from './components/AddTemplate';
import SendMessage from './components/SendMessage';
// import ExecuteQuery from './components/ExecuteQuery/ExecuteQuery.js';
import KafkaMessageSender from './components/KafkaMessageSender.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <div>
            <ToastContainer />
            <Router>
                <Routes>
                    <Route path='/' element={<Login />} />
                    {/* <Route path='/connect_to_database' element={<DataSource/>}/> */}
                    <Route path='/connection/admin' element={<ConnectionPage />} />
                    <Route path='/query/:role/:connectedDatabaseType/:connectedDatabaseId' element={<SqlQuery />} />
                    <Route path='/add_query/:connectedDatabaseType/:connectedDatabaseId' element={<AddQuery />} />
                    {/* <Route path='/execute_query/:connectedDatabaseType/:connectedDatabaseId' element={<ExecuteQuery/>}/> */}
                    <Route path='/update_query/:queryId' element={<UpdateQuery />} />
                    <Route path='/execute_sql_query/:queryId' element={<ExecuteSqlQuery />} />
                    <Route path='/execute_mongo_query/:queryId' element={<ExecuteMongoQuery />} />
                    <Route path='/kafka_template/:role' element={<KafkaTemplate />} />
                    <Route path='/update_template/:templateId' element={<UpdateTemplate />} />
                    <Route path='/add_template' element={<AddTemplate />} />
                    <Route path='/message_sender' element={<SendMessage />} />
                    <Route path='/send_message/:templateId' element={<KafkaMessageSender />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;