# Infrastructure As Code (GA)

## 1. Terraform Modules
The core cloud infrastructure is defined using HashiCorp Terraform inside the `terraform/` directory.

### Structure
- `main.tf`: The root module that configures the AWS provider and wires together the VPC, EKS, Postgres, and Redis modules.
- `variables.tf`: Defines environment-specific variables allowing the same module to be re-used for `staging` and `production` (`var.environment`).
- `modules/eks/main.tf`: Uses the official `terraform-aws-modules/eks/aws` registry module to provision the control plane and managed node groups.
- `modules/postgres/main.tf`: Provisions an RDS instance inside the private subnets.
- `modules/redis/main.tf`: Provisions an ElastiCache Redis 7 instance.

## 2. Kubernetes Manifests
The application workloads are defined using standard Kubernetes YAML inside the `kubernetes/` directory.
- `01-base.yaml`: Namespaces, ConfigMaps, and Secret templates.
- `02-database.yaml`: PersistentVolumeClaims and stateful sets for local/fallback database deployments.
- `03-api.yaml` & `04-web.yaml`: The primary Application Deployments, Services, HorizontalPodAutoscalers, and NetworkPolicies.
- `05-ingress.yaml`: NGINX Ingress rules with TLS references.

## 3. Provisioning Workflow
1. Initialize the backend: `terraform init`
2. Review the execution plan: `terraform plan -var="environment=production"`
3. Apply the infrastructure: `terraform apply --auto-approve`
4. Deploy the manifests via CI/CD: `kubectl apply -f kubernetes/`
