# Use Node v14 for building
FROM node:14-alpine AS build

ARG MODE

# Set workdir inside docker container
WORKDIR /usr/src/app

# Copy package.json and package.lock.json into docker container
COPY package*.json ./

# Install node modules in docker container
RUN npm install

# Copy source code into docker container
COPY . ./

# Expose vite port to host machine
RUN npm run build -- --mode ${MODE}

# Use nginx for serving build
FROM nginx:1.19-alpine

# Copy app from build container to nginx container
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
