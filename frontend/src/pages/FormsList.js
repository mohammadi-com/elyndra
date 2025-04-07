import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FormsList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get('/api/forms');
        setForms(response.data);
        setError(null);
      } catch (err) {
        setError('Error loading forms: ' + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleDeleteForm = async (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await axios.delete(`/api/formio/forms/${formId}`);
        // Update forms list after deletion
        setForms(forms.filter(form => form._id !== formId));
      } catch (err) {
        setError('Error deleting form: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Forms</h1>
        <Link to="/upload">
          <Button variant="primary">Upload New Form</Button>
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="form-container">
        <Card.Body>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : forms.length === 0 ? (
            <div className="text-center my-5">
              <p className="mb-3">You don't have any forms yet.</p>
              <Link to="/upload">
                <Button variant="primary">Upload Your First Form</Button>
              </Link>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Form Name</th>
                  <th>Created</th>
                  <th>Last Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {forms.map(form => (
                  <tr key={form._id}>
                    <td>{form.title}</td>
                    <td>{new Date(form.created).toLocaleDateString()}</td>
                    <td>{new Date(form.modified).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/builder/${form._id}`}>
                          <Button variant="outline-primary" size="sm">Edit</Button>
                        </Link>
                        <Link to={`/submit/${form._id}`}>
                          <Button variant="outline-success" size="sm">Fill</Button>
                        </Link>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteForm(form._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormsList; 