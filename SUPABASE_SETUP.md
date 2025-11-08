# Supabase Setup Guide

This guide will help you set up Supabase for the BE SAFE project.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Your project already created in Supabase

## Step 1: Create a New Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click on "New Project"
3. Fill in the project details:
   - **Name**: BE SAFE
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose the closest to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (1-2 minutes)

## Step 2: Run the Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Open the file `supabase-schema.sql` from this repository
3. Copy the entire contents
4. Paste it into the SQL Editor
5. Click **Run** or press `Ctrl/Cmd + Enter`
6. You should see a success message

This will create:
- `users` table
- `posts` table
- Indexes for better performance
- Row Level Security (RLS) policies
- Helper functions for common queries

## Step 3: Get Your API Keys

1. In your Supabase project, go to **Settings** → **API**
2. You'll need two keys:

   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **Service Role Key** (secret): `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

   ⚠️ **IMPORTANT**: The service role key bypasses Row Level Security. Keep it secret!

## Step 4: Configure Environment Variables

### Backend Configuration

Create a `.env` file in the `backend` folder:

```env
VIRUSTOTAL_API_KEY=ce7de855a44cd3422f5dc0a490744cb0a9869b83ba30963ee3e4e62158b5306a
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here
```

Replace:
- `https://your-project.supabase.co` with your actual Supabase project URL
- `your_supabase_service_role_key_here` with your Supabase service role key (secret!)

### Frontend Configuration

Create a `.env` file in the `frontend` folder:

```env
VIRUSTOTAL_API_KEY=ce7de855a44cd3422f5dc0a490744cb0a9869b83ba30963ee3e4e62158b5306a
```

## Step 5: Disable Row Level Security (Optional for Development)

If you want to disable RLS during development (not recommended for production):

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
```

Run this in the SQL Editor.

## Step 6: Test the Connection

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Start the backend server:
   ```bash
   npm start
   ```

3. You should see:
   ```
   ✅ Conexão com Supabase estabelecida com sucesso!
   🚀 Servidor backend iniciado com sucesso!
   ```

## Database Schema Overview

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| username | VARCHAR(26) | Primary key, unique username |
| password | VARCHAR(255) | User password (should be hashed) |
| role | VARCHAR(20) | User role (User, Admin, etc.) |
| header_image | TEXT | Base64 image header (e.g., "data:image/png;base64") |
| bytes_image | TEXT | Base64 image data |
| created_at | TIMESTAMP | Auto-generated creation timestamp |
| updated_at | TIMESTAMP | Auto-updated timestamp |

### Posts Table

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Auto-incrementing primary key |
| site_name | VARCHAR(255) | Name of the site being reviewed |
| description | TEXT | Post description |
| category | VARCHAR(20) | "Positiva", "Negativa", or "Aviso" |
| author_username | VARCHAR(26) | Foreign key to users table |
| likes | INTEGER | Number of likes |
| dislikes | INTEGER | Number of dislikes |
| liked_users | JSONB | Array of usernames who liked |
| disliked_users | JSONB | Array of usernames who disliked |
| created_at | TIMESTAMP | Auto-generated creation timestamp |
| updated_at | TIMESTAMP | Auto-updated timestamp |

## Helpful SQL Queries

### View all users
```sql
SELECT * FROM users ORDER BY created_at DESC;
```

### View all posts
```sql
SELECT * FROM posts ORDER BY created_at DESC;
```

### Get posts by a specific user
```sql
SELECT * FROM get_user_posts('username_here');
```

### Search posts by site name
```sql
SELECT * FROM search_posts_by_site('google');
```

### Check if user voted on a post
```sql
SELECT * FROM user_vote_status(1, 'username_here');
```

## Troubleshooting

### Error: "Invalid API key"
- Make sure you're using the **service role key**, not the anon key
- Check that there are no extra spaces in your `.env` file

### Error: "relation does not exist"
- Make sure you ran the `supabase-schema.sql` in the SQL Editor
- Check that you're connected to the right project

### Error: "new row violates row-level security policy"
- Either disable RLS for development, or
- Adjust the RLS policies in the schema to match your auth implementation

### Connection timeout
- Check your internet connection
- Verify the Supabase URL is correct
- Make sure your project is not paused (free tier projects pause after inactivity)

## Production Deployment

For production on Vercel:

1. Add environment variables in Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `VIRUSTOTAL_API_KEY`

2. Make sure your Supabase project is on a paid plan if you need:
   - More than 500MB database storage
   - More than 2GB bandwidth
   - Custom domains

3. Enable RLS policies for security
4. Consider using connection pooling for better performance
5. Set up database backups

## Security Best Practices

1. **Never commit** `.env` files to git
2. **Always use** the service role key on the backend only
3. **Enable RLS** in production
4. **Hash passwords** before storing (consider using bcrypt)
5. **Implement rate limiting** to prevent abuse
6. **Use HTTPS** in production
7. **Rotate keys** regularly

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## Need Help?

- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- GitHub Issues: Create an issue in this repository
- Supabase Support: [app.supabase.com/support](https://app.supabase.com/support)
