# Utiliser Node.js LTS
FROM node:20-alpine

# Créer le dossier de l'application
WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer toutes les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Exposer le port défini dans .env
ARG PORT=3001
ENV PORT=${PORT}
EXPOSE ${PORT}

# Lancer l'application
CMD ["node", "server.js"]
