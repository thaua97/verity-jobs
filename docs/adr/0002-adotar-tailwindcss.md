# 2. Adotar TailwindCSS

- Status: Accepted

## Contexto

O projeto `verity-jobs` utiliza Angular e Angular Material para construir telas e componentes. Apesar do Material fornecer componentes acessíveis e consistentes, a camada de layout/spacing/responsividade e a criação de variações visuais ainda exigem CSS manual (SCSS) ou utilitários próprios.

Requisitos identificados:

- Ajustes rápidos de layout, spacing e responsividade por feature sem proliferar classes CSS globais.
- Consistência visual (escala de cores, tipografia, espaçamento) e facilidade de refino fino em prototipação.
- Evitar CSS morto ou difícil de manter ao longo do tempo.
- Integração simples com Angular standalone e build atual.

## Decisão

Adotar TailwindCSS como framework utility-first para a camada de estilo base, privilegiando utilitários de layout, spacing, tipografia e responsividade, mantendo Angular Material como kit de componentes.

Diretrizes:

- Utilizar utilitários Tailwind para layout (Flex/Grid), espaçamentos, cores, tipografia e estados (hover/focus) diretamente nos templates.
- Centralizar tokens de design (cores, spacing, fonte) no `tailwind.config` e evitar CSS custom desnecessário.
- Manter SCSS/CSS global mínimo (apenas resets e integrações pontuais). 
- Aplicar classes utilitárias no nível de feature (`src/app/features/*`) para manter o estilo próximo ao uso.

## Consequências

- Benefícios
  - Velocidade de desenvolvimento para ajustes visuais e responsividade.
  - Redução de CSS global e risco de regressões por cascata.
  - Padronização via tokens do Tailwind e maior consistência de espaçamentos.
  - Fácil refatoração visual sem tocar em folhas de estilo complexas.

- Custos/Trade-offs
  - Aumento de classes utilitárias no HTML (aprendizado de convenções Tailwind).
  - Possível conflito pontual com estilos default do Angular Material, mitigado com prefixos/utilitários específicos.
  - Necessidade de pipeline de build com purge/treeshake para manter bundle enxuto (já suportado).

## Alternativas Consideradas

- SCSS modular + BEM
  - Prós: controle total, sem dependência externa.
  - Contras: mais boilerplate e risco de CSS não utilizado; menor velocidade de iteração.

- Somente Angular Material (theming + density)
  - Prós: menos ferramentas, coesão no ecossistema Angular.
  - Contras: limitado para layout/spacing fino e responsividade granular; demanda CSS adicional.

- CSS-in-JS (ex.: styled-components via wrappers)
  - Prós: colocalização de estilos e componentes.
  - Contras: não nativo em Angular; aumenta complexidade e peso.

## Notas de Implementação

- Garantir configuração do Tailwind no build do Angular (postcss + `tailwind.config.js`).
- Habilitar purge/`content` apontando para `src/**/*.{html,ts}` para tree-shaking de classes.
- Documentar convenções de uso (padrões de spacing, breakpoints, cores) no `README.md`.
