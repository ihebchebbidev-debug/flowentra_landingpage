# Flowentra VPS Deployment Guide

This document describes a complete setup for deploying the Flowentra backend project on a fresh VPS. It covers:

- creating a dedicated system user
- cloning the repo
- installing PHP, MySQL, and Nginx
- configuring the PHP backend
- serving the PHP API endpoints
- setting up SQL management tools
- linking to `backend.flowentra.io`
- enabling HTTPS

> NOTE: If you only need to host the PHP APIs and SQL, skip the frontend build steps. The critical parts are: PHP backend configuration, MySQL setup, Nginx API routing, and API endpoint access.
>
> Remove or replace placeholder values like `<your-repo-url.git>`, `StrongPasswordHere!`, and `backend.flowentra.io` before you run any commands.

---

## 1. Create the dedicated system user

Connect to your VPS as `root` and run:

```bash
adduser flowentra_landing
usermod -aG sudo flowentra_landing
```

Then switch into the new user:

```bash
su - flowentra_landing
```

---

## 2. Install core software

Install required packages:

```bash
apt update
apt install -y git curl ca-certificates nginx php-fpm php-mysql php-xml php-curl php-mbstring php-zip unzip mysql-server
```

Install Node.js 20 for the frontend build:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

---

## 3. Clone the landing page repository

From the new user account:

```bash
cd /home/flowentra_landing
git clone <your-repo-url.git> flowentra_landingpage
cd flowentra_landingpage
npm install
```

If you use SSH keys, make sure the key is installed in the VPS user’s `~/.ssh` folder.

---

## 4. Set up MySQL

Secure the database server:

```bash
mysql_secure_installation
```

Create the application database and user:

```bash
mysql -u root -p
```

Inside MySQL:

```sql
CREATE DATABASE flowentra_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'flowentra'@'localhost' IDENTIFIED BY 'StrongPasswordHere!';
GRANT ALL PRIVILEGES ON flowentra_db.* TO 'flowentra'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 5. Configure the PHP backend

Edit the backend config file at `src/backend/config.php` and update the database connection:

```php
class Database {
    private $host = "localhost";
    private $username = "flowentra";
    private $password = "StrongPasswordHere!";
    private $database = "flowentra_db";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->database,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Connection error: ' . $e->getMessage()
            ]);
            exit;
        }
        return $this->conn;
    }
}
```

If you plan to use a separate MySQL host, replace `localhost` accordingly.

---

## 6. Build the frontend

Run the frontend build from the project root:

```bash
cd /home/flowentra_landing/flowentra_landingpage
npm run build
```

If you use environment variables for the API base URL, create a `.env` file in the project root:

```bash
cat > /home/flowentra_landing/flowentra_landingpage/.env <<'EOF'
VITE_API_BASE_URL=http://backend.flowentra.io/api
EOF
```

Then rebuild:

```bash
npm run build
```

---

## 7. Configure Nginx for static assets + PHP API

Create an Nginx site config at `/etc/nginx/sites-available/flowentra_landingpage` with:

```nginx
server {
    listen 80;
    server_name backend.flowentra.io;

    root /home/flowentra_landing/flowentra_landingpage/dist;
    index index.html;

    location /api/ {
        alias /home/flowentra_landing/flowentra_landingpage/src/backend/api/;
        try_files $uri $uri/ =404;

        location ~ \.php$ {
            fastcgi_pass unix:/run/php/php8.2-fpm.sock;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $request_filename;
            include fastcgi_params;
        }
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Then enable and reload Nginx:

```bash
ln -s /etc/nginx/sites-available/flowentra_landingpage /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

If your PHP-FPM socket is different, update `fastcgi_pass` accordingly.

---

## 8. Verify API gateway paths

The application expects backend endpoints under `/api`. Confirm the following are reachable from the browser or curl:

- `http://backend.flowentra.io/api/content.php?action=sections`
- `http://backend.flowentra.io/api/screenshots.php?action=list`
- `http://backend.flowentra.io/api/errors.php?action=report`

If the API returns JSON and no 404, the route is correct.

---

## 9. Add SQL manager

### Option 1: phpMyAdmin

Install phpMyAdmin:

```bash
apt install -y phpmyadmin
```

Add an Nginx alias in your server block:

```nginx
location /phpmyadmin/ {
    root /usr/share/;
    index index.php index.html index.htm;
    location ~ ^/phpmyadmin/(.+\.php)$ {
        try_files $uri =404;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    location ~* ^/phpmyadmin/(.+\.(jpg|jpeg|gif|css|png|js|map))$ {
        root /usr/share/;
    }
}
```

Then reload nginx.

### Option 2: Adminer

Download Adminer to your project:

```bash
mkdir -p /home/flowentra_landing/flowentra_landingpage/adminer
cd /home/flowentra_landing/flowentra_landingpage/adminer
curl -O https://www.adminer.org/latest.php
```

Then access it at `http://backend.flowentra.io/adminer/latest.php`.

---

## 10. Add a file manager

### Option 1: File Browser (recommended)

Install and run File Browser:

```bash
curl -fsSL https://filebrowser.xyz/get.sh | bash
mkdir -p /home/flowentra_landing/filebrowser
filebrowser -r /home/flowentra_landing/filebrowser &
```

Set up an Nginx proxy if you want browser access:

```nginx
location /filebrowser/ {
    proxy_pass http://127.0.0.1:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Option 2: PHP file manager

If you prefer a PHP file manager like `elfinder`, deploy it inside the project and expose it under `/filemanager/`.

---

## 11. Link `backend.flowentra.io`

In your DNS provider, create an `A` record:

- Host: `backend.flowentra.io`
- Type: `A`
- Value: `<your VPS public IP>`
- TTL: automatic or 300

Wait for DNS propagation and confirm:

```bash
ping backend.flowentra.io
```

Then ensure Nginx is configured with `server_name backend.flowentra.io`.

---

## 12. Enable HTTPS with Certbot

Install Certbot and obtain certificates:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d backend.flowentra.io
```

Follow prompts and allow Certbot to update Nginx.

Then verify with:

```bash
curl -I https://backend.flowentra.io
```

---

## 13. Final checklist

- [ ] `flowentra_landing` user exists
- [ ] repo cloned to `/home/flowentra_landing/flowentra_landingpage`
- [ ] `npm install` and `npm run build` completed successfully
- [ ] MySQL database and user created
- [ ] `src/backend/config.php` updated with local DB values
- [ ] Nginx site enabled and reloaded
- [ ] API endpoints are reachable under `/api`
- [ ] SQL manager available via `/phpmyadmin` or `/adminer`
- [ ] File manager available and proxy configured
- [ ] DNS record for `backend.flowentra.io` points to the VPS
- [ ] HTTPS enabled via Certbot

---

## 14. Troubleshooting

### Nginx errors

Run:

```bash
nginx -t
```

If there are errors, check `/var/log/nginx/error.log`.

### PHP issues

Check PHP-FPM status:

```bash
systemctl status php8.2-fpm
```

Review `/var/log/php8.2-fpm.log` if the socket or service fails.

### MySQL issues

Check the server:

```bash
systemctl status mysql
```

And connect manually:

```bash
mysql -u flowentra -p flowentra_db
```

---

## 15. Notes

- The landing page frontend is served from `dist`.
- The backend API is served from `src/backend/api`.
- If you need a separate FTP service, install and configure `vsftpd`.
- Keep credentials and secrets secure; do not commit them to Git.
