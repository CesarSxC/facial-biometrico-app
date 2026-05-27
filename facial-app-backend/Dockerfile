# 1. Usamos la imagen oficial de Bun (¡Adiós Node y npm!)
FROM oven/bun:latest

# 2. Le decimos a Docker en qué carpeta trabajar
WORKDIR /app

# 3. Copiamos los archivos de paquetes (package.json y el lock de bun)
COPY package.json bun.lockb* ./

# 4. Instalamos las dependencias usando la velocidad de Bun
RUN bun install

# 5. Copiamos todo el resto del código fuente
COPY . .

# 6. Compilamos el código de TypeScript a JavaScript (carpeta /dist)
RUN bun run build

# 7. Exponemos el puerto 3000
EXPOSE 3000

# 8. El comando maestro: encendemos el servidor usando Bun
CMD ["bun", "dist/main.js"]