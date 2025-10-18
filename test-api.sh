#!/bin/bash

# StudentHub API - Quick Test Script

BASE_URL="http://localhost:3000"

echo "🧪 Testing StudentHub API"
echo "=========================="
echo ""

# Test 1: Health Check
echo "1. Testing Health Check..."
HEALTH=$(curl -s ${BASE_URL}/health)
if echo "$HEALTH" | grep -q "OK"; then
    echo "   ✅ Health check passed"
else
    echo "   ❌ Health check failed"
    exit 1
fi

# Test 2: Register
echo ""
echo "2. Testing Register..."
REGISTER=$(curl -s -X POST ${BASE_URL}/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Quick Test User",
        "email": "quicktest@example.com",
        "password": "test123456"
    }')

if echo "$REGISTER" | grep -q "successfully"; then
    echo "   ✅ Register passed"
    TOKEN=$(echo "$REGISTER" | jq -r '.data.token')
else
    echo "   ⚠️  Register skipped (user might exist)"
    # Try login instead
    LOGIN=$(curl -s -X POST ${BASE_URL}/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{
            "email": "quicktest@example.com",
            "password": "test123456"
        }')
    TOKEN=$(echo "$LOGIN" | jq -r '.data.token')
fi

# Test 3: Get Profile
echo ""
echo "3. Testing Get Profile..."
PROFILE=$(curl -s ${BASE_URL}/api/auth/profile \
    -H "Authorization: Bearer $TOKEN")

if echo "$PROFILE" | grep -q "successfully"; then
    echo "   ✅ Get profile passed"
else
    echo "   ❌ Get profile failed"
fi

# Test 4: Create Note
echo ""
echo "4. Testing Create Note..."
NOTE=$(curl -s -X POST ${BASE_URL}/api/notes \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "Test Note",
        "content": "Testing notes API",
        "category": "study"
    }')

if echo "$NOTE" | grep -q "successfully"; then
    echo "   ✅ Create note passed"
else
    echo "   ❌ Create note failed"
fi

# Test 5: Get Dashboard
echo ""
echo "5. Testing Dashboard..."
DASHBOARD=$(curl -s ${BASE_URL}/api/dashboard \
    -H "Authorization: Bearer $TOKEN")

if echo "$DASHBOARD" | grep -q "successfully"; then
    echo "   ✅ Dashboard passed"
else
    echo "   ❌ Dashboard failed"
fi

echo ""
echo "=========================="
echo "✅ All tests completed!"
echo ""
