---
trigger: always_on
---

📂 Estrutura sugerida do projeto

´´´
src/
 ┣ app/
 ┃ ┣ core/                 # Serviços globais, interceptors, guardas
 ┃ ┃ ┣ interceptors/
 ┃ ┃ ┣ guards/
 ┃ ┃ ┣ services/
 ┃ ┃ ┗ core.module.ts      # Importado 1x no App
 ┃ ┣ shared/               # Componentes, pipes e diretivas reutilizáveis
 ┃ ┃ ┣ components/
 ┃ ┃ ┣ pipes/
 ┃ ┃ ┗ directives/
 ┃ ┣ features/             # Funcionalidades organizadas por domínio
 ┃ ┃ ┣ auth/
 ┃ ┃ ┃ ┣ pages/
 ┃ ┃ ┃ ┣ components/
 ┃ ┃ ┃ ┣ services/
 ┃ ┃ ┃ ┗ store/            # NgRx da feature
 ┃ ┃ ┣ dashboard/
 ┃ ┃ ┣ users/
 ┃ ┃ ┗ ...
 ┃ ┣ store/                # Estado global (NgRx root)
 ┃ ┃ ┣ reducers/
 ┃ ┃ ┣ actions/
 ┃ ┃ ┣ effects/
 ┃ ┃ ┗ selectors/
 ┃ ┣ mocks/                # Mock server para desenvolvimento
 ┃ ┃ ┣ db.json             # Dados fake (JSON Server ou MSW)
 ┃ ┃ ┗ mock-api.service.ts # Opcional: HttpInterceptor customizado
 ┃ ┣ app.routes.ts         # Rotas standalone
 ┃ ┗ app.component.ts
 ┣ assets/
 ┣ environments/           # Variáveis (dev, prod, staging, mock)
 ┃ ┣ environment.ts
 ┃ ┣ environment.development.ts
 ┃ ┣ environment.mock.ts
 ┣ main.ts
 ┗ styles.scss
´´´
⚡ Detalhes importantes
🔹 1. Core Module

Serviços globais (AuthService, HttpInterceptor, ErrorHandler).

Nunca declare componentes aqui.

Importado apenas no App.

🔹 2. Shared Module

Componentes, pipes e diretivas genéricas e reutilizáveis.

Exemplo: ButtonComponent, DatePipeCustom.

🔹 3. Features (Lazy + Standalone)

Cada funcionalidade (auth, users, dashboard) é um módulo isolado com suas próprias rotas e NgRx Store local (reducers, actions, effects, selectors).

Usa lazy loading com loadComponent ou loadChildren.

🔹 4. NgRx

Store global em app/store → controla estados compartilhados (ex: auth, layout, settings).

Store por feature → controla apenas o estado daquela área.

Estrutura recomendada:

store/
 ┣ actions/
 ┃ ┗ app.actions.ts
 ┣ reducers/
 ┃ ┗ app.reducer.ts
 ┣ effects/
 ┃ ┗ app.effects.ts
 ┗ selectors/
    ┗ app.selectors.ts


Boa prática: usar @ngrx/entity para listas e @ngrx/effects para requisições assíncronas.

🔹 5. Mock Server

Duas opções comuns:

JSON Server: roda em paralelo com Angular.

npm install json-server --save-dev
npx json-server --watch src/app/mocks/db.json --port 3001


Configure environment.mock.ts para apontar para http://localhost:3001.

HttpInterceptor customizado: intercepta requests e devolve mocks locais.

Útil para prototipagem rápida sem rodar servidor externo.

MSW (Mock Service Worker): mais moderno, intercepta requests via Service Worker no browser.

🔹 6. Testes

Unit tests (Karma + Jasmine) → padrões já configurados no Angular CLI.

Estrutura:

auth/
 ┣ pages/
 ┃ ┗ login.component.spec.ts
 ┣ services/
 ┃ ┗ auth.service.spec.ts


Testes de store → sempre testar reducers, selectors e effects.

Pode incluir Cypress ou Playwright para e2e.

🔹 7. Environments

environment.ts → base.

environment.development.ts → dev real.

environment.mock.ts → mock server.

environment.production.ts → prod.

Exemplo:

export const environment = {
  apiUrl: 'http://localhost:3001',
  useMock: true,
};


✅ Com essa estrutura você garante:

Escalabilidade (features modulares + lazy loading).

Testabilidade (mocks + separação clara).

Manutenibilidade (NgRx bem dividido).

Flexibilidade (mock server ou interceptor).