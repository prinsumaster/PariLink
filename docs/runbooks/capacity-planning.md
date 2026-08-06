# Capacity Planning Guide

## Service Level Objectives (SLOs)
- **API Latency**: 99% of requests must complete in < 200ms.
- **API Availability**: 99.99% uptime per month.
- **Webhook Processing**: 95% of webhooks delivered in < 5s.

## Horizontal Pod Autoscaling (HPA) Triggers
- **CPU Target**: 70% (Triggers scale up)
- **Memory Target**: 80% (Triggers scale up to avoid OOM)
- **Queue Backlog**: If BullMQ `waiting` count > 1000, trigger worker scale up (using KEDA).

## Database Scaling
- 100 Pods × 5 max connections = 500 connections.
- Requires PgBouncer if scaling beyond 200 connections.
