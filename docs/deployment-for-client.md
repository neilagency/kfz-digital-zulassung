# How to Deploy the Website — Guide for Non-Technical Users

**Website:** https://onlineautoabmelden.com  
**Hosting:** Hostinger (Node.js / LiteSpeed Passenger)  
**Deployment method:** GitHub Actions (manual trigger)

---

## What Does "Deploying" Mean?

Deploying means publishing your latest code changes from GitHub to the live website. After a deploy, visitors will see the updated version.

Deployment runs automatically on GitHub's servers — **you do not need a terminal, a Mac, or any technical tools.** Any authorized person can do it from a web browser.

---

## Who Can Deploy?

Any GitHub user who has **Write** or **Admin** access to the repository can trigger a deployment.

To check or change access:  
`GitHub → Repository → Settings → Collaborators and teams`

---

## How to Deploy — Step by Step

1. Go to the repository on GitHub
2. Click the **Actions** tab (top navigation bar)
3. In the left sidebar, click **"Deploy to Hostinger"**
4. Click the **"Run workflow"** button (top right of the workflow list)
5. A small dialog appears:
   - **Branch:** leave as `main` (or whichever branch you want to deploy)
   - **Skip schema guard:** leave this **unchecked** (default is safe)
6. Click the green **"Run workflow"** button
7. A new run appears in the list — click it to watch live progress

The entire process takes approximately **5–10 minutes**.

---

## How to Know if It Succeeded

A successful deployment shows a **green checkmark ✅** next to the run.

The last step "Health check" confirms the live website is returning HTTP 200 (normal response). If the site is up, deployment is complete.

You can also verify manually by visiting:  
👉 https://onlineautoabmelden.com

---

## What Each Step Does

| Step | What it does |
|------|--------------|
| Checkout code | Downloads the latest code from GitHub |
| Setup Node.js | Prepares the build environment |
| Install dependencies | Installs all required packages |
| Schema guard | Checks database structure is safe to deploy |
| Build Next.js | Compiles the website for production |
| Prepare deploy package | Packages the build files for upload |
| Configure SSH | Sets up a secure connection to the server |
| Clear old build | Removes the previous build from the server |
| Upload via rsync | Uploads the new build to the server |
| Setup environment | Copies the server's config file, restarts the app |
| Health check | Confirms the live site responds correctly |
| Show server logs | Displays recent server output for debugging |

---

## What to Do if Deployment Fails

### Step 1 — Read the error

Click on the failed run → click on the failed step (shown in red) → read the output.

### Step 2 — Common causes and fixes

**Schema guard failed (exit code 1)**
- The database structure has changed in a way that could break the site.
- **Do not skip this** — contact the developer to review the schema changes first.

**Build failed**
- There is a code error. Check the "Build Next.js" step output for the TypeScript or compilation error.
- Fix the code, push to GitHub, then deploy again.

**SSH connection failed**
- The server may be temporarily unreachable or the SSH key has expired.
- Try again in a few minutes. If it persists, contact the developer.

**Health check failed (site returned non-200)**
- The app may still be starting up (this can take up to 60 seconds).
- Check the "Show recent server logs" step — look for error messages.
- Try visiting the site manually — it may have recovered by the time you check.

### Step 3 — Re-run a failed deployment

If the failure was temporary (network issue, server timeout):
- Click **"Re-run failed jobs"** or **"Re-run all jobs"** on the failed run page.

### Step 4 — Rollback

There is no automatic rollback button. To rollback:
1. Go to the repository commits
2. Find the last working commit
3. Ask the developer to revert — or create a revert commit yourself on the `main` branch
4. Deploy again

---

## What Should NEVER Be Edited in This File

Do not modify the workflow file at:  
`.github/workflows/deploy.yml`

Unless you know exactly what you are doing. Wrong changes here can break all future deployments.

---

## GitHub Secrets — Do Not Touch

The deployment relies on sensitive values stored as GitHub Secrets:

`GitHub → Repository → Settings → Secrets and variables → Actions`

| Secret name | What it is |
|-------------|------------|
| `HOSTINGER_SSH_KEY` | Private SSH key for server access |
| `HOSTINGER_HOST` | Server IP address |
| `HOSTINGER_PORT` | SSH port number |
| `HOSTINGER_USERNAME` | Server login username |
| `HOSTINGER_APP_PATH` | Path to the app on the server |
| `HOSTINGER_ENV_FILE` | Path to the server's `.env` config file |
| `TURSO_DATABASE_URL` | Database connection URL |
| `TURSO_AUTH_TOKEN` | Database authentication token |
| `NEXTAUTH_SECRET` | Authentication secret key |
| `NEXTAUTH_URL` | Website URL for authentication |

**These values are encrypted and cannot be read back.** If any of them are incorrect, the deployment will fail. Do not delete or overwrite them unless you have the correct new values ready.

The server's `.env` file (containing all runtime environment variables) lives on the Hostinger server at:  
`/home/u104276643/env/onlineautoabmelden.env`

This file is **never overwritten by deployment**. It is copied to the app directory after each deploy.

---

## Files That Are Never Overwritten During Deployment

The following server-side files/folders are protected and will never be deleted or overwritten by a deployment:

| Path on server | Contents |
|----------------|----------|
| `.env` | All environment variables (database, payments, mail, etc.) |
| `public/uploads/media/` | User-uploaded images via the admin panel |
| `public/uploads/wp/` | Legacy WordPress media files |
| `public/uploads/documents/` | Uploaded customer documents |
| `public/uploads/order-documents/` | Uploaded order documents |

---

## Permissions Needed to Deploy

The GitHub account must have at minimum **Write** access to the repository.

If you see the "Run workflow" button is greyed out or missing, your account does not have sufficient permissions. Contact the repository owner to grant access.

---

## After Deployment — Quick Checks

1. ✅ Visit https://onlineautoabmelden.com — site loads normally
2. ✅ Test the order form on the product page
3. ✅ Log in to the admin panel at `/admin`
4. ✅ Check that uploaded images are still visible

---

## For Developers — SSH Access to Server Logs

```bash
# View live server logs
ssh -p 65002 u104276643@88.223.85.114 'tail -f /home/u104276643/domains/onlineautoabmelden.com/nodejs/console.log'

# Force restart the app
ssh -p 65002 u104276643@88.223.85.114 'touch /home/u104276643/domains/onlineautoabmelden.com/nodejs/tmp/restart.txt'

# Run the original local deploy script (Mac only, full build + upload)
bash deploy/hostinger-deploy.sh
```

---

## Setting Up GitHub Secrets (One-Time Setup)

This only needs to be done once by the developer. After that, deployments work without any further configuration.

1. Go to `GitHub → Repository → Settings → Secrets and variables → Actions`
2. Click **"New repository secret"**
3. Add each secret listed in the table above
4. For `HOSTINGER_SSH_KEY`: paste the **entire** private key content, including the lines:
   ```
   -----BEGIN OPENSSH PRIVATE KEY-----
   ...
   -----END OPENSSH PRIVATE KEY-----
   ```
5. The SSH public key must already be in the server's `~/.ssh/authorized_keys` file on Hostinger

---

*Last updated: May 2026*
