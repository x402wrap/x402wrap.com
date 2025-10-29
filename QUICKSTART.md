# ⚡ Quick Start Guide

## 1. Installation (1 minute)

```bash
# Vous êtes déjà dans le bon dossier
cd /Users/bassamchaouki/x402wrap

# Les dépendances sont déjà installées, mais si besoin :
npm install
```

## 2. Lancer le serveur (30 secondes)

```bash
npm run dev
```

🎉 **Le site est live sur:** http://localhost:3000

## 3. Tester le flow complet (2 minutes)

### Étape 1: Créer un lien payant

1. Ouvrir http://localhost:3000
2. Remplir le formulaire :
   - **API URL**: `https://api.github.com/users/octocat`
   - **Price**: `0.01`
   - **Wallet**: `7xKXtaoaYJVRvpz9B2WuKJ9Qwp6hqC9XYZ1234567890`
3. Cliquer sur "Generate Paid Link"
4. Noter le lien généré (ex: `http://localhost:3000/abc123`)

### Étape 2: Tester sans paiement

```bash
curl http://localhost:3000/abc123
```

**Résultat attendu**: 402 Payment Required

```json
{
  "error": "Payment Required",
  "payment": {
    "recipient": "7xKXtaoaYJVRvpz9B2WuKJ9Qwp6hqC9XYZ1234567890",
    "amount": 0.01,
    "currency": "USDC"
  }
}
```

### Étape 3: Tester avec paiement (simulé)

```bash
curl http://localhost:3000/abc123 \
  -H "x-payment-signature: test_signature_12345" \
  -H "x-payment-from: 7xKXtaoaYJVRvpz9B2WuKJ9Qwp6hqC9XYZ1234567890"
```

**Résultat attendu**: Response de l'API GitHub proxied

### Étape 4: Voir les analytics

Ouvrir dans le navigateur: http://localhost:3000/stats/abc123

Vous verrez :
- ✅ Total requests
- ✅ Total revenue
- ✅ Stats des dernières 24h
- ✅ Liste des requêtes récentes

## 4. Exemples d'APIs à monétiser

### API Publiques gratuites (pour tests)

```bash
# 1. GitHub User Info
URL: https://api.github.com/users/octocat
Prix suggéré: $0.01

# 2. Random User
URL: https://randomuser.me/api/
Prix suggéré: $0.001

# 3. Cat Facts
URL: https://catfact.ninja/fact
Prix suggéré: $0.001

# 4. Bitcoin Price
URL: https://api.coindesk.com/v1/bpi/currentprice.json
Prix suggéré: $0.01

# 5. Weather (nécessite API key)
URL: https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=YOUR_KEY
Prix suggéré: $0.01
```

## 5. Structure du code (pour personnalisation)

```
app/page.tsx          → Page d'accueil (modifier le design ici)
app/[id]/route.ts     → Logique du proxy (ajouter features ici)
app/stats/[id]/page.tsx → Analytics dashboard
lib/solana.ts         → Intégration paiements Solana
lib/db.ts            → Database queries
components/          → Composants réutilisables
```

## 6. Prochaines étapes

### Développement local
```bash
# Modifier le code
# Hot reload automatique
# Tester dans le browser
```

### Ajouter des features
- Custom rate limiting dans `app/[id]/route.ts`
- Nouveau type de stats dans `lib/db.ts`
- Nouveau design dans `components/`

### Déployer en production
```bash
# Option 1: Vercel (recommandé)
npm i -g vercel
vercel deploy

# Option 2: Docker
docker build -t x402wrap .
docker run -p 3000:3000 x402wrap
```

## 7. Troubleshooting

### Le serveur ne démarre pas
```bash
# Vérifier que le port 3000 est libre
lsof -ti:3000 | xargs kill -9

# Relancer
npm run dev
```

### Erreur de base de données
```bash
# Supprimer la DB et relancer (reset complet)
rm x402.db
npm run dev
```

### Problème de dépendances
```bash
# Réinstaller tout
rm -rf node_modules package-lock.json
npm install
```

## 8. Tips & Tricks

### Tester rapidement plusieurs APIs

```bash
# Script bash pour tester
for api in "github.com/users/octocat" "randomuser.me/api" "catfact.ninja/fact"
do
  echo "Testing: $api"
  # Créer le lien via API
  curl -X POST http://localhost:3000/api/create \
    -H "Content-Type: application/json" \
    -d "{\"apiUrl\":\"https://$api\",\"price\":0.01,\"wallet\":\"7xKXtaoaYJVRvpz9B2WuKJ9Qwp6hqC9XYZ1234567890\"}"
done
```

### Monitorer les logs

```bash
# Terminal 1: Serveur
npm run dev

# Terminal 2: Surveiller la DB
watch -n 1 'sqlite3 x402.db "SELECT * FROM links"'
```

### Reset complet

```bash
# Tout supprimer et recommencer
rm -rf node_modules package-lock.json x402.db .next
npm install
npm run dev
```

## 9. Ressources

- 📚 **Documentation complète**: `README.md`
- 🏗️ **Architecture détaillée**: `ARCHITECTURE.md`
- 🎬 **Guide de démo**: `DEMO.md`
- 💬 **Support**: Ouvrir une issue sur GitHub

## 10. Checklist avant production

- [ ] Tester avec une vraie transaction Solana
- [ ] Configurer un RPC Solana custom (pas le public)
- [ ] Ajouter rate limiting
- [ ] Configurer les variables d'environnement
- [ ] Activer HTTPS
- [ ] Configurer monitoring (Sentry, etc.)
- [ ] Backup automatique de la DB
- [ ] Tester la scalabilité
- [ ] Documenter l'API

---

**Ready to monetize! 🚀💰**

Temps total pour setup: **< 5 minutes**

