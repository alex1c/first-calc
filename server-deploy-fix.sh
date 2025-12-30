#!/bin/bash
# Fix: Create deploy script in correct directory

# Create script in /var/www/first-calc (where project is)
cat > /var/www/first-calc/auto-deploy.sh << 'EOF'
#!/bin/bash
set -e
cd /var/www/first-calc
git fetch origin
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
if [ "$LOCAL" != "$REMOTE" ]; then
    echo "Deploying new changes..."
    git pull origin main
    docker-compose down || true
    docker-compose build --no-cache
    docker-compose up -d
    docker image prune -f
    echo "Deployment done"
fi
EOF

chmod +x /var/www/first-calc/auto-deploy.sh

# Update crontab with correct path
(crontab -l 2>/dev/null | grep -v "first-calc/auto-deploy.sh"; echo "*/5 * * * * /var/www/first-calc/auto-deploy.sh >> /var/log/first-calc-deploy.log 2>&1") | crontab -

echo "Script created at /var/www/first-calc/auto-deploy.sh"
echo "Cron job added. Check with: crontab -l"

