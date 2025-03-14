import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';

import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import TaskComments from './pages/TaskComments';
import UserManagement from './pages/UserManagement';
import TaskManagement from './pages/TaskManagement';
import TaskDetails from './pages/TaskDetails';
import TransactionHistory from './pages/TransactionHistory';
import PerformanceReport from './pages/PerformanceReport';
import RegisterUser from './pages/RegisterUser';
import AssignTask from './pages/AssignTask';

const { Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout>
          <Content style={{ padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/task-management" element={<TaskManagement />} />
              <Route path="/task-details" element={<TaskDetails />} />
              <Route path="/task-comments" element={<TaskComments />} />
              <Route path="/transaction-history" element={<TransactionHistory />} />
              <Route path="/performance-report" element={<PerformanceReport />} />
              <Route path="/assign-task" element={<AssignTask />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegisterUser />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
