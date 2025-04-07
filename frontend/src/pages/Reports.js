import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Modal, Image } from 'react-bootstrap';
import axios from 'axios';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/forms/report');
      setReports(response.data.issues || []);
      setError(null);
    } catch (err) {
      setError('Error loading reports: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = (photoUrl) => {
    setSelectedPhoto(photoUrl);
    setShowPhotoModal(true);
  };

  const renderPriorityBadge = (priority) => {
    const variant = 
      priority === 'High' ? 'danger' :
      priority === 'Medium' ? 'warning' :
      'info';
    
    return <Badge bg={variant}>{priority}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Maintenance Reports</h1>
        <Button 
          variant="outline-primary"
          onClick={fetchReports}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span className="ms-2">Loading...</span>
            </>
          ) : (
            'Refresh'
          )}
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : reports.length === 0 ? (
        <Card className="form-container text-center py-5">
          <Card.Body>
            <i className="fas fa-clipboard-check mb-3" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
            <h3 className="mb-3">No Issues Reported</h3>
            <p>There are currently no maintenance issues reported.</p>
          </Card.Body>
        </Card>
      ) : (
        <div>
          <Row>
            <Col md={12}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Summary</Card.Title>
                  <Row>
                    <Col xs={4} className="text-center border-end">
                      <h3>{reports.length}</h3>
                      <p className="text-muted">Total Issues</p>
                    </Col>
                    <Col xs={4} className="text-center border-end">
                      <h3>{reports.filter(r => r.priority === 'High').length}</h3>
                      <p className="text-muted">High Priority</p>
                    </Col>
                    <Col xs={4} className="text-center">
                      <h3>{reports.filter(r => r.status === 'Open').length}</h3>
                      <p className="text-muted">Open Issues</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <h3 className="mb-3">All Issues</h3>

          {reports.map((issue, index) => (
            <Card key={issue.id || index} className="report-card mb-3">
              <Card.Body>
                <Row>
                  <Col md={9}>
                    <div className="d-flex justify-content-between">
                      <h5>{issue.issueType || 'Safety Issue'}</h5>
                      <div>
                        {renderPriorityBadge(issue.priority)}
                        <Badge bg={issue.status === 'Open' ? 'danger' : 'success'} className="ms-2">
                          {issue.status}
                        </Badge>
                      </div>
                    </div>
                    <p><strong>Location:</strong> {issue.location}</p>
                    <p><strong>Reported:</strong> {formatDate(issue.dateSubmitted)}</p>
                    <p><strong>Description:</strong> {issue.description}</p>
                  </Col>
                  
                  <Col md={3}>
                    {issue.photos && issue.photos.length > 0 ? (
                      <div>
                        <p className="mb-2"><strong>Photos:</strong></p>
                        <div className="photo-thumbnails">
                          {issue.photos.map((photo, photoIndex) => (
                            <img
                              key={photoIndex}
                              src={photo}
                              alt={`Issue ${index + 1} photo ${photoIndex + 1}`}
                              className="photo-thumbnail"
                              onClick={() => handlePhotoClick(photo)}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted">No photos</p>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      <Modal 
        show={showPhotoModal} 
        onHide={() => setShowPhotoModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Issue Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image src={selectedPhoto} fluid />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPhotoModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Reports; 