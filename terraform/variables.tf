variable "aws_region" {
  description = "AWS Region"
  type        = string
  default = "ap-south-1"
}

variable "instance_type" {
  description = "EC2 Instance Type"
  type        = string
  default = "t3.micro"
}

variable "key_name" {
  description = "SSH key pair name"
}

variable "allowed_ip" {
  description = "Your public IP for SSH"
  default = "0.0.0.0/0"
}
