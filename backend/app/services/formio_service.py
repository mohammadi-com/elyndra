import os
import httpx
from typing import Dict, Any
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Load environment variables
FORMIO_SERVER_URL = os.getenv("FORMIO_SERVER_URL")
FORMIO_API_KEY = os.getenv("FORMIO_API_KEY")

# Headers for API requests
headers = {
    "Content-Type": "application/json",
    "x-token": FORMIO_API_KEY
}

async def get_forms():
    """Get all forms from the database"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{FORMIO_SERVER_URL}/form", headers=headers)
        response.raise_for_status()
        return response.json()

async def get_form(form_id: str):
    """Get a specific form by ID"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{FORMIO_SERVER_URL}/form/{form_id}", headers=headers)
        response.raise_for_status()
        return response.json()

async def create_form(form_data: Dict[str, Any]):
    """Create a new form"""
    # We no longer need formatting since OpenAI generates properly structured data
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{FORMIO_SERVER_URL}/form",
            headers=headers,
            json=form_data
        )
        response.raise_for_status()
        return response.json()

async def update_form(form_id: str, form_data: Dict[str, Any]):
    """Update an existing form"""
    # We no longer need formatting here either
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{FORMIO_SERVER_URL}/form/{form_id}",
            headers=headers,
            json=form_data
        )
        response.raise_for_status()
        return response.json()

async def submit_form(form_id: str, submission_data: Dict[str, Any]):
    """Submit a form with data"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{FORMIO_SERVER_URL}/form/{form_id}/submission",
            headers=headers,
            json=submission_data
        )
        response.raise_for_status()
        return response.json()

async def get_submissions():
    """Get all form submissions"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{FORMIO_SERVER_URL}/submission", headers=headers)
        response.raise_for_status()
        return response.json()

async def generate_report():
    """Generate a maintenance report based on form submissions"""
    # Get all submissions
    submissions = await get_submissions()
    
    # Filter submissions with issues (customize based on your form structure)
    issues = []
    for submission in submissions:
        if submission.get("data", {}).get("hasIssues") == True:
            issues.append({
                "id": submission.get("_id"),
                "formId": submission.get("form"),
                "dateSubmitted": submission.get("created"),
                "location": submission.get("data", {}).get("location", "Unknown"),
                "issueType": submission.get("data", {}).get("issueType", "Unknown"),
                "description": submission.get("data", {}).get("issueDescription", ""),
                "photos": submission.get("data", {}).get("issuePhotos", []),
                "priority": submission.get("data", {}).get("issuePriority", "Medium"),
                "status": "Open"
            })
    
    return {
        "reportDate": "Generated on: " + datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "totalIssues": len(issues),
        "issues": issues
    }

# Direct form.io API methods
async def get_formio_forms():
    """Get all forms from form.io"""
    return await get_forms()

async def create_formio_form(form_data: Dict[str, Any]):
    """Create a new form in form.io"""
    return await create_form(form_data)

async def get_formio_form(form_id: str):
    """Get a specific form from form.io"""
    return await get_form(form_id)

async def update_formio_form(form_id: str, form_data: Dict[str, Any]):
    """Update a form in form.io"""
    return await update_form(form_id, form_data)

async def delete_formio_form(form_id: str):
    """Delete a form from form.io"""
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"{FORMIO_SERVER_URL}/form/{form_id}",
            headers=headers
        )
        response.raise_for_status()
        return response.json()

async def get_formio_submissions(form_id: str):
    """Get all submissions for a specific form"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{FORMIO_SERVER_URL}/form/{form_id}/submission",
            headers=headers
        )
        response.raise_for_status()
        return response.json()

async def create_formio_submission(form_id: str, submission_data: Dict[str, Any]):
    """Create a new submission for a form"""
    return await submit_form(form_id, submission_data) 