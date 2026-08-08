#!/usr/bin/env bash
set -e

ENVIRONMENT=$1
VERSION=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$VERSION" ]; then
  echo "Usage: $0 <environment> <version>"
  exit 1
fi

if [ -z "$REGISTRY" ]; then
  echo "Error: REGISTRY environment variable is not set."
  echo "Example: REGISTRY=123456789012.dkr.ecr.ap-south-1.amazonaws.com ./scripts/deploy.sh production v1.0.0"
  exit 1
fi

NAMESPACE="parilink-${ENVIRONMENT}"

echo "Deploying version ${VERSION} to ${NAMESPACE}..."

kubectl set image deployment/parilink-api api=${REGISTRY}/parilink-api:${VERSION} -n ${NAMESPACE}
kubectl set image deployment/parilink-web web=${REGISTRY}/parilink-web:${VERSION} -n ${NAMESPACE}

echo "Waiting for rollout to complete..."
kubectl rollout status deployment/parilink-api -n ${NAMESPACE} --timeout=300s
kubectl rollout status deployment/parilink-web -n ${NAMESPACE} --timeout=300s

echo "Deployment of ${VERSION} to ${ENVIRONMENT} completed successfully."
