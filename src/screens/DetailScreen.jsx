import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Spinner, Alert, Row, Col, Badge } from 'react-bootstrap';

function DetailScreen() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProjectDetails();
    }, [projectId]);

    const fetchProjectDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch project details
            const projectResponse = await fetch(`/api/v1/projects/${projectId}`);
            if (!projectResponse.ok) {
                throw new Error(`Failed to fetch project: ${projectResponse.status}`);
            }
            const projectData = await projectResponse.json();
            setProject(projectData.project);

            // Fetch tasks for this project
            const tasksResponse = await fetch(`/api/v1/projects/${projectId}/tasks`);
            if (!tasksResponse.ok) {
                throw new Error(`Failed to fetch tasks: ${tasksResponse.status}`);
            }
            const tasksData = await tasksResponse.json();
            setTasks(tasksData.tasks || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch project details');
            console.error('Error fetching project details:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'in-progress':
                return 'primary';
            case 'pending':
                return 'warning';
            case 'on-hold':
                return 'secondary';
            default:
                return 'light';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
            <Alert variant="danger">
                <Alert.Heading>Error Loading Project</Alert.Heading>
                <p>{error}</p>
                <div className="mt-3">
                    <Button variant="primary" onClick={() => navigate('/')} className="me-2">
                        Back to Dashboard
                    </Button>
                    <Button variant="secondary" onClick={fetchProjectDetails}>
                        Retry
                    </Button>
                </div>
            </Alert>
        );
    }

    if (!project) {
        return (
            <Alert variant="info">
                Project not found.
                <div className="mt-3">
                    <Button variant="primary" onClick={() => navigate('/')}>
                        Back to Dashboard
                    </Button>
                </div>
            </Alert>
        );
    }

    return (
        <div>
            <Button 
                variant="secondary" 
                className="mb-4"
                onClick={() => navigate('/')}
            >
                ← Back to Dashboard
            </Button>

            {/* Project Information Section */}
            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h2 className="mb-0">{project.project_name}</h2>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6} className="mb-3">
                            <div className="mb-4">
                                <h5>Description</h5>
                                <p className="text-muted">{project.project_description || 'No description available'}</p>
                            </div>

                            <div className="mb-4">
                                <h5>Status</h5>
                                <Badge bg={getStatusBadgeVariant(project.status)}>
                                    {project.status || 'N/A'}
                                </Badge>
                            </div>

                            <div className="mb-4">
                                <h5>Hours Consumed</h5>
                                <p className="text-muted">
                                    <strong>{project.hours_consumed || 0}</strong> hours
                                </p>
                            </div>
                        </Col>

                        <Col md={6} className="mb-3">
                            <div className="mb-4">
                                <h5>Start Date</h5>
                                <p className="text-muted">{formatDate(project.start_date)}</p>
                            </div>

                            <div className="mb-4">
                                <h5>End Date</h5>
                                <p className="text-muted">{formatDate(project.end_date)}</p>
                            </div>

                            <div className="mb-4">
                                <h5>Duration</h5>
                                <p className="text-muted">
                                    {project.start_date && project.end_date
                                        ? `${Math.ceil((new Date(project.end_date) - new Date(project.start_date)) / (1000 * 60 * 60 * 24))} days`
                                        : 'N/A'}
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Tasks Section */}
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h3 className="mb-0">Tasks ({tasks.length})</h3>
                </Card.Header>
                <Card.Body>
                    {tasks.length === 0 ? (
                        <Alert variant="info" className="mb-0">
                            No tasks assigned to this project yet.
                        </Alert>
                    ) : (
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead className="table-light">
                                    <tr>
                                        <th>Task Name</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Assigned To</th>
                                        <th>Hours</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map(task => (
                                        <tr key={task._id || task.id}>
                                            <td>
                                                <strong>{task.task_name || 'N/A'}</strong>
                                            </td>
                                            <td>
                                                <small className="text-muted">
                                                    {task.task_description || 'No description'}
                                                </small>
                                            </td>
                                            <td>
                                                <Badge bg={getStatusBadgeVariant(task.status)}>
                                                    {task.status || 'N/A'}
                                                </Badge>
                                            </td>
                                            <td>
                                                {task.user_assigned || 'Unassigned'}
                                            </td>
                                            <td>
                                                {task.hours_consumed || 0} hrs
                                            </td>
                                            <td>
                                                {formatDate(task.start_date)}
                                            </td>
                                            <td>
                                                {formatDate(task.end_date)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}

export default DetailScreen;
