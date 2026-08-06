# Chaos Engineering Experiments

The following experiments validate the PariLink distributed systems resilience parameters. We rely on Kubernetes Chaos Mesh to inject faults into the staging cluster.

## 1. Network Partition (Redis Unreachable)
**Hypothesis:** If the Redis cluster is unreachable, API routes that don't depend on rate limiting or brute force protection should still function (failing open for Redis, or bypassing gracefully). However, BullMQ operations will fail.
**Manifest:**
```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: redis-network-partition
spec:
  action: partition
  mode: all
  selector:
    labelSelectors:
      app: parilink-api
  direction: to
  target:
    selector:
      labelSelectors:
        app: redis
```
**Verification:** Ensure `/health/readiness` fails but `/health/liveness` passes. Ensure core HTTP GET routes are still partially functional.

## 2. Pod Kill (API Server)
**Hypothesis:** Randomly killing API pods should not result in dropped incoming requests due to graceful shutdown hooks waiting for active connections to drain before exiting.
**Manifest:**
```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: api-pod-kill
spec:
  action: pod-kill
  mode: one
  selector:
    labelSelectors:
      app: parilink-api
```
**Verification:** Running `k6/stress-test.js` concurrently with this experiment should yield 0% `http_req_failed`.

## 3. PostgreSQL CPU Stress
**Hypothesis:** CPU saturation on the DB should trigger Prisma connection timeouts. Circuit breakers should trip and prevent cascading failure.
**Verification:** Verify that 503 Service Unavailable is returned gracefully to clients rather than hanging indefinitely.
