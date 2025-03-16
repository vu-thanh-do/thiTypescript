import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { message } from 'antd';
import {
    WalletService,
    UserService,
    TaskService,
    BlockchainTask,
    BlockchainUser
} from '../services/BlockchainService';
import { roleToString, taskStatusToString } from '../utils/blockchain';
import Web3Modal from 'web3modal';

// Interface cho User đã được chuyển đổi
export interface User {
    id: string;
    walletAddress: string;
    username: string;
    role: 'admin' | 'teamLead' | 'employee';
    status: 'active' | 'inactive';
    createdAt: string;
}

// Interface cho Task đã được chuyển đổi
export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'created' | 'assigned' | 'in_progress' | 'completed' | 'rejected';
    createdBy: string;
    assignee?: string;
    createdAt: string;
    updatedAt: string;
    ipfsHash?: string;
    priority?: 'low' | 'medium' | 'high';
}

// Interface cho Blockchain Context
interface BlockchainContextType {
    walletAddress: string | null;
    isConnected: boolean;
    userRole: string | null;
    users: User[];
    tasks: Task[];
    loading: boolean;
    connectWallet: () => Promise<void>;
    fetchUsers: () => Promise<void>;
    fetchTasks: () => Promise<void>;
    createUser: (address: string, name: string, role: number) => Promise<void>;
    createTask: (title: string, description: string, ipfsHash?: string) => Promise<string>;
    assignTask: (taskId: string, assigneeAddress: string) => Promise<void>;
    updateTaskStatus: (taskId: string, status: string) => Promise<void>;
}

// Tạo context
export const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

