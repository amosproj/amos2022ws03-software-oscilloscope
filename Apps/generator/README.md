# Generator

## Run Dockerized

### Prerequisites

Have [Docker Desktop](https://www.docker.com/get-started/) installed and running.

### Use docker-compose

From inside the directory Apps/backend run:

```cmd
docker-compose up
```

This will build the latest image and start the container with published port 9000.

### Build Image

From inside the directory code/generator/generator run:

```cmd
docker build -t generator .
```

### Run Image

Possibilites:
* Use Docker Desktop App
* Run from terminal: (add -d to run in background)
```cmd
docker run generator
```

## Run/Build local

Build:

```cmd
cargo build
```

Build as release:

```cmd
cargo build --release
```

Build and run:

```cmd
cargo run
```

Run unit tests:

```cmd
cargo test
```

