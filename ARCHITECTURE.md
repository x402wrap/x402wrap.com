# Architecture x402wrap

## Vue d'ensemble

x402wrap est une plateforme SaaS qui transforme n'importe quelle API en endpoint payant via le protocole x402 sur Solana.

## Stack Technique

### Frontend
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Type safety et meilleure DX
- **Tailwind CSS** - Styling moderne et responsive
- **React Hooks** - State management côté client

### Backend
- **Next.js API Routes** - Endpoints serverless
- **SQLite + better-sqlite3** - Base de données légère et performante
- **Node.js** - Runtime JavaScript

### Blockchain
- **Solana Web3.js** - Interaction avec la blockchain Solana
- **@solana/pay** - Protocole de paiement
- **x402 Protocol** - Standard de micropaiements HTTP

## Structure du Projet

```
x402wrap/
├── app/
│   ├── layout.tsx              # Layout principal avec metadata
│   ├── page.tsx                # Page d'accueil (form de création)
│   ├── globals.css             # Styles globaux et utilities
│   ├── [id]/
│   │   └── route.ts           # Proxy endpoint (gère tous les HTTP methods)
│   ├── stats/
│   │   └── [id]/
│   │       └── page.tsx       # Page d'analytics
│   └── api/
│       ├── create/
│       │   └── route.ts       # API pour créer des liens
│       └── stats/
│           └── [id]/
│               └── route.ts   # API pour récupérer les stats
│
├── components/
│   ├── Button.tsx             # Composant bouton réutilisable
│   ├── Input.tsx              # Input avec validation visuelle
│   ├── Card.tsx               # Container avec glassmorphism
│   ├── Badge.tsx              # Badge pour statuts/tags
│   └── Logo.tsx               # Logo de la marque
│
├── lib/
│   ├── db.ts                  # Logique base de données SQLite
│   ├── solana.ts              # Intégration Solana + x402
│   └── utils.ts               # Fonctions utilitaires
│
├── public/                    # Assets statiques
├── package.json              # Dépendances npm
├── tsconfig.json            # Configuration TypeScript
├── tailwind.config.ts       # Configuration Tailwind
├── next.config.js          # Configuration Next.js
└── README.md              # Documentation principale
```

## Flow de Données

### 1. Création d'un lien payant

```
User Input (Form)
    ↓
POST /api/create
    ↓
Validation (URL, price, wallet)
    ↓
Generate unique ID (nanoid)
    ↓
Store in SQLite
    ↓
Return short link ID
```

### 2. Requête via proxy

```
Client Request → GET/POST/etc /:id
    ↓
Fetch link from DB
    ↓
Check headers for payment proof
    ↓
┌─────────────┬─────────────┐
│ No payment  │ Has payment │
└─────────────┴─────────────┘
        ↓              ↓
   Return 402    Verify payment
   with details   (Solana tx)
                       ↓
                  Valid? No → Return 402
                       ↓
                     Yes
                       ↓
              Forward to original API
                       ↓
              Log request to DB
                       ↓
              Return API response
```

### 3. Analytics

```
GET /stats/:id
    ↓
Query DB for link stats
    ↓
Calculate metrics
    ↓
Return JSON with:
  - Total requests
  - Total revenue
  - Last 24h stats
  - Recent requests
    ↓
Display in dashboard
```

## Base de Données

### Schema SQLite

```sql
-- Table des liens créés
CREATE TABLE links (
    id TEXT PRIMARY KEY,           -- Short ID (abc123)
    original_url TEXT NOT NULL,    -- URL de l'API originale
    price REAL NOT NULL,           -- Prix par requête (USDC)
    receiver_wallet TEXT NOT NULL, -- Wallet Solana du receveur
    created_at INTEGER NOT NULL,   -- Timestamp de création
    total_requests INTEGER,        -- Nombre total de requêtes
    total_revenue REAL            -- Revenu total généré
);

-- Table des logs de requêtes
CREATE TABLE requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link_id TEXT NOT NULL,         -- Référence au link
    timestamp INTEGER NOT NULL,    -- Timestamp de la requête
    payer_wallet TEXT,             -- Wallet du payeur
    amount REAL NOT NULL,          -- Montant payé
    success INTEGER DEFAULT 1,     -- 1 = succès, 0 = échec
    FOREIGN KEY (link_id) REFERENCES links(id)
);
```

## Protocole x402

### Headers HTTP

