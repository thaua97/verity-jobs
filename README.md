# VerityJobs
[Disponivel para teste](https://verity-jobs.vercel.app/)

Aplicação web para cadastro e gestão de candidatos (currículos). O objetivo é oferecer uma experiência moderna para inserir, listar, paginar e visualizar candidatos, com suporte a internacionalização (i18n) e arquitetura escalável por features.

## Badges

![Angular](https://img.shields.io/badge/Angular-20-red)
![NgRx](https://img.shields.io/badge/NgRx-Store%2FEffects-purple)
![Transloco](https://img.shields.io/badge/i18n-Transloco-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38BDF8)
![Jest](https://img.shields.io/badge/Tests-Jest-green)

## Stack

- Angular 20 (standalone components)
- Angular Material (kit de componentes)
- NgRx (Store, Effects, Entity) para gerenciamento de estado
- Transloco para i18n (arquivos em `public/i18n/`)
- TailwindCSS para layout/spacing/responsividade
- Jest para testes unitários (sem JIT)
- JSON Server para mocks locais (opcional)

## Estrutura do Projeto

```
src/
 ┣ app/
 ┃ ┣ core/                 # Serviços globais, interceptors, guardas
 ┃ ┣ shared/               # Componentes/pipes/diretivas reutilizáveis
 ┃ ┣ features/             # Funcionalidades organizadas por domínio
 ┃ ┃ ┣ resume/             # Ex.: listagem/paginação de candidatos
 ┃ ┣ store/                # Estado global (se aplicável)
 ┃ ┣ mocks/                # Mock server (JSON Server)
 ┃ ┣ app.routes.ts
 ┃ ┗ app.component.ts
 ┣ public/
 ┃ ┗ i18n/                 # pt-br.json, en-us.json, es-es.json
 ┣ environments/
 ┣ main.ts
 ┗ styles.scss | styles.css
```

Para detalhes arquiteturais e decisões, veja os ADRs em `docs/adr/`:

- [0001-adotar-ngrx-para-gerenciamento-de-estado.md](https://github.com/thaua97/verity-jobs/blob/feature/forms/docs/adr/0001-adotar-ngrx-para-gerenciamento-de-estado.md)
- [0002-adotar-tailwindcss.md](https://github.com/thaua97/verity-jobs/blob/feature/forms/docs/adr/0002-adotar-tailwindcss.md)
- [0003-combinar-tailwindcss-com-angular-material.md](https://github.com/thaua97/verity-jobs/blob/feature/forms/docs/adr/0003-combinar-tailwindcss-com-angular-material.md)
- [0004-estrategia-testes-unitarios-sem-jit.md](https://github.com/thaua97/verity-jobs/blob/feature/forms/docs/adr/0004-estrategia-testes-unitarios-sem-jit.md)

## Pré-requisitos

- Node.js 18+ e npm 9+
- Angular CLI (opcional, recomendado):
  ```bash
  npm i -g @angular/cli
  ```

## Instalação

```bash
git clone <repo-url>
cd verity-jobs
npm install
```

## Como Rodar

- Desenvolvimento (porta 4200):
  ```bash
  npm start
  # ou
  ng serve
  ```
  Acesse: http://localhost:4200

- Mock API (opcional – JSON Server na porta 3001):
  ```bash
  npm run mock
  ```
  Arquivo de dados: `src/app/mocks/db.json`

### i18n (Transloco)

- Idiomas disponíveis: `pt-br`, `en-us`, `es-es`
- Arquivos de tradução: `public/i18n/{lang}.json`
- A troca de idioma é dinâmica via `TranslocoService` (ver `src/app/shared/ui/header/`).

## Build

```bash
npm run build
# artefatos em dist/ (config padrão Angular)
```

## Testes

O projeto oferece duas estratégias:

- Karma (padrão Angular CLI):
  ```bash
  npm test
  ```

- Jest (sem JIT, recomendado para unidade de lógica):
  ```bash
  npm run test:jest
  # modo watch
  npm run test:jest:watch
  ```

Diretrizes de testes e racional técnico estão em `docs/adr/0004-estrategia-testes-unitarios-sem-jit.md`.

## Boas Práticas de Contribuição

- Abra uma issue descrevendo claramente o problema/feature.
- Crie branches com prefixos semânticos (ex.: `feat/`, `fix/`, `docs/`).
- Siga o padrão arquitetural por features e mantenha a lógica de UI enxuta.
- Para estado global/feature, prefira NgRx (`actions`, `reducers`, `effects`, `selectors`).
- Testes unitários: foque na lógica de negócio (sem JIT) e mantenha testes rápidos.
- Atualize traduções (`public/i18n/`) quando adicionar textos na UI.
- Se alterar decisões arquiteturais, proponha/atualize um ADR em `docs/adr/`.

## Licença

Este projeto é distribuído sob a licença MIT. Consulte o arquivo `LICENSE` (se aplicável) para mais detalhes.
