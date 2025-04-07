import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import UploadForm from './pages/UploadForm';
import FormsList from './pages/FormsList';
import FormBuilder from './pages/FormBuilder';
import FormSubmit from './pages/FormSubmit';
import Reports from './pages/Reports';

// Set form.io base URL
import { Formio } from 'formiojs';
Formio.setBaseUrl('https://odlsnbvnodlkzac.form.io');
Formio.setProjectUrl('https://odlsnbvnodlkzac.form.io');

function App() {
  return (
    <Router>
      <Navigation />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadForm />} />
          <Route path="/forms" element={<FormsList />} />
          <Route path="/builder/:formId" element={<FormBuilder />} />
          <Route path="/submit/:formId" element={<FormSubmit />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App; 