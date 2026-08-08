#!/usr/bin/env bash
set -e

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
  echo "Usage: $0 <environment>"
  exit 1
fi

echo "Initiating rollback for ${ENVIRONMENT}..."

# Undo the last deployment rollout
kubectl rollout undo deployment/parilink-api -n default
kubectl rollout undo deployment/parilink-web -n default

echo "Waiting for rollback to complete..."
kubectl rollout status deployment/parilink-api -n default --timeout=300s
kubectl rollout status deployment/parilink-web -n default --timeout=300s

echo "Rollback completed successfully."
