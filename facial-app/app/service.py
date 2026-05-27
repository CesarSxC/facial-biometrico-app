import face_recognition
import numpy as np
import cv2
from functools import lru_cache

class FaceRecognitionService:
  
  def __init__(self):
    pass
  
  
  def generate_vector(self, image_bytes: bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img_cv2 = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    rgb_img = cv2.cvtColor(img_cv2, cv2.COLOR_BGR2RGB)
        
    face_locations = face_recognition.face_locations(rgb_img)
        
    if len(face_locations) == 0:
      raise ValueError("No se detectó ningún rostro en la imagen.")
    if len(face_locations) > 1:
      raise ValueError("Se detectó más de un rostro. El enrolamiento debe ser individual.")
            
    face_encoding = face_recognition.face_encodings(rgb_img, face_locations)[0]
        
    return face_encoding.tolist()    
    
  def reconocer_imagen(self, image_bytes: bytes, base_datos_vectores: dict):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img_cv2 = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    rgb_img = cv2.cvtColor(img_cv2, cv2.COLOR_BGR2RGB)
      
    face_locations = face_recognition.face_locations(rgb_img)
    face_encodings = face_recognition.face_encodings(rgb_img, face_locations)
    
    if not face_encodings:
      return [{"nombre": "Desconocido", "error": "No face detected"}]

    resultados = []
    
    nombres_conocidos = list(base_datos_vectores.keys())
    
    vectores_conocidos = [np.array(vector) for vector in base_datos_vectores.values()]
      
    for face_encoding in face_encodings:
      nombre = "Desconocido"

      if vectores_conocidos:
        matches = face_recognition.compare_faces(vectores_conocidos, face_encoding)

        if True in matches:
          first_match_index = matches.index(True)
          nombre = nombres_conocidos[first_match_index]
        resultados.append({"nombre": nombre})
        
    return resultados

@lru_cache()
def get_face_service():
    return FaceRecognitionService()