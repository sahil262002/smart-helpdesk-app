# frontend/Dockerfile

# Stage 1: Build the React application
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application using a lightweight server
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# ADD THIS LINE to copy your custom config file
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80