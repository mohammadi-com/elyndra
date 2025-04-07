import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      <Row className="text-center mb-4">
        <Col>
          <h1>Digital Form Builder</h1>
          <p className="lead">
            Transform paper health & safety forms into interactive digital versions
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center my-5">
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body className="text-center">
              <i className="fas fa-upload mb-3" style={{ fontSize: '3rem', color: '#007bff' }}></i>
              <Card.Title>Upload Form</Card.Title>
              <Card.Text>
                Upload and digitize a paper form using AI
              </Card.Text>
              <Link to="/upload">
                <Button variant="primary">Upload Form</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body className="text-center">
              <i className="fas fa-list mb-3" style={{ fontSize: '3rem', color: '#28a745' }}></i>
              <Card.Title>My Forms</Card.Title>
              <Card.Text>
                View and manage your existing forms
              </Card.Text>
              <Link to="/forms">
                <Button variant="success">View Forms</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body className="text-center">
              <i className="fas fa-file-alt mb-3" style={{ fontSize: '3rem', color: '#dc3545' }}></i>
              <Card.Title>Reports</Card.Title>
              <Card.Text>
                Generate reports from collected data
              </Card.Text>
              <Link to="/reports">
                <Button variant="danger">View Reports</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <Card>
            <Card.Body>
              <h4>Why Digitize Your Forms?</h4>
              <ul>
                <li>Complete forms on any mobile device</li>
                <li>Capture photos of safety issues directly in your form</li>
                <li>Generate maintenance reports automatically</li>
                <li>Track issue resolution over time</li>
                <li>Save time and reduce manual data entry</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home; 