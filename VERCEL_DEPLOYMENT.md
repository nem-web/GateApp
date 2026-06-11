# Vercel Deployment Guide

This guide explains how to deploy GateApp to Vercel with proper configuration for the authentication middleware and API endpoints.

## Prerequisites

1. Vercel account (https://vercel.com)
2. GitHub repository connected to Vercel
3. PostgreSQL database (can use Vercel Postgres or external DB)
4. Environment variables configured

## Environment Variables Setup

When deploying to Vercel, configure these environment variables in your Vercel project settings:

### Required Variables

```
DATABASE_URL=******your-db-host:5432/gateprep
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-app.vercel.app
```

### Optional API Keys (for AI features)

```
ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=AIza...
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
```

### Important Notes

- **NEXTAUTH_SECRET**: Must be the same across all deployments. Generate once and reuse:
  ```bash
  openssl rand -base64 32
  ```
- **NEXTAUTH_URL**: Use the Vercel preview/production URL (e.g., `https://yourapp-git-main-yourteam.vercel.app`)
- **DATABASE_URL**: Must be accessible from Vercel's servers

## Critical Production Settings

### 1. Middleware Protection ✅
- **File**: `src/middleware.ts`
- **Status**: Automatically applied to all API routes
- **Coverage**: Protects all POST/PUT/PATCH/DELETE requests
- **Public Endpoints**: 
  - `/api/auth/*` (NextAuth)
  - `/api/auth/register` (custom register endpoint)
  - `/api/telegram/webhook` (if using Telegram integration)

### 2. Authentication Flow ✅
- JWT tokens from NextAuth are automatically used
- Middleware extracts tokens and validates them
- Unauthenticated requests to protected endpoints return 401

### 3. User Data Isolation ✅
- All endpoints extract `userId` from authenticated session
- Tasks API: `/api/tasks` (GET/POST) - user-isolated
- AI endpoints: All AI routes extract `userId` from session
- Database queries filtered by `userId` for data isolation

## Deployment Steps

### 1. Connect Repository to Vercel
```bash
# Navigate to Vercel dashboard
# Click "Add New..." → "Project"
# Select your GitHub repository
# Import project
```

### 2. Configure Environment Variables
In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add all required variables from the section above
3. Ensure NEXTAUTH_SECRET is identical across all environments

### 3. Configure Build and Runtime
In Vercel Dashboard → Settings:
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Node.js Version**: 18.x or higher (recommended)

### 4. Database Migrations
After first deployment:
```bash
# Using Vercel CLI
vercel env pull  # Download environment variables locally

# Run migrations locally with remote DB
npm run prisma:migrate -- --skip-generate
```

Or through Vercel's dashboard deployment hooks.

## Verification Checklist

- [ ] Environment variables are set in Vercel dashboard
- [ ] NEXTAUTH_SECRET is identical to local development
- [ ] NEXTAUTH_URL matches your Vercel deployment URL
- [ ] DATABASE_URL is accessible from Vercel
- [ ] Build completes successfully (check deployment logs)
- [ ] Middleware compiles (check for "ƒ Middleware" in build output)
- [ ] Authentication works (test login)
- [ ] Protected endpoints return 401 when unauthenticated
- [ ] Authenticated users can access their data
- [ ] Tasks are user-isolated

## Testing in Vercel Preview

1. **Create a PR** with your changes
2. **Vercel creates a preview URL** automatically
3. **Test authentication**:
   - Try accessing `/api/tasks` without login → should get 401
   - Login and access `/api/tasks` → should get your tasks
4. **Test API endpoints**:
   - Create a task
   - Verify it appears only for your user
5. **Check logs** in Vercel dashboard for errors

## Troubleshooting

### Issue: Middleware not being applied
**Solution**: Ensure `src/middleware.ts` exists and file name is exact (case-sensitive)

### Issue: 401 errors in frontend
**Solution**: 
1. Verify NEXTAUTH_SECRET is set correctly
2. Check NEXTAUTH_URL matches your deployment URL
3. Clear browser cookies and login again

### Issue: Database connection errors
**Solution**:
1. Verify DATABASE_URL is correct
2. Ensure database allows connections from Vercel IPs
3. Check database credentials in environment variables

### Issue: Prisma client generation fails
**Solution**:
1. Add to vercel.json (create if needed):
   ```json
   {
     "buildCommand": "npm run prisma:generate && npm run build"
   }
   ```
2. This ensures Prisma client is generated during build

## Performance Notes

- Middleware adds ~47.7 KB to serverless function size (acceptable)
- API routes are server-rendered on demand (✓ Vercel compatible)
- Static pages pre-rendered at build time (✓ Optimal)
- Prisma client properly initialized for serverless

## Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js on Vercel](https://nextjs.org/learn/basics/deploying-nextjs-app)
- [NextAuth.js on Vercel](https://next-auth.js.org/deployment)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
