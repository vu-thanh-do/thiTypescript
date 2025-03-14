import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Table, 
  Space, 
  Tag, 
  Card, 
  Input, 
  Row, 
  Col, 
  Select, 
  Modal, 
  Form, 
  DatePicker,
  message,
  Tooltip,
  Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdBy: string;
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

interface User {
  id: string;
  username: string;
  role: string;
}

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [userRole, setUserRole] = useState<string>('employee');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Giả định: Lấy vai trò người dùng từ localStorage
    const role = localStorage.getItem('userRole');
    setUserRole(role || 'employee');

    // Giả định: Lấy danh sách task và người dùng
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Giả định: Đây là nơi bạn sẽ gọi API hoặc blockchain để lấy danh sách task
      // Ví dụ:
      /*
      const tasks = await contractInstance.getTasks();
      setTasks(tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        createdBy: task.createdBy,
        assignee: task.assignee,
        dueDate: task.dueDate ? new Date(task.dueDate * 1000).toISOString().split('T')[0] : undefined,
        createdAt: new Date(task.createdAt * 1000).toLocaleString(),
        priority: task.priority
      })));
      */

      // Dữ liệu mẫu
      setTimeout(() => {
        const mockTasks: Task[] = [
          {
            id: '1',
            title: 'Implement Smart Contract',
            description: 'Create and deploy the main task management smart contract',
            status: 'pending' as 'pending',
            createdBy: 'Admin',
            createdAt: '01/03/2023',
            priority: 'high'
          },
          {
            id: '2',
            title: 'Design User Interface',
            description: 'Create UI designs for the DApp',
            status: 'in_progress' as 'in_progress',
            createdBy: 'Admin',
            assignee: 'Alice',
            dueDate: '2023-04-15',
            createdAt: '05/03/2023',
            priority: 'medium'
          },
          {
            id: '3',
            title: 'Test Web3 Integration',
            description: 'Test the integration with Web3 wallets',
            status: 'completed' as 'completed',
            createdBy: 'Admin',
            assignee: 'Bob',
            dueDate: '2023-03-20',
            createdAt: '10/03/2023',
            priority: 'medium'
          },
          {
            id: '4',
            title: 'Fix Authentication Bug',
            description: 'Fix the authentication issue with MetaMask',
            status: 'in_progress' as 'in_progress',
            createdBy: 'Alice',
            assignee: 'Charlie',
            dueDate: '2023-04-10',
            createdAt: '15/03/2023',
            priority: 'high'
          },
          {
            id: '5',
            title: 'Write Documentation',
            description: 'Document the smart contract functions and API',
            status: 'pending' as 'pending',
            createdBy: 'Admin',
            assignee: 'David',
            dueDate: '2023-04-30',
            createdAt: '20/03/2023',
            priority: 'low'
          }
        ];
        setTasks(mockTasks);
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('Lỗi khi tải danh sách task');
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Giả định: Đây là nơi bạn sẽ gọi API hoặc blockchain để lấy danh sách người dùng
      // Ví dụ:
      /*
      const users = await contractInstance.getUsers();
      setUsers(users.filter(user => user.status === 'active').map(user => ({
        id: user.id,
        username: user.username,
        role: user.role
      })));
      */

      // Dữ liệu mẫu
      const mockUsers: User[] = [
        { id: '1', username: 'Admin', role: 'admin' },
        { id: '2', username: 'Alice', role: 'teamLead' },
        { id: '3', username: 'Bob', role: 'employee' },
        { id: '4', username: 'Charlie', role: 'employee' },
        { id: '5', username: 'David', role: 'employee' }
      ];
      setUsers(mockUsers);
    } catch (error) {
      message.error('Lỗi khi tải danh sách người dùng');
    }
  };

  const handleCreateTask = async (values: any) => {
    try {
      // Giả định: Tạo task mới trên blockchain
      // Ví dụ:
      /*
      const transaction = await contractInstance.createTask(
        values.title,
        values.description,
        values.assignee,
        values.dueDate ? Math.floor(new Date(values.dueDate).getTime() / 1000) : 0,
        values.priority
      );
      await transaction.wait();
      */

      // Mô phỏng tạo thành công
      const newTask: Task = {
        id: (tasks.length + 1).toString(),
        title: values.title,
        description: values.description,
        status: 'pending' as 'pending',
        createdBy: 'Admin', // Giả định người dùng hiện tại
        assignee: values.assignee,
        dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : undefined,
        createdAt: new Date().toLocaleDateString(),
        priority: values.priority
      };

      setTasks([...tasks, newTask]);
      message.success('Tạo task thành công');
      setCreateModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Lỗi khi tạo task');
    }
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    editForm.setFieldsValue({
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      dueDate: task.dueDate ? moment(task.dueDate) : null,
      priority: task.priority,
      status: task.status
    });
    setEditModalVisible(true);
  };

  const handleUpdateTask = async (values: any) => {
    if (!currentTask) return;

    try {
      // Giả định: Cập nhật task trên blockchain
      // Ví dụ:
      /*
      const transaction = await contractInstance.updateTask(
        currentTask.id,
        values.title,
        values.description,
        values.status,
        values.assignee,
        values.dueDate ? Math.floor(new Date(values.dueDate).getTime() / 1000) : 0,
        values.priority
      );
      await transaction.wait();
      */

      // Mô phỏng cập nhật thành công
      const updatedTasks = tasks.map(task => {
        if (task.id === currentTask.id) {
          return {
            ...task,
            title: values.title,
            description: values.description,
            status: values.status as 'pending' | 'in_progress' | 'completed',
            assignee: values.assignee,
            dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : undefined,
            priority: values.priority
          };
        }
        return task;
      });

      setTasks(updatedTasks);
      message.success('Cập nhật task thành công');
      setEditModalVisible(false);
    } catch (error) {
      message.error('Lỗi khi cập nhật task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      // Giả định: Xóa task trên blockchain
      // Ví dụ:
      /*
      const transaction = await contractInstance.deleteTask(taskId);
      await transaction.wait();
      */

      // Mô phỏng xóa thành công
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      message.success('Xóa task thành công');
    } catch (error) {
      message.error('Lỗi khi xóa task');
    }
  };

  const handleViewTaskDetails = (taskId: string) => {
    navigate(`/task-details?id=${taskId}`);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'pending':
        return <Tag color="default">Chờ xử lý</Tag>;
      case 'in_progress':
        return <Tag color="processing">Đang xử lý</Tag>;
      case 'completed':
        return <Tag color="success">Hoàn thành</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getPriorityTag = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Tag color="green">Thấp</Tag>;
      case 'medium':
        return <Tag color="blue">Trung bình</Tag>;
      case 'high':
        return <Tag color="red">Cao</Tag>;
      default:
        return <Tag>{priority}</Tag>;
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Text strong>{text}</Text>,
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value: any, record: Task) => 
        record.title.toLowerCase().includes(value.toString().toLowerCase()) ||
        record.description.toLowerCase().includes(value.toString().toLowerCase())
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filteredValue: statusFilter ? [statusFilter] : null,
      onFilter: (value: any, record: Task) => record.status === value.toString(),
      filters: [
        { text: 'Chờ xử lý', value: 'pending' },
        { text: 'Đang xử lý', value: 'in_progress' },
        { text: 'Hoàn thành', value: 'completed' }
      ]
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => getPriorityTag(priority),
      filters: [
        { text: 'Cao', value: 'high' },
        { text: 'Trung bình', value: 'medium' },
        { text: 'Thấp', value: 'low' }
      ],
      onFilter: (value: any, record: Task) => record.priority === value.toString()
    },
    {
      title: 'Người được giao',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (assignee: string) => assignee || <Text type="secondary">Chưa giao</Text>
    },
    {
      title: 'Hạn hoàn thành',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (dueDate: string) => dueDate || <Text type="secondary">Không có</Text>
    },
    {
      title: 'Tạo bởi',
      dataIndex: 'createdBy',
      key: 'createdBy'
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Task) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewTaskDetails(record.id)} 
            />
          </Tooltip>
          {/* Admin và TeamLead có thể chỉnh sửa */}
          {(userRole === 'admin' || userRole === 'teamLead') && (
            <Tooltip title="Chỉnh sửa">
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => handleEditTask(record)} 
              />
            </Tooltip>
          )}
          {/* Chỉ Admin có thể xóa */}
          {userRole === 'admin' && (
            <Tooltip title="Xóa">
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa task này không?"
                onConfirm={() => handleDeleteTask(record.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          )}
          {/* Nhân viên chỉ có thể đánh dấu hoàn thành khi task được giao cho họ và đang trong trạng thái in_progress */}
          {userRole === 'employee' && record.status === 'in_progress' && (
            <Tooltip title="Đánh dấu hoàn thành">
              <Button 
                type="text" 
                icon={<CheckCircleOutlined />} 
                style={{ color: '#52c41a' }}
                onClick={() => {
                  const updatedTasks = tasks.map(task => {
                    if (task.id === record.id) {
                      return { ...task, status: 'completed' };
                    }
                    return task;
                  });
                  setTasks(updatedTasks);
                  message.success('Task đã được đánh dấu hoàn thành');
                }}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const filteredTasks = tasks.filter(task => {
    if (searchText && !(task.title.toLowerCase().includes(searchText.toLowerCase()) || 
                       task.description.toLowerCase().includes(searchText.toLowerCase()))) {
      return false;
    }
    if (statusFilter && task.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const handleToggleStatus = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'in_progress' ? 'completed' : 'in_progress';
        return {
          ...task,
          status: newStatus as 'pending' | 'in_progress' | 'completed'
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    message.success('Task status updated');
  };

  return (
    <div className="task-management-container">
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={2}>Quản Lý Task</Title>
            {/* Chỉ Admin và TeamLead có thể tạo task mới */}
            {(userRole === 'admin' || userRole === 'teamLead') && (
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => {
                  form.resetFields();
                  setCreateModalVisible(true);
                }}
              >
                Tạo Task Mới
              </Button>
            )}
          </div>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Input
                placeholder="Tìm kiếm theo tiêu đề hoặc mô tả"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col span={8}>
              <Select
                placeholder="Lọc theo trạng thái"
                style={{ width: '100%' }}
                allowClear
                onChange={(value) => setStatusFilter(value)}
              >
                <Option value="pending">Chờ xử lý</Option>
                <Option value="in_progress">Đang xử lý</Option>
                <Option value="completed">Hoàn thành</Option>
              </Select>
            </Col>
          </Row>
          
          <Table 
            columns={columns} 
            dataSource={tasks} 
            rowKey="id" 
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1100 }}
          />
        </Space>
      </Card>

      {/* Modal tạo task mới */}
      <Modal
        title="Tạo Task Mới"
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateTask}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề task' }]}
          >
            <Input placeholder="Nhập tiêu đề task" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả task' }]}
          >
            <TextArea 
              placeholder="Nhập mô tả chi tiết về task" 
              rows={4} 
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assignee"
                label="Người thực hiện"
              >
                <Select placeholder="Chọn người thực hiện">
                  {users.filter(user => user.role !== 'admin').map(user => (
                    <Option key={user.id} value={user.username}>
                      {user.username}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Độ ưu tiên"
                initialValue="medium"
                rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên' }]}
              >
                <Select placeholder="Chọn độ ưu tiên">
                  <Option value="low">Thấp</Option>
                  <Option value="medium">Trung bình</Option>
                  <Option value="high">Cao</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="dueDate"
            label="Hạn hoàn thành"
          >
            <DatePicker 
              placeholder="Chọn hạn hoàn thành" 
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Tạo Task
              </Button>
              <Button onClick={() => setCreateModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa task */}
      <Modal
        title="Chỉnh Sửa Task"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateTask}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề task' }]}
          >
            <Input placeholder="Nhập tiêu đề task" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả task' }]}
          >
            <TextArea 
              placeholder="Nhập mô tả chi tiết về task" 
              rows={4} 
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assignee"
                label="Người thực hiện"
              >
                <Select placeholder="Chọn người thực hiện">
                  {users.filter(user => user.role !== 'admin').map(user => (
                    <Option key={user.id} value={user.username}>
                      {user.username}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="pending">Chờ xử lý</Option>
                  <Option value="in_progress">Đang xử lý</Option>
                  <Option value="completed">Hoàn thành</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Độ ưu tiên"
                rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên' }]}
              >
                <Select placeholder="Chọn độ ưu tiên">
                  <Option value="low">Thấp</Option>
                  <Option value="medium">Trung bình</Option>
                  <Option value="high">Cao</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Hạn hoàn thành"
              >
                <DatePicker 
                  placeholder="Chọn hạn hoàn thành" 
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskManagement; 