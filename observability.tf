resource "aws_cloudwatch_log_group" "eks" {
  name              = "/aws/eks/${var.project_name}"
  retention_in_days = 30
}
