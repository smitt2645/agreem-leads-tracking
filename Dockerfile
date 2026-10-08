FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/

RUN npm install
RUN npm --prefix client install

COPY . .

RUN npm run client:build

FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/client/dist ./client/dist

RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=5000
ENV DB_PATH=/app/data/leads.db

EXPOSE 5000

CMD ["node", "src/server.js"]
