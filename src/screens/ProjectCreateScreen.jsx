import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';

function ProjectCreateScreen() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        project_name: '',
        project_description: '',
        user_assigned: '',
        start_date: '',
        end_date: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Mock managers list
    const mockManagers = [
        { _id: '101', name: 'Alice Johnson', email: 'alice@example.com' },
        { _id: '102', name: 'Bob Smith', email: 'bob@example.com' },
        { _id: '103', name: 'Charlie Davis', email: 'charlie@example.com' },
        { _id: '104', name: 'Diana Wilson', email: 'diana@example.com' }
    ];

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
        if (!formData.project_name.trim()) {
            setError('Project name is required');
            return;
        }

        if (!formData.user_assigned) {
            setError('Please assign a manager to this project');
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
            const selectedManager = mockManagers.find(m => m._id === formData.user_assigned);
            const projectData = {
                ...formData,
                manager_assigned: selectedManager.name,
                created_at: new Date().toISOString()
            };

            console.log('Project created:', projectData);

            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 1500);

            /* For real API:
            const response = await fetch('/api/v1/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to create project');
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 1500);
            */
        } catch (err) {
            setError(err.message || 'Failed to create project');
            console.error('Error creating project:', err);
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
                        onClick={() => navigate('/')}
                    >
                        ← Back to Dashboard
                    </Button>

                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h2 className="mb-0">Create New Project</h2>
                        </Card.Header>
                        <Card.Body>
                            {error && (
                                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                                    {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert variant="success">
                                    Project created successfully! Redirecting to dashboard...
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Project Name <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="project_name"
                                        placeholder="Enter project name"
                                        value={formData.project_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        The name should be clear and descriptive
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Project Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="project_description"
                                        placeholder="Describe the project (optional)"
                                        value={formData.project_description}
                                        onChange={handleInputChange}
                                    />
                                    <Form.Text className="text-muted">
                                        Provide details about the project goals and scope
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Assign Manager <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        name="user_assigned"
                                        value={formData.user_assigned}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">-- Select a Manager --</option>
                                        {mockManagers.map(manager => (
                                            <option key={manager._id} value={manager._id}>
                                                {manager.name} ({manager.email})
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        Only managers with Manager role are shown
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
                                        {loading ? 'Creating...' : 'Create Project'}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => navigate('/')}
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

export default ProjectCreateScreen;
