# AMOS Project 3 - Software Oscilloscope (AMOS SS 2022)


# About The Project
This project - SOSCI is a software developed based on an oscilloscopes and its features.

### Product Vision
The objective of SOSCI is to enable users of oscilloscope a way to gain access to all the features and possibilities through a software that can be done through a hardware oscilloscope and beyond. Our vision is to create a method that would better everyday life of engineers. 

### Product Mission
To organize features of an oscilloscope and processing of information and make it possible for the user to access it through a webpage. To continuously raise the level of experience of the customer with use of current technologies and maximize the output of our customer. Using SOSCI application for displaying sensor data on the frontend. 


## Environments
- [Develop - Nightly Builds](https://amos-sosci.die-degens.eu/dev/ui)
- [Integration - Latest Release Canidate](https://amos-sosci.die-degens.eu/int/ui)
- [Production - Latest Release](https://amos-sosci.die-degens.eu/prod/ui)

# Docker

## DockerHub Images
 - [Generator](https://hub.docker.com/repository/docker/sosci/generator)
 - [Backend](https://hub.docker.com/repository/docker/sosci/backend)
 - [Frontend](https://hub.docker.com/repository/docker/sosci/frontend)


## How to run docker containers

Prerequisites:

- Make sure you have Docker installed with `docker -v`
- Start the Docker daemon by running Docker Desktop or `dockerd`
- docker-compose installes

### Frontend

1. Enter the frontend directory: `cd Apps/`
2. Build & run the image: `docker-compose up --build`
3. Run detached the container: `docker-compose up -d`
4. Rebuild specific container: `docker-compose up -d --build <generator/backend/frontend>`
