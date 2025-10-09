#!/bin/bash

# Get Twilio TURN credentials
# Usage: ./scripts/get-twilio-turn.sh YOUR_ACCOUNT_SID YOUR_AUTH_TOKEN

ACCOUNT_SID=$1
AUTH_TOKEN=$2

if [ -z "$ACCOUNT_SID" ] || [ -z "$AUTH_TOKEN" ]; then
    echo "Usage: ./scripts/get-twilio-turn.sh YOUR_ACCOUNT_SID YOUR_AUTH_TOKEN"
    echo ""
    echo "Get your credentials from:"
    echo "https://console.twilio.com/"
    exit 1
fi

curl -X POST "https://api.twilio.com/2010-04-01/Accounts/$ACCOUNT_SID/Tokens.json" \
    -u "$ACCOUNT_SID:$AUTH_TOKEN" | jq .

echo ""
echo "Copy the 'username' and 'password' from above into your TURN server config"
