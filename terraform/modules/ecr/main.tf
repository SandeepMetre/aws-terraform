variable "name" { type = string }
variable "services" { type = list(string) }
resource "aws_ecr_repository" "service" {
  for_each             = toset(var.services)
  name                 = "${var.name}/${each.value}"
  image_tag_mutability = "IMMUTABLE"
  image_scanning_configuration { scan_on_push = true }
  encryption_configuration { encryption_type = "AES256" }
}
output "repository_urls" { value = { for k, v in aws_ecr_repository.service : k => v.repository_url } }
