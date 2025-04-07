import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Form as FormioForm } from '@formio/react';
import axios from 'axios';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formStructure, setFormStructure] = useState(null);
  const [formName, setFormName] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const uploadForm = async () => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/forms/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormStructure(response.data.form_structure);
      setStep(2);
    } catch (err) {
      setError('Error uploading form: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const createForm = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create a basic structure with the form name
      let formData = { ...formStructure };
      
      // Add form name if provided
      if (formName) {
        formData.title = formName;
        formData.name = formName.toLowerCase().replace(/\s+/g, '_');
        formData.path = formName.toLowerCase().replace(/\s+/g, '_');
      }

      const response = await axios.post('/api/forms/create', formData);
      
      // Navigate to form builder to edit the form
      if (response.data && response.data._id) {
        navigate(`/builder/${response.data._id}`);
      } else {
        setError('Error creating form: Invalid response');
      }
    } catch (err) {
      setError('Error creating form: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Upload Form</h1>

      {step === 1 && (
        <Card className="form-container">
          <Card.Body>
            <h4 className="mb-3">Upload a paper form</h4>
            <p>Upload a PDF or image of your paper form to digitize it using AI.</p>

            {error && <Alert variant="danger">{error}</Alert>}

            <div 
              className="upload-container mb-4"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <i className="fas fa-cloud-upload-alt mb-3" style={{ fontSize: '3rem', color: '#007bff' }}></i>
              <p>Drag & drop your form here or click to browse</p>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Control 
                  type="file" 
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                  style={{ display: 'none' }}
                />
                <Button 
                  variant="outline-primary"
                  onClick={() => document.getElementById('formFile').click()}
                >
                  Select File
                </Button>
              </Form.Group>
              {file && <p className="mt-2">Selected file: {file.name}</p>}
            </div>

            <div className="d-flex justify-content-end">
              <Button 
                variant="primary" 
                onClick={uploadForm} 
                disabled={!file || loading}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Processing...</span>
                  </>
                ) : (
                  'Process Form'
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {step === 2 && formStructure && (
        <div>
          <Card className="form-container mb-4">
            <Card.Body>
              <h4 className="mb-3">Form Preview</h4>
              <p>Review and customize the digitized form before saving.</p>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form.Group className="mb-3">
                <Form.Label>Form Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter form name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </Form.Group>

              <div className="form-preview">
                <FormioForm form={formStructure} />
              </div>

              <div className="d-flex justify-content-between mt-4">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button 
                  variant="primary" 
                  onClick={createForm} 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Creating...</span>
                    </>
                  ) : (
                    'Save Form'
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </Container>
  );
};

export default UploadForm; 