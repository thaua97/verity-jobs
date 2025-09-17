# 4. Estratégia de Testes Unitários sem JIT (Jest + Angular)

- Status: Accepted

## Contexto

O projeto `verity-jobs` utiliza Angular, Angular Material, NgRx e Transloco. Em ambientes de teste com Jest, importar componentes Angular diretamente com TestBed/fixture pode acionar compilação JIT e bootstrap parcial do framework, causando erros como:

- "The injectable '_PlatformLocation' needs to be compiled using the JIT compiler"
- Dependências do Angular Material exigindo providers/bootstrapping que não estão presentes no ambiente de teste

Objetivos dos testes:

- Validar lógica de negócio de componentes e features rapidamente, sem custo de bootstrap Angular
- Testar `reducers`, `selectors` e `effects` do NgRx com previsibilidade
- Evitar flakiness e fortes acoplamentos de testes a detalhes de implementação de UI

## Decisão

Adotar uma abordagem de testes unitários focada em lógica pura (sem JIT) com Jest, seguindo as diretrizes:

- Extrair métodos de validação, formatação e processamento de dados de componentes para classes/funções utilitárias testáveis (puras)
- Testar lógica de containers e coordenação via funções/classes auxiliares, evitando `TestBed` e `ComponentFixture` quando possível
- Testar `reducers` e `selectors` como funções puras e `effects` com marbles ou mocks de streams
- Evitar importar Angular Material, Forms, Router e outros módulos nos testes unitários — preferir mocks e simulações
- Deixar testes de integração/E2E para cobrir interação real com o DOM e bibliotecas de UI

Esta decisão está alinhada com a prática já aplicada no projeto para listas e formulários, onde a lógica foi isolada e testada com sucesso sem JIT.

## Consequências

- **Benefícios**
  - Execução extremamente rápida (sem bootstrap Angular)
  - Testes estáveis e previsíveis, focados na regra de negócio
  - Menor manutenção ao evoluir UI/Angular/Material, pois os testes não acoplam detalhes de templates
  - Cobertura efetiva do domínio (validadores, formatadores, processamento, ações simuladas)

- **Custos/Trade-offs**
  - Exige disciplina para extrair lógica do componente (evitar regras dentro de templates)
  - Menor cobertura de integração de UI no nível unitário (compensado por E2E)
  - Necessidade de mocks para partes do framework quando imprescindíveis

## Alternativas Consideradas

- Testes com TestBed/ComponentFixture (JIT/compilação de componentes)
  - Prós: mais próximo do runtime Angular
  - Contras: lento, frágil com Angular Material/Forms/Router; erros de JIT; maior esforço de configuração

- Testes híbridos: parte com TestBed e parte pura
  - Prós: flexibilidade
  - Contras: mantém complexidade e flakiness em casos com Material/Transloco

- Apenas E2E para tudo
  - Prós: fidelidade máxima ao runtime real
  - Contras: mais lento, menos granular, difícil isolar regressões

## Padrões e Diretrizes de Implementação

- **Isolar lógica de negócio**
  - Mover validadores, formatadores e processamento para classes/funções utilitárias
  - Ex.: `ComponentTestUtils` com métodos estáticos usados nos testes

- **Testes de Store (NgRx)**
  - Reducers: testar como funções puras (estado inicial, transições)
  - Selectors: validar projeções e memoization com estados de exemplo
  - Effects: usar marbles ou mocks de streams para ações de input/output; importar os effects diretamente, sem barrel
  - Store root: inicializar via `provideStore()` sem reducers no root (evita conflitos de injeção)

- **Componentes com Angular Material**
  - Não importar módulos Material em unit tests
  - Testar lógica disparada por eventos (ex.: paginação) simulando chamadas de métodos públicos, não o DOM do paginator
  - Caso precise de labels/intl (Transloco + Material), testar as funções de mapeamento isoladas

- **Transloco (i18n)**
  - Em unit tests, evitar dependências reais de tradução; quando necessário, mockar `TranslocoService` ou testar funções puras que recebem strings já traduzidas

- **Estrutura de testes**
  - Organizar por domínio/funcionalidade, com describes aninhados para casos de sucesso/erro
  - Comentários claros (pt-BR) e nomes de testes objetivos

## Exemplos Aplicados no Projeto

- `ResumeList` (lista de candidatos):
  - Testes para filtros, ordenação, remoção de itens e ações de deleção simuladas, sem importar Angular Material
- Steps do formulário (identificação, localização, ocupação):
  - Validadores e formatadores (telefone, CPF, CEP), processamento de skills e mensagens de erro específicos
- Shell de formulário:
  - Navegação entre steps, coleta/validação de dados e coordenação de ações

## Notas

- Este padrão entregou +100 testes rodando em ~1s, com 100% de sucesso, sem erros de JIT
- Para cobertura de UI/integração, complementar com E2E (Cypress/Playwright)
