# Use official rust:slim as base
FROM rust:slim

RUN apt-get update
RUN apt-get install -y iputils-ping

# Create folder structur for code
RUN mkdir -p /usr/src/generator
WORKDIR /usr/src/generator

# Copy source code onto docker image
COPY . .

# Build
RUN cargo build

# Run on container start
CMD ["cargo", "run"]