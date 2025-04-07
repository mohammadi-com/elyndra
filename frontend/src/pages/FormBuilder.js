import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FormBuilder as FormioBuilder } from '@formio/react';
import axios from 'axios';

const FormBuilder = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  const handleSave = async (schema) => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      await axios.put(`/api/forms/${formId}`, schema);
      setSuccess('Form saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Error saving form: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (schema) => {
    setForm(schema);
  };

  const handleEnhanceForm = async () => {
    setSaving(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/ai/enhance-form', form);
      setForm(response.data);
      setSuccess('Form enhanced successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Error enhancing form: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Form Builder</h1>
        <div>
          <Button 
            variant="outline-primary"
            className="me-2"
            onClick={handleEnhanceForm}
            disabled={saving || loading}
          >
            Enhance with AI
          </Button>
          <Button 
            variant="primary"
            onClick={() => handleSave(form)}
            disabled={saving || loading}
          >
            {saving ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Saving...</span>
              </>
            ) : (
              'Save Form'
            )}
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="form-container">
        <Card.Body>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : form ? (
            <FormioBuilder
              form={form}
              onChange={handleChange}
              options={{
                builder: {
                  basic: {
                    components: {
                      textfield: true,
                      textarea: true,
                      number: true,
                      password: true,
                      checkbox: true,
                      selectboxes: true,
                      select: true,
                      radio: true,
                      button: true,
                    }
                  },
                  advanced: {
                    components: {
                      email: true,
                      url: true,
                      phoneNumber: true,
                      datetime: true,
                      day: true,
                      time: true,
                      address: true,
                      signature: true,
                    }
                  },
                  layout: {
                    components: {
                      panel: true,
                      columns: true,
                      table: true,
                      tabs: true,
                      well: true,
                      fieldset: true,
                    }
                  },
                  data: {
                    components: {
                      hidden: true,
                      container: true,
                      datamap: true,
                      datagrid: true,
                      editgrid: true,
                    }
                  },
                  specialized: {
                    components: {
                      file: true,
                      currency: true,
                      survey: true,
                      tags: true,
                      recaptcha: true,
                    }
                  }
                }
              }}
            />
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
    </Container>
  );
};

export default FormBuilder; 