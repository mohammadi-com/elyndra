import os
import json
from typing import Dict, Any
import base64
import openai
from dotenv import load_dotenv
from fastapi import UploadFile

load_dotenv()

# Load OpenAI API key from environment
openai.api_key = os.getenv("OPENAI_API_KEY")

async def process_form(file: UploadFile) -> Dict[str, Any]:
    """
    Process a form image/PDF using OpenAI to extract structure
    """
    # Read the file content
    content = await file.read()
    
    # For PDFs, we need to convert to image (simplified for this prototype)
    if file.content_type == "application/pdf":
        # In a real implementation, you'd use a PDF-to-image converter
        # For this prototype, we'll just handle it as an image
        pass
    
    # Convert to base64 for OpenAI API
    encoded_image = base64.b64encode(content).decode('utf-8')
    
    # Example of a working form.io structure to use as a template
    example_template = """
    {
        "title": "Register",
        "display": "form",
        "type": "form",
        "name": "register",
        "path": "register",
        "components": [{
            "input": true,
            "tableView": true,
            "inputType": "text",
            "inputMask": "",
            "label": "First Name",
            "key": "firstName",
            "placeholder": "",
            "prefix": "",
            "suffix": "",
            "multiple": false,
            "defaultValue": "",
            "protected": false,
            "unique": false,
            "persistent": true,
            "validate": {
                "required": true,
                "minLength": "",
                "maxLength": "",
                "pattern": "",
                "custom": "",
                "customPrivate": false
            },
            "conditional": {
                "show": "",
                "when": null,
                "eq": ""
            },
            "type": "textfield",
            "tags": [],
            "lockKey": true,
            "isNew": false
        }, {
            "label": "Radio",
            "optionsLabelPosition": "right",
            "inline": false,
            "tableView": false,
            "values": [
                {
                    "label": "yes",
                    "value": "yes",
                    "shortcut": ""
                },
                {
                    "label": "no",
                    "value": "no",
                    "shortcut": ""
                }
            ],
            "validateWhenHidden": false,
            "key": "radio",
            "type": "radio",
            "input": true
        }, {
            "label": "Comment/Action",
            "applyMaskOn": "change",
            "tableView": true,
            "validateWhenHidden": false,
            "key": "commentAction",
            "type": "textfield",
            "input": true,
            "conditional": {
                "show": true,
                "when": "radio",
                "eq": "yes"
            }
        }, {
            "input": true,
            "label": "Submit",
            "tableView": false,
            "key": "submit",
            "size": "md",
            "leftIcon": "",
            "rightIcon": "",
            "block": false,
            "action": "submit",
            "disableOnInvalid": false,
            "theme": "primary",
            "type": "button"
        }]
    }
    """
    
    # Call OpenAI API to analyze the form
    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "You are an AI assistant specialized in thoroughly analyzing form images and converting them to digital structures. "
                           "Your task is to meticulously examine every element in the image and identify ALL form fields, sections, labels, and input types. "
                           "Be extremely thorough - do not miss any field, checkbox, dropdown, text area, or other input element. "
                           "Create a complete form.io compatible JSON representation that includes EVERY field visible in the image. "
                           "Map each field to the most appropriate form.io component type (textfield, textarea, select, radio, checkbox, email, phoneNumber, number, etc). "
                           "Always include necessary properties like input, tableView, type, key, label, etc. for each component. "
                           "Pay close attention to field groupings, sections, and hierarchical relationships between fields. "
                           "If there are any complex layouts or field arrangements, represent them accurately. "
                           "Make sure to follow form.io's format requirements as shown in the reference example."
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": f"Extract the COMPLETE form structure from this image and create a comprehensive form.io compatible JSON representation. Identify and include EVERY field visible in the image without exception.\n\nAnalyze the form systematically, working from top to bottom, left to right. Don't miss any field, checkbox, dropdown, or other input element. For each field, determine the most appropriate form.io component type.\n\nUse the example below as a reference for the format, but adapt to include ALL field types present in this specific form:\n\n{example_template}"},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"}}
                ]
            }
        ],
        response_format={"type": "json_object"},
        max_tokens=4000
    )
    
    # Extract the form structure from the response
    form_structure = json.loads(response.choices[0].message.content)
    
    # Ensure submit button exists
    has_submit = False
    for component in form_structure["components"]:
        if component.get("type") == "button" and component.get("action") == "submit":
            has_submit = True
            break
    
    if not has_submit:
        form_structure["components"].append({
            "input": True,
            "label": "Submit",
            "tableView": False,
            "key": "submit",
            "size": "md",
            "leftIcon": "",
            "rightIcon": "",
            "block": False,
            "action": "submit",
            "disableOnInvalid": False,
            "theme": "primary",
            "type": "button"
        })
    
    return form_structure

