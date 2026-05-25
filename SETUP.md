# Daily Updates — Setup Guide

## 1. Create a GitHub repo

Create a new GitHub repo (e.g. `daily-updates`) — can be private.

## 2. Create a GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Click **Generate new token**
3. Set permissions:
   - Repository: `daily-updates`
   - **Contents**: Read and write
4. Copy the token

## 3. Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
GITHUB_TOKEN=ghp_your_token
GITHUB_OWNER=your-github-username
GITHUB_REPO=daily-updates
```

## 4. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 5. Deploy to Vercel (free)

1. Push this repo to GitHub
2. Go to vercel.com → New Project → Import your repo
3. Add these Environment Variables in Vercel project settings:
   - `GITHUB_TOKEN`
   - `GITHUB_OWNER`
   - `GITHUB_REPO`
4. Deploy — done!

Updates are stored as markdown files in the `updates/` folder of your `GITHUB_REPO`.
