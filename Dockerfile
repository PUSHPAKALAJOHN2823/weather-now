FROM node:20-alpine AS build-stage
 
WORKDIR /app
 
COPY FE/package*.json ./
RUN npm install
 
COPY FE/ .
RUN npm run build
 
 
# -------- BACKEND STAGE --------
FROM node:20-alpine
 
WORKDIR /app
 
COPY BE/package*.json ./
RUN npm install --omit=dev
 
COPY --from=build-stage /app/dist ./dist
COPY BE/ .
 
EXPOSE 8080
 
CMD ["node", "server.js"]
