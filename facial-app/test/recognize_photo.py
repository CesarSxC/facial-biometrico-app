import cv2
import face_recognition
import numpy as np

def analize_photo():
  image_base = face_recognition.load_image_file('images/elon.jpg')
  cod_image = face_recognition.face_encodings(image_base)[0]
  
  image_test = face_recognition.load_image_file('images/elon_test.jpg')
  imagen_test_bgr = cv2.cvtColor(image_test, cv2.COLOR_RGB2BGR)
  
  face_locations = face_recognition.face_locations(image_test)
  face_encodings = face_recognition.face_encodings(image_test, face_locations)
  
  for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
    
    matches = face_recognition.compare_faces([cod_image], face_encoding)
    nombre = "Desconocido"
    
    if True in matches:
      nombre = "Eres Tu"
      
    cv2.rectangle(imagen_test_bgr, (left, top), (right, bottom), (0, 255, 0), 2)   
    cv2.putText(imagen_test_bgr, nombre, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
    
    cv2.imshow("Resultado del Analisis", imagen_test_bgr)
    
    cv2.waitKey(0)
    cv2.destroyAllWindows()
analize_photo()    