import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Table, 
  Card, 
  Space, 
  Tag, 
  Button, 
  Input, 
  Row, 
  Col, 
  Tooltip,
  Popover,
  Spin,
  message
} from 'antd';
import { 
  HistoryOutlined, 
  SearchOutlined, 
  LinkOutlined, 
  FileTextOutlined,
  UserOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;

interface Transaction {
  id: string;
  hash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  to: string;
  action: string;
  taskId?: string;
  taskTitle?: string;
  status: 'success' | 'pending' | 'failed';
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = transactions.filter(
        tx => 
          tx.hash.toLowerCase().includes(searchText.toLowerCase()) ||
          tx.action.toLowerCase().includes(searchText.toLowerCase()) ||
          (tx.taskTitle && tx.taskTitle.toLowerCase().includes(searchText.toLowerCase())) ||
          (tx.from && tx.from.toLowerCase().includes(searchText.toLowerCase())) ||
          (tx.to && tx.to.toLowerCase().includes(searchText.toLowerCase()))
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(transactions);
    }
  }, [searchText, transactions]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Giả định: Đây là nơi bạn sẽ gọi API hoặc blockchain để lấy lịch sử giao dịch
      // Ví dụ:
      /*
      const txData = await contractInstance.getTransactionHistory();
      setTransactions(txData.map(tx => ({
        id: tx.id,
        hash: tx.hash,
        blockNumber: tx.blockNumber,
        timestamp: new Date(tx.timestamp * 1000).toLocaleString(),
        from: tx.from,
        to: tx.to,
        action: tx.action,
        taskId: tx.taskId,
        taskTitle: tx.taskTitle,
        status: tx.status
      })));
      */

      // Dữ liệu mẫu
      setTimeout(() => {
        const mockTransactions: Transaction[] = [
          {
            id: '1',
            hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
            blockNumber: 12345678,
            timestamp: '05/03/2023 09:30:00',
            from: '0x1234...5678',
            to: '0x8765...4321',
            action: 'Tạo Task',
            taskId: '1',
            taskTitle: 'Implement Smart Contract',
            status: 'success'
          },
          {
            id: '2',
            hash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
            blockNumber: 12345679,
            timestamp: '05/03/2023 10:45:00',
            from: '0x1234...5678',
            to: '0x8765...4321',
            action: 'Tạo Task',
            taskId: '2',
            taskTitle: 'Design User Interface',
            status: 'success'
          },
          {
            id: '3',
            hash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4',
            blockNumber: 12345680,
            timestamp: '07/03/2023 14:15:00',
            from: '0xabcd...efgh',
            to: '0x8765...4321',
            action: 'Nhận Task',
            taskId: '2',
            taskTitle: 'Design User Interface',
            status: 'success'
          },
          {
            id: '4',
            hash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5',
            blockNumber: 12345681,
            timestamp: '10/03/2023 11:45:00',
            from: '0xabcd...efgh',
            to: '0x8765...4321',
            action: 'Cập nhật tiến độ Task',
            taskId: '2',
            taskTitle: 'Design User Interface',
            status: 'success'
          },
          {
            id: '5',
            hash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6',
            blockNumber: 12345682,
            timestamp: '15/03/2023 16:30:00',
            from: '0x1234...5678',
            to: '0x8765...4321',
            action: 'Đăng ký người dùng',
            status: 'success'
          }
        ];
        setTransactions(mockTransactions);
        setFilteredData(mockTransactions);
        setLoading(false);
      }, 1500);
    } catch (error) {
      message.error('Lỗi khi tải lịch sử giao dịch');
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'success':
        return <Tag color="success">Thành công</Tag>;
      case 'pending':
        return <Tag color="processing">Đang xử lý</Tag>;
      case 'failed':
        return <Tag color="error">Thất bại</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: string) => (
        <Space>
          <ClockCircleOutlined />
          <span>{text}</span>
        </Space>
      ),
      sorter: (a: Transaction, b: Transaction) => 
        moment(a.timestamp, 'DD/MM/YYYY HH:mm:ss').valueOf() - 
        moment(b.timestamp, 'DD/MM/YYYY HH:mm:ss').valueOf()
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (text: string, record: Transaction) => (
        <Space>
          <Text strong>{text}</Text>
          {record.taskTitle && (
            <Button 
              type="link" 
              size="small" 
              onClick={() => navigate(`/task-details?id=${record.taskId}`)}
            >
              {record.taskTitle}
            </Button>
          )}
        </Space>
      )
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'from',
      key: 'from',
      render: (text: string) => (
        <Space>
          <UserOutlined />
          <Tooltip title={text}>
            <Text copyable={{ text }}>{text}</Text>
          </Tooltip>
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: 'Thành công', value: 'success' },
        { text: 'Đang xử lý', value: 'pending' },
        { text: 'Thất bại', value: 'failed' }
      ],
      onFilter: (value: string, record: Transaction) => record.status === value
    },
    {
      title: 'Hash giao dịch',
      dataIndex: 'hash',
      key: 'hash',
      render: (hash: string) => (
        <Tooltip title="Xem trên Etherscan">
          <Button 
            type="link" 
            icon={<LinkOutlined />} 
            onClick={() => window.open(`https://etherscan.io/tx/${hash}`, '_blank')}
          >
            {`${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`}
          </Button>
        </Tooltip>
      )
    },
    {
      title: 'Chi tiết',
      key: 'details',
      render: (text: string, record: Transaction) => (
        <Popover 
          title="Chi tiết giao dịch" 
          content={
            <Space direction="vertical">
              <div><Text strong>Block Number:</Text> {record.blockNumber}</div>
              <div><Text strong>From:</Text> {record.from}</div>
              <div><Text strong>To:</Text> {record.to}</div>
              <div><Text strong>Hash:</Text> <Text copyable>{record.hash}</Text></div>
              {record.taskId && <div><Text strong>Task ID:</Text> {record.taskId}</div>}
            </Space>
          }
          trigger="click"
        >
          <Button icon={<FileTextOutlined />}>Chi tiết</Button>
        </Popover>
      )
    }
  ];

  return (
    <div className="transaction-history-container">
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Title level={2}>
            <Space>
              <HistoryOutlined />
              Lịch sử giao dịch Blockchain
            </Space>
          </Title>

          <Paragraph>
            Xem lịch sử tất cả các giao dịch đã được thực hiện trên smart contract của hệ thống.
          </Paragraph>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Input
                placeholder="Tìm kiếm theo hash, hành động, hoặc task..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              <Button 
                type="primary" 
                onClick={fetchTransactions} 
                loading={loading}
              >
                Làm mới
              </Button>
            </Col>
          </Row>
          
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default TransactionHistory;