# Complete Railway Deployment Guide

This guide will help you deploy your Craiyon website to Railway with MySQL database and Nebius AI integration.

## Prerequisites

- GitHub account
- Your Nebius API key: `eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprLVRvdzlLZWstc0M1akptWXBvX1VaVkxUZlpnMDRlOFUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJnb29nbGUtb2F1dGgyfDExMDg0MDQ3NDk0MTA3NTA3NzA5MSIsInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXNzIiwiaXNzIjoiYXBpX2tleV9pc3N1ZXIiLCJhdWQiOlsiaHR0cHM6Ly9uZWJpdXMtaW5mZXJlbmNlLmV1LmF1dGgwLmNvbS9hcGkvdjIvIl0sImV4cCI6MTkxMzYxNTU5NSwidXVpZCI6IjdjNzZkMmM5LWQ1ZmEtNDhmMC1iZGNhLTdkNmZmZmQ5NTk3ZiIsIm5hbWUiOiJjcmFpeW9uIiwiZXhwaXJlc19hdCI6IjIwMzAtMDgtMjJUMDc6NTM6MTUrMDAwMCJ9.D5vSq1uEmzUuD9awoNntFFKcBgpVfDcxAdeVLOD6CuY`

## Step 1: Push Your Code to GitHub

```bash
# Make sure you're in your project directory
cd ~/aura/craiyon-website

# Add all changes
git add .

# Commit with a descriptive message
git commit -m "Update to Nebius API and Railway deployment config"

# Push to GitHub
git push origin main
```

## Step 2: Set Up Railway Account

