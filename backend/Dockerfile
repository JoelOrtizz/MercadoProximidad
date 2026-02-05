FROM node:22-bookworm-slim

WORKDIR /app

# Dependencias primero (mejor cache)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Código
COPY api ./api

# Carpeta de uploads (se montará como volumen en producción)
RUN mkdir -p /app/uploads

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]

