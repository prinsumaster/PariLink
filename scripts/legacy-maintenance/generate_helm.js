const fs = require("fs");
const path = require("path");

function createDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content.trim() + "\n");
}

const baseDir = "helm/parilink";
const templatesDir = path.join(baseDir, "templates");

createDir(templatesDir);

writeFile(path.join(baseDir, "Chart.yaml"), `apiVersion: v2
name: parilink
description: PariLink Enterprise Logistics OS v3.0 Helm Chart
type: application
version: 3.0.0
appVersion: "3.0.0"`);

writeFile(path.join(baseDir, "values.yaml"), `global:
  environment: production
  tenant: default
replicaCount:
  api: 3
  web: 3
image:
  repository: parilink
  tag: "latest"
  pullPolicy: IfNotPresent
api:
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 1000m
      memory: 2Gi
  hpa:
    minReplicas: 3
    maxReplicas: 10
    targetCPUUtilizationPercentage: 70
web:
  resources:
    requests:
      cpu: 200m
      memory: 512Mi
    limits:
      cpu: 500m
      memory: 1Gi
  hpa:
    minReplicas: 3
    maxReplicas: 10
    targetCPUUtilizationPercentage: 70
postgres:
  enabled: true
redis:
  enabled: true
ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"
  hosts:
    - host: api.parilink.com
      paths:
        - path: /
          pathType: Prefix
          service: api
    - host: app.parilink.com
      paths:
        - path: /
          pathType: Prefix
          service: web
  tls:
    - secretName: parilink-tls
      hosts:
        - api.parilink.com
        - app.parilink.com`);

writeFile(path.join(templatesDir, "configmap.yaml"), `apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-config
  labels:
    app: {{ .Chart.Name }}
data:
  NODE_ENV: {{ .Values.global.environment | quote }}
  APP_TENANT: {{ .Values.global.tenant | quote }}
  PORT: "8080"`);

writeFile(path.join(templatesDir, "secrets.yaml"), `apiVersion: v1
kind: Secret
metadata:
  name: {{ .Release.Name }}-secrets
  labels:
    app: {{ .Chart.Name }}
type: Opaque
data:
  DATABASE_URL: {{ "postgresql://user:pass@localhost:5432/parilink" | b64enc | quote }}
  REDIS_URL: {{ "redis://localhost:6379" | b64enc | quote }}
  JWT_SECRET: {{ "fallback-secret-key" | b64enc | quote }}
  COOKIE_SECRET: {{ "fallback-cookie-secret" | b64enc | quote }}`);

writeFile(path.join(templatesDir, "api-deployment.yaml"), `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-api
  labels:
    app: {{ .Chart.Name }}
    component: api
spec:
  replicas: {{ .Values.replicaCount.api }}
  selector:
    matchLabels:
      app: {{ .Chart.Name }}
      component: api
  template:
    metadata:
      labels:
        app: {{ .Chart.Name }}
        component: api
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
    spec:
      serviceAccountName: {{ .Release.Name }}-sa
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 2000
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              component: api
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: component
                  operator: In
                  values:
                  - api
              topologyKey: kubernetes.io/hostname
      containers:
        - name: api
          image: "{{ .Values.image.repository }}-api:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop:
                - ALL
          envFrom:
            - configMapRef:
                name: {{ .Release.Name }}-config
            - secretRef:
                name: {{ .Release.Name }}-secrets
          ports:
            - name: http
              containerPort: 8080
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 15
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 5
            periodSeconds: 10
            timeoutSeconds: 3
            successThreshold: 1
            failureThreshold: 3
          resources:
            {{- toYaml .Values.api.resources | nindent 12 }}
          volumeMounts:
            - name: tmp
              mountPath: /tmp
      volumes:
        - name: tmp
          emptyDir: {}`);

writeFile(path.join(templatesDir, "api-hpa.yaml"), `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ .Release.Name }}-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ .Release.Name }}-api
  minReplicas: {{ .Values.api.hpa.minReplicas }}
  maxReplicas: {{ .Values.api.hpa.maxReplicas }}
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: {{ .Values.api.hpa.targetCPUUtilizationPercentage }}`);

writeFile(path.join(templatesDir, "api-service.yaml"), `apiVersion: v1
kind: Service
metadata:
  name: {{ .Release.Name }}-api
  labels:
    app: {{ .Chart.Name }}
    component: api
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: http
      protocol: TCP
      name: http
  selector:
    app: {{ .Chart.Name }}
    component: api`);

