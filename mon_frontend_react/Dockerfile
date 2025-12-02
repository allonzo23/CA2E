FROM node:20-alpine as build
WORKDIR /app

COPY package*.json ./

# Installation propre
RUN npm cache clean --force && \
    npm install --legacy-peer-deps --force && \
    npm install ajv@8.12.0 --save --legacy-peer-deps --force

COPY . .

ENV NODE_ENV=production

# Utiliser npm run build au lieu de npx
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]