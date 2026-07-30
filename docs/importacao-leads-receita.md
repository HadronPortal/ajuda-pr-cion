# Importação de leads da Receita Federal

O importador lê os arquivos mensais de Dados Abertos do CNPJ e grava somente
estabelecimentos ativos nos municípios em um raio de 80 km de São Carlos/SP.
Clientes já cadastrados no CRM são ignorados pelo CNPJ.

## Arquivos necessários

Baixe da mesma competência os ZIPs de:

- `Estabelecimentos`
- `Empresas`
- `Municipios`
- `Cnaes`
- `Naturezas` (recomendado)
- `Simples` (recomendado)

Não extraia os ZIPs. Coloque todos em uma pasta local.

## Execução

Defina `DATABASE_URL` no ambiente sem registrar a credencial no repositório:

```powershell
$env:CNPJ_SOURCE_DIR="C:\Dados\CNPJ\2026-07"
npm run import:company-leads
```

Para validar os arquivos e contar os registros sem gravar:

```powershell
npm run import:company-leads -- --dry-run
```

Quando o repositório oficial oferecer novamente listagem direta de arquivos,
também é possível usar `CNPJ_BASE_URL` e `CNPJ_COMPETENCE`. Os downloads ficam
em `.cache/cnpj` e são reaproveitados nas execuções seguintes.

## Regras

- somente situação cadastral `02` (ativa);
- somente os 48 municípios configurados em `scripts/company-leads-cities.mjs`;
- junção pelo CNPJ básico entre Estabelecimentos, Empresas e Simples;
- upsert idempotente pelo CNPJ completo;
- clientes já existentes em `client_companies` não são importados como leads;
- a origem e a competência são preservadas no registro.
