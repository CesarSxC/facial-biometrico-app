import cv2
import face_recognition

cap = cv2.VideoCapture(0)

print("Iniciando la cámara... Presiona la tecla 'q' para salir.")

while True:
  ret, frame = cap.read()
  
  if not ret:
    print("Error: No se puede acceder a la cámara.")
    break
  
  small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
  
  rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
  
  face_locations = face_recognition.face_locations(rgb_small_frame) 
  
  for (top, right, bottom, left) in face_locations:
    
    top *=4
    right *=4
    bottom *=4
    left *=4
    
    cv2.rectangle(frame, (left,top), (right, bottom), (0, 255, 0), 2)
    
  cv2.imshow('Detector de rostros (Prueba)', frame)
  
  if cv2.waitKey(1) & 0xFF == ord('q'):
    break

cap.release()
cv2.destroyAllWindows()
    