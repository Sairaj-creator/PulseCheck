#!/bin/bash
set -e

# Usage: ./deploy.sh <git-sha> <docker-hub-username>
IMAGE_TAG=$1
DOCKER_USR=$2

if [ -z "$IMAGE_TAG" ] || [ -z "$DOCKER_USR" ]; then
  echo "Usage: ./deploy.sh <git-sha> <docker-hub-username>"
  exit 1
fi

LAST_GOOD_SHA_FILE="/var/jenkins_home/workspace/last_good_sha.txt"

echo "======================================"
echo "Starting Deploy for SHA: $IMAGE_TAG"
echo "======================================"

# NOTE: This deploy mechanism introduces a real downtime window.
# The stack is fully stopped and started on every deploy (and rollback).
# For a zero-downtime deployment, we would need to spin up the new containers 
# on alternate ports, health-check them, and then proxy over. 
# We accept this downtime for this project's scale.

# WARNING: Rollback depends on the old SHA's image being cached locally on the Jenkins host.
# Do NOT add a routine 'docker system prune' or aggressive image cleanup step to this pipeline,
# otherwise rollback will fail if it tries to revert to a pruned image.

export IMAGE_TAG=$IMAGE_TAG

# Stop current stack and start new one
docker compose down
docker compose up -d

echo "Waiting for containers to boot..."
sleep 5

HEALTH_CHECK_URL="http://host.docker.internal:3000/health"
MAX_RETRIES=7
RETRY_DELAY=5
SUCCESS=false

for i in $(seq 1 $MAX_RETRIES); do
  echo "Health check attempt $i of $MAX_RETRIES..."
  if curl -sSf $HEALTH_CHECK_URL > /dev/null; then
    echo "Health check passed!"
    SUCCESS=true
    break
  fi
  echo "Health check failed. Retrying in $RETRY_DELAY seconds..."
  sleep $RETRY_DELAY
done

if [ "$SUCCESS" = true ]; then
  echo "Deployment successful."
  echo "$IMAGE_TAG" > $LAST_GOOD_SHA_FILE
  
  echo "Tagging and pushing 'latest' to Docker Hub..."
  docker tag $DOCKER_USR/pulsecheck-frontend:$IMAGE_TAG $DOCKER_USR/pulsecheck-frontend:latest
  docker push $DOCKER_USR/pulsecheck-frontend:latest
  
  docker tag $DOCKER_USR/pulsecheck-backend:$IMAGE_TAG $DOCKER_USR/pulsecheck-backend:latest
  docker push $DOCKER_USR/pulsecheck-backend:latest
  
  echo "Deployment complete."
else
  echo "======================================"
  echo "HEALTH CHECK FAILED. INITIATING ROLLBACK."
  echo "======================================"
  
  if [ -f "$LAST_GOOD_SHA_FILE" ]; then
    PREV_SHA=$(cat $LAST_GOOD_SHA_FILE)
    echo "Rolling back to previous good SHA: $PREV_SHA"
    
    export IMAGE_TAG=$PREV_SHA
    docker compose down
    docker compose up -d
    
    echo "Rollback complete (containers started with old SHA). Note: Pipeline will still fail."
  else
    echo "No last_good_sha.txt found. Cannot roll back. System is down!"
  fi
  
  # Exit with error to fail the Jenkins stage
  exit 1
fi
