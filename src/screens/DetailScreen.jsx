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

    const mockProjectsData = {
        '1': {
            _id: '1',
            project_name: 'Website Redesign',
            project_description: 'Complete redesign of the company website with modern UI/UX',
            status: 'in-progress',
            hours_consumed: 120,
            start_date: '2026-01-15',
            end_date: '2026-03-15'
        },
        '2': {
            _id: '2',
            project_name: 'Mobile App Development',
            project_description: 'Development of iOS and Android mobile applications',
            status: 'in-progress',
            hours_consumed: 250,
            start_date: '2026-01-01',
            end_date: '2026-04-30'
        },
        '3': {
            _id: '3',
            project_name: 'Database Migration',
            project_description: 'Migration from legacy database to modern cloud-based solution',
            status: 'pending',
            hours_consumed: 40,
            start_date: '2026-02-10',
            end_date: '2026-03-31'
        },
        '4': {
            _id: '4',
            project_name: 'API Integration',
            project_description: 'Integrate third-party payment and analytics APIs',
            status: 'completed',
            hours_consumed: 80,
            start_date: '2025-12-01',
            end_date: '2026-01-31'
        }
    };

    const mockTasksData = {
        '1': [
            {
                _id: 't1',
                task_name: 'UI Design',
                task_description: 'Design all UI components and pages',
                status: 'completed',
                hours_consumed: 40,
                user_assigned: 'John Designer',
                start_date: '2026-01-15',
                end_date: '2026-01-31'
            },
            {
                _id: 't2',
                task_name: 'Frontend Development',
                task_description: 'Implement UI components with React',
                status: 'in-progress',
                hours_consumed: 60,
                user_assigned: 'Sarah Frontend Dev',
                start_date: '2026-02-01',
                end_date: '2026-02-28'
            },
            {
                _id: 't3',
                task_name: 'Testing & QA',
                task_description: 'Perform testing and quality assurance',
                status: 'pending',
                hours_consumed: 20,
                user_assigned: 'Mike QA',
                start_date: '2026-03-01',
                end_date: '2026-03-15'
            }
        ],
        '2': [
            {
                _id: 't4',
                task_name: 'iOS Development',
                task_description: 'Develop iOS application',
                status: 'in-progress',
                hours_consumed: 120,
                user_assigned: 'Alice iOS Dev',
                start_date: '2026-01-01',
                end_date: '2026-03-15'
            },
            {
                _id: 't5',
                task_name: 'Android Development',
                task_description: 'Develop Android application',
                status: 'in-progress',
                hours_consumed: 130,
                user_assigned: 'Bob Android Dev',
                start_date: '2026-01-01',
                end_date: '2026-03-15'
            }
        ],
        '3': [
            {
                _id: 't6',
                task_name: 'Data Analysis',
                task_description: 'Analyze current database structure',
                status: 'completed',
                hours_consumed: 20,
                user_assigned: 'Charlie DBA',
                start_date: '2026-02-10',
                end_date: '2026-02-15'
            },
            {
                _id: 't7',
                task_name: 'Migration Execution',
                task_description: 'Execute database migration plan',
                status: 'pending',
                hours_consumed: 20,
                user_assigned: 'Charlie DBA',
                start_date: '2026-02-20',
                end_date: '2026-03-31'
            }
        ],
        '4': [
            {
                _id: 't8',
                task_name: 'Payment API Integration',
                task_description: 'Integrate Stripe payment API',
                status: 'completed',
                hours_consumed: 40,
                user_assigned: 'David Backend Dev',
                start_date: '2025-12-01',
                end_date: '2026-01-15'
            },
            {
                _id: 't9',
                task_name: 'Analytics API Integration',
                task_description: 'Integrate Google Analytics API',
                status: 'completed',
                hours_consumed: 40,
                user_assigned: 'Eve Backend Dev',
                start_date: '2026-01-10',
                end_date: '2026-01-31'
            }
        ]
    };

    useEffect(() => {
        fetchProjectDetails();
    }, [projectId]);

    const fetchProjectDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            // Use mock data for development
            const projectData = mockProjectsData[projectId];
            const tasksData = mockTasksData[projectId] || [];

            if (!projectData) {
                throw new Error('Project not found');
            }

            setProject(projectData);
            setTasks(tasksData);
        } catch (err) {
            setError(err.message || 'Failed to fetch project details');
            console.error('Error fetching project details:', err);
        } finally {
            setLoading(false);
        }
    };

    // For Backend
    const fetchProjectDetailsAPI = async () => {
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
