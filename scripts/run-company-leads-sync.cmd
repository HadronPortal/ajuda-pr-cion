@echo off
cd /d "%~dp0\.."
if not exist ".cache\cnpj" mkdir ".cache\cnpj"
npm run sync:company-leads >> ".cache\cnpj\monthly-sync.log" 2>&1
