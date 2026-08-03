# How to Deploy Flowentra

A simple guide to push your code to the server and make it live.

There are two parts:
- **Backend** (PHP API) → one double-click with `push_code_to_server.bat`
- **Frontend** (the React site) → build once, upload the result

---

## ⚡ TL;DR

1. **Backend:** double-click **`push_code_to_server.bat`** → done.
2. **Frontend:** run `npm run build`, then upload the `dist/` folder to where the site is hosted.

---

## 1. Backend — one-click deploy

### What it does
Double-clicking **`push_code_to_server.bat`** will:
1. Install PuTTY/plink automatically if it's missing (one-time).
2. Connect to the VPS over SSH.
3. Run `git pull` to fetch the latest code.
4. Reload PHP-FPM (clears the cache so your changes go live immediately).

### First run
1. Make sure your latest code is **pushed to git** first (see *Pushing your changes* below).
2. Double-click **`push_code_to_server.bat`**.
3. The **first time only**, Windows may show a **UAC prompt** to install PuTTY — click **Yes**.
4. Wait for `== DONE ==` and "Deploy finished successfully."

That's it. Every future deploy is just a double-click.

> If the install step fails, right-click the `.bat` → **Run as administrator** once.

### What "live immediately" means
The server has OPcache with `validate_timestamps = Off`, so PHP does **not** auto-detect file changes. The script's PHP-FPM reload is what makes edits take effect. (You can also click **♻ Reload backend** inside the file manager for quick edits.)

---

## 2. Pushing your changes (before deploying backend)

The deploy script pulls from git, so commit and push your local changes first:

```bash
git add -A
git commit -m "Describe your change"
git push
```

Then run `push_code_to_server.bat` to pull them onto the server.

> If you edit files **directly on the server** (via the file manager), you don't need git — just click **♻ Reload backend** in the file manager.

---

## 3. Frontend — build and upload

The React site must be built into static files, then uploaded to wherever the site is served.

### Build
```bash
npm install      # only needed the first time, or after dependency changes
npm run build
```
This creates a **`dist/`** folder.

### Upload
Upload the **contents of `dist/`** to the web root of the site host (the folder your domain serves). Use the file manager, FTP, or `scp`.

### API URL
The frontend talks to `https://backend.flowentra.io/api` by default. To override, create a file named **`.env.production`** in the project root before building:
```
VITE_API_BASE_URL=https://backend.flowentra.io/api
```

---

## 4. Manual deploy (if the script ever fails)

You can always do the backend steps by hand:

```bash
ssh flowentra_landing@vps-cf5a8c99.vps.ovh.net
# password: Zaleyo2026

cd /home/flowentra_landing/flowentra_landingpage
git pull
sudo systemctl reload php8.4-fpm
exit
```

---

## 5. Quick checks after deploy

```bash
# API returns JSON?
curl -s "https://backend.flowentra.io/api/content.php?action=sections" | head -c 200

# mailbox connects?
curl -s "https://backend.flowentra.io/api/imap.php?action=test&mailbox=contact"
```

---

## 6. Troubleshooting

| Problem | Fix |
|---|---|
| "plink not found" / install failed | Run the `.bat` as **Administrator**, or run `winget install PuTTY.PuTTY` manually |
| Stuck on host key prompt | The script auto-accepts it; if it hangs, run `plink -ssh flowentra_landing@vps-cf5a8c99.vps.ovh.net`, type `y`, exit, then re-run |
| `git pull` asks for a login | Set up git credentials/deploy key on the server (ask Claude to help) |
| Wrong server address | If you connect by **IP**, edit the `HOST=` line at the top of the `.bat` |
| Changes not visible after deploy | Make sure you **pushed** first; the reload clears OPcache — hard-refresh the browser |
| Mailbox: "imap extension not enabled" | `sudo apt install -y php8.4-imap && sudo systemctl restart php8.4-fpm` |

---

## 7. ⚠️ Security note

`push_code_to_server.bat` contains the **server password in plain text** and is **committed to git**. Anyone with access to this repo or your PC can read it.

Safer alternative (recommended later): **SSH keys** — no password stored anywhere, still one-click. Ask Claude to set this up; then you can delete the password from the script.

---

## Server reference

| Item | Value |
|---|---|
| SSH host | `flowentra_landing@vps-cf5a8c99.vps.ovh.net` |
| Project path | `/home/flowentra_landing/flowentra_landingpage` |
| Backend URL | `https://backend.flowentra.io` |
| API base | `https://backend.flowentra.io/api` |
| PHP service | `php8.4-fpm` |
| File manager | `https://backend.flowentra.io/api/filemanager.php` |
