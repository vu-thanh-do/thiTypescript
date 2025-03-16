import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Alert, Row, Col, Divider, Space } from 'antd';
import { WalletOutlined, LinkOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useBlockchain } from '../contexts/BlockchainContext';

const { Title, Paragraph, Text } = Typography;

const Login: React.FC = () => {
  const { connectWallet, isConnected, walletAddress, loading } = useBlockchain();
  const [networkStatus, setNetworkStatus] = useState<'connected' | 'wrong_network' | 'disconnected'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected && walletAddress) {
      navigate('/');
    }
  }, [isConnected, walletAddress, navigate]);

  // Xử lý kết nối ví
  const handleConnectWallet = async () => {
    setError(null);
    try {
      await connectWallet();
      setNetworkStatus('connected');
    } catch (err) {
      setError((err as Error).message);
    }
  };
  console.log(networkStatus, 'networkStatus');
  const getNetworkStatusMessage = () => {
    switch (networkStatus) {
      case 'connected':
        return <Alert message="Đã kết nối đến mạng Ethereum" type="success" showIcon />;
      case 'wrong_network':
        return <Alert message="Vui lòng chuyển đến mạng Ethereum chính" type="warning" showIcon />;
      case 'disconnected':
      default:
        return <Alert message="Chưa kết nối đến mạng Ethereum" type="info" showIcon />;
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
      <Col xs={22} sm={18} md={12} lg={10} xl={8}>
        <Card
          title={<Title level={2} style={{ textAlign: 'center' }}>Đăng Nhập Blockchain Task</Title>}
          bordered={false}
          style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <WalletOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              <Paragraph style={{ marginTop: 16 }}>
                Kết nối ví Ethereum của bạn để đăng nhập vào hệ thống quản lý task.
              </Paragraph>
            </div>

            {getNetworkStatusMessage()}

            {walletAddress && (
              <Alert
                message="Địa chỉ ví đã kết nối"
                description={walletAddress}
                type="success"
                showIcon
              />
            )}

            {error && (
              <Alert
                message="Lỗi kết nối"
                description={error}
                type="error"
                showIcon
                icon={<ExclamationCircleOutlined />}
              />
            )}

            <Divider />

            <Button
              type="primary"
              icon={<LinkOutlined />}
              size="large"
              block
              onClick={handleConnectWallet}
              loading={loading}
              disabled={isConnected}
            >
              {loading ? 'Đang kết nối...' : walletAddress ? 'Đã kết nối' : 'Kết nối với MetaMask'}
            </Button>

            <Paragraph style={{ textAlign: 'center', fontSize: 12, marginTop: 16 }}>
              <Text type="secondary">
                Bạn cần cài đặt ví MetaMask để sử dụng ứng dụng này.
                Nếu chưa có, <a href="https://metamask.io/download.html" target="_blank" rel="noopener noreferrer">tải MetaMask</a>.
              </Text>
            </Paragraph>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default Login; 