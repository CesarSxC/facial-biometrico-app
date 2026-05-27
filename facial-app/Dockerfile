# Usamos una versión oficial y ligera de Python
FROM python:3.10-slim

# Le decimos a Docker en qué carpeta interna trabajar
WORKDIR /app

# ¡CLAVE! Instalamos los compiladores de C++ y herramientas de video que dlib y OpenCV necesitan en Linux
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copiamos nuestra armadura (las versiones exactas)
COPY requirements.txt .

# Instalamos las librerías de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos todo el código de la aplicación
COPY . .

# Exponemos el puerto
EXPOSE 8000

# El comando para arrancar FastAPI (nota que usamos 0.0.0.0 para que se pueda ver desde afuera del contenedor)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]