1. **Go to Railway**:
   - Visit [railway.app](https://railway.app)
   - Click **"Login"**
   - Choose **"Login with GitHub"**
   - Authorize Railway to access your GitHub account

## Step 3: Create MySQL Database

1. **Create New Project**:
   - Click **"New Project"**
   - Select **"Provision MySQL"**
   - Wait for deployment (30-60 seconds)

2. **Get Database Credentials**:
   - Click on your MySQL service (purple database icon)
   - Go to **"Variables"** tab
   - Note down these values:
     - `MYSQL_HOST`
     - `MYSQL_PORT`
     - `MYSQL_USER` (usually "root")
     - `MYSQL_PASSWORD`
     - `MYSQL_DATABASE` (usually "railway")

## Step 4: Initialize Database Schema

1. **Access Railway Query Console**:
   - In your MySQL service, click **"Query"** tab
   - Copy and paste this SQL:

```sql
CREATE TABLE image_entries (
  id SERIAL PRIMARY KEY,
  image_id INT NOT NULL,
  team_name VARCHAR(128) NOT NULL,
  image_url VARCHAR(2000) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  score DECIMAL(11,10) NOT NULL,
  model VARCHAR(100) NOT NULL,
  prompt VARCHAR(2000) NOT NULL,
  negative_prompt VARCHAR(2000) NOT NULL,
  steps TEXT NOT NULL,
  cfg_scale TEXT NOT NULL,
  seed BIGINT NOT NULL,
  style_preset VARCHAR(50),
  sampler VARCHAR(255) NOT NULL,
  width INT NOT NULL,
  height INT NOT NULL
);

CREATE TABLE text_entries (
  id SERIAL PRIMARY KEY,
  text_id INT NOT NULL,
  team_name VARCHAR(128) NOT NULL,
  generation TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  score DECIMAL(12, 10) NOT NULL,
  model VARCHAR(64) NOT NULL,
  user_prompt TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  temperature DECIMAL(4, 3) NOT NULL,
  max_tokens INT NOT NULL
);
```

2. **Run the Query**:
   - Click **"Run Query"**
   - Verify both tables are created successfully

## Step 5: Deploy Your Application to Railway

1. **Add Your GitHub Repository**:
   - In Railway dashboard, click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your `craiyon-website` repository
   - Railway will automatically detect it's a Next.js app

2. **Wait for Initial Deployment**:
   - Railway will build and deploy your app
   - This may take 3-5 minutes
   - You'll see build logs in real-time

## Step 6: Configure Environment Variables

1. **Access Your Web Service**:
   - Click on your web service (not the database)
   - Go to **"Variables"** tab

2. **Add Database Environment Variables**:
   Add these variables with values from your MySQL service:

   | Variable Name | Value | Description |
   |---------------|-------|-------------|
   | `DB_HOST` | Your MySQL MYSQL_HOST | Database host |
   | `DB_NAME` | `railway` | Database name |
   | `DB_USER` | `root` | Database user |
   | `DB_PASSWORD` | Your MySQL password | Database password |

3. **Add Nebius API Key**:
   | Variable Name | Value |
   |---------------|-------|
   | `NEBIUS_API_KEY` | `eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprLVRvdzlLZWstc0M1akptWXBvX1VaVkxUZlpnMDRlOFUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJnb29nbGUtb2F1dGgyfDExMDg0MDQ3NDk0MTA3NTA3NzA5MSIsInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXNzIiwiaXNzIjoiYXBpX2tleV9pc3N1ZXIiLCJhdWQiOlsiaHR0cHM6Ly9uZWJpdXMtaW5mZXJlbmNlLmV1LmF1dGgwLmNvbS9hcGkvdjIvIl0sImV4cCI6MTkxMzYxNTU5NSwidXVpZCI6IjdjNzZkMmM5LWQ1ZmEtNDhmMC1iZGNhLTdkNmZmZmQ5NTk3ZiIsIm5hbWUiOiJjcmFpeW9uIiwiZXhwaXJlc19hdCI6IjIwMzAtMDgtMjJUMDc6NTM6MTUrMDAwMCJ9.D5vSq1uEmzUuD9awoNntFFKcBgpVfDcxAdeVLOD6CuY` |

4. **Save and Redeploy**:
   - After adding all variables, Railway will automatically redeploy
   - Wait for the new deployment to complete

## Step 7: Test Your Application

1. **Get Your App URL**:
   - In your web service, you'll see a URL like `https://your-app-name.up.railway.app`
   - Click on it to open your app

2. **Test Login**:
   - Username: `aura`
   - Password: `aura`

3. **Test Image Generation**:
   - Login successfully
   - Try generating an image
   - The app should now use Nebius API instead of Prodia

## Step 8: Configure Custom Domain (Optional)

1. **Add Custom Domain**:
   - In your web service, go to **"Settings"** tab
   - Click **"Domains"**
   - Add your custom domain
   - Configure DNS as instructed

## Troubleshooting

### Database Connection Issues

**Problem**: Database connection errors

**Solutions**:
1. Check if MySQL service is running (green status)
2. Verify all DB environment variables are correct
3. Ensure MySQL service and web service are in the same project

### Build Failures

**Problem**: Build fails during deployment

**Solutions**:
1. Check build logs for specific errors
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility

### API Issues

**Problem**: Image generation fails

**Solutions**:
1. Verify `NEBIUS_API_KEY` is set correctly
2. Check Nebius API documentation for any changes
3. Monitor Railway logs for API errors

### Login Issues

**Problem**: Cannot login with aura/aura

**Solutions**:
1. Clear browser cache
2. Check if database tables were created properly
3. Verify login logic is working (it's hardcoded, not database-dependent)

## Railway Features

### Automatic Deployments
- Every push to your main branch triggers a new deployment
- No manual intervention needed

### Monitoring
- View logs in real-time
- Monitor resource usage
- Set up alerts for downtime

### Scaling
- Railway automatically handles traffic spikes
- Upgrade plans for higher limits

## Cost Information

### Railway Pricing
- **Starter Plan**: $5/month
  - Includes both web app and database
  - No sleeping (unlike free tiers)
  - Better performance and reliability

### What's Included
- Web application hosting
- MySQL database
- SSL certificates
- Custom domains
- Automatic deployments
- 24/7 uptime

## Next Steps

1. **Monitor Your App**: Check Railway dashboard regularly
2. **Set Up Monitoring**: Configure alerts for downtime
3. **Backup Strategy**: Consider database backups for production
4. **Performance**: Monitor response times and optimize as needed
5. **Security**: Regularly update dependencies

## Support

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Nebius Documentation**: [studio.nebius.ai/docs](https://studio.nebius.ai/docs)

---

**Your app is now fully deployed on Railway with:**
- ✅ Nebius AI integration
- ✅ MySQL database
- ✅ Custom login (aura/aura)
- ✅ Automatic deployments
- ✅ SSL certificates
- ✅ Production-ready hosting

**App URL**: Check your Railway dashboard for the live URL!