#!/bin/bash
# Fix Fail2Ban for GitHub Actions - Server script
# Run this on the server

set -e

echo "Installing jq if needed..."
if ! command -v jq &> /dev/null; then
    apt-get update -qq
    apt-get install -y jq
fi

echo "Getting GitHub Actions IP ranges..."
GITHUB_IPS=$(curl -s https://api.github.com/meta | jq -r '.actions[]' | tr '\n' ' ')

if [ -z "$GITHUB_IPS" ]; then
    echo "Warning: Could not fetch GitHub IPs, using known ranges..."
    GITHUB_IPS="140.82.112.0/20 143.55.64.0/20 185.199.108.0/22 192.30.252.0/22 20.65.195.0/24"
fi

echo "GitHub Actions IP ranges: $GITHUB_IPS"

# Check if Fail2Ban is installed
if ! command -v fail2ban-client &> /dev/null; then
    echo "Fail2Ban is not installed. Installing..."
    apt-get update -qq
    apt-get install -y fail2ban
fi

# Start Fail2Ban if not running
if ! systemctl is-active --quiet fail2ban; then
    echo "Starting Fail2Ban..."
    systemctl start fail2ban
    systemctl enable fail2ban
fi

# Create jail.local if it doesn't exist
if [ ! -f /etc/fail2ban/jail.local ]; then
    echo "Creating /etc/fail2ban/jail.local..."
    cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
fi

# Backup original
cp /etc/fail2ban/jail.local /etc/fail2ban/jail.local.backup.$(date +%Y%m%d_%H%M%S)

# Add GitHub IPs to DEFAULT section
if grep -q "^ignoreip" /etc/fail2ban/jail.local; then
    # Update existing ignoreip
    sed -i "s|^ignoreip = .*|ignoreip = 127.0.0.1/8 ::1 $GITHUB_IPS|" /etc/fail2ban/jail.local
else
    # Add ignoreip to DEFAULT section
    sed -i "/^\[DEFAULT\]/a ignoreip = 127.0.0.1/8 ::1 $GITHUB_IPS" /etc/fail2ban/jail.local
fi

# Also ensure sshd section has ignoreip
if grep -q "^\[sshd\]" /etc/fail2ban/jail.local; then
    # Check if sshd section already has ignoreip
    if ! sed -n '/^\[sshd\]/,/^\[/p' /etc/fail2ban/jail.local | grep -q "^ignoreip"; then
        # Add ignoreip to sshd section
        sed -i "/^\[sshd\]/a ignoreip = 127.0.0.1/8 ::1 $GITHUB_IPS" /etc/fail2ban/jail.local
    else
        # Update existing ignoreip in sshd section
        sed -i "/^\[sshd\]/,/^\[/ { s|^ignoreip = .*|ignoreip = 127.0.0.1/8 ::1 $GITHUB_IPS|; }" /etc/fail2ban/jail.local
    fi
fi

# Restart Fail2Ban
echo "Restarting Fail2Ban..."
systemctl restart fail2ban
sleep 2

# Unban all currently banned IPs
echo "Unbanning all IPs..."
fail2ban-client unban --all || true

# Check status
echo ""
echo "✓ Fail2Ban configured for GitHub Actions"
echo "Status:"
fail2ban-client status sshd || echo "SSH jail not found, but Fail2Ban is running"
echo ""
echo "Whitelisted IPs: $GITHUB_IPS"

