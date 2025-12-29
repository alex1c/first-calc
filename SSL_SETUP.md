# SSL Setup Guide for test.first-calc.com
#

This guide explains how to set up SSL certificate using Let's Encrypt for test.first-calc.com.

## Prerequisites

- Domain `test.first-calc.com` pointing to server IP `165.227.171.143`
- Apache web server installed and configured
- Port 80 and 443 open in firewall

## Step 1: Install Certbot

```bash
# Update package list
apt update

# Install Certbot and Apache plugin
apt install certbot python3-certbot-apache -y
```

## Step 2: Obtain SSL Certificate

```bash
# Request SSL certificate for your domain
certbot --apache -d test.first-calc.com -d www.test.first-calc.com

# Follow the prompts:
# - Enter your email address
# - Agree to terms of service
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)
```

Certbot will automatically:
- Obtain the certificate
- Configure Apache virtual host for HTTPS
- Set up automatic renewal

## Step 3: Verify Apache Configuration

After Certbot finishes, check the configuration:

```bash
# Test Apache configuration
apache2ctl configtest

# Check SSL virtual host
cat /etc/apache2/sites-available/test.first-calc.com-le-ssl.conf

# Reload Apache if needed
systemctl reload apache2
```

## Step 4: Test SSL Certificate

```bash
# Test SSL connection
curl -I https://test.first-calc.com

# Check certificate details
openssl s_client -connect test.first-calc.com:443 -servername test.first-calc.com
```

Or visit in browser: `https://test.first-calc.com`

## Step 5: Verify Auto-Renewal

Let's Encrypt certificates expire every 90 days. Certbot sets up automatic renewal:

```bash
# Test renewal process
certbot renew --dry-run

# Check renewal timer
systemctl status certbot.timer

# View renewal logs
journalctl -u certbot.service
```

## Manual Configuration (Alternative)

If you prefer to configure SSL manually, update the Apache configuration:

```bash
# Edit SSL configuration
nano /etc/apache2/sites-available/test.first-calc.com-le-ssl.conf
```

Ensure it includes:

```apache
<VirtualHost *:443>
    ServerName test.first-calc.com
    ServerAlias www.test.first-calc.com
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/test.first-calc.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/test.first-calc.com/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
    
    # Proxy to Docker container
    ProxyPreserveHost On
    ProxyPass / http://localhost:3003/
    ProxyPassReverse / http://localhost:3003/
    
    # WebSocket support
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} =websocket [NC]
    RewriteRule /(.*) ws://localhost:3003/$1 [P,L]
    RewriteCond %{HTTP:Upgrade} !=websocket [NC]
    RewriteRule /(.*) http://localhost:3003/$1 [P,L]
    
    # Security headers
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/test.first-calc.com_ssl_error.log
    CustomLog ${APACHE_LOG_DIR}/test.first-calc.com_ssl_access.log combined
</VirtualHost>
```

## Update Next.js Configuration (Optional)

If your Next.js app needs to know it's behind HTTPS proxy, update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config
  // Trust proxy for secure headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Forwarded-Proto',
            value: 'https',
          },
        ],
      },
    ]
  },
}
```

## Troubleshooting

### Certificate not obtained

```bash
# Check domain DNS
dig test.first-calc.com

# Check if port 80 is accessible
netstat -tulpn | grep :80

# Check Apache error logs
tail -f /var/log/apache2/error.log
```

### SSL not working after setup

```bash
# Check if SSL module is enabled
apache2ctl -M | grep ssl

# Enable SSL module if needed
a2enmod ssl
systemctl reload apache2

# Check certificate files exist
ls -la /etc/letsencrypt/live/test.first-calc.com/
```

### Renewal issues

```bash
# Check Certbot logs
journalctl -u certbot.service -n 50

# Manually renew certificate
certbot renew

# Force renewal (before expiry)
certbot renew --force-renewal
```

## Security Best Practices

1. **Enable HSTS** - Already included in SSL config
2. **Redirect HTTP to HTTPS** - Certbot should do this automatically
3. **Keep Certbot updated** - `apt upgrade certbot`
4. **Monitor certificate expiry** - Set up alerts for 30 days before expiry

## Firewall Configuration

Ensure ports are open:

```bash
# Check firewall status
ufw status

# Allow HTTPS if needed
ufw allow 443/tcp
ufw allow 80/tcp  # Needed for Let's Encrypt validation
```

## Additional Resources

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Certbot User Guide](https://certbot.eff.org/)
- [Apache SSL Configuration](https://httpd.apache.org/docs/2.4/ssl/)

