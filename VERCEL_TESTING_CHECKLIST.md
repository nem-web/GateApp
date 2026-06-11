# 🚀 Vercel Preview Testing Checklist

Use this checklist when testing the preview deployment on Vercel.

## Pre-Deployment

- [ ] Read `VERCEL_READY.md` for overview of all fixes
- [ ] Review `VERCEL_DEPLOYMENT.md` for setup instructions
- [ ] Note the Vercel preview URL (e.g., `https://gateapp-git-main-username.vercel.app`)

## Environment Setup in Vercel Dashboard

In Vercel Project → Settings → Environment Variables, add:

- [ ] `DATABASE_URL` - Your production database connection string
- [ ] `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` - Set to your preview URL
- [ ] `ANTHROPIC_API_KEY` (optional) - If using AI features
- [ ] `GROQ_API_KEY` (optional) - If using AI features
- [ ] `GEMINI_API_KEY` (optional) - If using AI features

## After Deployment

- [ ] Vercel build completed successfully (check Deployments page)
- [ ] Preview URL is accessible
- [ ] No 500 errors in deployment logs

## Authentication Testing

### Test 1: Unauthenticated Access
- [ ] Open browser console (DevTools)
- [ ] Go to Network tab
- [ ] Try accessing `/api/tasks` directly via curl or browser:
  ```bash
  curl https://your-preview.vercel.app/api/tasks
  ```
- [ ] Expected: 401 status code with error message
- [ ] Actual: ___

### Test 2: Login Flow
- [ ] Navigate to `https://your-preview.vercel.app/login`
- [ ] Create account or login
- [ ] Check that auth cookie is set
- [ ] DevTools → Application → Cookies → Look for `next-auth.session-token`

## API Endpoints Testing

### Test 3: Create Task (Authenticated)
- [ ] After login, click on "Todo" page
- [ ] Create a new task with title, priority, due date
- [ ] Expected: Task appears in list
- [ ] Actual: ___
- [ ] Check DevTools → Network → POST /api/tasks → Status should be 201/200

### Test 4: Retrieve Tasks
- [ ] While logged in, visit `/todo`
- [ ] All tasks visible should have correct userId
- [ ] Check database: All tasks should have matching userId

### Test 5: User Data Isolation
- [ ] User A: Create a task titled "User A Task"
- [ ] User A: Logout
- [ ] User B: Login
- [ ] User B: Go to `/todo`
- [ ] Expected: "User A Task" should NOT be visible
- [ ] Actual: ___

## AI Features Testing

### Test 6: Dashboard AI Insight
- [ ] Login and go to Dashboard (home page)
- [ ] Click "Regenerate" button on "AI Insight" panel
- [ ] Expected: AI response appears (or 503 if no API key)
- [ ] Actual: ___
- [ ] Status code: ___ (should be 200 or 503, NOT 500)

### Test 7: Notes AI Features
- [ ] Go to `/notes`
- [ ] Write some text in editor
- [ ] Click "Regenerate" on "Summarize Note"
- [ ] Expected: Summary appears
- [ ] Actual: ___
- [ ] Check DevTools → Network → POST /api/ai/summarize-note
- [ ] Status code: ___ (should be 200 or 503)

### Test 8: Other AI Endpoints
- [ ] [ ] Study Plan AI (`/study-plan`)
- [ ] [ ] Hot Topics Prediction (`/pyq`)
- [ ] [ ] College Advisor (`/cutoffs`)
- [ ] [ ] All AI endpoints should work without 500 errors

## Error Handling Testing

### Test 9: Proper HTTP Status Codes
- [ ] Unauthenticated POST → 401 ✓
- [ ] Missing AI API key → 503 ✓
- [ ] Authenticated request → 200 ✓
- [ ] No 500 errors from endpoint issues ✓

### Test 10: Database Persistence
1. Create task with specific content
2. Refresh page
3. Task should still be there with same content
4. Log out and log back in
5. Task should still be visible

## Edge Cases

### Test 11: Middleware Application
- [ ] GET /api/tasks (before fix: worked, after fix: requires auth)
- [ ] POST /api/tasks (requires auth) ✓
- [ ] PUT endpoints (require auth) ✓
- [ ] DELETE endpoints (require auth) ✓
- [ ] /api/auth/register (public - allowed) ✓
- [ ] /api/telegram/webhook (public - allowed) ✓

### Test 12: Session Management
- [ ] Clear all cookies
- [ ] Try accessing protected endpoint → 401 ✓
- [ ] Login again
- [ ] Try accessing protected endpoint → 200 ✓
- [ ] Session token is valid ✓

## Logging & Debugging

### Check Vercel Logs
In Vercel Dashboard → Deployment → Logs:
- [ ] No error stack traces
- [ ] No "Unauthorized" errors from middleware
- [ ] No database connection errors
- [ ] Performance metrics look normal

### Browser Console
- [ ] No JavaScript errors
- [ ] No CORS errors
- [ ] No auth warnings

## Final Verification

- [ ] All critical features work ✓
- [ ] No 500 errors from API issues ✓
- [ ] Authentication properly enforced ✓
- [ ] User data properly isolated ✓
- [ ] Database operations work ✓
- [ ] Ready for production deploy ✓

## Issues Found

If you find any issues, document them here:

| Issue | Status | Resolution |
|-------|--------|-----------|
|       |        |           |
|       |        |           |

## Notes

Add any observations or findings:

___

---

**Deployment Date**: ___  
**Tester Name**: ___  
**Test Results**: [ ] PASS [ ] FAIL  
**Ready for Production**: [ ] YES [ ] NO
