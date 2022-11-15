# AMOS Project 3 - Software Oscilloscope (AMOS SS 2022)

[Feature board](https://github.com/users/dev3225/projects/1/views/1)

[Impediments backlog](https://github.com/users/rbalink/projects/1/views/1)

# Docker

## How to run docker containers

Prerequisites:

- Make sure you have Docker installed with `docker -v`
- Start the Docker daemon by running Docker Desktop or `dockerd`

### Frontend

1. Enter the frontend directory: `cd code/frontend`
2. Build the image: `docker build -t sosci-frontend .`
   - `-t sosci-frontend` tags the image for convenience.
   - `.` refers to the location of the Dockerfile.
3. Run the container: `docker run --name=sosci-frontend -p 5000:80 sosci-frontend`
   - `--name=sosci-frontend` sets the name of the container.
   - `-p 5000:80` exposes port 80 of nginx to port 5000 on the host machine.
   - `sosci-frontend` refers to the image you built in step 2.
4. Open `localhost:5000`.
