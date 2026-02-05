import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';

function UserCreateScreen() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        role: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Mock current user (in real app, this would come from auth context)
    const currentUser = {
        _id: '201',
        role: 'admin'
    };

    // Role options
    const roleOptions = [
        { value: 'admin', label: 'Admin' },
        { value: 'manager', label: 'Manager' },
        { value: 'user', label: 'User' }
    ];

    // Check admin access
    if (currentUser.role !== 'admin') {
        return (
            <Container>
                <Alert variant="danger" className="mt-4">
                    <Alert.Heading>Access Denied</Alert.Heading>
                    <p>You do not have permission to access this page. Only admins can create users.</p>
                    <div className="mt-3">
                        <Button variant="primary" onClick={() => navigate('/')}>
                            Back to Dashboard
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        // Check all required fields
        if (!formData.first_name.trim()) {
            setError('First name is required');
            return false;
        }

        if (!formData.last_name.trim()) {
            setError('Last name is required');
            return false;
        }

        if (!formData.username.trim()) {
            setError('Username is required');
            return false;
        }

        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (!formData.role) {
            setError('Please select a role');
            return false;
        }

        if (!formData.password.trim()) {
            setError('Password is required');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        // Check if username already exists
        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
            try {
                const users = JSON.parse(savedUsers);
                if (users.some(u => u.username === formData.username)) {
                    setError('Username already exists');
                    return false;
                }
                if (users.some(u => u.email === formData.email)) {
                    setError('Email already exists');
                    return false;
                }
            } catch (e) {
                console.error('Error checking existing users:', e);
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Create user object with generated ID
            const userId = Date.now().toString();
            const userData = {
                _id: userId,
                ...formData,
                created_at: new Date().toISOString(),
                created_by: currentUser._id
            };

            // Get existing users from localStorage
            let allUsers = [];
            const savedUsersData = localStorage.getItem('users');
            try {
                allUsers = savedUsersData ? JSON.parse(savedUsersData) : [];
            } catch (e) {
                allUsers = [];
            }

            // Check again for duplicates (safety check)
            if (allUsers.some(u => u.username === formData.username)) {
                setError('Username already exists');
                setLoading(false);
                return;
            }

            // Add new user
            allUsers.push(userData);
            localStorage.setItem('users', JSON.stringify(allUsers));

            console.log('User created:', userData);

            setSuccess(true);
            setTimeout(() => {
                navigate('/users');
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to create user');
            console.error('Error creating user:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Button 
                        variant="secondary" 
                        className="mb-4"
                        onClick={() => navigate('/users')}
                    >
                        ← Back to Users
                    </Button>

                    <Card className="shadow-sm">
                        <Card.Header className="bg-success text-white">
                            <h2 className="mb-0">Create New User</h2>
                        </Card.Header>
                        <Card.Body>
                            {error && (
                                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                                    {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert variant="success">
                                    User created successfully! Redirecting to users list...
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        First Name <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="first_name"
                                        placeholder="Enter first name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Last Name <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="last_name"
                                        placeholder="Enter last name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Username <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        placeholder="Enter username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        Must be unique
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Email <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="Enter email address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        Must be a valid email and unique
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Role <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">-- Select a Role --</option>
                                        {roleOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        Admin - Full access | Manager - Can manage projects | User - Limited access
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Password <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Enter password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        Minimum 6 characters
                                    </Form.Text>
                                </Form.Group>

                                <div className="d-flex gap-2">
                                    <Button
                                        variant="success"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating...' : 'Create User'}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => navigate('/users')}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default UserCreateScreen;
