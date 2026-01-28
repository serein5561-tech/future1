FROM node:18-alpine

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm ci --only=production

COPY backend/ .

EXPOSE 8080

ENV PORT=8080

CMD ["node", "src/index.js"]
