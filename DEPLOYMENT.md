# Deployment Guide for first-calc

This guide explains how to deploy the first-calc application to a server using Docker and Apache.

## Prerequisites

- Server with Docker and Docker Compose installed
- Apache web server installed and configured
- SSH access to the server
- Domain name pointing to server IP (test.first-calc.com)

## Initial Server Setup

### 1. Install Required Software

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Install Apache modules for proxying
a2enmod proxy
a2enmod proxy_http
a2enmod proxy_wstunnel
a2enmod rewrite
a2enmod headers
systemctl restart apache2
```

### 2. Configure Apache Virtual Host

```bash
# Copy Apache configuration
cp apache-config/test.first-calc.com.conf /etc/apache2/sites-available/

# Enable the site
a2ensite test.first-calc.com.conf

# Test Apache configuration
apache2ctl configtest

# Reload Apache
systemctl reload apache2
```

### 3. Initial Deployment

```bash
# Clone repository
mkdir -p /opt/first-calc
cd /opt/first-calc
git clone https://github.com/alex1c/first-calc.git .

# Copy docker-compose.yml and Dockerfile (they should be in repo)
# Build and start container
docker-compose up -d --build

# Check container status
docker ps
docker logs first-calc
```

## Automatic Deployment via GitHub Actions

### 1. Setup SSH Key

On your local machine, generate an SSH key pair if you don't have one:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy"
```

### 2. Add SSH Key to Server

```bash
# Copy public key to server
ssh-copy-id root@165.227.171.143

# Or manually add to ~/.ssh/authorized_keys on server
```

### 3. Configure GitHub Secrets

Go to GitHub repository settings → Secrets and variables → Actions, and add:

- `SSH_PRIVATE_KEY`: The private SSH key content (the one you generated)
- `SERVER_HOST`: `165.227.171.143`

### 4. Test Deployment

Push to main branch or manually trigger workflow from GitHub Actions tab.

## Manual Deployment

If you need to deploy manually:

```bash
# SSH into server
ssh root@165.227.171.143

# Navigate to project directory
cd /opt/first-calc

# Pull latest changes
git pull origin main

# Rebuild and restart container
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check logs
docker logs first-calc
```

Or use the deployment script:

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## Container Management

### View Logs

```bash
docker logs first-calc
docker logs -f first-calc  # Follow logs
```

### Restart Container

```bash
docker-compose restart
```

### Stop Container

```bash
docker-compose down
```

### Update Application

```bash
cd /opt/first-calc
git pull origin main
docker-compose build --no-cache
docker-compose up -d
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs first-calc

# Check if port is available
netstat -tulpn | grep 3003

# Check Docker status
docker ps -a
```

### Apache proxy not working

```bash
# Check Apache error logs
tail -f /var/log/apache2/test.first-calc.com_error.log

# Test Apache configuration
apache2ctl configtest

# Check if proxy modules are enabled
apache2ctl -M | grep proxy
```

### Port conflicts

If port 3003 is already in use, change it in `docker-compose.yml`:

```yaml
ports:
  - '3004:3000'  # Change 3003 to 3004
```

And update Apache configuration accordingly.

## SSL Certificate Setup (Optional)

To enable HTTPS:

```bash
# Install Certbot
apt install certbot python3-certbot-apache -y

# Obtain certificate
certbot --apache -d test.first-calc.com

# Certbot will automatically configure Apache
```

Then uncomment the SSL VirtualHost section in Apache configuration.

## Monitoring

### Check Container Health

```bash
docker ps
docker inspect first-calc | grep Health
```

### Monitor Resource Usage

```bash
docker stats first-calc
```

## Backup

To backup the application:

```bash
# Backup code
tar -czf first-calc-backup-$(date +%Y%m%d).tar.gz /opt/first-calc

# Backup Docker images (optional)
docker save first-calc:latest | gzip > first-calc-image-$(date +%Y%m%d).tar.gz
```

## Rollback

If you need to rollback to a previous version:

```bash
cd /opt/first-calc
git checkout <previous-commit-hash>
docker-compose build --no-cache
docker-compose up -d
```

