# Fix Fail2Ban blocking GitHub Actions

## Problem
Fail2Ban is blocking GitHub Actions IP addresses, preventing SSH connections from GitHub Actions workflows.

## Solution: Add GitHub Actions IP ranges to Fail2Ban whitelist

### Step 1: Get GitHub Actions IP ranges

```bash
# Get GitHub Actions IP ranges
curl -s https://api.github.com/meta | jq -r '.actions[]' | head -20
```

Or manually add known ranges:
- `140.82.112.0/20`
- `143.55.64.0/20`
- `185.199.108.0/22`
- `192.30.252.0/22`
- `20.65.195.0/24` (seen in logs)

### Step 2: Configure Fail2Ban to whitelist GitHub Actions

```bash
# Edit Fail2Ban jail configuration
nano /etc/fail2ban/jail.local
```

Add or modify the `[sshd]` section:

```ini
[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 5
bantime = 3600
findtime = 600

# Whitelist GitHub Actions IP ranges
ignoreip = 127.0.0.1/8 ::1 140.82.112.0/20 143.55.64.0/20 185.199.108.0/22 192.30.252.0/22 20.65.195.0/24
```

### Step 3: Restart Fail2Ban

```bash
# Restart Fail2Ban
systemctl restart fail2ban

# Check status
fail2ban-client status sshd
```

### Step 4: Unban current blocked IPs (if needed)

```bash
# Unban specific IP
fail2ban-client set sshd unbanip 44.250.220.183

# Or unban all
fail2ban-client unban --all
```

## Alternative: Disable Fail2Ban for specific IPs

If you want to completely disable Fail2Ban for GitHub Actions:

```bash
# Create custom filter
nano /etc/fail2ban/filter.d/sshd-github-actions.conf
```

Add:
```ini
[Definition]
failregex = ^%(__prefix_line)s(?:error: PAM: )?Authentication failure for .* from <HOST>$
            ^%(__prefix_line)s(?:error: )?Received disconnect from <HOST>.*: (?:11: )?.*$
            ^%(__prefix_line)s(?:error: )?Connection closed by <HOST>.*\[preauth\]$
ignoreregex =
```

Then modify jail to exclude GitHub Actions IPs from banning.

## Fix SSH host key type issue

The error "no matching host key type found" suggests SSH server needs to support more key types:

```bash
# Edit SSH config
nano /etc/ssh/sshd_config
```

Add or ensure these lines exist:
```
HostKeyAlgorithms +ssh-rsa,rsa-sha2-256,rsa-sha2-512,ecdsa-sha2-nistp256,ecdsa-sha2-nistp384,ecdsa-sha2-nistp521
KexAlgorithms +diffie-hellman-group-exchange-sha256,diffie-hellman-group14-sha256
```

Restart SSH:
```bash
systemctl restart sshd
```

## Quick fix script

Run this on the server:

```bash
#!/bin/bash
# Quick fix for Fail2Ban and GitHub Actions

# Get GitHub Actions IP ranges
GITHUB_IPS=$(curl -s https://api.github.com/meta | jq -r '.actions[]' | tr '\n' ' ')

# Add to Fail2Ban ignoreip
if [ -f /etc/fail2ban/jail.local ]; then
    # Backup
    cp /etc/fail2ban/jail.local /etc/fail2ban/jail.local.backup
    
    # Add GitHub IPs to ignoreip
    sed -i "s|ignoreip = .*|ignoreip = 127.0.0.1/8 ::1 $GITHUB_IPS|" /etc/fail2ban/jail.local
else
    # Create jail.local
    cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
ignoreip = 127.0.0.1/8 ::1 $GITHUB_IPS

[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 10
bantime = 3600
findtime = 600
EOF
fi

# Restart Fail2Ban
systemctl restart fail2ban

# Unban all
fail2ban-client unban --all

echo "Fail2Ban configured for GitHub Actions"
```

## Verify

```bash
# Check Fail2Ban status
fail2ban-client status sshd

# Check if IPs are whitelisted
fail2ban-client get sshd ignoreip

# Test SSH connection from GitHub Actions
# (should work now)
```

