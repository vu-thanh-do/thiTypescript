import React, { useState } from 'react';
import { Form, Input, Button, Select, Card, Row, Col, Typography, Alert, Space, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useBlockchain } from '../contexts/BlockchainContext';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const roleStringToNumber = (role: string): number => {
  switch (role) {
    case 'admin': return 2;
    case 'teamLead': return 1;
    case 'employee': return 0;
    default: return 0;
  }
};

const RegisterUser: React.FC = () => {
  const [form] = Form.useForm();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { createUser, loading } = useBlockchain();

  // Đăng ký người dùng mới sử dụng blockchain
  const onFinish = async (values: any) => {
    setError(null);

    try {
      // Gọi hàm tạo người dùng từ blockchain context
      const roleNumber = roleStringToNumber(values.role);
      await createUser(values.walletAddress, values.username, roleNumber);

      setSuccess(true);
      form.resetFields();
      message.success('Đăng ký người dùng mới thành công!');

      // Sau 2 giây, chuyển hướng về trang quản lý người dùng
      setTimeout(() => {
        navigate('/user-management');
      }, 2000);
    } catch (err) {
      setError((err as Error).message);
      message.error('Đăng ký người dùng thất bại!');
    }
  };

  return (
    <Row justify="center">
      <Col xs={24} sm={20} md={16} lg={14} xl={12}>
        <Card
          title={
            <div style={{ textAlign: 'center' }}>
              <UserAddOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 16 }} />
              <Title level={2}>Đăng Ký Người Dùng Mới</Title>
              <Paragraph type="secondary">
                Admin có thể tạo tài khoản mới cho người dùng trong hệ thống
              </Paragraph>
            </div>
          }
          style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {success && (
              <Alert
                message="Đăng ký thành công"
                description="Người dùng mới đã được tạo thành công. Đang chuyển hướng về trang quản lý người dùng..."
                type="success"
                showIcon
              />
            )}

            {error && (
              <Alert
                message="Lỗi đăng ký"
                description={error}
                type="error"
                showIcon
              />
            )}

            <Form
              form={form}
              name="register_user"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              disabled={loading || success}
            >
              <Form.Item
                name="walletAddress"
                label="Địa Chỉ Ví Ethereum"
                rules={[
                  { required: true, message: 'Vui lòng nhập địa chỉ ví Ethereum' },
                  {
                    pattern: /^0x[a-fA-F0-9]{40}$/,
                    message: 'Địa chỉ ví Ethereum không hợp lệ'
                  }
                ]}
              >
                <Input placeholder="0x..." prefix={<span style={{ color: '#d9d9d9' }}>ETH</span>} />
              </Form.Item>

              <Form.Item
                name="username"
                label="Tên Người Dùng"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên người dùng' },
                  { min: 3, message: 'Tên người dùng phải có ít nhất 3 ký tự' }
                ]}
              >
                <Input placeholder="Nhập tên hiển thị của người dùng" />
              </Form.Item>

              <Form.Item
                name="role"
                label="Vai Trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                initialValue="employee"
              >
                <Select placeholder="Chọn vai trò">
                  <Option value="admin">Admin</Option>
                  <Option value="teamLead">Team Lead</Option>
                  <Option value="employee">Nhân viên</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                >
                  Đăng Ký Người Dùng
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default RegisterUser; 