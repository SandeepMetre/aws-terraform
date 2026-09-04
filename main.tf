module "network" {
  source = "./terraform/modules/network"
  name   = var.project_name
  region = var.aws_region
}

module "eks" {
  source             = "./terraform/modules/eks"
  name               = var.project_name
  region             = var.aws_region
  vpc_id             = module.network.vpc_id
  private_subnet_ids = module.network.private_subnet_ids
  cluster_version    = var.kubernetes_version
}

module "ecr" {
  source   = "./terraform/modules/ecr"
  name     = var.project_name
  services = ["catalog", "orders", "payments", "users", "notifications", "gateway"]
}

module "rds" {
  source             = "./terraform/modules/rds"
  name               = var.project_name
  private_subnet_ids = module.network.private_subnet_ids
  vpc_id             = module.network.vpc_id
}
