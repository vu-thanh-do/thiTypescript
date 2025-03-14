import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Descriptions, 
  Tag, 
  Space, 
  Button, 
  Divider, 
  Timeline, 
  Empty, 
  Spin,
  Progress,
  Badge,
  Avatar,
  message,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
  InputNumber
} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircleOutlined, 
  SyncOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  CommentOutlined,
  HistoryOutlined,
  EditOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdBy: string;
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  progress?: number;
  priority: 'low' | 'medium' | 'high';
}

interface StatusHistory {
  id: string;
  status: string;
  timestamp: string;
  user: string;
  comment?: string;
}

const TaskDetails: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [completeForm] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string>('employee');

  // Lấy taskId từ query parameter
  const taskId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    // Giả định: Lấy vai trò người dùng từ localStorage
    const role = localStorage.getItem('userRole');
    setUserRole(role || 'employee');

    if (taskId) {
      fetchTaskDetails(taskId);
      fetchStatusHistory(taskId);
    } else {
      message.error('Task ID không hợp lệ');
      navigate('/task-management');
    }
  }, [taskId]);

  const fetchTaskDetails = async (id: string) => {
    setLoading(true);
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
        createdBy: taskData.createdBy,
        assignee: taskData.assignee,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate * 1000).toISOString().split('T')[0] : undefined,
        createdAt: new Date(taskData.createdAt * 1000).toLocaleString(),
        progress: taskData.progress,
        priority: taskData.priority
      });
      */

      // Dữ liệu mẫu
      setTimeout(() => {
        const mockTask: Task = {
          id: id,
          title: 'Design User Interface',
          description: 'Create UI designs for the DApp including dashboard, task management, and user profile screens.',
          status: 'in_progress' as 'in_progress',
          createdBy: 'Admin',
          assignee: 'Alice',
          dueDate: '2023-04-15',
          createdAt: '05/03/2023',
          progress: 60,
          priority: 'medium'
        };
        setTask(mockTask);
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('Lỗi khi tải chi tiết task');
      setLoading(false);
    }
  };

  const fetchStatusHistory = async (id: string) => {
    try {
      // Giả định: Đây là nơi bạn sẽ gọi API hoặc blockchain để lấy lịch sử trạng thái
      // Ví dụ:
      /*
      const history = await contractInstance.getTaskStatusHistory(id);
      setStatusHistory(history.map(item => ({
        id: item.id,
        status: item.status,
        timestamp: new Date(item.timestamp * 1000).toLocaleString(),
        user: item.user,
        comment: item.comment
      })));
      */

      // Dữ liệu mẫu
      const mockHistory: StatusHistory[] = [
        {
          id: '1',
          status: 'pending',
          timestamp: '05/03/2023 09:30:00',
          user: 'Admin',
          comment: 'Task được tạo'
        },
        {
          id: '2',
          status: 'in_progress',
          timestamp: '07/03/2023 14:15:00',
          user: 'Alice',
          comment: 'Bắt đầu làm việc trên task'
        },
        {
          id: '3',
          status: 'in_progress',
          timestamp: '10/03/2023 11:45:00',
          user: 'Alice',
          comment: 'Cập nhật tiến độ: 30%'
        },
        {
          id: '4',
          status: 'in_progress',
          timestamp: '12/03/2023 16:20:00',
          user: 'Alice',
          comment: 'Cập nhật tiến độ: 60%'
        }
      ];
      setStatusHistory(mockHistory);
    } catch (error) {
      message.error('Lỗi khi tải lịch sử trạng thái');
    }
  };

  const handleUpdateProgress = async (values: any) => {
    if (!task) return;

    try {
      // Giả định: Cập nhật tiến độ task trên blockchain
      // Ví dụ:
      /*
      const transaction = await contractInstance.updateTaskProgress(
        task.id,
        values.progress,
        values.status,
        values.comment
      );
      await transaction.wait();
      */

      // Mô phỏng cập nhật thành công
      const updatedTask = {
        ...task,
        progress: values.progress,
        status: values.status as 'pending' | 'in_progress' | 'completed'
      };
      setTask(updatedTask);

      // Thêm vào lịch sử trạng thái
      const newHistoryItem: StatusHistory = {
        id: (statusHistory.length + 1).toString(),
        status: values.status,
        timestamp: new Date().toLocaleString(),
        user: 'Alice', // Giả định người dùng hiện tại
        comment: `Cập nhật tiến độ: ${values.progress}% - ${values.comment}`
      };
      setStatusHistory([...statusHistory, newHistoryItem]);

      message.success('Cập nhật tiến độ thành công');
      setUpdateModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Lỗi khi cập nhật tiến độ');
    }
  };

  const handleCompleteTask = async (values: any) => {
    if (!task) return;

    try {
      // Giả định: Đánh dấu task hoàn thành trên blockchain
      // Ví dụ:
      /*
      const transaction = await contractInstance.completeTask(
        task.id,
        values.result,
        values.ipfsHash || ''
      );
      await transaction.wait();
      */

      // Mô phỏng cập nhật thành công
      const updatedTask = {
        ...task,
        status: 'completed' as 'completed',
        progress: 100
      };
      setTask(updatedTask);

      // Thêm vào lịch sử trạng thái
      const newHistoryItem: StatusHistory = {
        id: (statusHistory.length + 1).toString(),
        status: 'completed',
        timestamp: new Date().toLocaleString(),
        user: 'Alice', // Giả định người dùng hiện tại
        comment: `Task hoàn thành - ${values.result}`
      };
      setStatusHistory([...statusHistory, newHistoryItem]);

      message.success('Đánh dấu task hoàn thành');
      setCompleteModalVisible(false);
      completeForm.resetFields();
    } catch (error) {
      message.error('Lỗi khi hoàn thành task');
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'pending':
        return <Tag icon={<ClockCircleOutlined />} color="default">Chờ xử lý</Tag>;
      case 'in_progress':
        return <Tag icon={<SyncOutlined spin />} color="processing">Đang xử lý</Tag>;
      case 'completed':
        return <Tag icon={<CheckCircleOutlined />} color="success">Hoàn thành</Tag>;
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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success';
    if (progress >= 30) return 'normal';
    return 'exception';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!task) {
    return (
      <Empty description="Không tìm thấy thông tin task" />
    );
  }

  return (
    <div className="task-details-container">
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <Title level={2}>{task.title}</Title>
              <Space>
                {getStatusTag(task.status)}
                {getPriorityTag(task.priority)}
                <Text type="secondary">ID: {task.id}</Text>
              </Space>
            </div>
            <Space>
              <Button 
                icon={<CommentOutlined />} 
                onClick={() => navigate(`/task-comments?id=${task.id}`)}
              >
                Bình luận
              </Button>
              {task.status === 'in_progress' && task.assignee === 'Alice' && (
                <>
                  <Button 
                    type="primary" 
                    ghost 
                    icon={<EditOutlined />} 
                    onClick={() => {
                      form.setFieldsValue({
                        progress: task.progress,
                        status: task.status,
                        comment: ''
                      });
                      setUpdateModalVisible(true);
                    }}
                  >
                    Cập nhật tiến độ
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<CheckCircleOutlined />} 
                    onClick={() => setCompleteModalVisible(true)}
                  >
                    Đánh dấu hoàn thành
                  </Button>
                </>
              )}
              {task.status === 'pending' && (userRole === 'employee') && (
                <Popconfirm 
                  title="Bạn muốn nhận task này phải không?"
                  onConfirm={() => {
                    const updatedTask = {
                      ...task,
                      status: 'in_progress' as 'in_progress',
                      assignee: 'Alice' // Giả định người dùng hiện tại
                    };
                    setTask(updatedTask);
                    
                    // Thêm vào lịch sử
                    const newHistoryItem: StatusHistory = {
                      id: (statusHistory.length + 1).toString(),
                      status: 'in_progress',
                      timestamp: new Date().toLocaleString(),
                      user: 'Alice',
                      comment: 'Đã nhận task'
                    };
                    setStatusHistory([...statusHistory, newHistoryItem]);
                    message.success('Đã nhận task');
                  }}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button type="primary">Nhận Task</Button>
                </Popconfirm>
              )}
            </Space>
          </div>

          <Divider />

          <Row gutter={24}>
            <Col span={16}>
              <div className="task-description">
                <Title level={4}>Mô tả</Title>
                <Paragraph>{task.description}</Paragraph>
              </div>
              
              {task.progress !== undefined && (
                <div className="task-progress" style={{ marginTop: 24 }}>
                  <Title level={4}>Tiến độ</Title>
                  <Progress 
                    percent={task.progress} 
                    status={getProgressColor(task.progress)} 
                    strokeWidth={15}
                  />
                </div>
              )}

              <Divider />

              <div className="task-history">
                <Title level={4}>
                  <Space>
                    <HistoryOutlined />
                    Lịch sử hoạt động
                  </Space>
                </Title>
                <Timeline>
                  {statusHistory.map((item) => (
                    <Timeline.Item key={item.id} color={
                      item.status === 'completed' ? 'green' : 
                      item.status === 'in_progress' ? 'blue' : 'gray'
                    }>
                      <div>
                        <Text strong>{item.user}</Text>
                        <Text> {item.comment}</Text>
                      </div>
                      <div>
                        <Text type="secondary">{item.timestamp}</Text>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            </Col>
            <Col span={8}>
              <Card title="Thông tin Task" type="inner">
                <Descriptions column={1} layout="horizontal" bordered>
                  <Descriptions.Item label="Người tạo">
                    <Space>
                      <Avatar icon={<UserOutlined />} />
                      {task.createdBy}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo">
                    {task.createdAt}
                  </Descriptions.Item>
                  <Descriptions.Item label="Người thực hiện">
                    {task.assignee ? (
                      <Space>
                        <Avatar icon={<UserOutlined />} />
                        {task.assignee}
                      </Space>
                    ) : (
                      <Text type="secondary">Chưa giao</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hạn hoàn thành">
                    {task.dueDate || <Text type="secondary">Không có</Text>}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    {getStatusTag(task.status)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Độ ưu tiên">
                    {getPriorityTag(task.priority)}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </Space>
      </Card>

      {/* Modal cập nhật tiến độ */}
      <Modal
        title="Cập nhật tiến độ Task"
        visible={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProgress}
        >
          <Form.Item
            name="progress"
            label="Tiến độ (%)"
            rules={[{ required: true, message: 'Vui lòng nhập tiến độ' }]}
          >
            <InputNumber 
              min={0} 
              max={100} 
              style={{ width: '100%' }} 
              formatter={value => `${value}%`}
              parser={value => value!.replace('%', '')}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Option value="in_progress">Đang xử lý</Option>
              <Option value="completed">Hoàn thành</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="comment"
            label="Ghi chú"
            rules={[{ required: true, message: 'Vui lòng nhập ghi chú' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Mô tả về cập nhật tiến độ này" 
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
              <Button onClick={() => setUpdateModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal hoàn thành task */}
      <Modal
        title="Đánh dấu Task hoàn thành"
        visible={completeModalVisible}
        onCancel={() => setCompleteModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={completeForm}
          layout="vertical"
          onFinish={handleCompleteTask}
        >
          <Form.Item
            name="result"
            label="Kết quả công việc"
            rules={[{ required: true, message: 'Vui lòng nhập kết quả công việc' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Mô tả kết quả đã đạt được" 
            />
          </Form.Item>

          <Form.Item
            name="ipfsHash"
            label="IPFS Hash (nếu có)"
          >
            <Input placeholder="Hash của tài liệu đã tải lên IPFS" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Hoàn thành Task
              </Button>
              <Button onClick={() => setCompleteModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskDetails; 