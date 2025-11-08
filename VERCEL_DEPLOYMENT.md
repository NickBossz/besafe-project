# Vercel Deployment Guide

This guide provides step-by-step instructions for deploying BE SAFE on Vercel.

## Prerequisites

- GitHub account with the repository pushed
- Vercel account ([sign up here](https://vercel.com))
- Supabase project configured (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))

## Deployment Steps

### 1. Import Project to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your GitHub repository: `NickBossz/besafe-project`
4. Click **Import**

### 2. Configure Project Settings

Vercel will automatically detect the monorepo structure from `vercel.json`.

**Root Directory**: Leave as `/` (root)

**Framework Preset**:
- Frontend: Create React App (auto-detected)
- Backend: Node.js (auto-detected)

### 3. Configure Environment Variables

Click on **Environment Variables** and add the following:

#### Backend Environment Variables

| Name | Value | Environment |
|------|-------|-------------|
| `VIRUSTOTAL_API_KEY` | `ce7de855a44cd3422f5dc0a490744cb0a9869b83ba30963ee3e4e62158b5306a` | Production, Preview, Development |
| `SUPABASE_URL` | `https://poxkmbzrenfecangqzyr.supabase.co` | Production, Preview, Development |
| `SUPABASE_SERVICE_KEY` | Your Supabase service role key | Production, Preview, Development |

#### Frontend Environment Variables

| Name | Value | Environment |
|------|-------|-------------|
| `VIRUSTOTAL_API_KEY` | `ce7de855a44cd3422f5dc0a490744cb0a9869b83ba30963ee3e4e62158b5306a` | Production, Preview, Development |

**IMPORTANT**: Replace `Your Supabase service role key` with your actual service role key from Supabase dashboard.

### 4. Deploy

1. Click **Deploy**
2. Wait for the build to complete (2-5 minutes)
3. Your app will be live at `https://your-project.vercel.app`

## Project Structure

```
be-safe-monorepo/
├── frontend/          # React app (static build)
│   └── build/        # Generated on deployment
├── backEnd/          # Node.js API (serverless functions)
│   └── servidor.js   # Main server file
└── vercel.json       # Deployment configuration
```

## How Routes Work

The `vercel.json` configuration maps routes:

### Backend Routes (Serverless Functions)
All these routes are handled by `backEnd/servidor.js`:

- `/check-site` - URL security check
- `/check-file` - File malware scan
- `/criarUsuario` - Create user
- `/usuario/:username` - Get user by username
- `/usuarios` - List all users
- `/excluirUsuario/:username` - Delete user
- `/uploadperfilimage` - Upload profile image
- `/posts` - List/create posts
- `/posts/:id` - Update/delete post
- `/posts/:id/vote` - Vote on post
- `/forum/posts/:username` - Get user's posts

### Frontend Routes (Static Files)
Everything else (`/*`) serves the React app.

## Troubleshooting

### Build Fails

**Error**: `Cannot find module '@supabase/supabase-js'`

**Solution**: Make sure `backEnd/package.json` includes the dependency:
```json
"dependencies": {
  "@supabase/supabase-js": "^2.45.4"
}
```

### 404 Error on Backend Routes

**Error**: `404: NOT_FOUND`

**Solution**:
1. Check that environment variables are set correctly
2. Verify `vercel.json` has correct backend directory (`backEnd` not `backend`)
3. Redeploy the project

### Supabase Connection Error

**Error**: `Invalid API key` or connection timeout

**Solution**:
1. Verify `SUPABASE_URL` is correct (check Supabase dashboard)
2. Verify `SUPABASE_SERVICE_KEY` is the **service role key** (not anon key)
3. Check Supabase project is not paused (free tier pauses after inactivity)

### CORS Errors

**Error**: `Access-Control-Allow-Origin` error

**Solution**: Backend already has CORS enabled for all origins (`*`). For production, update in `backEnd/servidor.js`:
```javascript
servidorBackend.use(cors({
  origin: 'https://your-domain.vercel.app',
  allowedHeaders: '*'
}));
```

### Frontend Can't Connect to Backend

**Error**: Failed to fetch or network error

**Solution**: Frontend should use relative URLs. Check that API calls don't hardcode `localhost:8080`. Example:
```javascript
// Bad
fetch('http://localhost:8080/posts')

// Good
fetch('/posts')
```

## Post-Deployment Checklist

- [ ] Backend routes respond correctly (test `/posts`)
- [ ] Frontend loads and displays properly
- [ ] Supabase connection works (create a test user)
- [ ] VirusTotal API works (test URL checker)
- [ ] File upload works (test file checker)
- [ ] Forum posts can be created
- [ ] User registration works

## Monitoring and Logs

### View Logs

1. Go to your project on Vercel dashboard
2. Click **Deployments**
3. Click on the latest deployment
4. Click **Functions** tab to see backend logs
5. Click **Build Logs** to see build output

### Real-time Function Logs

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# View logs
vercel logs
```

## Performance Optimization

### Enable Caching

Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Edge Functions (Optional)

For better global performance, consider migrating to Edge Functions:
```json
{
  "functions": {
    "backEnd/servidor.js": {
      "runtime": "edge"
    }
  }
}
```

## Custom Domain

1. Go to project **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request

To disable auto-deploy:
1. Go to **Settings** → **Git**
2. Uncheck **Automatically deploy...**

## Rollback

If deployment breaks:
1. Go to **Deployments**
2. Find a working deployment
3. Click **...** → **Promote to Production**

## Cost Estimate

**Free Tier Includes**:
- Unlimited deployments
- 100GB bandwidth/month
- Serverless function execution
- SSL certificates
- Preview deployments

**May Require Pro** ($20/mo):
- Custom domains beyond 1
- More than 100GB bandwidth
- Team collaboration features

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)

## Support

- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
