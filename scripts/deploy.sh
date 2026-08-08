#!/usr/bin/env bash
set -e

ENVIRONMENT=$1
VERSION=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$VERSION" ]; then
  echo "Usage: $0 <environment> <version>"
  exit 1
fi

echo "Deploying version ${VERSION} to ${ENVIRONMENT}..."

# Helm upgrade command (assumes PariLink has a base helm chart in terraform/helm/parilink-api)
# Using generic kubectl set image for simplicity in this script assuming a standard deployment
kubectl set image deployment/parilink-api parilink-api=${AWS_ACCOUNT_ID}.dkr.ecr.ap-south-1.amazonaws.com/parilink-api:${VERSION} -n default
kubectl set image deployment/parilink-web parilink-web=${AWS_ACCOUNT_ID}.dkr.ecr.ap-south-1.amazonaws.com/parilink-web:${VERSION} -n default

echo "Waiting for rollout to complete..."
kubectl rollout status deployment/parilink-api -n default --timeout=300s
kubectl rollout status deployment/parilink-web -n default --timeout=300s

echo "Deployment of ${VERSION} to ${ENVIRONMENT} completed successfully."