// Provider Component
export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Kết nối ví khi component mount
    useEffect(() => {
        checkWalletConnection();
    }, []);

    // Thêm useEffect lắng nghe sự thay đổi provider
    useEffect(() => {
        const setupProviderEvents = async () => {
            try {
                const web3Modal = new Web3Modal({
                    cacheProvider: true,
                    providerOptions: {},
                });

                // Nếu đã có cached provider, tự động kết nối
                if (web3Modal.cachedProvider) {
                    await connectWallet();
                }

                // Lắng nghe sự kiện từ provider
                const provider = await web3Modal.connect();

                provider.on("accountsChanged", (accounts: string[]) => {
                    if (accounts.length > 0) {
                        setWalletAddress(accounts[0]);
                        fetchUserRole();
                    } else {
                        setWalletAddress(null);
                        setIsConnected(false);
                    }
                });

                provider.on("disconnect", () => {
                    web3Modal.clearCachedProvider();
                    setWalletAddress(null);
                    setIsConnected(false);
                    setUserRole(null);
                });

            } catch (error) {
                console.error("Lỗi thiết lập sự kiện provider", error);
            }
        };

        setupProviderEvents();
    }, []);

    // Kiểm tra kết nối ví
    const checkWalletConnection = async () => {
        try {
            const isWalletConnected = await WalletService.isConnected();
            setIsConnected(isWalletConnected);

            if (isWalletConnected) {
                const address = await WalletService.connectWallet();
                setWalletAddress(address);

                // Lấy vai trò người dùng từ blockchain
                await fetchUserRole();
            }
        } catch (error) {
            console.error('Lỗi kiểm tra kết nối ví:', error);
        }
    };

    // Lấy vai trò người dùng
    const fetchUserRole = async () => {
        try {
            const { getUserRole, roleToString } = await import('../utils/blockchain');
            const role = await getUserRole();

            if (role !== null) {
                const roleStr = roleToString(role);
                setUserRole(roleStr);
                localStorage.setItem('userRole', roleStr);
            }
        } catch (error) {
            console.error('Lỗi lấy vai trò người dùng:', error);
        }
    };

    // Kết nối ví
    const connectWallet = async () => {
        setLoading(true);
        try {
            const address = await WalletService.connectWallet();
            if (address) {
                setWalletAddress(address);
                setIsConnected(true);
                await fetchUserRole();
                message.success('Đã kết nối ví thành công!');
            } else {
                message.error('Không thể kết nối ví!');
            }
        } catch (error) {
            console.error('Lỗi kết nối ví:', error);
            message.error('Đã xảy ra lỗi khi kết nối ví!');
        } finally {
            setLoading(false);
        }
    };

    // Lấy danh sách người dùng
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const blockchainUsers = await UserService.getUsers();

            // Chuyển đổi từ blockchain data sang dữ liệu app
            const transformedUsers: User[] = blockchainUsers.map(user => ({
                id: user.userAddress,
                walletAddress: user.userAddress,
                username: user.name,
                role: roleToString(user.role) as 'admin' | 'teamLead' | 'employee',
                status: user.isActive ? 'active' : 'inactive',
                createdAt: new Date().toLocaleDateString(), // Blockchain không lưu thời gian tạo user
            }));

            setUsers(transformedUsers);
        } catch (error) {
            console.error('Lỗi lấy danh sách người dùng:', error);
            message.error('Không thể lấy danh sách người dùng!');
        } finally {
            setLoading(false);
        }
    };

    // Lấy danh sách nhiệm vụ
    const fetchTasks = async () => {
        setLoading(true);
        try {
            const blockchainTasks = await TaskService.getTasks();

            // Chuyển đổi từ blockchain data sang dữ liệu app
            const transformedTasks: Task[] = blockchainTasks.map(task => ({
                id: String(task.id),
                title: task.title,
                description: task.description,
                status: taskStatusToString(task.status) as 'created' | 'assigned' | 'in_progress' | 'completed' | 'rejected',
                createdBy: task.createdBy,
                assignee: task.assignedTo !== '0x0000000000000000000000000000000000000000' ? task.assignedTo : undefined,
                createdAt: new Date(task.createdAt * 1000).toLocaleString(),
                updatedAt: new Date(task.updatedAt * 1000).toLocaleString(),
                ipfsHash: task.ipfsHash,
                priority: 'medium', // Priority không được lưu trên blockchain
            }));

            setTasks(transformedTasks);
        } catch (error) {
            console.error('Lỗi lấy danh sách nhiệm vụ:', error);
            message.error('Không thể lấy danh sách nhiệm vụ!');
        } finally {
            setLoading(false);
        }
    };

    // Tạo người dùng mới
    const createUser = async (address: string, name: string, role: number) => {
        setLoading(true);
        try {
            await UserService.createUser(address, name, role);
            message.success('Đã tạo người dùng thành công!');
            await fetchUsers();
        } catch (error) {
            console.error('Lỗi tạo người dùng:', error);
            message.error('Không thể tạo người dùng!');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Tạo nhiệm vụ mới
    const createTask = async (title: string, description: string, ipfsHash: string = '') => {
        setLoading(true);
        try {
            const taskId = await TaskService.createTask(title, description, ipfsHash);
            message.success('Đã tạo nhiệm vụ thành công!');
            await fetchTasks();
            return String(taskId);
        } catch (error) {
            console.error('Lỗi tạo nhiệm vụ:', error);
            message.error('Không thể tạo nhiệm vụ!');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Phân công nhiệm vụ
    const assignTask = async (taskId: string, assigneeAddress: string) => {
        setLoading(true);
        try {
            await TaskService.assignTask(Number(taskId), assigneeAddress);
            message.success('Đã phân công nhiệm vụ thành công!');
            await fetchTasks();
        } catch (error) {
            console.error('Lỗi phân công nhiệm vụ:', error);
            message.error('Không thể phân công nhiệm vụ!');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Cập nhật trạng thái nhiệm vụ
    const updateTaskStatus = async (taskId: string, status: string) => {
        setLoading(true);
        try {
            await TaskService.updateTaskStatus(Number(taskId), status);
            message.success('Đã cập nhật trạng thái nhiệm vụ thành công!');
            await fetchTasks();
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái nhiệm vụ:', error);
            message.error('Không thể cập nhật trạng thái nhiệm vụ!');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const disconnectWallet = async () => {
        const web3Modal = new Web3Modal({
            cacheProvider: true,
            providerOptions: {},
        });

        web3Modal.clearCachedProvider();
        setWalletAddress(null);
        setIsConnected(false);
        setUserRole(null);
        localStorage.removeItem('userRole');
    };

    const value = {
        walletAddress,
        isConnected,
        userRole,
        users,
        tasks,
        loading,
        connectWallet,
        fetchUsers,
        fetchTasks,
        createUser,
        createTask,
        assignTask,
        updateTaskStatus,
        disconnectWallet,
    };

    return (
        <BlockchainContext.Provider value={value}>
            {children}
        </BlockchainContext.Provider>
    );
};

// Hook để sử dụng context
export const useBlockchain = () => {
    const context = useContext(BlockchainContext);
    if (context === undefined) {
        throw new Error('useBlockchain must be used within a BlockchainProvider');
    }
    return context;
}; 