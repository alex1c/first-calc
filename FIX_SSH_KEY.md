# Fix SSH Key Issue

## Problem
SSH key with fingerprint `SHA256:PwnqD/gRXu7Jb1OlJLX5+BjwIg98ljLfROqcYl5BPTE` is not in authorized_keys.

## Solution

### Step 1: Get public key from private key

On your local machine, extract the public key from the private key that's in GitHub Secrets:

```bash
# If using github-deploy key
ssh-keygen -y -f ~/.ssh/github-deploy

# Or if using another key, check which one matches the fingerprint
ssh-keygen -lf ~/.ssh/github-deploy
# Should show: SHA256:PwnqD/gRXu7Jb1OlJLX5+BjwIg98ljLfROqcYl5BPTE
```

### Step 2: Add public key to server

On the server, add the public key:

```bash
# Add the public key (replace with actual key from step 1)
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI..." >> ~/.ssh/authorized_keys

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### Step 3: Verify

```bash
# Check if key is added
cat ~/.ssh/authorized_keys | grep "PwnqD"

# Test connection
ssh -i ~/.ssh/github-deploy root@165.227.171.143 "echo 'Success'"
```

