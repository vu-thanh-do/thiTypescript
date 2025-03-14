import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  List, 
  Comment, 
  Avatar, 
  Form, 
  Button, 
  Input, 
  Divider,
  Space,
  Empty,
  Spin,
  message,
  Badge,
  Tooltip
} from 'antd';
import { 
  UserOutlined, 
  SendOutlined,
  MessageOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface CommentItem {
  id: string;
  content: string;
  author: string;
  datetime: string;
  avatarUrl?: string;
}

interface Task {
  id: string;
  title: string;
}

const TaskComments: React.FC = () => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [task, setTask] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy taskId từ query parameter
  const taskId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails(taskId);
      fetchComments(taskId);
    } else {
      message.error('Task ID không hợp lệ');
      navigate('/task-management');
    }
  }, [taskId]);

  const fetchTaskDetails = async (id: string) => {
    try {
      // Giả định: Đây là nơi bạn sẽ gọi API hoặc blockchain để lấy thông tin task
      // Ví dụ:
      /*
      const taskData = await contractInstance.getTaskById(id);
      setTask({
        id: taskData.id,
        title: taskData.title
      });
      */

      // Dữ liệu mẫu
      setTimeout(() => {
        setTask({
          id,
          title: 'Design User Interface'
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('Lỗi khi tải thông tin task');
      setLoading(false);
    }
  };

  const fetchComments = async (id: string) => {
    try {
      // Giả định: Đây là nơi bạn sẽ gọi API hoặc blockchain để lấy danh sách bình luận
      // Ví dụ:
      /*
      const commentData = await contractInstance.getTaskComments(id);
      setComments(commentData.map(comment => ({
        id: comment.id,
        content: comment.content,
        author: comment.author,
        datetime: new Date(comment.datetime * 1000).toLocaleString(),
        avatarUrl: comment.avatarUrl
      })));
      */

      // Dữ liệu mẫu
      const mockComments: CommentItem[] = [
        {
          id: '1',
          content: 'Tôi đã bắt đầu làm việc trên task này. Cần thêm thông tin về yêu cầu màu sắc.',
          author: 'Alice',
          datetime: '10/03/2023 14:23:00'
        },
        {
          id: '2',
          content: 'Màu sắc chủ đạo nên sử dụng xanh dương và trắng, phù hợp với nhận diện thương hiệu.',
          author: 'Admin',
          datetime: '10/03/2023 15:45:00'
        },
        {
          id: '3',
          content: 'Đã hiểu. Tôi sẽ sử dụng bảng màu đó cho thiết kế.',
          author: 'Alice',
          datetime: '10/03/2023 16:10:00'
        }
      ];
      setComments(mockComments);
    } catch (error) {
      message.error('Lỗi khi tải bình luận');
    }
  };

  const handleSubmitComment = async () => {
    if (!commentValue.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      // Giả định: Đây là nơi bạn sẽ gọi API hoặc blockchain để thêm bình luận mới
      // Ví dụ:
      /*
      const transaction = await contractInstance.addTaskComment(
        taskId,
        commentValue
      );
      await transaction.wait();
      */

      // Mô phỏng thêm bình luận thành công
      const newComment: CommentItem = {
        id: (comments.length + 1).toString(),
        content: commentValue,
        author: 'Alice', // Giả định người dùng hiện tại
        datetime: new Date().toLocaleString()
      };

      setComments([...comments, newComment]);
      setCommentValue('');
      message.success('Đã thêm bình luận');
    } catch (error) {
      message.error('Lỗi khi thêm bình luận');
    } finally {
      setSubmitting(false);
    }
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
    <div className="task-comments-container">
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Space>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate(`/task-details?id=${taskId}`)}
              >
                Quay lại Task
              </Button>
              <Title level={2} style={{ margin: 0 }}>
                <Space>
                  <MessageOutlined />
                  Bình luận Task
                </Space>
              </Title>
            </Space>
            <div style={{ marginTop: 8 }}>
              <Badge status="processing" text={<Text strong>{task.title}</Text>} />
              <Text type="secondary" style={{ marginLeft: 8 }}>ID: {task.id}</Text>
            </div>
          </div>

          <Divider />

          <div className="comment-list">
            {comments.length > 0 ? (
              <List
                dataSource={comments}
                itemLayout="horizontal"
                renderItem={item => (
                  <Comment
                    author={<Text strong>{item.author}</Text>}
                    avatar={<Avatar icon={<UserOutlined />} />}
                    content={<Paragraph>{item.content}</Paragraph>}
                    datetime={
                      <Tooltip title={item.datetime}>
                        <Text type="secondary">{item.datetime}</Text>
                      </Tooltip>
                    }
                  />
                )}
              />
            ) : (
              <Empty description="Chưa có bình luận nào" />
            )}
          </div>

          <Divider />

          <div className="comment-editor">
            <Form>
              <Form.Item>
                <TextArea 
                  rows={4} 
                  value={commentValue}
                  onChange={e => setCommentValue(e.target.value)}
                  placeholder="Viết bình luận của bạn..."
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  htmlType="submit" 
                  loading={submitting} 
                  onClick={handleSubmitComment} 
                  type="primary"
                  icon={<SendOutlined />}
                  disabled={!commentValue.trim()}
                >
                  Gửi bình luận
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default TaskComments; 