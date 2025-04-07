from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from fastapi.responses import JSONResponse
from typing import List, Optional
import json
from ..services import formio_service, ai_service

router = APIRouter()

@router.post("/upload")
async def upload_form(
    file: UploadFile = File(...),
):
    """
    Upload a paper form and convert it to digital format using AI
    """
    if file.content_type not in ["application/pdf", "image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Only PDF, JPEG, and PNG files are supported")
    
    try:
        # Process the uploaded form
        form_structure = await ai_service.process_form(file)
        return {"form_structure": form_structure}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create")
async def create_form(form_data: dict):
    """
    Create a new form in form.io using the provided structure
    """
    try:
        result = await formio_service.create_form(form_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_forms():
    """
    Get all available forms
    """
    try:
        forms = await formio_service.get_forms()
        return forms
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{form_id}")
async def get_form(form_id: str):
    """
    Get a specific form by ID
    """
    try:
        form = await formio_service.get_form(form_id)
        return form
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{form_id}")
async def update_form(form_id: str, form_data: dict):
    """
    Update a form
    """
    try:
        result = await formio_service.update_form(form_id, form_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{form_id}/submit")
async def submit_form(form_id: str, submission_data: dict):
    """
    Submit a form with the provided data
    """
    try:
        result = await formio_service.submit_form(form_id, submission_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/submissions")
async def get_submissions():
    """
    Get all form submissions
    """
    try:
        submissions = await formio_service.get_submissions()
        return submissions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/report")
async def generate_report():
    """
    Generate a maintenance report based on form submissions
    """
    try:
        report = await formio_service.generate_report()
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 