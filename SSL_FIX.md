# Fix SSL Certificate Issue

## Problem
Certbot failed because `www.test.first-calc.com` doesn't have a DNS record.

## Solution 1: Get certificate for main domain only (Recommended)

```bash
# Request certificate only for test.first-calc.com (without www)
certbot --apache -d test.first-calc.com
```

## Solution 2: Add www DNS record first

If you want to support www subdomain:

1. Add DNS A record for www:
   - Type: A
   - Name: www
   - Value: 165.227.171.143
   - TTL: 3600 (or default)

2. Wait for DNS propagation (5-30 minutes)

3. Then run:
```bash
certbot --apache -d test.first-calc.com -d www.test.first-calc.com
```

## Solution 3: Update Apache config to remove www alias

If you don't need www subdomain, update Apache config:

```bash
# Edit Apache config
nano /etc/apache2/sites-available/test.first-calc.com.conf

# Remove or comment out the ServerAlias line:
# ServerAlias www.test.first-calc.com

# Then get certificate
certbot --apache -d test.first-calc.com
```

