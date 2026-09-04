# Microservices Platform

Production-oriented reference application with six independently containerized Node.js
services deployed to AWS EKS:

`gateway -> catalog | orders | payments | users | notifications`

The gateway exposes the public API and forwards requests to private Kubernetes Services.
The other services are not exposed through the ingress.

## Prerequisites
- Terraform >= 1.6, AWS CLI, kubectl, Docker, Node.js 22
- AWS credentials with permissions for VPC, EKS, ECR, RDS and CloudWatch

## Deploy infrastructure

1. Configure AWS credentials and review `terraform.tfvars`.
2. Run `terraform init`, `terraform plan`, and `terraform apply`.
3. Configure kubectl:
   `aws eks update-kubeconfig --region us-east-1 --name microservices-platform`

The Terraform stack creates a three-AZ VPC, private EKS nodes, six immutable and
scan-on-push ECR repositories, a private PostgreSQL RDS instance, and an EKS log
group. RDS credentials are generated and managed by AWS Secrets Manager.

## Build and deploy an environment

Build each service from its directory and push an immutable commit tag to the
corresponding ECR repository. Replace the image registry in the Kustomize base (or
configure it through your release automation), then deploy one environment:

```bash
kubectl apply -k k8s/overlays/dev
kubectl apply -k k8s/overlays/uat
kubectl apply -k k8s/overlays/prod
```

The overlays set environment metadata, image tags, and replicas (dev=1, uat=2,
prod=3). Promotion should reuse the exact image digest that passed validation;
never rebuild an image for UAT or production.

The checked-in Kubernetes Secret is intentionally a non-production placeholder.
Use External Secrets, AWS Secrets Manager CSI, or an equivalent secret-management
workflow before deploying UAT or production.

## Service endpoints

Every service exposes `/healthz` and `/readyz`. Through the gateway:

- `GET /api/catalog/products`
- `POST /api/orders`
- `POST /api/payments/authorize`
- `GET /api/users/:id`
- `POST /api/notifications`

## CI/CD

`.github/workflows/ci.yml` runs Terraform formatting/validation and builds all six
Docker images for changes to `main`. Configure an ECR push and environment-specific
deployment stage in your repository settings after adding AWS OIDC permissions.
