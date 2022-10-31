# Generator

## Run Dockerized

### Prerequisites

Have [Docker Desktop](https://www.docker.com/get-started/) installed and running.

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

## Run directly

Build without run:

```cmd
cargo build
```

Build and run:

```cmd
cargo run
```

Default parameters:

* Host-IP: 127.0.0.1:34254
* Target-IP: 127.0.0.1:34255
* Frequency [Hz]: 1.0

Build and with command line args:

```cmd
cargo run <host-ip> <target-ip> <frequency>
```

Build and run as release:

```cmd
cargo run --release XX
```
