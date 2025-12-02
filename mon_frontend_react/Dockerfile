FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
ENV NODE_ENV=production
RUN npx react-app-rewired build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# ✅ LIGNE CRITIQUE - Vérifiez qu'elle est présente
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]