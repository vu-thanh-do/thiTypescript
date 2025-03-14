import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Typography, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Switch,
  message,
  Popconfirm,
  Tooltip,
  Card,
  Row,
  Col
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  UnlockOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

interface User {
  id: string;
  walletAddress: string;
  username: string;
  role: 'admin' | 'teamLead' | 'employee';
  status: 'active' | 'inactive';
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    // Giả định: Lấy danh sách người dùng từ blockchain hoặc API
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Giả định: Đây là nơi bạn sẽ gọi API hoặc blockchain để lấy danh sách người dùng
      // Ví dụ:
      /*
      const users = await contractInstance.getUsers();
      setUsers(users.map(user => ({
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username,
        role: user.role,
        status: user.status,
        createdAt: new Date(user.createdAt * 1000).toLocaleString()
      })));
      */

      // Dữ liệu mẫu
      setTimeout(() => {
        const mockUsers: User[] = [
          {
            id: '1',
            walletAddress: '0x1234...5678',
            username: 'Admin',
            role: 'admin',
            status: 'active',
            createdAt: '01/03/2023'
          },
          {
            id: '2',
            walletAddress: '0xabcd...efgh',
            username: 'Alice',
            role: 'teamLead',
            status: 'active',
            createdAt: '15/03/2023'
          },
          {
            id: '3',
            walletAddress: '0x9876...5432',
            username: 'Bob',
            role: 'employee',
            status: 'active',
            createdAt: '20/03/2023'
          },
          {
            id: '4',
            walletAddress: '0xijkl...mnop',
            username: 'Charlie',
            role: 'employee',
            status: 'inactive',
            createdAt: '25/03/2023'
          },
          {
            id: '5',
            walletAddress: '0x2468...1357',
            username: 'David',
            role: 'employee',
            status: 'active',
            createdAt: '01/04/2023'
          }
        ];
        setUsers(mockUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('Lỗi khi tải danh sách người dùng');
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    form.setFieldsValue({
      username: user.username,
      role: user.role,
      status: user.status === 'active'
    });
    setEditModalVisible(true);
  };

  const handleUpdateUser = async (values: any) => {
    if (!currentUser) return;

    try {
      // Giả định: Cập nhật người dùng trên blockchain
      // Ví dụ:
      /*
      const transaction = await contractInstance.updateUser(
        currentUser.id,
        values.username,
        values.role,
        values.status ? 'active' : 'inactive'
      );
      await transaction.wait();
      */

      // Mô phỏng cập nhật thành công
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            username: values.username,
            role: values.role,
            status: values.status ? 'active' : 'inactive'
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      message.success('Cập nhật người dùng thành công');
      setEditModalVisible(false);
    } catch (error) {
      message.error('Lỗi khi cập nhật người dùng');
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      // Giả định: Cập nhật trạng thái người dùng trên blockchain
      // Ví dụ:
      /*
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      const transaction = await contractInstance.updateUserStatus(user.id, newStatus);
      await transaction.wait();
      */

      // Mô phỏng cập nhật thành công
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          return {
            ...u,
            status: u.status === 'active' ? 'inactive' : 'active'
          };
        }
        return u;
      });

      setUsers(updatedUsers);
      message.success(`Người dùng đã được ${user.status === 'active' ? 'khóa' : 'mở khóa'}`);
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái người dùng');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Giả định: Xóa người dùng trên blockchain
      // Ví dụ:
      /*
      const transaction = await contractInstance.deleteUser(userId);
      await transaction.wait();
      */

      // Mô phỏng xóa thành công
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      message.success('Xóa người dùng thành công');
    } catch (error) {
      message.error('Lỗi khi xóa người dùng');
    }
  };

  const getRoleTag = (role: string) => {
    switch (role) {
      case 'admin':
        return <Tag color="red">Admin</Tag>;
      case 'teamLead':
        return <Tag color="blue">Team Lead</Tag>;
      case 'employee':
        return <Tag color="green">Employee</Tag>;
      default:
        return <Tag>{role}</Tag>;
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
      title: 'Tên người dùng',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Địa chỉ ví',
      dataIndex: 'walletAddress',
      key: 'walletAddress',
      render: (address: string) => (
        <Tooltip title={address}>
          <Text copyable>{address}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => getRoleTag(role),
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Team Lead', value: 'teamLead' },
        { text: 'Employee', value: 'employee' }
      ],
      onFilter: (value: string, record: User) => record.role === value
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? 'Hoạt động' : 'Bị khóa'}
        </Tag>
      ),
      filters: [
        { text: 'Hoạt động', value: 'active' },
        { text: 'Bị khóa', value: 'inactive' }
      ],
      onFilter: (value: string, record: User) => record.status === value
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditUser(record)} 
          />
          <Button 
            type="text" 
            danger={record.status === 'active'}
            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />} 
            onClick={() => handleToggleStatus(record)} 
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này không?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="user-management-container">
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={2}>Quản Lý Người Dùng</Title>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => navigate('/register')}
                >
                  Thêm Người Dùng
                </Button>
              </div>
              
              <Table 
                columns={columns} 
                dataSource={users} 
                rowKey="id" 
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1000 }}
              />
            </Space>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Chỉnh Sửa Người Dùng"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateUser}
        >
          <Form.Item
            name="username"
            label="Tên người dùng"
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="teamLead">Team Lead</Option>
              <Option value="employee">Employee</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Hoạt động" 
              unCheckedChildren="Bị khóa" 
            />
          </Form.Item>

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

export default UserManagement; 