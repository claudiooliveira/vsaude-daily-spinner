## Roleta da Daily · VSaúde

Aplicação React que ajuda a conduzir a daily com mais dinamismo: você cadastra os nomes da squad, gira a roleta e deixa que ela escolha quem fala a seguir. O estado fica salvo em `localStorage`, então a lista permanece mesmo após atualizar a página.

### Próximos passos
- Adicionar import/export da lista em CSV/JSON.
- Integrar com uma API para criar um ranking dos mais sorteados
- Adicionar fotos dos participantes

---

### ✨ Principais funcionalidades
- Cadastro rápido de nomes com feedback via toasts.
- Persistência local (`dailyNames`) para salvar/carregar listas.
- Roleta animada com segmentação automática, cores alternadas e seta indicadora.
- Histórico dos já sorteados, evitando repetições no mesmo ciclo.
- Reset da roleta para recomeçar o sorteio com todos os nomes.

---

### 🧱 Stack
- **React 18 + TypeScript** (SPA via Vite).
- **Tailwind CSS + shadcn/ui** para estilização e componentes.
- **Lucide Icons** e **sonner** para UX.
- **Radix UI** por trás dos componentes acessíveis.

---

### 🚀 Rodando localmente
Pré-requisitos: Node 18+ e um gerenciador de pacotes (npm, pnpm ou bun).

```bash
git clone https://github.com/<seu-usuario>/daily-spinner.git
cd daily-spinner
npm install     # ou pnpm install / bun install
npm run dev
```

O Vite exibirá a URL (por padrão `http://localhost:5173`). Qualquer alteração em `src/` recarrega automaticamente.

---

### 📜 Scripts úteis
- `npm run dev` – ambiente de desenvolvimento com HMR.
- `npm run build` – bundle otimizado para produção.
- `npm run build:dev` – build em modo development (útil para testar artefatos).
- `npm run preview` – serve o build gerado em um servidor local.
- `npm run lint` – verifica o projeto com ESLint.

---

### 🗂️ Estrutura de interesse
- `src/pages/Index.tsx` – tela principal (inputs, botões e fluxo da daily).
- `src/components/WheelSpinner.tsx` – lógica/estilo da roleta e setas.
- `src/components/ui/*` – biblioteca shadcn/ui pronta para novos componentes.
- `src/hooks` – hooks utilitários (ex.: `use-mobile`, `use-toast`).

---

### 🛠️ Personalizações rápidas
- **Paleta e gradiente dos segmentos**: ajuste `getColorForSegment` em `WheelSpinner.tsx`.
- **Velocidade da animação**: altere o tempo do `transform` na mesma roleta.
- **Mensagens e toasts**: editáveis em `Index.tsx` (funções `saveNames`, `loadNames`, etc.).
- **Layout**: Tailwind facilita ajustes diretos nas classes utilitárias usadas na página.

---
