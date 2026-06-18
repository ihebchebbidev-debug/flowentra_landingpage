@echo off
title Flowentra - Deploy backend to VPS

REM ============================================================
REM  ONE-CLICK DEPLOY
REM    1) Auto-installs PuTTY/plink if it is missing (via winget)
REM    2) Caches the server host key automatically (first run)
REM    3) SSH into the VPS, git pull, reload PHP-FPM
REM
REM  WARNING: this file contains a plaintext server password.
REM  Anyone who can read this file can access the server.
REM ============================================================

set "HOST=flowentra_landing@vps-cf5a8c99.vps.ovh.net"
set "PASS=Zaleyo2026"
set "DIR=/home/flowentra_landing/flowentra_landingpage"
set "PLINK="

echo(
echo  ===============================
echo   Flowentra - deploy to VPS
echo  ===============================
echo(

REM --- 1) Locate plink, install PuTTY via winget if missing ---
where plink >nul 2>&1 && set "PLINK=plink"

if not defined PLINK (
  echo  plink not found - installing PuTTY via winget ...
  winget install --id PuTTY.PuTTY -e --silent --accept-package-agreements --accept-source-agreements
  if exist "C:\Program Files\PuTTY\plink.exe" set "PLINK=C:\Program Files\PuTTY\plink.exe"
  if exist "C:\Program Files (x86)\PuTTY\plink.exe" set "PLINK=C:\Program Files (x86)\PuTTY\plink.exe"
)

if not defined PLINK (
  where plink >nul 2>&1 && set "PLINK=plink"
)

if not defined PLINK (
  echo(
  echo  ERROR: could not find or install plink.
  echo  Try running this script as Administrator, or install manually:
  echo      winget install PuTTY.PuTTY
  echo(
  pause
  exit /b 1
)

REM --- 2) Cache the server host key automatically (answers first-time y/n) ---
echo y | "%PLINK%" -ssh -pw %PASS% %HOST% "exit" >nul 2>&1

REM --- 3) Deploy: git pull + reload PHP-FPM ---
echo  Connecting to %HOST%
echo  Project: %DIR%
echo(

"%PLINK%" -ssh -batch -pw %PASS% %HOST% "cd %DIR% && echo '== git pull ==' && git pull && echo '== reload php-fpm ==' && echo %PASS% | sudo -S systemctl reload php8.4-fpm && echo '== DONE =='"

set "EXITCODE=%ERRORLEVEL%"
echo(
if "%EXITCODE%"=="0" (
  echo  Deploy finished successfully.
) else (
  echo  Something went wrong ^(exit code %EXITCODE%^). See messages above.
  echo  Common fixes:
  echo   - git asked for login: set up git credentials on the server.
  echo   - wrong host: if you connect by IP, change HOST at the top of this file.
)
echo(
echo  Press any key to close.
pause >nul
