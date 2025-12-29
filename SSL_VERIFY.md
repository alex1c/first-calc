# SSL Verification Checklist

## ✅ SSL Certificate Installed Successfully

Your SSL certificate has been installed and configured by Certbot.

## Verification Steps

### 1. Test HTTPS Connection

```bash
# Test HTTPS from server
curl -I https://test.first-calc.com

# Should return HTTP 200 or 301/302
```

### 2. Check Certificate Details

```bash
# View certificate information
openssl s_client -connect test.first-calc.com:443 -servername test.first-calc.com < /dev/null 2>/dev/null | openssl x509 -noout -dates -subject

# Or use browser: https://test.first-calc.com
```

### 3. Verify HTTP to HTTPS Redirect

```bash
# Test HTTP redirect
curl -I http://test.first-calc.com

# Should return 301 or 302 redirect to HTTPS
```

### 4. Check Apache SSL Configuration

```bash
# View SSL virtual host config
cat /etc/apache2/sites-available/test.first-calc.com-le-ssl.conf

# Check if SSL module is enabled
apache2ctl -M | grep ssl

# Test Apache configuration
apache2ctl configtest
```

### 5. Verify Auto-Renewal

```bash
# Test certificate renewal (dry run)
certbot renew --dry-run

# Check renewal timer status
systemctl status certbot.timer

# View renewal schedule
systemctl list-timers | grep certbot
```

## Expected Results

✅ HTTPS should work: `https://test.first-calc.com`  
✅ HTTP should redirect to HTTPS  
✅ Certificate expires: 2026-03-29 (90 days from now)  
✅ Auto-renewal is configured  
✅ Docker container should be accessible through HTTPS proxy  

## Troubleshooting

### If HTTPS doesn't work:

```bash
# Check Apache error logs
tail -f /var/log/apache2/test.first-calc.com_ssl_error.log

# Check if SSL module is enabled
a2enmod ssl
systemctl reload apache2

# Verify port 443 is open
netstat -tulpn | grep :443
```

### If Docker container not accessible:

Certbot should have automatically configured the proxy. If not, check:

```bash
# Verify proxy configuration in SSL config
grep -A 5 "ProxyPass" /etc/apache2/sites-available/test.first-calc.com-le-ssl.conf

# Should show:
# ProxyPass / http://localhost:3003/
# ProxyPassReverse / http://localhost:3003/
```

### If auto-renewal fails:

```bash
# Check Certbot logs
journalctl -u certbot.service -n 50

# Manually renew (if needed)
certbot renew
```

## Next Steps

1. ✅ SSL certificate installed
2. ✅ HTTPS enabled
3. ✅ HTTP to HTTPS redirect configured
4. ✅ Auto-renewal scheduled
5. 🔄 Test the website in browser
6. 🔄 Verify Docker container is accessible via HTTPS

## Security Notes

- Certificate expires: **2026-03-29**
- Auto-renewal: **Configured** (runs automatically)
- HSTS: Should be enabled in SSL config
- Certificate location: `/etc/letsencrypt/live/test.first-calc.com/`

