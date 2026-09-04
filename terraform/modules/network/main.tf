variable "name" { type = string }
variable "region" { type = string }
module "vpc" {
  source              = "terraform-aws-modules/vpc/aws"
  version             = "5.21.0"
  name                = var.name
  cidr                = "10.0.0.0/16"
  azs                 = ["${var.region}a", "${var.region}b", "${var.region}c"]
  private_subnets     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets      = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  enable_nat_gateway  = true
  single_nat_gateway  = true
  public_subnet_tags  = { "kubernetes.io/role/elb" = "1" }
  private_subnet_tags = { "kubernetes.io/role/internal-elb" = "1", "kubernetes.io/cluster/${var.name}" = "shared" }
}
output "vpc_id" { value = module.vpc.vpc_id }
output "private_subnet_ids" { value = module.vpc.private_subnets }
