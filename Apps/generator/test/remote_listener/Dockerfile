# Use official rust:slim as base
FROM rust:latest

RUN apt-get update
RUN apt-get install -y iputils-ping

# Create folder structur for code
RUN mkdir -p /usr/src/remote_listener
WORKDIR /usr/src/remote_listener

# Copy source code onto docker image
COPY . .

# Build
RUN cargo build

# Run on container start
CMD ["cargo", "run"]