writeFile(path.join(templatesDir, "api-pdb.yaml"), `apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: {{ .Release.Name }}-api-pdb
spec:
  minAvailable: 50%
  selector:
    matchLabels:
      app: {{ .Chart.Name }}
      component: api`);

writeFile(path.join(templatesDir, "web-deployment.yaml"), `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-web
  labels:
    app: {{ .Chart.Name }}
    component: web
spec:
  replicas: {{ .Values.replicaCount.web }}
  selector:
    matchLabels:
      app: {{ .Chart.Name }}
      component: web
  template:
    metadata:
      labels:
        app: {{ .Chart.Name }}
        component: web
    spec:
      serviceAccountName: {{ .Release.Name }}-sa
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 2000
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              component: web
      containers:
        - name: web
          image: "{{ .Values.image.repository }}-web:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop:
                - ALL
          envFrom:
            - configMapRef:
                name: {{ .Release.Name }}-config
          ports:
            - name: http
              containerPort: 3000
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /api/health
              port: http
            initialDelaySeconds: 15
            periodSeconds: 20
          readinessProbe:
            httpGet:
              path: /api/health
              port: http
            initialDelaySeconds: 5
            periodSeconds: 10
          resources:
            {{- toYaml .Values.web.resources | nindent 12 }}
          volumeMounts:
            - name: tmp
              mountPath: /tmp
      volumes:
        - name: tmp
          emptyDir: {}`);

writeFile(path.join(templatesDir, "web-service.yaml"), `apiVersion: v1
kind: Service
metadata:
  name: {{ .Release.Name }}-web
  labels:
    app: {{ .Chart.Name }}
    component: web
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: http
      protocol: TCP
      name: http
  selector:
    app: {{ .Chart.Name }}
    component: web`);

writeFile(path.join(templatesDir, "web-hpa.yaml"), `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ .Release.Name }}-web-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ .Release.Name }}-web
  minReplicas: {{ .Values.web.hpa.minReplicas }}
  maxReplicas: {{ .Values.web.hpa.maxReplicas }}
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: {{ .Values.web.hpa.targetCPUUtilizationPercentage }}`);

writeFile(path.join(templatesDir, "web-pdb.yaml"), `apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: {{ .Release.Name }}-web-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: {{ .Chart.Name }}
      component: web`);

writeFile(path.join(templatesDir, "ingress.yaml"), `{{- if .Values.ingress.enabled -}}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ .Release.Name }}-ingress
  annotations:
    {{- toYaml .Values.ingress.annotations | nindent 4 }}
spec:
  ingressClassName: {{ .Values.ingress.className }}
  tls:
    {{- range .Values.ingress.tls }}
    - hosts:
        {{- range .hosts }}
        - {{ . | quote }}
        {{- end }}
      secretName: {{ .secretName }}
    {{- end }}
  rules:
    {{- range .Values.ingress.hosts }}
    - host: {{ .host | quote }}
      http:
        paths:
          {{- range .paths }}
          - path: {{ .path }}
            pathType: {{ .pathType }}
            backend:
              service:
                name: {{ $.Release.Name }}-{{ .service }}
                port:
                  number: 80
          {{- end }}
    {{- end }}
{{- end }}`);

writeFile(path.join(templatesDir, "networkpolicy.yaml"), `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: {{ .Release.Name }}-api-policy
spec:
  podSelector:
    matchLabels:
      component: api
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ingress-nginx
        - podSelector:
            matchLabels:
              component: web
      ports:
        - protocol: TCP
          port: 8080
  egress:
    - to:
        - podSelector:
            matchLabels:
              component: postgres
        - podSelector:
            matchLabels:
              component: redis
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: kube-system
      ports:
        - protocol: UDP
          port: 53
        - protocol: TCP
          port: 53
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: {{ .Release.Name }}-db-policy
spec:
  podSelector:
    matchLabels:
      component: postgres
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              component: api
      ports:
        - protocol: TCP
          port: 5432`);

writeFile(path.join(templatesDir, "serviceaccount.yaml"), `apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ .Release.Name }}-sa
  labels:
    app: {{ .Chart.Name }}`);

console.log("Helm Chart created successfully at helm/parilink");
