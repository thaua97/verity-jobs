# 1. Adotar NgRx para Gerenciamento de Estado

- Status: Accepted

## Contexto

O projeto `verity-jobs` é uma aplicação web em Angular com foco em cadastro e gestão de candidatos (currículos). A stack principal inclui:

- Angular (standalone components, Angular Material, SSR não previsto no momento)
- NgRx (Store, Effects, Entity) para gerenciamento de estado
- Transloco para i18n com troca de idioma em tempo de execução e arquivos em `public/i18n/`
- Arquitetura modular por feature (`src/app/features/*`) e estado global em `src/app/store/`
- Integrações assíncronas para paginação, busca e remoção de candidatos

Desafios identificados:

- Necessidade de sincronizar estados entre páginas/rotas (lista de candidatos, formulário, visualização de currículo)
- Padronizar efeitos colaterais (requisições HTTP, paginação) e lidar com erros
- Testabilidade e previsibilidade do fluxo de dados
- Escalabilidade do estado por domínio/feature

## Decisão

Adotar NgRx como biblioteca de gerenciamento de estado global e por feature, seguindo as práticas:

- Inicializar a Store global com `provideStore()` sem reducers explícitos no root, permitindo adição incremental de features
- Registrar reducers por feature via `provideState(featureKey, reducer)`
- Registrar efeitos por feature via `provideEffects([FeatureEffects])`
- Utilizar `@ngrx/entity` para coleções (ex.: lista de currículos), simplificando operações de CRUD e paginação
- Centralizar efeitos colaterais (chamadas HTTP, paginação, deleção) em `Effects`, mantendo `Components` enxutos
- Isolar `selectors` por domínio para reuso e melhor composição
- Evitar barrel exports para efeitos ao registrá-los (importar diretamente do arquivo fonte)

Observações de implementação já adotadas:

- `app.config.ts` define `provideStore()`, `provideState(RESUME_FEATURE_KEY, resumeReducer)` e `provideEffects([ResumeEffects, ...])`
- As features são organizadas por domínio (`src/app/features/resume/...`) com seus próprios `actions`, `reducers`, `selectors` e `effects`

## Consequências

- Benefícios
  - Previsibilidade do estado e time-travel debugging (Redux DevTools)
  - Fluxos assíncronos padronizados em `Effects`
  - Maior testabilidade de `reducers`, `selectors` e `effects`
  - Escalabilidade: fácil adicionar novas features com `provideState` e `provideEffects`
  - Padronização para toda a equipe

- Custos/Trade-offs
  - Curva de aprendizado para novos membros
  - Boilerplate adicional (actions, reducers, selectors, effects)
  - Overhead desnecessário para estados puramente locais/efêmeros (neste caso, preferir signals/services locais)

## Alternativas Consideradas

- Signals + Services locais
  - Prós: menos boilerplate, curva de aprendizado menor
  - Contras: menor padronização para efeitos colaterais complexos; escalabilidade e depuração mais difíceis em estados compartilhados

- Component Store (@ngrx/component-store)
  - Prós: ótima para estados locais complexos de componentes/pequenas features; integra bem com NgRx
  - Contras: não substitui a Store global quando há estados amplamente compartilhados entre rotas

- NGXS / Akita
  - Prós: APIs mais sucintas e menor boilerplate em alguns cenários
  - Contras: menor adoção e ecossistema comparado ao NgRx; integração e guias oficiais do Angular favorecem NgRx

- Serviços com Subjects/BehaviorSubjects (padrão RxJS puro)
  - Prós: flexível e simples para cenários pequenos
  - Contras: tendência a soluções ad-hoc, dificuldade de padronização e testabilidade em larga escala

## Anexos e Notas

- Padrões internos adotados:
  - Store global em `app.config.ts` com `provideStore()` sem reducers root
  - Registro de features com `provideState` e `provideEffects`
  - Uso de `@ngrx/entity` para coleções
  - Selectors exportados por arquivo de domínio (sem barrel de effects)

- Estrutura do projeto recomendada (resumo): ver `/.windsurf/rules/structure.md` e diretório `src/app/features/*`.
