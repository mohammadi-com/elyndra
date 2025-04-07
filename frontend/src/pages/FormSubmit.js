import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Form as FormioForm } from '@formio/react';
import axios from 'axios';

const FormSubmit = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submission, setSubmission] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`/api/forms/${formId}`);
        setForm(response.data);
        setError(null);
      } catch (err) {
        setError('Error loading form: ' + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleSubmit = async (submission) => {
    setSubmitting(true);
    setError(null);
    
    try {
      await axios.post(`/api/forms/${formId}/submit`, submission);
      setSuccess(true);
    } catch (err) {
      setError('Error submitting form: ' + (err.response?.data?.detail || err.message));
      return false; // Prevent form from clearing
    } finally {
      setSubmitting(false);
    }
    
    return true; // Allow form to clear
  };

  const handleChange = (submission) => {
    setSubmission(submission);
  };

  return (
    <Container>
      <h1 className="mb-4">Fill Form</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {success ? (
        <Card className="form-container">
          <Card.Body className="text-center py-5">
            <div className="mb-4">
              <i className="fas fa-check-circle" style={{ fontSize: '4rem', color: '#28a745' }}></i>
            </div>
            <h3 className="mb-3">Form Submitted Successfully!</h3>
            <p className="mb-4">Thank you for completing the form.</p>
            <div className="d-flex justify-content-center gap-3">
              <Button 
                variant="outline-primary"
                onClick={() => {
                  setSuccess(false);
                  setSubmission({});
                }}
              >
                Submit Another Response
              </Button>
              <Button 
                variant="primary"
                onClick={() => navigate('/forms')}
              >
                Back to Forms
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Card className="form-container">
          <Card.Body>
            {loading ? (
              <div className="text-center my-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : form ? (
              <div>
                <p className="mb-4">
                  Complete the form below. Fields marked with an asterisk (*) are required.
                </p>
                <FormioForm
                  form={form}
                  submission={submission}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  options={{
                    readOnly: submitting,
                    hooks: {
                      beforeSubmit: (submission, next) => {
                        // Add timestamp
                        submission.data.submittedAt = new Date().toISOString();
                        next();
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="text-center my-5">
                <p>Form not found or could not be loaded.</p>
                <Button 
                  variant="primary"
                  onClick={() => navigate('/forms')}
                >
                  Back to Forms
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default FormSubmit; 