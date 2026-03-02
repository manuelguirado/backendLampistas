FROM node:22-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Crea un usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Instala pnpm globalmente
RUN npm install -g pnpm

# Copia los archivos de dependencias primero para aprovechar la cache
COPY package.json pnpm-lock.yaml ./

# Instala las dependencias usando pnpm
RUN pnpm install

# Copia el resto de la aplicación
COPY . .

# Cambia al usuario no-root
USER nodejs

# Expone el puerto de la API
EXPOSE 3000

# Comando por defecto (ajusta si usas otro script)
CMD ["pnpm", "start:dev"]