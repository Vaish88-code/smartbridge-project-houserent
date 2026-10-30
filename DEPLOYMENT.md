# HouseHunt Deployment Guide

## Architecture
- **Frontend (React)** → Netlify (free)
- **Backend (Express API)** → Render (free)
- **Database (MongoDB)** → MongoDB Atlas (free)

---

## Step 1: MongoDB Atlas (Cloud Database)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and sign up/login
2. Click **"Build a Cluster"** → Select **FREE (M0)** tier
3. Choose a region close to you → Click **"Create Deployment"**
4. Create a database user:
   - Username: `househunt`
   - Password: (choose a strong password)
5. Click **"Network Access"** → **"Add IP Address"** → **"Allow Access from Anywhere"** (0.0.0.0/0)
6. Go to **"Database"** → Click **"Connect"** → **"Drivers"**
7. Copy the connection string. It looks like:
   ```
   mongodb+srv://househunt:<password>@cluster0.xxxxx.mongodb.net/househunt?retryWrites=true&w=majority
   ```
   Replace `<password>` with your actual password.

---

## Step 2: Deploy Backend on Render

1. Go to [https://render.com](https://render.com) and sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo: `Vaish88-code/smartbridge-project-houserent`
4. Configure the service:
   - **Name**: `househunt-api`
   - **Region**: Choose closest to you
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Click **"Advanced"** → Add these **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `PORT` | `5000` |
   | `MONGO_URI` | `mongodb+srv://househunt:<password>@cluster0.xxxxx.mongodb.net/househunt?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `househunt_prod_secret_key_change_this_2024` |
   | `CLIENT_URL` | *(leave empty for now, fill after Netlify deploy)* |
   | `NODE_ENV` | `production` |
6. Click **"Create Web Service"**
7. Wait for it to deploy. Copy your Render URL (e.g., `https://househunt-api.onrender.com`)

---

## Step 3: Deploy Frontend on Netlify

1. Go to [https://app.netlify.com](https://app.netlify.com) and sign up with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** → Select repo: `smartbridge-project-houserent`
4. Configure build settings:
   - **Base directory**: `client`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `client/dist`
5. Click **"Advanced"** → Add environment variable:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://househunt-api.onrender.com/api` |
   *(Replace with your actual Render URL from Step 2)*
6. Click **"Deploy site"**
7. Copy your Netlify URL (e.g., `https://househunt-xyz.netlify.app`)

---

## Step 4: Update CORS on Render

1. Go back to **Render Dashboard** → Your web service → **Environment**
2. Update `CLIENT_URL` to your Netlify URL:
   ```
   https://househunt-xyz.netlify.app
   ```
3. Click **"Save Changes"** — Render will auto-redeploy

---

## Step 5: Seed Data on Production

After deployment, seed admin and properties by running these URLs in your browser:
- Or use the Render Shell to run: `node scripts/seedAdmin.js && node scripts/seedProperties.js`

---

## Summary of URLs

| Service | URL |
|---------|-----|
| **Frontend** | `https://your-site.netlify.app` |
| **Backend API** | `https://househunt-api.onrender.com/api` |
| **Database** | MongoDB Atlas (cloud) |

## Default Admin Login
- **Email**: admin@househunt.com
- **Password**: Admin@12345
