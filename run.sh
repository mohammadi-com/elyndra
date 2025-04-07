#!/bin/bash

# Start backend and frontend in parallel

# Start backend
cd backend
# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  python -m venv venv
fi
# Activate virtual environment
source venv/bin/activate
# Install dependencies
pip install -r requirements.txt
# Run backend in background
echo "Starting backend server..."
python run.py &
BACKEND_PID=$!
cd ..

# Start frontend
cd frontend
# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi
# Run frontend
echo "Starting frontend server..."
npm start &
FRONTEND_PID=$!
cd ..

# Wait for user input to terminate
echo "Both servers are running. Press Ctrl+C to stop."
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 