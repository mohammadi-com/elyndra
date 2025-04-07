from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import forms, formio, ai

app = FastAPI(title="Digital Form Builder API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(forms.router, prefix="/api/forms", tags=["Forms"])
app.include_router(formio.router, prefix="/api/formio", tags=["Form.io"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])

@app.get("/")
async def read_root():
    return {"message": "Welcome to Digital Form Builder API"} 