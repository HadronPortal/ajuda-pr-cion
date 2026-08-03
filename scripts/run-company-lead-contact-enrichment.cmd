@echo off
cd /d "%~dp0\.."
if not exist ".cache\cnpj" mkdir ".cache\cnpj"
npm run enrich:company-lead-contacts >> ".cache\cnpj\contact-enrichment.log" 2>&1
