import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Statistic, Table, List, Tag, Divider, Button } from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  SyncOutlined,
  ExclamationCircleOutlined, 
  ArrowUpOutlined, 
  TeamOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'admin';
  assignee?: string;
  dueDate?: string;
}

interface Activity {
  id: string;
  action: string;
  user: string;
  time: string;
  taskId?: string;
}

const Dashboard: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('guest');
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [inProgressTasks, setInProgressTasks] = useState<number>(0);
  const [pendingTasks, setPendingTasks] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Giả định: Lấy vai trò người dùng từ localStorage
    const role = localStorage.getItem('userRole');
    setUserRole(role || 'guest');

    // Giả định: Lấy dữ liệu từ API/Blockchain
    // Đây là dữ liệu mẫu
    setTotalTasks(24);
    setCompletedTasks(12);
    setInProgressTasks(8);
    setPendingTasks(4);
    setTotalUsers(8);

    // Dữ liệu mẫu cho task gần đây
    setRecentTasks([
      { id: '1', title: 'Implement Smart Contract', status: 'admin' },
      { id: '2', title: 'Design User Interface', status: 'in_progress', assignee: 'Alice' },
      { id: '3', title: 'Test Web3 Integration', status: 'completed', assignee: 'Bob' },
      { id: '4', title: 'Fix Authentication Bug', status: 'in_progress', assignee: 'Charlie' },
      { id: '5', title: 'Write Documentation', status: 'pending', assignee: 'David' }
    ]);

    // Dữ liệu mẫu cho hoạt động gần đây
    setRecentActivities([
      { id: '1', action: 'completed task', user: 'Bob', time: '2 giờ trước', taskId: '3' },
      { id: '2', action: 'assigned task', user: 'Admin', time: '3 giờ trước', taskId: '4' },
      { id: '3', action: 'created new task', user: 'Admin', time: '5 giờ trước', taskId: '5' },
      { id: '4', action: 'started working on', user: 'Alice', time: '1 ngày trước', taskId: '2' },
      { id: '5', action: 'registered new user', user: 'Admin', time: '2 ngày trước' }
    ]);

  }, []);

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'admin':
        return <Tag color="purple">Admin</Tag>;
      case 'pending':
        return <Tag icon={<ClockCircleOutlined />} color="default">Chờ xử lý</Tag>;
      case 'in_progress':
        return <Tag icon={<SyncOutlined spin />} color="processing">Đang xử lý</Tag>;
      case 'completed':
        return <Tag icon={<CheckCircleOutlined />} color="success">Hoàn thành</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const renderAdminDashboard = () => (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Tổng số Task" 
              value={totalTasks} 
              valueStyle={{ color: '#1890ff' }} 
              prefix={<ExclamationCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Hoàn thành" 
              value={completedTasks} 
              valueStyle={{ color: '#3f8600' }} 
              prefix={<CheckCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Đang xử lý" 
              value={inProgressTasks} 
              valueStyle={{ color: '#1890ff' }} 
              prefix={<SyncOutlined spin />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Tổng số người dùng" 
              value={totalUsers} 
              valueStyle={{ color: '#722ed1' }} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Task gần đây</Divider>
      <List
        bordered
        dataSource={recentTasks}
        renderItem={item => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => navigate(`/task-details?id=${item.id}`)}>
                Xem chi tiết
              </Button>
            ]}
          >
            <List.Item.Meta
              title={item.title}
              description={item.assignee ? `Giao cho: ${item.assignee}` : 'Chưa giao'}
            />
            {getStatusTag(item.status)}
          </List.Item>
        )}
      />

      <Divider orientation="left">Hoạt động gần đây</Divider>
      <List
        bordered
        dataSource={recentActivities}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={<span><strong>{item.user}</strong> {item.action} {item.taskId ? <a href={`/task-details?id=${item.taskId}`}>#{item.taskId}</a> : ''}</span>}
              description={item.time}
            />
          </List.Item>
        )}
      />
    </>
  );

  const renderTeamLeadDashboard = () => (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Tổng số Task" 
              value={totalTasks} 
              valueStyle={{ color: '#1890ff' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Đang thực hiện" 
              value={inProgressTasks} 
              valueStyle={{ color: '#faad14' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Hoàn thành" 
              value={completedTasks} 
              valueStyle={{ color: '#3f8600' }} 
              suffix={<div style={{ fontSize: '15px' }}>/{totalTasks}</div>}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Task của team</Divider>
      <List
        bordered
        dataSource={recentTasks}
        renderItem={item => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => navigate(`/task-details?id=${item.id}`)}>Chi tiết</Button>,
              item.status === 'pending' ? (
                <Button type="primary" size="small" onClick={() => navigate(`/assign-task?id=${item.id}`)}>
                  Phân công
                </Button>
              ) : null
            ]}
          >
            <List.Item.Meta
              title={item.title}
              description={item.assignee ? `Giao cho: ${item.assignee}` : 'Chưa giao'}
            />
            {getStatusTag(item.status)}
          </List.Item>
        )}
      />

      <Row style={{ marginTop: 20 }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={() => navigate('/task-management')}>
            Quản lý tất cả Task
          </Button>
        </Col>
      </Row>
    </>
  );

  const renderEmployeeDashboard = () => (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Task được giao" 
              value={3} 
              valueStyle={{ color: '#1890ff' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Đang thực hiện" 
              value={1} 
              valueStyle={{ color: '#faad14' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Đã hoàn thành" 
              value={2} 
              valueStyle={{ color: '#3f8600' }} 
            />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Task của tôi</Divider>
      <List
        bordered
        dataSource={recentTasks.filter(task => task.assignee === 'Alice')} // Giả định người dùng hiện tại là Alice
        renderItem={item => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => navigate(`/task-details?id=${item.id}`)}>
                Xem chi tiết
              </Button>,
              item.status === 'in_progress' ? (
                <Button type="primary" size="small" onClick={() => navigate(`/task-details?id=${item.id}`)}>
                  Cập nhật
                </Button>
              ) : null
            ]}
          >
            <List.Item.Meta
              title={item.title}
            />
            {getStatusTag(item.status)}
          </List.Item>
        )}
      />

      <Row style={{ marginTop: 20 }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={() => navigate('/my-tasks')}>
            Xem tất cả Task của tôi
          </Button>
        </Col>
      </Row>
    </>
  );

  // Hiển thị dashboard dựa trên vai trò
  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return renderAdminDashboard();
      case 'teamLead':
        return renderTeamLeadDashboard();
      case 'employee':
        return renderEmployeeDashboard();
      default:
        return (
          <div style={{ textAlign: 'center', margin: '100px 0' }}>
            <Title level={3}>Vui lòng đăng nhập để xem dashboard</Title>
            <Button type="primary" onClick={() => navigate('/login')}>
              Đăng nhập
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <Title level={2}>
        {userRole === 'admin' ? 'Dashboard Admin' : 
         userRole === 'teamLead' ? 'Dashboard Team Lead' : 
         userRole === 'employee' ? 'Dashboard Employee' : 'Welcome'}
      </Title>
      <Paragraph>
        {userRole !== 'guest' ? 'Xem tóm tắt công việc và hoạt động gần đây của bạn' : 'Vui lòng đăng nhập để tiếp tục'}
      </Paragraph>
      {renderDashboard()}
    </div>
  );
};

export default Dashboard; 