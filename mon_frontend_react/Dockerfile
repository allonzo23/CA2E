FROM node:20-alpine as build
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installation avec résolution de conflits
RUN npm install --legacy-peer-deps --force

# Copier le code source
COPY . .

# Variable d'environnement
ENV NODE_ENV=production

# Build de l'application
RUN npx react-app-rewired build

# Stage de production avec nginx
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=build /app/build /usr/share/nginx/html

# Copier la configuration nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]