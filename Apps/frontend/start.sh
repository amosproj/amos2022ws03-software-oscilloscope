#!/bin/sh

echo "Starting nginx..."
nginx -g 'daemon on;'
echo "Starting node..."
npm start