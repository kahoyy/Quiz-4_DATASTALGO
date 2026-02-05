import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';

function HomeScreen() {
    const [projects, setProjects] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Mock data for development
        const mockProjects = [
            {
                _id: '1',
                project_name: 'Website Redesign',
                project_description: 'Complete redesign of the company website with modern UI/UX',
                status: 'in-progress',
                hours_consumed: 120,
                start_date: '2026-01-15',
                end_date: '2026-03-15'
            },
            {
                _id: '2',
                project_name: 'Mobile App Development',
                project_description: 'Development of iOS and Android mobile applications',
                status: 'in-progress',
                hours_consumed: 250,
                start_date: '2026-01-01',
                end_date: '2026-04-30'
            },
            {
                _id: '3',
                project_name: 'Database Migration',
                project_description: 'Migration from legacy database to modern cloud-based solution',
                status: 'pending',
                hours_consumed: 40,
                start_date: '2026-02-10',
                end_date: '2026-03-31'
            },
            {
                _id: '4',
                project_name: 'API Integration',
                project_description: 'Integrate third-party payment and analytics APIs',
                status: 'completed',
                hours_consumed: 80,
                start_date: '2025-12-01',
                end_date: '2026-01-31'
            }
        ];
        
        setProjects(mockProjects);
        setLoading(false);
    }, []);

    const fetchProjects = async () => {
        // API call for when backend is ready
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/v1/projects');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('API is not responding with JSON. Make sure the backend server is running.');
            }
            
            const data = await response.json();
            setProjects(data.projects || []);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err.message || 'Failed to fetch projects. Is the backend API running?');
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (projectId) => {
        setExpandedRows(prev => ({
            ...prev,
            [projectId]: !prev[projectId]
        }));
    };

    const handleViewProject = (projectId) => {
        navigate(`/project/${projectId}`);
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
                <Alert.Heading>Error Loading Projects</Alert.Heading>
                <p>{error}</p>
                <Button variant="primary" onClick={fetchProjects}>
                    Retry
                </Button>
            </Alert>
        );
    }

    return (
        <div>
            <h1 className="mb-4">Dashboard</h1>
            
            {projects.length === 0 ? (
                <Alert variant="info">No projects available.</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>Project Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(project => (
                            <React.Fragment key={project._id || project.id}>
                                <tr>
                                    <td>
                                        <strong>{project.project_name}</strong>
                                    </td>
                                    <td>
                                        <span className={`badge bg-${project.status === 'completed' ? 'success' : project.status === 'in-progress' ? 'primary' : 'warning'}`}>
                                            {project.status || 'N/A'}
                                        </span>
                                    </td>
                                    <td>
                                        <Button 
                                            variant="sm" 
                                            className="me-2"
                                            onClick={() => toggleRow(project._id || project.id)}
                                        >
                                            {expandedRows[project._id || project.id] ? '▼ Hide' : '▶ Show'} Details
                                        </Button>
                                        <Button 
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleViewProject(project._id || project.id)}
                                        >
                                            View Full
                                        </Button>
                                    </td>
                                </tr>
                                {expandedRows[project._id || project.id] && (
                                    <tr className="table-light">
                                        <td colSpan="3">
                                            <div className="p-3">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <p><strong>Description:</strong> {project.project_description || 'N/A'}</p>
                                                        <p><strong>Start Date:</strong> {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}</p>
                                                        <p><strong>End Date:</strong> {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p><strong>Hours Consumed:</strong> {project.hours_consumed || 0} hrs</p>
                                                        <p><strong>Status:</strong> {project.status || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}

export default HomeScreen;