from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from app.service import FaceRecognitionService, get_face_service
import json

app = FastAPI(
  title="Microservicio Facial de IA",
  description="API para reconocimiento facial estatico",
  version="1.0"
)

@app.post("/enrolar")
async def enrolar_rostro(
  file: UploadFile = File(...),
  ia_service: FaceRecognitionService = Depends(get_face_service) 
):
  try:
    image_bytes = await file.read()
    vector_generado = ia_service.generate_vector(image_bytes)
    
    return {
      "status": "success",
      "filename": file.filename,
      "vector": vector_generado
    }
  except Exception as e:
    raise HTTPException(status_code=400, detail=str(e))
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@app.post("/reconocer")
async def reconocer_rostro(
  file: UploadFile = File(...),
  vectores_json: str = Form(...), 
  ia_service: FaceRecognitionService = Depends(get_face_service) 
):
  try:
    image_bytes = await file.read()
    
    base_datos_vectores = json.loads(vectores_json)
    
    faces_found = ia_service.reconocer_imagen(image_bytes, base_datos_vectores)
    
    return {
      "status": "success",
      "filename": file.filename,
      "data": faces_found      
    }
  except ValueError as e:
    raise HTTPException(status_code=400, detail=str(e))
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")