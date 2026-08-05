# 1. Usar Miniconda para evitar compilar dlib desde cero
FROM continuumio/miniconda3

# 2. Le decimos a Docker en qué carpeta interna trabajar
WORKDIR /app

# 3. Instalamos las herramientas de video que OpenCV necesita en Linux
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 4. ¡LA MAGIA! Instalamos dlib ya pre-compilado usando conda
RUN conda install -c conda-forge dlib -y

# 5. Copiamos nuestra armadura
COPY requirements.txt .

# 6. Instalamos el resto de las librerías de Python
RUN pip install --no-cache-dir -r requirements.txt

# 7. Copiamos todo el código de la aplicación
COPY . .

# 8. Exponemos el puerto
EXPOSE 8000

# 9. El comando para arrancar FastAPI (usamos el mismo que ya tenías)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
