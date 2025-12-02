FROM node:20-bullseye-slim
WORKDIR /app
COPY package*.json ./
RUN apt-get update && \
    apt-get install -y build-essential python3 curl && \
    npm install && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]