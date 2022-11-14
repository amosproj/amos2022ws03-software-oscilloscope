# Use official rust:slim as base
FROM rust:slim

RUN apt-get update
RUN apt-get install -y iputils-ping

#Setting default parameters as cargo build requires env vars to be set
ENV HOST=0.0.0.0:34254
ENV TARGET=frontend:9022
ENV FREQUENCY=1.0

# Create folder structur for code
RUN mkdir -p /usr/src/generator
WORKDIR /usr/src/generator

# Copy source code onto docker image
COPY . .

# Build
RUN cargo build

# Run on container start
CMD ["cargo", "run"]