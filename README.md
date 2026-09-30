# Desafio Pilates de Parede - 28 Dias 🧘‍♀️
> **Especialista Oficial:** Beatriz Araujo  
> **Entregável Oficial de Produto Digital (Infoproduto)**

Um Web App mobile-first, completo, ultraleve e responsivo desenvolvido especialmente para mulheres de 30 a 55 anos conquistarem alinhamento postural, alívio de dores nas costas e tonificação corporal com o apoio de uma parede.

---

## 🌟 O Grande Diferencial: Zero Vídeos Hospedados

A maioria dos infoprodutos sofre com custos elevados de hospedagem de vídeo (Vimeo, Panda Video, YouTube), instabilidade de conexão dos alunos e alto consumo do plano de dados móveis.

Neste aplicativo:
- **100% das demonstrações dos exercícios são feitas com ANIMAÇÕES VETORIAIS NATIVAS (SVG + CSS Keyframes)**.
- **Carregamento Instantâneo**: Peso total do app inferior a 150 KB.
- **Estilo Moderno & Fluido**: Inspirado nos aplicativos líderes mundiais como *BetterMe*, *Fitify* e *Nike Training*.
- **Silhueta Anatômica**: Representação estética de uma silhueta feminina executando os movimentos precisos na parede com guia de respiração sincronizado (*Inspire / Expire*).

---

## 📱 Estrutura e Recursos do Web App

### 1. Dashboard Principal (Trilha dos 28 Dias)
- **Cabeçalho Oficial**: Avatar ilustrado com selo de verificação de **Beatriz Araujo**, contador de sequência (*streak*), barra de progresso geral e pílula motivacional do dia.
- **Card Hero "Treino de Hoje"**: Identifica automaticamente o dia ativo, exibe tempo estimado (~12 a 16 min), calorias projetadas e botão de ação direta.
- **Trilha Completa em 4 Semanas Temáticas**:
  - **Semana 1**: Ativação & Correção Postural (Dias 1 a 7)
  - **Semana 2**: Queima Abdominal & Glúteos (Dias 8 a 14)
  - **Semana 3**: Flexibilidade & Força Funcional (Dias 15 a 21)
  - **Semana 4**: Tonificação Total & Queima Acelerada (Dias 22 a 28)
- **Status dos Dias**: Concluído (verde com checkmark), Dia Atual (destaque liberado) e Próximos Dias. Possibilidade de marcar/desmarcar manualmente ou pelo player.

### 2. Player Interativo de Treino (Modo Execução)
- **Interface Imersiva Fullscreen**:
  - Indicadores superiores de progresso (*Exercício X de Y*).
  - Demonstração visual animada em loop contínuo via SVG/CSS.
  - Nome do exercício, músculos ativados e **3 dicas práticas de postura de Beatriz Araujo**.
  - **Cronômetro Circular SVG**: contagem regressiva precisa com barra de progresso circular (`stroke-dashoffset`).
  - **Descanso Automático Inteligente**: tela de 20 segundos para recuperação e hidratação com aviso sonoro e prévia do próximo exercício.
  - **Sintetizador Web Audio API Nativo**: bips sonoros nos últimos 3 segundos (3, 2, 1), acorde de início e apito de descanso sem nenhum arquivo de áudio pesado.
  - **Controles Completos**: Pausar, Retomar, Pular exercício, Reiniciar e Sair com segurança.
  - **Tela de Parabéns com Confetes**: comemoração festiva, cálculo de minutos e calorias reais e desbloqueio de novas medalhas.

### 3. Biblioteca de Exercícios na Parede
Catálogo interativo com os 8 exercícios fundamentais:
1. **Wall Sit (Cadeira na Parede)** — Quadríceps e estabilização de joelhos.
2. **Elevação Pélvica com Apoio na Parede** — Firmeza de glúteos e assoalho pélvico.
3. **Prancha Inclinada na Parede** — Ativação profunda do transverso abdominal.
4. **Crunch Abdominal com Pés na Parede** — Definição do abdômen sem impacto no pescoço.
5. **Alongamento Posterior na Parede** — Alívio da lombar e drenagem linfática nas pernas.
6. **Flexão Inclinada na Parede** — Tonificação de braços (*músculo do tchauzinho*) e peitoral.
7. **Panturrilha com Apoio na Parede** — Estímulo da circulação e prevenção de inchaço.
8. **Abertura Torácica na Parede** — Correção de ombros caídos e alívio da tensão cervical.
- Inclui modal com detalhes anatômicos e botão para **"Praticar Este Exercício (40s)"**.

### 4. Progresso & Sistema de Conquistas
- 4 Métricas acumuladas: Dias Concluídos (/28), Minutos Totais, Kcal Queimadas e Sequência de Dias (*Streak*).
- Barra de conclusão visual da jornada.
- **6 Medalhas de Mérito Desbloqueáveis**:
  - 🌱 *Primeiro Passo* (1º treino)
  - 🔥 *Foco Inabalável* (3 dias)
  - ⭐ *Semana 1 Vencida* (7 dias)
  - 💎 *Mestre da Parede* (14 dias)
  - 👑 *Postura de Rainha* (21 dias)
  - 🏆 *Deusa do Pilates* (28 dias completos)
- Persistência total e automática via `localStorage`.

### 5. PWA (Progressive Web App) & 100% Offline
- `manifest.json` configurado para instalação direta na tela de início do celular sem passar por lojas de aplicativos.
- `sw.js` (Service Worker) ativo com cache local: a aluna pode treinar em qualquer lugar, mesmo sem internet ou em modo avião.

---

## 🚀 Como Executar ou Hospedar

### Opção 1: Uso Direto no Navegador (Sem servidor)
Basta abrir o arquivo `index.html` em qualquer navegador moderno (Chrome, Safari, Edge, Firefox).

### Opção 2: Servidor Local (Exemplo com Python ou Node)
```bash
# Com Python 3:
python -m http.server 8080

# Com Node (serve ou http-server):
npx serve .
```
Acesse `http://localhost:8080`.

### Opção 3: Hospedagem Gratuita em 1 Clique
Pode ser hospedado gratuitamente e com SSL no **Vercel**, **Netlify**, **Cloudflare Pages** ou **GitHub Pages**. Basta fazer upload desta pasta.

---

## 🎨 Identidade Visual
- **Fundo**: `#F8FAF9` (Neutro acolhedor e relaxante)
- **Primária**: `#0D9488` (Verde Menta / Saúde e Vitalidade)
- **Energia & Ação**: `#FF6B6B` (Coral) e `#F97316` (Pêssego)
- **Tipografia**: *Plus Jakarta Sans*
