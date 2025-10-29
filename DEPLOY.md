# 🚀 Guide de Déploiement x402wrap

## Option 1: Vercel (Recommandé - 5 minutes)

### Étape 1: Préparer le projet
```bash
# S'assurer que tout fonctionne localement
npm run build

# Test du build
npm run start
```

### Étape 2: Créer un compte Vercel
1. Va sur https://vercel.com
2. Sign up avec GitHub
3. Connecte ton repo GitHub

### Étape 3: Déployer
**Option A: Via Dashboard Vercel**
1. Clique "Add New Project"
2. Importe ton repo GitHub
3. Configure les variables d'environnement :
   - `NEXT_PUBLIC_BASE_URL` = `https://your-domain.vercel.app` (temporaire)
   - `SOLANA_RPC_URL` = `https://api.mainnet-beta.solana.com`
4. Clique "Deploy"
5. Attends 2-3 minutes ⏱️

**Option B: Via CLI**
```bash
# Installer Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy en production
vercel --prod
```

### Étape 4: Configurer le domaine

**Domaine Vercel gratuit:**
- Tu recevras: `x402wrap.vercel.app`
- Utilise-le directement ou...

**Ton propre domaine:**

#### Acheter un domaine (10-15$/an)
- **Namecheap**: https://namecheap.com
- **Cloudflare**: https://cloudflare.com (moins cher)
- **GoDaddy**: https://godaddy.com

Suggestions de noms:
- `x402wrap.com`
- `x402.io`
- `wrapapi.com`
- `payperapi.com`
- `apiwrap.xyz`

#### Connecter le domaine à Vercel
1. Dashboard Vercel → ton projet
2. Settings → Domains
3. Ajoute ton domaine (ex: `x402wrap.com`)
4. Vercel te donne des DNS à configurer

#### Configurer les DNS
Chez ton registrar (Namecheap/Cloudflare):
```
Type: A
Host: @
Value: 76.76.21.21

Type: CNAME
Host: www
Value: cname.vercel-dns.com
```

**OU utilise les Nameservers Vercel:**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Étape 5: Mettre à jour l'URL de base
Une fois ton domaine actif:
1. Vercel Dashboard → Settings → Environment Variables
2. Édite `NEXT_PUBLIC_BASE_URL`
3. Change en `https://ton-domaine.com`
4. Redeploy (ça prend 1 minute)

---

## Option 2: Railway (Alternative)

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Login
railway login

# Init
railway init

# Deploy
railway up
```

---

## Option 3: VPS (DigitalOcean, AWS, etc.)

### Prérequis
- Ubuntu 22.04 VPS
- Node.js 20+
- Nginx
- SSL (Let's Encrypt)

### Setup rapide
```bash
# Sur le serveur
git clone https://github.com/ton-username/x402wrap.git
cd x402wrap
npm install
npm run build

# Setup PM2
npm i -g pm2
pm2 start npm --name "x402wrap" -- start
pm2 startup
pm2 save

# Nginx config
sudo nano /etc/nginx/sites-available/x402wrap

# Ajoute:
server {
    listen 80;
    server_name ton-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Active et reload
sudo ln -s /etc/nginx/sites-available/x402wrap /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL avec Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ton-domaine.com
```

---

## Variables d'environnement en production

```env
# .env.production
NEXT_PUBLIC_BASE_URL=https://ton-domaine.com
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Optionnel: RPC privé pour meilleure performance
# SOLANA_RPC_URL=https://rpc.helius.xyz/?api-key=TON_API_KEY
```

---

## Checklist avant le lancement 🚀

### Performance
- [ ] Build réussit sans erreurs
- [ ] Teste en mode production localement
- [ ] Vérifie que les images chargent
- [ ] Teste la création de liens
- [ ] Teste les analytics

### Sécurité
- [ ] HTTPS activé (SSL)
- [ ] Variables d'env configurées
- [ ] Rate limiting activé (optionnel)
- [ ] Pas de secrets dans le code

### SEO & Marketing
- [ ] Metadata configurés (title, description)
- [ ] OG images configurées
- [ ] Favicon en place
- [ ] Sitemap généré (optionnel)
- [ ] Google Analytics (optionnel)

### Monitoring
- [ ] Vercel Analytics activé
- [ ] Error tracking (Sentry optionnel)
- [ ] Uptime monitoring (UptimeRobot)

---

## Coûts estimés

**Starter (Gratuit):**
- Vercel: Free tier ✅
- Domaine: ~10-15$/an
- Total: **~15$/an**

**Pro (~50-100$/mois):**
- Vercel Pro: 20$/mois
- Domaine: 15$/an
- RPC privé Solana: 30-50$/mois
- Total: **~50-70$/mois**

---

## Monitoring post-déploiement

### Vercel Dashboard
- Visite count
- Build time
- Error rate
- Performance metrics

### Outils externes
- **Uptime**: https://uptimerobot.com (gratuit)
- **Analytics**: https://plausible.io
- **Errors**: https://sentry.io

---

## Support

Besoin d'aide ? 
- Discord: discord.gg/x402wrap
- Email: hello@x402wrap.com
- GitHub Issues

---

**Tu es à 5 minutes du lancement! 🚀**

