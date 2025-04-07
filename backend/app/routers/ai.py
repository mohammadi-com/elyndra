from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Dict, Any
from ..services import ai_service

router = APIRouter()

@router.post("/process-form")
async def process_form(file: UploadFile = File(...)):
    """
    Process a form image/PDF using OpenAI to extract structure
    """
    if file.content_type not in ["application/pdf", "image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Only PDF, JPEG, and PNG files are supported")
    
    try:
        form_structure = await ai_service.process_form(file)
        return {"form_structure": form_structure}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/enhance-form")
async def enhance_form(form_data: Dict[str, Any]):
    """
    Enhance a form structure using OpenAI
    """
    try:
        enhanced_form = await ai_service.enhance_form(form_data)
        return enhanced_form
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    """
    Extract text from form image/PDF
    """
    if file.content_type not in ["application/pdf", "image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Only PDF, JPEG, and PNG files are supported")
    
    try:
        text = await ai_service.extract_text(file)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 