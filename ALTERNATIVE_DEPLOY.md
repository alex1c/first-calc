# Alternative Deployment Solutions

Since SSH deployment through GitHub Actions is problematic, here are working alternatives:

## Solution 1: Server-Side Auto-Deploy Script (Recommended)

Create a script on the server that checks for updates and deploys automatically.

### On Server:

```bash
# Create deploy script
cat > /opt/first-calc/auto-deploy.sh << 'EOF'
#!/bin/bash
set -e

PROJECT_DIR="/var/www/first-calc"
cd $PROJECT_DIR

# Check if there are new commits
git fetch origin
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "New changes detected, deploying..."
    git pull origin main
    
    # Rebuild and restart container
    docker-compose down || true
    docker-compose build --no-cache
    docker-compose up -d
    
    # Cleanup
    docker image prune -f
    
    echo "Deployment completed"
else
    echo "No changes"
fi
EOF

chmod +x /opt/first-calc/auto-deploy.sh

# Add to crontab (check every 5 minutes)
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/first-calc/auto-deploy.sh >> /var/log/first-calc-deploy.log 2>&1") | crontab -
```

### GitHub Actions - Just trigger webhook (optional):

```yaml
- name: Notify server
  run: |
    curl -X POST http://your-server/webhook/deploy || echo "Webhook failed, but cron will handle it"
```

## Solution 2: GitHub Webhook to Server

### On Server - Create webhook endpoint:

```bash
# Install webhook handler (using simple HTTP server)
cat > /opt/first-calc/webhook-handler.sh << 'EOF'
#!/bin/bash
# Simple webhook handler using netcat or Python

while true; do
    echo -e "HTTP/1.1 200 OK\r\n\r\nOK" | nc -l -p 9000 -q 1
    /opt/first-calc/auto-deploy.sh
done
EOF

chmod +x /opt/first-calc/webhook-handler.sh

# Run as service
nohup /opt/first-calc/webhook-handler.sh > /var/log/webhook.log 2>&1 &
```

### GitHub Actions:

```yaml
- name: Trigger webhook
  run: |
    curl -X POST http://165.227.171.143:9000/webhook
```

## Solution 3: Docker Registry + Pull

### Build and push to registry in GitHub Actions:

```yaml
- name: Build and push Docker image
  run: |
    docker build -t your-registry/first-calc:${{ github.sha }} .
    docker push your-registry/first-calc:${{ github.sha }}
```

### On server - pull and deploy:

```bash
# Script that pulls latest image
docker pull your-registry/first-calc:latest
docker-compose up -d
```

## Solution 4: Manual Deploy Script (Simplest)

Just run deploy script manually on server after each push:

```bash
# On server
cd /var/www/first-calc
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Solution 5: Use GitHub Actions Artifacts

### GitHub Actions - Build and upload:

```yaml
- name: Build
  run: npm run build

- name: Upload artifact
  uses: actions/upload-artifact@v3
  with:
    name: build
    path: .next
```

### Server - Download and deploy (via API or manual)

## Recommendation

**Use Solution 1 (Cron-based auto-deploy)** - it's the simplest and most reliable:
- No SSH issues
- Works automatically
- Easy to debug
- No external dependencies

