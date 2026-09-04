output "cluster_name" { value = module.eks.cluster_name }
output "ecr_repositories" { value = module.ecr.repository_urls }
output "rds_endpoint" {
  value     = module.rds.endpoint
  sensitive = true
}
