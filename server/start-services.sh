#!/usr/bin/env bash

# Start the first process
npm start &

# Start the second process
npm run start-service-transaction &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?