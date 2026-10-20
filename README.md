# Appetizing Food — Demonstração React + Vite

Migração do protótipo Macro 3 para React 19 + Vite 7. A camada visual original (HTML/CSS/assets) é mantida, enquanto catálogo, filtros, estado do cesto e controlos de apresentação são geridos em React. O HTML está em `src/shell.html` e é montado na aplicação; os componentes dinâmicos usam React Portals sobre os contentores do layout existente.

## Iniciar

```bash
npm install
npm run dev
```

## Produção / Vercel

```bash
npm run build
npm run preview
```

Importa o repositório para a Vercel com Framework Preset **Vite** (build `npm run build`, output `dist`). O ficheiro `vercel.json` já inclui a configuração do fallback de rotas. Para alojar numa subpasta de outro site Vite, ajusta `base` no `vite.config.js` e os URLs absolutos de `public/assets/`.

## Aviso

Demonstração conceptual não oficial. Produtos e imagens são ilustrativos; nenhum pedido ou formulário é enviado. As imagens, copy e logótipo conceptual deverão ser substituídos por material autorizado caso a empresa aprove um website real.
