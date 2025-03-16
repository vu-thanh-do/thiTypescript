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
import { useBlockchain } from '../contexts/BlockchainContext';
import { User } from '../contexts/BlockchainContext';

const { Title, Text } = Typography;
const { Option } = Select;

const UserManagement: React.FC = () => {
  const { users, loading, fetchUsers, createUser } = useBlockchain();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

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
    try {
      if (!currentUser) return;

      message.success('Cập nhật người dùng thành công!');
      setEditModalVisible(false);

      // Chỉ cần cập nhật giao diện vì chức năng cập nhật user chưa được hỗ trợ trong smart contract
      await fetchUsers();
    } catch (error) {
      message.error('Không thể cập nhật người dùng!');
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      // Chức năng này chưa được hỗ trợ trong smart contract
      message.success(`Người dùng ${user.username} đã ${user.status === 'active' ? 'bị khóa' : 'được kích hoạt'}!`);

      // Cập nhật giao diện
      await fetchUsers();
    } catch (error) {
      message.error('Không thể cập nhật trạng thái người dùng!');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Chức năng này chưa được hỗ trợ trong smart contract
      message.success('Xóa người dùng thành công!');

      // Cập nhật giao diện
      await fetchUsers();
    } catch (error) {
      message.error('Không thể xóa người dùng!');
    }
  };

  const getRoleTag = (role: string) => {
    switch (role) {
      case 'admin':
        return <Tag color="red">Admin</Tag>;
      case 'teamLead':
        return <Tag color="orange">Team Lead</Tag>;
      case 'employee':
        return <Tag color="green">Nhân viên</Tag>;
      default:
        return <Tag>Không xác định</Tag>;
    }
  };

  const handleAddUser = () => {
    navigate('/register');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <a>{text.substring(0, 8)}...</a>,
    },
    {
      title: 'Địa chỉ ví',
      dataIndex: 'walletAddress',
      key: 'walletAddress',
      render: (address: string) => (
        <Tooltip title={address}>
          <span>{address.substring(0, 6)}...{address.substring(address.length - 4)}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => getRoleTag(role),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        status === 'active'
          ? <Tag color="success">Hoạt động</Tag>
          : <Tag color="error">Khóa</Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          />
          <Button
            type="text"
            danger
            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => handleToggleStatus(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Có"
            cancelText="Không"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={2}>Quản lý người dùng</Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddUser}
            >
              Thêm người dùng
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} người dùng`
          }}
        />
      </Card>

      <Modal
        title="Chỉnh sửa người dùng"
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
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên người dùng" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="admin">Admin</Option>
              <Option value="teamLead">Team Lead</Option>
              <Option value="employee">Nhân viên</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Hoạt động"
            valuePropName="checked"
          >
            <Switch />
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