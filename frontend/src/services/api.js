import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Forms API
export const formsApi = {
  // Get all forms
  getForms: () => api.get('/forms'),
  
  // Get a specific form
  getForm: (formId) => api.get(`/forms/${formId}`),
  
  // Create a new form
  createForm: (formData) => api.post('/forms/create', formData),
  
  // Update a form
  updateForm: (formId, formData) => api.put(`/forms/${formId}`, formData),
  
  // Delete a form
  deleteForm: (formId) => api.delete(`/formio/forms/${formId}`),
  
  // Submit a form
  submitForm: (formId, submissionData) => api.post(`/forms/${formId}/submit`, submissionData),
  
  // Upload and process a form
  uploadForm: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/forms/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Get form submissions
  getSubmissions: () => api.get('/forms/submissions'),
  
  // Get maintenance report
  getReport: () => api.get('/forms/report'),
};

// AI API
export const aiApi = {
  // Process a form with AI
  processForm: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/ai/process-form', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Enhance a form with AI
  enhanceForm: (formData) => api.post('/ai/enhance-form', formData),
  
  // Extract text from an image/PDF
  extractText: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/ai/extract-text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default {
  forms: formsApi,
  ai: aiApi,
}; 