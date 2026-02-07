FROM node:22-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código del servidor
COPY server.js .
COPY imvu-client.js .
COPY imvu-routes.js .

# Exponer puerto
EXPOSE 3001

# Iniciar servidor
CMD ["node", "server.js"]
