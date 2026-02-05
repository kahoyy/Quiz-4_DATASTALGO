import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Alert, Spinner, Badge, Container, Button } from 'react-bootstrap';

function UserListScreen() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock current user (in real app, this would come from auth context)
    const currentUser = {
        _id: '201',
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        role: 'admin'
    };

    // Mock users data
    const mockUsers = [
        {
            _id: '201',
            first_name: 'Admin',
            last_name: 'User',
            email: 'admin@example.com',
            role: 'admin'
        },
        {
            _id: '101',
            first_name: 'Alice',
            last_name: 'Johnson',
            email: 'alice@example.com',
            role: 'manager'
        },
        {
            _id: '102',
            first_name: 'Bob',
            last_name: 'Smith',
            email: 'bob@example.com',
            role: 'manager'
        },
        {
            _id: '103',
            first_name: 'Charlie',
            last_name: 'Davis',
            email: 'charlie@example.com',
            role: 'manager'
        },
        {
            _id: '104',
            first_name: 'Diana',
            last_name: 'Wilson',
            email: 'diana@example.com',
            role: 'manager'
        },
        {
            _id: '301',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            role: 'user'
        },
        {
            _id: '302',
            first_name: 'Sarah',
            last_name: 'Connor',
            email: 'sarah@example.com',
            role: 'user'
        },
        {
            _id: '303',
            first_name: 'Mike',
            last_name: 'Johnson',
            email: 'mike@example.com',
            role: 'user'
        },
        {
            _id: '304',
            first_name: 'Eve',
            last_name: 'Wilson',
            email: 'eve@example.com',
            role: 'user'
        },
        {
            _id: '305',
            first_name: 'Frank',
            last_name: 'Brown',
            email: 'frank@example.com',
            role: 'user'
        }
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            // Check if current user is admin
            if (currentUser.role !== 'admin') {
                throw new Error('You do not have permission to access this page. Only admins can view user lists.');
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));

            // Load only saved users from localStorage
            let allUsers = [];
            const savedUsersData = localStorage.getItem('users');
            if (savedUsersData) {
                try {
                    const savedUsers = JSON.parse(savedUsersData);
                    allUsers = savedUsers;
                } catch (e) {
                    console.error('Error parsing saved users:', e);
                }
            }

            setUsers(allUsers);
        } catch (err) {
            setError(err.message || 'Failed to fetch users');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case 'admin':
                return 'danger';
            case 'manager':
                return 'warning';
            case 'user':
                return 'info';
            default:
                return 'secondary';
        }
    };

    const getRoleDisplayName = (role) => {
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert variant="danger" className="mt-4">
                    <Alert.Heading>Access Denied</Alert.Heading>
                    <p>{error}</p>
                    <div className="mt-3">
                        <Button variant="primary" onClick={() => navigate('/')}>
                            Back to Dashboard
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Button 
                variant="secondary" 
                className="mb-4"
                onClick={() => navigate('/')}
            >
                ← Back to Dashboard
            </Button>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>User Management</h1>
                <div className="d-flex gap-2 align-items-center">
                    <Badge bg="primary">{users.length} Users</Badge>
                    <Button 
                        variant="success"
                        onClick={() => navigate('/users/create')}
                    >
                        + Create User
                    </Button>
                </div>
            </div>

            {users.length === 0 ? (
                <Alert variant="info">
                    <Alert.Heading>No Users Yet</Alert.Heading>
                    <p>No users have been created. Click the "Create User" button to register a new user.</p>
                </Alert>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead className="table-dark">
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                    <td>
                                        <a href={`mailto:${user.email}`}>
                                            {user.email}
                                        </a>
                                    </td>
                                    <td>
                                        <Badge bg={getRoleBadgeVariant(user.role)}>
                                            {getRoleDisplayName(user.role)}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            <div className="mt-4 p-3 bg-light rounded">
                <h6>User Role Summary</h6>
                <ul className="mb-0">
                    <li><Badge bg="danger">Admin</Badge> - Full system access and user management</li>
                    <li><Badge bg="warning">Manager</Badge> - Can create projects and manage tasks</li>
                    <li><Badge bg="info">User</Badge> - Can view assigned projects and tasks</li>
                </ul>
            </div>
        </Container>
    );
}

export default UserListScreen;
