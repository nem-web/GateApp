# API Testing Guide

## Overview
This guide explains how to test the fixed API endpoints after the authentication and userId extraction improvements.

## Setup

### Prerequisites
1. PostgreSQL running locally
2. Node.js and npm installed
3. Environment variables configured in `.env` file

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Update .env with your values:
DATABASE_URL="******localhost:5432/gateprep"
NEXTAUTH_SECRET="your-secure-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY="sk-ant-..." # Optional for AI features
```

### Initialize Database
```bash
npm run prisma:generate
npm run prisma:migrate
```

## Running Tests

### Start Development Server
```bash
npm run dev
```
Server will be available at `http://localhost:3000`

## Test Scenarios

### 1. Authentication/Authorization Tests

#### Test 1.1: Unauthenticated POST Request Should Fail
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task"}'
```
**Expected Response:** 
- Status: 401
- Body: `{"error": "Sign in to edit or save changes."}`

#### Test 1.2: Unauthenticated GET Request Should Also Be Protected
```bash
curl -X GET http://localhost:3000/api/tasks
```
**Expected Response:** 
- Status: 401
- Body: `{"error": "Unauthorized"}`

### 2. Tasks Endpoint Tests

#### Test 2.1: Create Task (Authenticated User)
1. Register/Login user at `http://localhost:3000/login`
2. After login, make authenticated request:
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Cookie: <your-auth-cookie>" \
  -d '{
    "title": "Complete Chapter 5",
    "priority": "high",
    "dueDate": "2027-02-15",
    "subjectTag": "DSA"
  }'
```
**Expected Response:** 
- Status: 200
- Body contains created task with userId matching authenticated user

#### Test 2.2: Retrieve Tasks (Authenticated User)
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Cookie: <your-auth-cookie>"
```
**Expected Response:** 
- Status: 200
- Body contains array of tasks for the authenticated user only

#### Test 2.3: Tasks Should Be User-Isolated
1. Create task as User A
2. Login as User B
3. GET /api/tasks - should NOT see User A's tasks
4. This verifies userId extraction is working correctly

### 3. AI Endpoints Tests

#### Test 3.1: Call AI Endpoint (Authenticated)
Make sure you have ANTHROPIC_API_KEY or GROQ_API_KEY or GEMINI_API_KEY set in .env

```bash
curl -X POST http://localhost:3000/api/ai/summarize-note \
  -H "Content-Type: application/json" \
  -H "Cookie: <your-auth-cookie>" \
  -d '{
    "text": "Machine Learning is a subset of Artificial Intelligence that enables systems to learn and improve from experience without being explicitly programmed."
  }'
```
**Expected Response (with valid API key):** 
- Status: 200
- Body: `{"content": "AI-generated summary here..."}`

**Expected Response (without valid API key):** 
- Status: 503 (Service Unavailable)
- Body: `{"error": "AI unavailable: set GROQ_API_KEY, GEMINI_API_KEY, or a valid ANTHROPIC_API_KEY.", "content": "..."}`

#### Test 3.2: Unauthenticated AI Request Should Fail
```bash
curl -X POST http://localhost:3000/api/ai/summarize-note \
  -H "Content-Type: application/json" \
  -d '{"text": "Test text"}'
```
**Expected Response:** 
- Status: 401
- Body: `{"error": "Sign in to edit or save changes."}`

### 4. Frontend UI Testing

#### Test 4.1: Dashboard AI Insight
1. Login to `http://localhost:3000`
2. Go to Dashboard (home page)
3. Click "Regenerate" button on "AI Insight" panel
4. Should see loading animation, then AI response
5. Check browser console - should not show 401 errors

#### Test 4.2: Notes Page AI Features
1. Navigate to `/notes`
2. Write some text in the editor
3. Click "Regenerate" on "Summarize Note" panel
4. Verify response displays correctly

#### Test 4.3: Study Plan AI
1. Navigate to `/study-plan`
2. Click "Regenerate" on study plan panel
3. Verify AI response appears

## Debugging

### Check Authentication Token
Open browser DevTools:
1. Application → Cookies
2. Look for `next-auth.session-token` cookie
3. Should have a JWT token value

### Check Middleware Logs
```bash
# In browser console, check Network tab
# All POST requests should show:
# - Successful ones: Status 200/201
# - Unauthorized: Status 401
```

### Database Verification
```bash
# Connect to PostgreSQL
psql "******localhost:5432/gateprep"

# Check users table
SELECT id, email, name FROM "User" LIMIT 10;

# Check tasks table (should have userId matching a valid user)
SELECT id, "userId", title, priority FROM "Task" LIMIT 10;

# Check AI suggestions were saved (if userId extraction works)
SELECT id, "userId", type, "generatedAt" FROM "AISuggestion" LIMIT 10;
```

## Common Issues & Solutions

### Issue: 401 on All POST Requests
**Cause:** User not authenticated
**Solution:** 
1. Ensure you're logged in at `/login` first
2. Check that NEXTAUTH_SECRET is set correctly in `.env`
3. Check browser cookies for auth token

### Issue: AI Endpoints Return 503
**Cause:** No valid AI API key configured
**Solution:**
1. Set one of these in `.env`:
   - `ANTHROPIC_API_KEY=sk-ant-...`
   - `GROQ_API_KEY=gsk_...`
   - `GEMINI_API_KEY=AIza...`
2. Restart dev server after updating `.env`

### Issue: Tasks Show 500 Error
**Cause:** Database connection or schema issues
**Solution:**
1. Verify PostgreSQL is running
2. Run `npm run prisma:migrate` to ensure schema is up to date
3. Check DATABASE_URL in `.env` is correct

### Issue: Middleware Not Applied
**Cause:** Middleware.ts not detected
**Solution:**
1. Verify `src/middleware.ts` exists
2. Check that file name is exactly `middleware.ts` (case-sensitive)
3. Restart dev server

## Verification Checklist

- [ ] Build succeeds: `npm run build` completes without errors
- [ ] Unauthenticated POST requests return 401
- [ ] Unauthenticated GET requests return 401
- [ ] Authenticated users can create tasks
- [ ] Tasks are user-isolated (userId working)
- [ ] AI endpoints require authentication
- [ ] AI endpoints pass userId to callAI function
- [ ] Frontend UI shows responses correctly
- [ ] Database persists data with correct userId
- [ ] No console errors in browser DevTools

## Success Criteria

All fixes are working correctly when:
1. **Authentication Works**: Middleware blocks unauthenticated mutations and reads
2. **UserID Extraction**: Each endpoint correctly gets userId from session
3. **Data Isolation**: Users only see their own data
4. **Error Handling**: Proper 401/500 responses for different scenarios
5. **AI Suggestions**: Saved to database with correct userId when API key is available
