from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from ..services import formio_service

router = APIRouter()

@router.get("/forms")
async def get_formio_forms():
    """
    Get all forms from form.io
    """
    try:
        forms = await formio_service.get_formio_forms()
        return forms
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/forms")
async def create_formio_form(form_data: Dict[str, Any]):
    """
    Create a new form in form.io
    """
    try:
        result = await formio_service.create_formio_form(form_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/forms/{form_id}")
async def get_formio_form(form_id: str):
    """
    Get a specific form from form.io
    """
    try:
        form = await formio_service.get_formio_form(form_id)
        return form
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/forms/{form_id}")
async def update_formio_form(form_id: str, form_data: Dict[str, Any]):
    """
    Update a form in form.io
    """
    try:
        result = await formio_service.update_formio_form(form_id, form_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/forms/{form_id}")
async def delete_formio_form(form_id: str):
    """
    Delete a form from form.io
    """
    try:
        result = await formio_service.delete_formio_form(form_id)
        return {"message": "Form deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/forms/{form_id}/submissions")
async def get_formio_submissions(form_id: str):
    """
    Get all submissions for a specific form
    """
    try:
        submissions = await formio_service.get_formio_submissions(form_id)
        return submissions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/forms/{form_id}/submissions")
async def create_formio_submission(form_id: str, submission_data: Dict[str, Any]):
    """
    Create a new submission for a form
    """
    try:
        result = await formio_service.create_formio_submission(form_id, submission_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 