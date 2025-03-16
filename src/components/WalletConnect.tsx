import React from 'react';
import { Button, Typography, Space, Tooltip } from 'antd';
import { WalletOutlined, LinkOutlined, LoadingOutlined } from '@ant-design/icons';
import { useBlockchain } from '../contexts/BlockchainContext';

const { Text } = Typography;

const WalletConnect: React.FC = () => {
    const { isConnected, walletAddress, connectWallet, loading, userRole } = useBlockchain();

    // Hàm rút gọn địa chỉ ví
    const truncateAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    // Hiển thị vai trò
    const getRoleDisplay = (role: string | null) => {
        if (!role) return null;

        switch (role) {
            case 'admin':
                return <Text type="danger">(Admin)</Text>;
            case 'teamLead':
                return <Text type="warning">(Team Lead)</Text>;
            case 'employee':
                return <Text type="success">(Nhân viên)</Text>;
            default:
                return null;
        }
    };

    return (
        <div style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {isConnected && walletAddress ? (
                <Space>
                    <Tooltip title={walletAddress}>
                        <Button icon={<WalletOutlined />} type="text">
                            {truncateAddress(walletAddress)} {getRoleDisplay(userRole)}
                        </Button>
                    </Tooltip>
                </Space>
            ) : (
                <Button
                    type="primary"
                    icon={<LinkOutlined />}
                    onClick={connectWallet}
                    loading={loading}
                >
                    Kết nối ví
                </Button>
            )}
        </div>
    );
};

export default WalletConnect; 