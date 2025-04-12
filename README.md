# Digital Form Builder

A prototype application that transforms paper health & safety forms into interactive digital versions using Form.io and AI.

## Features

- Upload and digitize paper health & safety forms
- Edit and customize form templates
- Complete forms on mobile devices
- Generate maintenance reports with issue tracking
- Include photos of issues in form submissions

## Technology Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React
- **Form Management**: Form.io
- **AI Integration**: OpenAI for form processing

## Project Structure

```
.
├── backend/                 # FastAPI backend
│   ├── app/                 # Application code
│   │   ├── routers/         # API routes
│   │   ├── services/        # Business logic services
│   │   └── models/          # Data models
│   ├── requirements.txt     # Python dependencies
│   └── run.py               # Script to run the backend
│
└── frontend/                # React frontend
    ├── src/                 # Source code
    │   ├── components/      # Reusable components
    │   ├── pages/           # Page components
    │   └── services/        # API services
    └── package.json         # NPM dependencies
```

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables in `.env` file:
   ```
   FORMIO_SERVER_URL=Your form.io's server
   FORMIO_API_KEY=Your form.io's key
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. Run the backend server:
   ```
   python run.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the frontend development server:
   ```
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Use the "Upload Form" page to upload a paper form
3. Edit the detected form template in the Form Builder
4. Fill out the form on a mobile device
5. View submitted forms and generate reports

## Mobile Experience

The application is fully responsive and designed to work on mobile devices. When filling out forms on mobile:

- Photos can be captured directly with the device camera
- Form layouts adapt to smaller screens
- Touch-friendly UI elements

## License

MIT