**Client → Proxy (pas de paiement)**
```http
GET /abc123 HTTP/1.1
Host: x402wrap.com
```

**Proxy → Client (402 Payment Required)**
```http
HTTP/1.1 402 Payment Required
X-Payment-Required: true
X-Payment-Amount: 0.01
X-Payment-Currency: USDC
X-Payment-Recipient: 7xKXR...9Qwp

{
  "error": "Payment Required",
  "payment": {
    "recipient": "7xKXR...9Qwp",
    "amount": 0.01,
    "currency": "USDC"
  }
}
```

**Client → Proxy (avec paiement)**
```http
GET /abc123 HTTP/1.1
Host: x402wrap.com
x-payment-signature: 5J7Xk9yH...
x-payment-from: 7xKXR...9Qwp
```

**Proxy → Client (requête forwarded)**
```http
HTTP/1.1 200 OK
Content-Type: application/json
X-Forwarded-By: x402wrap
X-Payment-Verified: true

{...} // Response de l'API originale
```

## Intégration Solana

### Vérification des paiements

```typescript
1. Extract signature from headers
2. Query Solana blockchain
3. Verify transaction:
   - Exists and confirmed
   - Amount matches price
   - Recipient matches wallet
   - Recent (< 5 minutes)
4. Return verification result
```

### Types de tokens supportés

- **USDC** (primary) - Stablecoin
- **SOL** (planned) - Native token
- **USDT** (planned) - Alternative stablecoin

## Sécurité

### Validations

- ✅ URL validation (http/https only)
- ✅ Price range (0.001 - 1000 USDC)
- ✅ Solana wallet format
- ✅ Transaction signature format
- ✅ SQL injection prevention (prepared statements)

### Protection

- Rate limiting (recommended in production)
- Input sanitization
- CORS configuration
- HTTPS enforcement (production)
- Wallet validation

## Performance

### Optimisations

- **SQLite indexing** sur link_id et timestamp
- **Connection pooling** pour Solana RPC
- **Caching** avec Redis (optionnel)
- **Edge deployment** via Vercel
- **Static generation** pour pages publiques

### Métriques cibles

- < 100ms latency pour validation
- < 500ms pour forward + log
- 99.9% uptime
- Support 1000+ req/s

## Scalabilité

### Horizontal Scaling

```
Load Balancer
    ↓
┌──────┬──────┬──────┐
│ App1 │ App2 │ App3 │
└──────┴──────┴──────┘
    ↓
Shared Database
(PostgreSQL ou PlanetScale)
```

### Vertical Scaling

- Migrer SQLite → PostgreSQL
- Ajouter Redis pour cache
- CDN pour assets statiques
- Solana RPC avec fallback

## Monitoring & Observability

### Métriques clés

1. **Business metrics**
   - Links créés / jour
   - Requêtes totales
   - Revenue généré
   - Taux de succès des paiements

2. **Technical metrics**
   - Response time
   - Error rate
   - Database query time
   - Solana RPC latency

3. **User metrics**
   - Conversion rate
   - Bounce rate
   - Time to first link
   - Return users

### Tools recommandés

- **Vercel Analytics** - Web vitals
- **Sentry** - Error tracking
- **PostHog** - Product analytics
- **Grafana** - Custom dashboards

## Déploiement

### Environnements

1. **Development** - Local (localhost:3000)
2. **Staging** - Vercel preview
3. **Production** - Vercel production

### CI/CD Pipeline

```
Git Push
    ↓
Vercel Build
    ↓
Run Tests
    ↓
Deploy Preview
    ↓
Manual Approval
    ↓
Deploy Production
```

## Roadmap Technique

### Phase 1 ✅ (MVP)
- [x] Core proxy functionality
- [x] SQLite database
- [x] Basic x402 integration
- [x] Analytics dashboard
- [x] Responsive UI

### Phase 2 (Current)
- [ ] Real Solana payment verification
- [ ] Rate limiting
- [ ] Custom domains
- [ ] API keys

### Phase 3 (Future)
- [ ] Multi-token support
- [ ] WebSocket proxying
- [ ] Webhook notifications
- [ ] Team accounts
- [ ] Revenue sharing
- [ ] Advanced analytics

## Maintenance

### Backups
- Database backup automatique (daily)
- Transaction logs archivés (monthly)
- Configuration versioning

### Updates
- Dépendances npm (monthly)
- Security patches (immediate)
- Next.js upgrades (quarterly)

