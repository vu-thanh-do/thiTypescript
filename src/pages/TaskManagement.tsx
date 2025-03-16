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
import { useBlockchain } from '../contexts/BlockchainContext';
import { Task } from '../contexts/BlockchainContext';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const TaskManagement: React.FC = () => {
  const { tasks, users, loading, fetchTasks, createTask, assignTask, updateTaskStatus } = useBlockchain();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  const userRole = 'admin'
  // Cập nhật tasks đã lọc khi data hoặc bộ lọc thay đổi
  useEffect(() => {
    let result = [...tasks];

    // Lọc theo trạng thái
    if (statusFilter) {
      result = result.filter(task => task.status === statusFilter);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTasks(result);
  }, [tasks, statusFilter, searchText]);

  // Xử lý tạo task mới
  const handleCreateTask = async (values: any) => {
    try {
      await createTask(values.title, values.description);
      setCreateModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Lỗi tạo task:', error);
    }
  };

  // Mở modal chỉnh sửa task
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    editForm.setFieldsValue({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setEditModalVisible(true);
  };

  // Cập nhật task
  const handleUpdateTask = async (values: any) => {
    try {
      if (!currentTask) return;

      // Nếu trạng thái thay đổi, cập nhật trạng thái
      if (values.status !== currentTask.status) {
        await updateTaskStatus(currentTask.id, values.status);
      }

      setEditModalVisible(false);
      message.success('Cập nhật nhiệm vụ thành công!');
    } catch (error) {
      console.error('Lỗi cập nhật task:', error);
      message.error('Không thể cập nhật nhiệm vụ!');
    }
  };

  // Xử lý xóa task
  const handleDeleteTask = async (taskId: string) => {
    try {
      // Chức năng này chưa được hỗ trợ trong smart contract
      message.info('Chức năng xóa nhiệm vụ chưa được hỗ trợ trong smart contract');
    } catch (error) {
      console.error('Lỗi xóa task:', error);
      message.error('Không thể xóa nhiệm vụ!');
    }
  };

  // Xử lý xem chi tiết task
  const handleViewTaskDetails = (taskId: string) => {
    navigate(`/task-details?id=${taskId}`);
  };

  // Lấy tag hiển thị trạng thái
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'created':
        return <Tag color="default">Đã tạo</Tag>;
      case 'assigned':
        return <Tag color="blue">Đã phân công</Tag>;
      case 'in_progress':
        return <Tag color="processing">Đang xử lý</Tag>;
      case 'completed':
        return <Tag color="success">Hoàn thành</Tag>;
      case 'rejected':
        return <Tag color="error">Từ chối</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // Lấy tag hiển thị độ ưu tiên
  const getPriorityTag = (priority: string = 'medium') => {
    switch (priority) {
      case 'high':
        return <Tag color="red">Cao</Tag>;
      case 'medium':
        return <Tag color="orange">Trung bình</Tag>;
      case 'low':
        return <Tag color="green">Thấp</Tag>;
      default:
        return <Tag>Không xác định</Tag>;
    }
  };

  // Lấy tên người dùng từ địa chỉ ví
  const getUsernameFromAddress = (address: string) => {
    const user = users.find(u => u.walletAddress === address);
    return user ? user.username : address.substring(0, 6) + '...' + address.substring(address.length - 4);
  };

  // Sự kiện thay đổi trạng thái task
  const handleToggleStatus = async (taskId: string, status: string) => {
    try {
      await updateTaskStatus(taskId, status);
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
      message.error('Không thể cập nhật trạng thái nhiệm vụ!');
    }
  };

  // Cấu hình cột cho bảng task
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <a>{id.substring(0, 4)}...</a>,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (address: string) => getUsernameFromAddress(address),
    },
    {
      title: 'Người được giao',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (address: string) => address ? getUsernameFromAddress(address) : <Text type="secondary">Chưa giao</Text>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Task) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewTaskDetails(record.id)}
          />
          {(userRole === 'admin' || userRole === 'teamLead') && (
            <>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEditTask(record)}
              />
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa nhiệm vụ này?"
                onConfirm={() => handleDeleteTask(record.id)}
                okText="Có"
                cancelText="Không"
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          )}
          {userRole === 'employee' && record.assignee === useBlockchain().walletAddress && (
            <Button
              type="text"
              icon={<CheckCircleOutlined />}
              onClick={() => handleToggleStatus(record.id, record.status === 'assigned' ? 'in_progress' : 'completed')}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={2}>Quản lý nhiệm vụ</Title>
          </Col>
          <Col>
            {(userRole === 'admin' || userRole === 'teamLead') && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                Tạo nhiệm vụ mới
              </Button>
            )}
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={16}>
            <Input
              placeholder="Tìm kiếm nhiệm vụ theo tiêu đề hoặc mô tả"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="Lọc theo trạng thái"
              style={{ width: '100%' }}
              allowClear
              onChange={(value) => setStatusFilter(value)}
            >
              <Option value="created">Đã tạo</Option>
              <Option value="assigned">Đã phân công</Option>
              <Option value="in_progress">Đang xử lý</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="rejected">Từ chối</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredTasks}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} nhiệm vụ`
          }}
        />
      </Card>

      {/* Modal tạo nhiệm vụ mới */}
      <Modal
        title="Tạo nhiệm vụ mới"
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateTask}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input placeholder="Nhập tiêu đề nhiệm vụ" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <TextArea
              rows={4}
              placeholder="Mô tả chi tiết về nhiệm vụ"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Tạo nhiệm vụ
              </Button>
              <Button onClick={() => setCreateModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa nhiệm vụ */}
      <Modal
        title="Chỉnh sửa nhiệm vụ"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateTask}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <TextArea
              rows={4}
              disabled
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Option value="created">Đã tạo</Option>
              <Option value="assigned">Đã phân công</Option>
              <Option value="in_progress">Đang xử lý</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="rejected">Từ chối</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
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