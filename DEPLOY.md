# Deployment Guide

## Quick Reference

```bash
# Full deploy (build + upload + restart)
bash deploy/hostinger-deploy.sh

# Validate (run after every deploy)
bash deploy/validate-deploy.sh

# Quick deploy (skip build, re-upload last build)
bash deploy/hostinger-deploy.sh --quick
```

All 25 validation checks must pass before a deploy is considered complete.

---

## What Happens During Deploy

`hostinger-deploy.sh` runs 7 steps:

| Step | What | Details |
|------|------|---------|
| 1 | Preflight | Verifies SSH connectivity to server |
| 2 | Build | `prisma generate` + `next build` (standalone mode) |
| 3 | Package | Copies static assets + public files into standalone dir |
| 4 | Clear | Removes old `.next/` and `node_modules/` on server |
| 5 | Upload | `rsync --delete --checksum` to server |
| 6 | Setup | Copies `.env`, installs native Linux binaries, restarts Passenger |
| 7 | Health check | Waits 8s, verifies HTTP 200 |

---

## Deploy Scripts

| Script | Purpose | When to use |
|--------|---------|-------------|
| `hostinger-deploy.sh` | Production deploy (builds locally, uploads, restarts) | **Every deploy** |
| `validate-deploy.sh` | 25-check post-deploy validation | **After every deploy** |
| `cleanup-server.sh` | WordPress eradication + security hardening (dry run by default) | Maintenance |
| `cleanup-server.sh --execute` | Apply cleanup changes | When cleanup needed |
| `setup-cron.sh` | One-time cron job setup on server | Run once |
| `server.env` | Environment variable template | Reference |

> Files marked `_LEGACY_DO_NOT_USE` are from an old VPS/PM2 architecture and must not be used.

---

## Environment

| | Local (build machine) | Server (runtime) |
|---|---|---|
| **OS** | macOS | Linux (Hostinger Shared Hosting) |
| **Node.js** | v25.x | v20.x |
| **Role** | Builds the app | Runs the pre-built `server.js` |
| **Package manager** | npm | npm (native binaries only) |

The Node.js version difference is **safe** because Next.js standalone mode bundles everything at build time. The server only executes the self-contained `server.js`.

### Server Details

- **Hosting**: Hostinger Shared Hosting (LiteSpeed + Passenger)
- **SSH**: `ssh -p 65002 u104276643@88.223.85.114`
- **App directory**: `/home/u104276643/domains/onlineautoabmelden.com/nodejs`
- **Env file**: `/home/u104276643/env/onlineautoabmelden.env` (persistent, not overwritten by deploys)
- **Restart method**: `touch tmp/restart.txt` (Passenger watches this file)
- **No PM2, No Nginx** — Passenger manages the process directly

---

## Troubleshooting

### "Cannot find module 'next'"
**Cause**: Running `npm install` directly inside the standalone `node_modules/` corrupts the dependency tree.
**Fix**: The deploy script installs native binaries in a temp directory and copies only the needed packages. Never run `npm install` in the app directory on the server.

### Images broken / AVIF corruption
**Cause**: Hostinger's sharp produces corrupt AVIF files.
**Fix**: `next.config.js` uses `images.formats: ['image/webp']` only. Do not add `image/avif`.

### Turso schema changes
`prisma db push` does not work with `libsql://` URLs. Use the Turso HTTP API directly:
```
POST https://kfz-digital-zulassung-omnianeil.aws-eu-west-1.turso.io/v2/pipeline
```

### Native binary install fails on server
Hostinger sometimes fails with "fork: Resource temporarily unavailable" during `npm install`.
**Workaround**: The deploy script handles this with the temp-dir pattern. If it still fails, install locally and rsync the binary to the server.
