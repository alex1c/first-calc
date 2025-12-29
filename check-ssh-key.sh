#!/bin/bash
# Check which key in authorized_keys matches the fingerprint

FINGERPRINT="SHA256:PwnqD/gRXu7Jb1OlJLX5+BjwIg98ljLfROqcYl5BPTE"

echo "Looking for key with fingerprint: $FINGERPRINT"
echo ""

# Check each key in authorized_keys
while IFS= read -r line; do
    if [ -n "$line" ] && [[ ! "$line" =~ ^# ]]; then
        # Create temp file with this key
        echo "$line" > /tmp/test_key.pub
        KEY_FP=$(ssh-keygen -lf /tmp/test_key.pub 2>/dev/null | awk '{print $2}')
        
        if [ "$KEY_FP" = "$FINGERPRINT" ]; then
            echo "✓ FOUND MATCHING KEY:"
            echo "$line"
            echo ""
            rm -f /tmp/test_key.pub
            exit 0
        fi
    fi
done < ~/.ssh/authorized_keys

rm -f /tmp/test_key.pub
echo "✗ Key with fingerprint $FINGERPRINT NOT FOUND in authorized_keys"
echo ""
echo "You need to add the public key that corresponds to the private key in GitHub Secrets."
echo "The public key should have fingerprint: $FINGERPRINT"

