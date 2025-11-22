# Étape 1 : Builder React
FROM node:20-alpine AS build

WORKDIR /app

# Copier le fichier package.json
COPY package*.json ./

# Installer toutes les dépendances (y compris dev)
RUN npm install --include=dev

# ✅ Forcer l'installation de react-scripts
RUN npm install react-scripts@5.0.1 --save-dev

# Copier le code source
COPY . .

# Builder le projet React
RUN npm run build

# Étape 2 : Servir avec Nginx
FROM nginx:alpine

# Copier les fichiers build dans Nginx
COPY --from=build /app/build /usr/share/nginx/html

# code nouveau
# Copier le nginx.conf personnalisé
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
