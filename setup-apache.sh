#!/bin/bash
# Script to create Apache configuration on server
# Run this on the server: bash <(curl -s https://raw.githubusercontent.com/alex1c/first-calc/main/setup-apache.sh)
# Or copy and paste the commands below

cat > /etc/apache2/sites-available/test.first-calc.com.conf << 'EOF'
# Apache Virtual Host Configuration for test.first-calc.com
<VirtualHost *:80>
	ServerName test.first-calc.com
	ServerAlias www.test.first-calc.com
	
	# Proxy all requests to Docker container on port 3003
	ProxyPreserveHost On
	ProxyPass / http://localhost:3003/
	ProxyPassReverse / http://localhost:3003/
	
	# WebSocket support (if needed)
	RewriteEngine On
	RewriteCond %{HTTP:Upgrade} =websocket [NC]
	RewriteRule /(.*) ws://localhost:3003/$1 [P,L]
	RewriteCond %{HTTP:Upgrade} !=websocket [NC]
	RewriteRule /(.*) http://localhost:3003/$1 [P,L]
	
	# Logging
	ErrorLog ${APACHE_LOG_DIR}/test.first-calc.com_error.log
	CustomLog ${APACHE_LOG_DIR}/test.first-calc.com_access.log combined
	
	# Security headers
	Header always set X-Content-Type-Options "nosniff"
	Header always set X-Frame-Options "SAMEORIGIN"
	Header always set X-XSS-Protection "1; mode=block"
</VirtualHost>
EOF

# Enable required Apache modules
a2enmod proxy proxy_http proxy_wstunnel rewrite headers

# Enable the site
a2ensite test.first-calc.com.conf

# Test configuration
apache2ctl configtest

# Reload Apache
systemctl reload apache2

echo "Apache configuration created and enabled successfully!"

