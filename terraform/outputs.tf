output "public_ip" {
  description = "Public IP address of the EC2 instance"
  value = aws_instance.app.public_ip
}

output "ssh_command" {
  value = "ssh -i ${var.key_name}.pem ubuntu@${aws_instance.app.public_ip}"
}
