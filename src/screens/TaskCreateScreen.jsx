import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';

function TaskCreateScreen() {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [formData, setFormData] = useState({
        task_name: '',
        task_description: '',
        user_assigned: '',
        start_date: '',
        end_date: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [projectName, setProjectName] = useState('');

    // Mock users by role
    const mockAllUsers = {
        admins: [
            { _id: '201', name: 'Admin User', email: 'admin@example.com', role: 'admin' }
        ],
        managers: [
            { _id: '101', name: 'Alice Johnson', email: 'alice@example.com', role: 'manager' },
            { _id: '102', name: 'Bob Smith', email: 'bob@example.com', role: 'manager' },
            { _id: '103', name: 'Charlie Davis', email: 'charlie@example.com', role: 'manager' }
        ],
        users: [
            { _id: '301', name: 'John Doe', email: 'john@example.com', role: 'user' },
            { _id: '302', name: 'Sarah Connor', email: 'sarah@example.com', role: 'user' },
            { _id: '303', name: 'Mike Johnson', email: 'mike@example.com', role: 'user' },
            { _id: '304', name: 'Eve Wilson', email: 'eve@example.com', role: 'user' }
        ]
    };

    // Mock projects data
    const mockProjectsData = {
        '1': { _id: '1', project_name: 'Website Redesign' },
        '2': { _id: '2', project_name: 'Mobile App Development' },
        '3': { _id: '3', project_name: 'Database Migration' },
        '4': { _id: '4', project_name: 'API Integration' }
    };

    // Mock current user role (in real app, this would come from auth context)
    const currentUserRole = 'admin'; // Can be 'admin' or 'manager'

    useEffect(() => {
        // Set project name
        const project = mockProjectsData[projectId];
        if (project) {
            setProjectName(project.project_name);
        }
    }, [projectId]);

    // Get available users based on current user's role
    const getAvailableUsers = () => {
        if (currentUserRole === 'admin') {
            // Admin can assign to both managers and users
            return [...mockAllUsers.managers, ...mockAllUsers.users];
        } else if (currentUserRole === 'manager') {
            // Manager can only assign to regular users
            return mockAllUsers.users;
        }
        return [];
    };

    const availableUsers = getAvailableUsers();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validation
        if (!formData.task_name.trim()) {
            setError('Task name is required');
            return;
        }

        if (formData.start_date && formData.end_date) {
            if (new Date(formData.end_date) < new Date(formData.start_date)) {
                setError('End date must be after start date');
                return;
            }
        }

        try {
            setLoading(true);

            // For development, just show success message and redirect
            const selectedUser = availableUsers.find(u => u._id === formData.user_assigned);
            const taskData = {
                project_id: projectId,
                ...formData,
                user_assigned_name: selectedUser ? selectedUser.name : 'Unassigned',
                created_at: new Date().toISOString()
            };

            console.log('Task created:', taskData);

            setSuccess(true);
            setTimeout(() => {
                navigate(`/project/${projectId}`);
            }, 1500);

            /* For real API:
            const response = await fetch(`/api/v1/projects/${projectId}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to create task');
            }

            setSuccess(true);
            setTimeout(() => {
                navigate(`/project/${projectId}`);
            }, 1500);
            */
        } catch (err) {
            setError(err.message || 'Failed to create task');
            console.error('Error creating task:', err);
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
                        onClick={() => navigate(`/project/${projectId}`)}
                    >
                        ← Back to Project
                    </Button>

                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h2 className="mb-0">Create New Task</h2>
                            {projectName && (
                                <small className="text-light">For: {projectName}</small>
                            )}
                        </Card.Header>
                        <Card.Body>
                            {error && (
                                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                                    {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert variant="success">
                                    Task created successfully! Redirecting to project...
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Task Name <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="task_name"
                                        placeholder="Enter task name"
                                        value={formData.task_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        Provide a clear and descriptive task name
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Task Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="task_description"
                                        placeholder="Describe the task (optional)"
                                        value={formData.task_description}
                                        onChange={handleInputChange}
                                    />
                                    <Form.Text className="text-muted">
                                        Include requirements, acceptance criteria, etc.
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Assign To</Form.Label>
                                    <Form.Select
                                        name="user_assigned"
                                        value={formData.user_assigned}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">-- Select a User (Optional) --</option>
                                        {availableUsers.map(user => (
                                            <option key={user._id} value={user._id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        {currentUserRole === 'admin' 
                                            ? 'Showing managers and users'
                                            : 'Showing users only'
                                        }
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>

                                <div className="d-flex gap-2">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating...' : 'Create Task'}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => navigate(`/project/${projectId}`)}
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

export default TaskCreateScreen;
