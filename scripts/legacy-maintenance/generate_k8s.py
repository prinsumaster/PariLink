import os

files = {
    "k8s/configmap.yaml": """apiVersion: v1
kind: ConfigMap
metadata:
  name: parilink-config
  namespace: parilink-prod
data:
  NODE_ENV: "production"
  POSTGRES_USER: "parilink"
  POSTGRES_DB: "parilink_db"
  DATABASE_URL: "postgresql://parilink@parilink-postgres:5432/parilink_db?schema=public"
  REDIS_URL: "redis://parilink-redis:6379"
  PORT: "8080"
  NEXT_PUBLIC_API_URL: "http://api.parilink.local/api/v1"
""",
    "k8s/secret.yaml": """apiVersion: v1
kind: Secret
metadata:
  name: parilink-secrets
  namespace: parilink-prod
type: Opaque
stringData:
  POSTGRES_PASSWORD: "CHANGE_ME_IN_PROD"
  JWT_SECRET: "CHANGE_ME_IN_PROD_SECURE_RANDOM_STRING_123!"
""",
    "k8s/postgres/statefulset.yaml": """apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: parilink-postgres
  namespace: parilink-prod
spec:
  serviceName: parilink-postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:16-alpine
        env:
        - name: POSTGRES_USER
          valueFrom:
            configMapKeyRef:
              name: parilink-config
              key: POSTGRES_USER
        - name: POSTGRES_DB
          valueFrom:
            configMapKeyRef:
              name: parilink-config
              key: POSTGRES_DB
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: parilink-secrets
              key: POSTGRES_PASSWORD
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-data
          mountPath: /var/lib/postgresql/data
        livenessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - parilink
            - -d
            - parilink_db
          initialDelaySeconds: 30
          periodSeconds: 10
  volumeClaimTemplates:
  - metadata:
      name: postgres-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 20Gi
""",
    "k8s/postgres/service.yaml": """apiVersion: v1
kind: Service
metadata:
  name: parilink-postgres
  namespace: parilink-prod
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
""",
    "k8s/redis/deployment.yaml": """apiVersion: apps/v1
kind: Deployment
metadata:
  name: parilink-redis
  namespace: parilink-prod
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        command: ["redis-server", "--appendonly", "yes"]
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: redis-data
          mountPath: /data
      volumes:
      - name: redis-data
        persistentVolumeClaim:
          claimName: redis-pvc
""",
    "k8s/redis/pvc.yaml": """apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-pvc
  namespace: parilink-prod
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
""",
    "k8s/redis/service.yaml": """apiVersion: v1
kind: Service
metadata:
  name: parilink-redis
  namespace: parilink-prod
spec:
  selector:
    app: redis
  ports:
    - port: 6379
      targetPort: 6379
""",
    "k8s/api/deployment.yaml": """apiVersion: apps/v1
kind: Deployment
metadata:
  name: parilink-api
  namespace: parilink-prod
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: parilink-api:latest
        imagePullPolicy: IfNotPresent
        envFrom:
        - configMapRef:
            name: parilink-config
        - secretRef:
            name: parilink-secrets
        env:
        - name: DATABASE_URL
          value: "postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@parilink-postgres:5432/$(POSTGRES_DB)?schema=public"
        ports:
        - containerPort: 8080
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 15
        resources:
          requests:
            cpu: "250m"
            memory: "512Mi"
          limits:
            cpu: "1"
            memory: "1Gi"
""",
    "k8s/api/service.yaml": """apiVersion: v1
kind: Service
metadata:
  name: parilink-api
  namespace: parilink-prod
spec:
  selector:
    app: api
  ports:
    - port: 8080
      targetPort: 8080
""",
    "k8s/web/deployment.yaml": """apiVersion: apps/v1
kind: Deployment
metadata:
  name: parilink-web
  namespace: parilink-prod
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: parilink-web:latest
        imagePullPolicy: IfNotPresent
        envFrom:
        - configMapRef:
            name: parilink-config
        ports:
        - containerPort: 3000
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 15
        resources:
          requests:
            cpu: "200m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
""",
    "k8s/web/service.yaml": """apiVersion: v1
kind: Service
metadata:
  name: parilink-web
  namespace: parilink-prod
spec:
  selector:
    app: web
  ports:
    - port: 3000
      targetPort: 3000
""",
    "k8s/ingress.yaml": """apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: parilink-ingress
  namespace: parilink-prod
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
  - host: api.parilink.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: parilink-api
            port:
              number: 8080
  - host: app.parilink.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: parilink-web
            port:
              number: 3000
""",
    "k8s/network-policies.yaml": """apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: parilink-prod
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-to-db
  namespace: parilink-prod
spec:
  podSelector:
    matchLabels:
      app: postgres
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: api
    ports:
    - protocol: TCP
      port: 5432
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-to-redis
  namespace: parilink-prod
spec:
  podSelector:
    matchLabels:
      app: redis
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: api
    ports:
    - protocol: TCP
      port: 6379
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-public-to-ingress
  namespace: parilink-prod
spec:
  podSelector:
    matchExpressions:
      - key: app
        operator: In
        values: ["api", "web"]
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector: {}
    ports:
    - protocol: TCP
      port: 8080
    - protocol: TCP
      port: 3000
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns-egress
  namespace: parilink-prod
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: kube-system
    ports:
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 53
""",
    ".github/workflows/ci.yml": """name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    - run: npm ci
    - run: npm run lint --if-present
    - run: npm run build --if-present

  security-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
    - run: npm audit
""",
    ".github/workflows/cd.yml": """name: CD

on:
  push:
    tags:
      - 'v*'

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    - name: Login to DockerHub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}
    - name: Build and push API
      uses: docker/build-push-action@v5
      with:
        context: ./apps/api
        push: true
        tags: your-docker-org/parilink-api:latest,your-docker-org/parilink-api:${{ github.ref_name }}
    - name: Build and push Web
      uses: docker/build-push-action@v5
      with:
        context: ./apps/web
        push: true
        tags: your-docker-org/parilink-web:latest,your-docker-org/parilink-web:${{ github.ref_name }}
"""
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)

print("K8s manifests and Github actions successfully created.")
