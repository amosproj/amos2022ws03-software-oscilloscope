# AMOS Project 3 - Software Oscilloscope (AMOS SS 2022)


# About The Project
This project - SOSCI is a software developed based on an oscilloscopes and its features.

### Product Vision
The goal of SOSCI is to empower oscilloscope users to unlock the full potential of their hardware and beyond. Our vision is to revolutionize the work of engineers with a cutting-edge, web-based application that streamlines their daily tasks.


### Product Mission
Our mission is to provide a comprehensive, user-friendly solution for oscilloscope users, enabling them to achieve their goals more efficiently and effectively. We strive to deliver innovative and intuitive software that exceeds industry standards and elevates the user experience. Our commitment to performance drives us to continuously improve our product, and to always put the needs of our customer first.


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