async def enhance_form(form_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Enhance a form structure using OpenAI
    """
    # Convert form structure to string for OpenAI
    form_json = json.dumps(form_data, indent=2)
    
    # Example of a working form.io structure to use as a template
    example_template = """
    {
        "title": "Register",
        "display": "form",
        "type": "form",
        "name": "register",
        "path": "register",
        "components": [{
            "input": true,
            "tableView": true,
            "inputType": "text",
            "inputMask": "",
            "label": "First Name",
            "key": "firstName",
            "placeholder": "",
            "prefix": "",
            "suffix": "",
            "multiple": false,
            "defaultValue": "",
            "protected": false,
            "unique": false,
            "persistent": true,
            "validate": {
                "required": true,
                "minLength": "",
                "maxLength": "",
                "pattern": "",
                "custom": "",
                "customPrivate": false
            },
            "conditional": {
                "show": "",
                "when": null,
                "eq": ""
            },
            "type": "textfield",
            "tags": [],
            "lockKey": true,
            "isNew": false
        }, {
            "label": "Radio",
            "optionsLabelPosition": "right",
            "inline": false,
            "tableView": false,
            "values": [
                {
                    "label": "yes",
                    "value": "yes",
                    "shortcut": ""
                },
                {
                    "label": "no",
                    "value": "no",
                    "shortcut": ""
                }
            ],
            "validateWhenHidden": false,
            "key": "radio",
            "type": "radio",
            "input": true
        }, {
            "label": "Comment/Action",
            "applyMaskOn": "change",
            "tableView": true,
            "validateWhenHidden": false,
            "key": "commentAction",
            "type": "textfield",
            "input": true,
            "conditional": {
                "show": true,
                "when": "radio",
                "eq": "yes"
            }
        }, {
            "input": true,
            "label": "Submit",
            "tableView": false,
            "key": "submit",
            "size": "md",
            "leftIcon": "",
            "rightIcon": "",
            "block": false,
            "action": "submit",
            "disableOnInvalid": false,
            "theme": "primary",
            "type": "button"
        }]
    }
    """
    
    # Call OpenAI API to enhance the form
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": "You are an AI assistant specialized in enhancing digital form structures. "
                           "Your task is to comprehensively improve the given form.io compatible form structure by:"
                           "1. Adding appropriate validation rules for ALL fields (required, pattern matching, min/max length, etc.)"
                           "2. Optimizing field organization and layout for better user experience"
                           "3. Implementing smart conditional logic between related fields"
                           "4. Enhancing labels, placeholders, and help text for clarity"
                           "5. Ensuring proper field types and formats (email validation, phone formats, etc.)"
                           "6. Preserving all existing fields while improving their configuration"
                           "7. Maintaining proper form.io structure and properties"
                           "Be thorough and comprehensive - enhance EVERY field in the form while ensuring the entire structure remains fully compatible with form.io."
            },
            {
                "role": "user",
                "content": f"Enhance this form.io structure to create a polished, professional form with proper validation and organization:\n\n{form_json}\n\n"
                           f"Improve EVERY field in the form while maintaining form.io compatibility. Reference this example for the correct property structure, but adapt to the specific fields in this form:\n\n{example_template}"
            }
        ],
        response_format={"type": "json_object"},
        max_tokens=4000
    )
    
    # Extract the enhanced form structure directly from the response
    enhanced_form = json.loads(response.choices[0].message.content)
    return enhanced_form

async def extract_text(file: UploadFile) -> str:
    """
    Extract text from form image/PDF
    """
    # Read the file content
    content = await file.read()
    
    # Convert to base64 for OpenAI API
    encoded_image = base64.b64encode(content).decode('utf-8')
    
    # Call OpenAI API to extract text
    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "You are an AI assistant designed to extract text from form images. "
                           "Extract all text content from the provided image, maintaining the structure as much as possible."
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Extract all text from this form image."},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"}}
                ]
            }
        ],
        max_tokens=4000
    )
    
    # Return the extracted text
    return response.choices[0].message.content 