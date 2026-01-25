# Reliability Platform Deployment

This directory contains Terraform configuration to deploy the Reliability Platform on AWS.

## Prerequisites

1.  **AWS Credentials**: Ensure you have AWS credentials configured (e.g., `~/.aws/credentials` or environment variables).
2.  **SSH Key Pair**: Generate an SSH key pair locally. This is used to connect to the EC2 instance.
    ```bash
    ssh-keygen -f terraform-key
    ```
    This will generate `terraform-key` (private) and `terraform-key.pub` (public). The Terraform configuration expects these filenames by default.

## Deployment Steps

1.  **Initialize Terraform**:
    ```bash
    terraform init
    ```

2.  **Review Plan**:
    ```bash
    terraform plan -var 'key_name=terraform-key' -var 'allowed_ip=0.0.0.0/0'
    ```

3.  **Apply**:
    ```bash
    terraform apply -var 'key_name=terraform-key' -var 'allowed_ip=0.0.0.0/0'
    ```
    Type `yes` to confirm.

## Resources Created

- **EC2 Instance**: Ubuntu, t3.micro (configurable).
- **Security Group**: Open ports 22 (SSH), 8000 (API), 9090 (Prometheus), 3000 (Grafana).
- **Key Pair**: Imports your local public key.