#!/bin/bash

# TaskMind AI - API Testing Script
# This script tests all backend endpoints

echo "======================================"
echo "TaskMind AI - API Testing Script"
echo "======================================"
echo ""

BASE_URL="http://localhost:5000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    
    echo -e "${BLUE}Testing: $name${NC}"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
        echo "$body"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    echo ""
}

# Check if server is running
echo "Checking if server is running..."
if ! curl -s "$BASE_URL/api/health" > /dev/null; then
    echo -e "${RED}Error: Server is not running on $BASE_URL${NC}"
    echo "Please start the server with: npm run dev"
    exit 1
fi
echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# Test 1: Health Check
test_endpoint "Health Check" "GET" "/api/health"

# Test 2: Get All Tasks (initially empty)
test_endpoint "Get All Tasks (Empty)" "GET" "/api/tasks"

# Test 3: Add Task 1
test_endpoint "Add Task 1 (Math Assignment)" "POST" "/api/tasks/add-task" \
    '{"title":"Math Assignment","deadline":"2026-05-03T23:59:59Z","duration":3}'

# Test 4: Add Task 2
test_endpoint "Add Task 2 (Project Report)" "POST" "/api/tasks/add-task" \
    '{"title":"Project Report","deadline":"2026-05-04T23:59:59Z","duration":4}'

# Test 5: Add Task 3
test_endpoint "Add Task 3 (Presentation)" "POST" "/api/tasks/add-task" \
    '{"title":"Presentation Prep","deadline":"2026-05-02T14:00:00Z","duration":2}'

# Test 6: Get All Tasks (with data)
test_endpoint "Get All Tasks (With Data)" "GET" "/api/tasks"

# Test 7: Generate Smart Plan
test_endpoint "Generate Smart Plan" "POST" "/api/tasks/generate-plan"

# Test 8: Get Stress Level
test_endpoint "Get Stress Level" "GET" "/api/tasks/stress-level"

# Test 9: Simulate Delay
test_endpoint "Simulate Delay (Task 1, 1 day)" "POST" "/api/tasks/simulate-delay" \
    '{"taskId":1,"delayDays":1}'

# Test 10: Update Task (Mark Complete)
test_endpoint "Update Task (Mark Complete)" "PUT" "/api/tasks/1" \
    '{"completed":true}'

# Test 11: Delete Task
test_endpoint "Delete Task" "DELETE" "/api/tasks/1"

# Summary
echo "======================================"
echo "Test Summary"
echo "======================================"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi

# Made with Bob
