# GitHub Secrets Setup Guide

## How to Add GitHub Secrets

### Step 1: Navigate to Secrets

1. Go to your repository: https://github.com/alex1c/first-calc
2. Click on **Settings** (вкладка вверху репозитория)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### Step 2: Add SSH_PRIVATE_KEY

1. **Name**: `SSH_PRIVATE_KEY`
2. **Secret**: Paste your private SSH key content

To get your private key:
```bash
# On your local machine (if you have the key file)
cat ~/.ssh/github-deploy

# Or on the server, get it from the private key file
cat ~/.ssh/github-deploy
```

**Important**: Copy the ENTIRE key, including:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

Or if it's RSA format:
```
-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
```

3. Click **Add secret**

### Step 3: Add SERVER_HOST

1. **Name**: `SERVER_HOST`
2. **Secret**: `165.227.171.143`
3. Click **Add secret**

## Verify Secrets

After adding, you should see both secrets in the list:
- `SSH_PRIVATE_KEY` (hidden)
- `SERVER_HOST` (hidden)

## Troubleshooting

### If secrets don't appear:

1. Make sure you're in the correct repository
2. Check that you have admin/write access to the repository
3. Try refreshing the page
4. Check if you're in the right section: Settings → Secrets and variables → Actions

### If SSH key doesn't work:

1. Verify the private key matches the public key on the server:
   ```bash
   # On server
   ssh-keygen -lf ~/.ssh/github-deploy.pub
   # Should show: SHA256:PwnqD/gRXu7Jb1OlJLX5+BjwIg98ljLfROqcYl5BPTE
   ```

2. Make sure the public key is in `~/.ssh/authorized_keys` on the server

3. Check key format - it should be a complete private key with headers

## Quick Setup Script

If you have access to the server, you can get the private key:

```bash
# On server
cat ~/.ssh/github-deploy
```

Then copy the entire output and paste it into GitHub Secrets as `SSH_PRIVATE_KEY`.

