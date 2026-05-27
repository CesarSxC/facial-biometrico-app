# === ETAPA 1: Compilación con Bun ===
FROM oven/bun:latest AS builder

WORKDIR /app

# Copiamos archivos de dependencias
COPY package.json bun.lockb* ./
RUN bun install

# Copiamos el resto del código y compilamos para producción
COPY . .
RUN bun run build --configuration production

# === ETAPA 2: Servidor Web Ultraligero (Nginx) ===
FROM nginx:alpine

# Limpiamos el servidor Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiamos los archivos estáticos desde la etapa de compilación
# NOTA: Revisa si tu carpeta es "dist/facial-app-frontend/browser" 
# (Común en Angular 17+) o solo "dist/facial-app-frontend"
COPY --from=builder /app/dist/facial-app-frontend/browser /usr/share/nginx/html

# Exponemos el puerto 80 interno de Nginx
EXPOSE 80

# Arrancamos el servidor web
CMD ["nginx", "-g", "daemon off;"]