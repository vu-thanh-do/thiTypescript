import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Form, 
  Select, 
  Button, 
  DatePicker, 
  Descriptions, 
  Space, 
  Spin, 
  Empty,
  message,
  Divider,
  Row,
  Col,
  Tag,
  Avatar,
  Result
} from 'antd';
import { 
  UserOutlined, 
  CheckCircleOutlined, 
  SendOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  walletAddress: string;
  role: 'admin' | 'teamLead' | 'employee';
  assignedTasksCount: number;
}

const AssignTask: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy taskId từ query parameter
  const taskId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails(taskId);
      fetchAvailableUsers();
    } else {
      // Nếu không có taskId, hiển thị form chọn task
      setLoading(false);
    }
  }, [taskId]);

  const fetchTaskDetails = async (id: string) => {
    try {
      // Giả định: Đây là nơi bạn sẽ gọi API hoặc blockchain để lấy chi tiết task
      // Ví dụ:
      /*
      const taskData = await contractInstance.getTaskById(id);
      setTask({
        id: taskData.id,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        createdBy: taskData.createdBy,
        createdAt: new Date(taskData.createdAt * 1000).toLocaleString()
      });
      */

      // Dữ liệu mẫu
      setTimeout(() => {
        const mockTask: Task = {
          id,
          title: 'Implement Smart Contract',
          description: 'Create and deploy the main task management smart contract',
          status: 'pending' as 'pending',
          priority: 'high',
          createdBy: 'Admin',
          createdAt: '01/03/2023'
        };
        setTask(mockTask);
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('Lỗi khi tải chi tiết task');
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      // Giả định: Đây là nơi bạn sẽ gọi API hoặc blockchain để lấy danh sách người dùng
      // Ví dụ:
      /*
      const userData = await contractInstance.getAvailableEmployees();
      setUsers(userData.map(user => ({
        id: user.id,
        username: user.username,
        walletAddress: user.walletAddress,
        role: user.role,
        assignedTasksCount: user.assignedTasksCount
      })));
      */

      // Dữ liệu mẫu
      const mockUsers: User[] = [
        {
          id: '1',
          username: 'Alice',
          walletAddress: '0xabcd...efgh',
          role: 'employee',
          assignedTasksCount: 2
        },
        {
          id: '2',
          username: 'Bob',
          walletAddress: '0x9876...5432',
          role: 'employee',
          assignedTasksCount: 1
        },
        {
          id: '3',
          username: 'Charlie',
          walletAddress: '0xijkl...mnop',
          role: 'employee',
          assignedTasksCount: 3
        },
        {
          id: '4',
          username: 'David',
          walletAddress: '0x2468...1357',
          role: 'employee',
          assignedTasksCount: 0
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      message.error('Lỗi khi tải danh sách người dùng');
    }
  };

  const handleAssignTask = async (values: any) => {
    setSubmitting(true);

    try {
      // Giả định: Đây là nơi bạn sẽ gọi API hoặc blockchain để phân công task
      // Ví dụ:
      /*
      const transaction = await contractInstance.assignTask(
        task?.id || values.taskId,
        values.assignee,
        Math.floor(new Date(values.deadline).getTime() / 1000)
      );
      await transaction.wait();
      */

      // Mô phỏng phân công thành công
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      message.success('Phân công task thành công');

      // Sau 2 giây, chuyển về trang quản lý task
      setTimeout(() => {
        navigate('/task-management');
      }, 2000);
    } catch (error) {
      message.error('Lỗi khi phân công task');
    } finally {
      setSubmitting(false);
    }
  };

  const renderTaskDetailsCard = () => {
    if (!task) return null;

    return (
      <Card title="Thông tin Task" type="inner">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="ID">{task.id}</Descriptions.Item>
          <Descriptions.Item label="Tiêu đề">{task.title}</Descriptions.Item>
          <Descriptions.Item label="Mô tả">{task.description}</Descriptions.Item>
          <Descriptions.Item label="Mức độ ưu tiên">
            <Tag color={
              task.priority === 'high' ? 'red' : 
              task.priority === 'medium' ? 'blue' : 'green'
            }>
              {task.priority === 'high' ? 'Cao' : 
               task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Người tạo">{task.createdBy}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{task.createdAt}</Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  if (success) {
    return (
      <Result
        status="success"
        title="Phân công Task thành công!"
        subTitle="Task đã được phân công thành công và sẽ được thông báo đến người thực hiện."
        extra={[
          <Button type="primary" key="console" onClick={() => navigate('/task-management')}>
            Quay lại Quản lý Task
          </Button>
        ]}
      />
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="assign-task-container">
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Title level={2}>
            <Space>
              <TeamOutlined />
              Phân công Task
            </Space>
          </Title>

          <Divider />

          <Row gutter={24}>
            <Col span={task ? 12 : 24}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleAssignTask}
                requiredMark={false}
              >
                {!task && (
                  <Form.Item
                    name="taskId"
                    label="Chọn Task"
                    rules={[{ required: true, message: 'Vui lòng chọn task' }]}
                  >
                    <Select
                      placeholder="Chọn task cần phân công"
                      optionFilterProp="children"
                      showSearch
                    >
                      <Option value="1">Task #1: Implement Smart Contract</Option>
                      <Option value="5">Task #5: Write Documentation</Option>
                    </Select>
                  </Form.Item>
                )}

                <Form.Item
                  name="assignee"
                  label="Người thực hiện"
                  rules={[{ required: true, message: 'Vui lòng chọn người thực hiện' }]}
                >
                  <Select
                    placeholder="Chọn người thực hiện task"
                    optionFilterProp="children"
                    showSearch
                  >
                    {users.map(user => (
                      <Option key={user.id} value={user.id}>
                        <Space>
                          <Avatar size="small" icon={<UserOutlined />} />
                          {user.username}
                          <Tag color="blue">{user.assignedTasksCount} task</Tag>
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="deadline"
                  label="Hạn hoàn thành"
                  rules={[{ required: true, message: 'Vui lòng chọn hạn hoàn thành' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    format="DD/MM/YYYY"
                    disabledDate={current => {
                      // Không cho phép chọn ngày trong quá khứ
                      return current && current < moment().startOf('day');
                    }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SendOutlined />} 
                    loading={submitting}
                    block
                  >
                    Phân công Task
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            
            {task && (
              <Col span={12}>
                {renderTaskDetailsCard()}
              </Col>
            )}
          </Row>
        </Space>
      </Card>
    </div>
  );
};

export default AssignTask; 