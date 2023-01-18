# Use Node v14 for building
FROM node:14-alpine AS build

# Set workdir inside docker container
WORKDIR /usr/src/app

# Copy package.json and package.lock.json into docker container
COPY package*.json ./

# Install node modules in docker container
RUN npm install

# Copy source code into docker container
COPY . ./

CMD [ "npm", "start" ]