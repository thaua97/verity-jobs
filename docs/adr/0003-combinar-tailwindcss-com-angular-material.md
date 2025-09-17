# 3. Combinar TailwindCSS com Angular Material

- Status: Accepted

## Contexto

O projeto `verity-jobs` utiliza Angular Material como biblioteca de componentes (acessibilidade, padrões de UI, consistência) e TailwindCSS como utilitário de layout e estilização. Na prática, precisamos:

- Controlar layout, espaçamento, tipografia e responsividade diretamente nos templates.
- Manter os componentes Material (ex.: `mat-paginator`, `mat-list`, `mat-button`) com tema consistente.
- Evitar CSS global excessivo e reduzir o acoplamento entre features.
- Prototipar rapidamente variações visuais sem criar múltiplas classes customizadas.

Desafio: Combinar utilitários Tailwind com o sistema de theming do Angular Material sem conflitos e com boa DX.

## Decisão

Utilizar TailwindCSS para layout/spacing/tipografia/responsividade e Angular Material para componentes e padrões de UI, seguindo as diretrizes:

- Aplicar classes utilitárias Tailwind nos templates para layout e espaçamentos em torno dos componentes Material (ex.: containers, grids, gaps, alinhamentos).
- Manter o theming do Angular Material via SCSS/`custom-theme.scss` (tokens de cor, densidade, tipografia) e não sobrescrever estilos internos do Material com Tailwind.
- Utilizar utilitários Tailwind para pequenas customizações visuais (bordas, radius, sombras) nos wrappers dos componentes Material, evitando modificar diretamente seletores do Material.
- Centralizar ajustes globais de Material (tema, densidade) em um único arquivo (ex.: `src/custom-theme.scss`) e manter os ajustes específicos por feature via classes Tailwind no HTML.

## Consequências

- Benefícios
  - Layout e responsividade mais rápidos, com menos CSS custom.
  - Componentes Material permanecem estáveis e temáveis via API oficial (SCSS).
  - Maior consistência visual por tokens globais do Material combinados com a escala de spacing do Tailwind.
  - Redução de regressões ao evitar CSS global agressivo.

- Custos/Trade-offs
  - Conhecimento da interseção entre Tailwind e Material (quando usar cada um).
  - Possíveis conflitos de especificidade se tentar sobrescrever diretamente estilos internos do Material com classes utilitárias — mitigado ao estilizar wrappers.
  - Necessidade de alinhar tokens (cores, tipografia) entre `custom-theme.scss` e `tailwind.config`.

## Alternativas Consideradas

- Somente Angular Material (theming + density)
  - Prós: simplicidade, uma única fonte de verdade para estilos.
  - Contras: menor ergonomia para layout/spacing granular; demanda CSS adicional para prototipação rápida.

- Somente Tailwind + bibliotecas de componentes 3rd party (sem Material)
  - Prós: liberdade total de design.
  - Contras: perde acessibilidade e maturidade dos componentes Material; maior esforço para manter consistência.

- CSS/SCSS tradicional com BEM
  - Prós: controle total; previsível em especificidade.
  - Contras: maior boilerplate, menor velocidade de iteração, risco de CSS morto.

## Boas Práticas de Implementação

- Envolver componentes Material em containers com Tailwind para layout e espaçamentos. Ex.:
  - `div` com `flex`, `grid`, `gap-*`, `p-*`, `w-*`, `max-w-*` etc., envolvendo `mat-list`, `mat-paginator`, `mat-form-field`.
- Manter o tema do Material centralizado (ex.: `src/custom-theme.scss`) e utilizar APIs de theming (paletas, density, typography config).
- Evitar sobrescrever estilos internos do Material via seletores globais; preferir utilitários Tailwind nos wrappers.
- Definir tokens compartilhados:
  - `custom-theme.scss`: paletas do Material (primary, accent, warn), density e tipografia.
  - `tailwind.config.js`: cores equivalentes, espaçamentos e breakpoints para coerência.
- Validar acessibilidade (contraste, foco) quando aplicar utilitários Tailwind ao redor dos componentes.

## Exemplos no Projeto

- `resume-list.html` utiliza classes Tailwind para layout/spacing do `mat-list` e posicionamento centralizado do `mat-paginator`.
- `custom-theme.scss` define o tema do Material; as páginas usam utilitários Tailwind para compor o layout em volta dos componentes Material.

