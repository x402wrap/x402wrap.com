# 🗄️ Configuration Vercel Postgres

## **Étapes rapides (3 minutes)**

### 1. Va sur le Dashboard Vercel

👉 https://vercel.com/youngceos-projects/x402tek

### 2. Crée une Database Postgres

1. Clique sur **"Storage"** (dans le menu du haut)
2. Clique sur **"Create Database"**
3. Sélectionne **"Postgres"**
4. Nom de la database: `x402-db`
5. Région: Choisis **"Washington, D.C. (iad1)"** (même que le site)
6. **Create**

**Gratuit jusqu'à 256MB de données + 60h de compute/mois** ✅

### 3. Connecte la Database au Projet

1. Une fois créée, clique sur **"Connect Project"**
2. Sélectionne ton projet **"x402tek"**
3. Environment: **Production**
4. Clique **"Connect"**

Vercel va automatiquement ajouter les variables d'environnement :
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- etc.

### 4. Initialise les Tables

Va dans l'onglet **"Query"** de ta database et exécute:

```sql
CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,
  original_url TEXT NOT NULL,
  price REAL NOT NULL,
  receiver_wallet TEXT NOT NULL,
  created_at BIGINT NOT NULL,
  total_requests INTEGER DEFAULT 0,
  total_revenue REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS requests (
  id SERIAL PRIMARY KEY,
  link_id TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  payer_wallet TEXT,
  amount REAL NOT NULL,
  success INTEGER DEFAULT 1,
  FOREIGN KEY (link_id) REFERENCES links(id)
);

CREATE INDEX IF NOT EXISTS idx_requests_link_id ON requests(link_id);
CREATE INDEX IF NOT EXISTS idx_requests_timestamp ON requests(timestamp);
```

Clique **"Run Query"** ✅

### 5. Redeploy le Site

```bash
vercel --prod
```

**OU** sur le dashboard: Deployments → Latest → ⋯ → Redeploy

---

## ✅ **C'EST PRÊT !**

Teste ton site:
1. Va sur https://x402wrap.com (ou l'URL Vercel)
2. Crée un lien
3. Ça devrait marcher !

---

## 🔍 Vérification

### Check que tout fonctionne:

**Dashboard Vercel → Storage → x402-db → Query**

```sql
-- Voir les liens créés
SELECT * FROM links;

-- Voir les requêtes
SELECT * FROM requests;
```

---

## 💰 Coûts

**Plan Hobby (Gratuit):**
- 256 MB storage
- 60h compute/mois
- Largement suffisant pour démarrer !

**Si tu dépasses:**
- Pro plan: $20/mois
- Ou passe à Supabase/Railway (aussi gratuit)

---

## 🆘 Troubleshooting

### "Failed to create link" encore?
- Check que les variables d'env sont bien là (Settings → Environment Variables)
- Check que les tables sont créées (Query → `SELECT * FROM links`)
- Redeploy: `vercel --prod`

### "Database connection error"
- Vérifie que le projet est bien connecté à la DB
- Storage → x402-db → Connect Project

---

**Tu es à 3 minutes d'avoir un site 100% fonctionnel ! 🚀**

