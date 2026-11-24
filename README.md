# Loja Oficial Alcateia — Frontend (Next.js + Tailwind v4)

Aplicação web da **Loja Oficial Alcateia (Esporte Clube Pelotas)** com fronteira modular preparada para separar Vitrine Pública e PDV no futuro:

- **`src/features/storefront/`** → Vitrine pública (`/`), catálogo, carrinho e reserva via WhatsApp.
- **`src/features/pdv/`** → PDV assistido (`/pdv`), edição de pedidos em negociação, notas de entrada e estoque Kardex.

## Portas Locais
- **Frontend Loja:** `http://localhost:7995` (Portal usa `7999`)
- **Backend API Loja:** `http://localhost:7996` (Portal usa `7998`)

## Rodar Localmente
```powershell
npm install
npm run dev
```

## Quality Gate
```powershell
npm run lint
npm run build
```
