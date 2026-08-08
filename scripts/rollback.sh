#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
  echo "Usage: $0 <environment>"
  exit 1
fi

echo "Initiating rollback for ${ENVIRONMENT}..."

NAMESPACE="parilink-${ENVIRONMENT}"

# Undo the last deployment rollout
kubectl rollout undo deployment/parilink-api -n ${NAMESPACE}
kubectl rollout undo deployment/parilink-web -n ${NAMESPACE}

echo "Waiting for rollback to complete..."
kubectl rollout status deployment/parilink-api -n ${NAMESPACE} --timeout=300s
kubectl rollout status deployment/parilink-web -n ${NAMESPACE} --timeout=300s

echo "Rollback completed successfully."
