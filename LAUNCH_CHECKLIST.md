# 🚀 Launch Checklist - x402wrap

## Phase 1: Préparation (10 min)

### ✅ Code
- [x] Projet fonctionne localement
- [x] Logo intégré
- [x] Design finalisé
- [x] Pas d'emojis
- [x] Bug des stats fixé
- [ ] Test du build production

### 🔨 Build
```bash
npm run build
npm run start
```
Vérifie sur http://localhost:3000 que tout marche !

---

## Phase 2: Nom de domaine (15 min)

### Suggestions de noms disponibles

**Premium (.com):**
- x402wrap.com 🔥
- x402.io
- wrapapi.com
- apigate402.com
- payperwrap.com

**Budget (.xyz, .app):**
- x402wrap.xyz
- x402wrap.app
- wrapapi.xyz

### Où acheter (par ordre de préférence)

1. **Cloudflare Registrar** (recommandé)
   - Prix: ~$10/an
   - DNS gratuit et rapide
   - https://cloudflare.com/products/registrar

2. **Namecheap**
   - Prix: ~$12-15/an
   - Interface simple
   - https://namecheap.com

3. **Google Domains**
   - Prix: ~$12/an
   - Intégration Google
   - https://domains.google

### Action immédiate
```
1. Va sur Cloudflare
2. Cherche: x402wrap.com
3. Achète (carte bancaire)
4. Note les DNS: tu en auras besoin
```

---

## Phase 3: Déploiement Vercel (5 min)

### Option A: Via Interface (Plus simple)

1. **Crée un compte Vercel**
   - Va sur https://vercel.com/signup
   - Login avec GitHub

2. **Push sur GitHub** (si pas déjà fait)
   ```bash
   git init
   git add .
   git commit -m "Initial commit - x402wrap"
   gh repo create x402wrap --private --source=.
   git push -u origin main
   ```

3. **Importe le projet**
   - Dashboard Vercel → "Add New Project"
   - Import depuis GitHub
   - Sélectionne `x402wrap`

4. **Configure**
   - Framework: Next.js (auto-détecté)
   - Build Command: `npm run build`
   - Environment Variables:
     * Nom: `NEXT_PUBLIC_BASE_URL`
     * Value: `https://x402wrap.vercel.app` (temporaire)

5. **Deploy!**
   - Clique "Deploy"
   - Attends 2-3 min
   - Tu recevras: `https://x402wrap.vercel.app`

### Option B: Via CLI (Plus rapide)

```bash
# Install CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## Phase 4: Configurer le domaine (10 min)

### Sur Vercel Dashboard

1. Va dans ton projet
2. Settings → Domains
3. Add Domain → entre `x402wrap.com`
4. Vercel te donne des DNS records

### Configuration DNS

**Si Cloudflare:**
```
1. Dashboard Cloudflare
2. Ton domaine → DNS
3. Ajoute:
   - Type: CNAME
   - Name: @
   - Target: cname.vercel-dns.com
   - Proxy: OFF (important!)
   
   - Type: CNAME
   - Name: www
   - Target: cname.vercel-dns.com
   - Proxy: OFF
```

**Si autre registrar:**
```
Nameservers Vercel:
- ns1.vercel-dns.com
- ns2.vercel-dns.com
```

### Attends la propagation
- DNS: 5-30 minutes
- SSL: automatique (Let's Encrypt)
- Vérifie: https://dnschecker.org

---

## Phase 5: Configuration finale (5 min)

### Update l'URL de base

1. Vercel Dashboard → Settings → Environment Variables
2. Édite `NEXT_PUBLIC_BASE_URL`
3. Change: `https://x402wrap.com`
4. Redeploy:
   ```bash
   vercel --prod
   ```

### Test complet
```
✅ https://x402wrap.com charge
✅ Créer un lien → génère https://x402wrap.com/abc123
✅ Copy le lien → fonctionne
✅ Stats page → fonctionne
✅ Logo s'affiche
✅ Tout est responsive
```

---

## Phase 6: Post-Launch (optionnel)

### Analytics
- Vercel Analytics: activé par défaut
- Google Analytics: ajoute le script
- Plausible.io: alternative privacy-friendly

### Monitoring
```bash
# UptimeRobot (gratuit)
https://uptimerobot.com
→ Ajoute https://x402wrap.com
→ Check toutes les 5 minutes
→ Alerte par email si down
```

### SEO basique
- Soumet à Google: https://search.google.com/search-console
- Crée un sitemap.xml
- Vérifie les meta tags

### Marketing rapide
- Post sur Twitter/X
- Post sur ProductHunt
- Share dans des Discord crypto/dev

---

## 🎯 Timing total: ~45 minutes

```
Préparation:    10 min
Nom de domaine: 15 min
Déploiement:     5 min
DNS:            10 min
Config finale:   5 min
------------------------
TOTAL:          45 min
```

---

## 💰 Coûts

**Première année:**
- Domaine: $10-15
- Vercel: FREE (Hobby plan)
- SSL: FREE (Let's Encrypt)
**Total: $10-15**

**Année 2+:**
- Domaine: $10-15/an
- Vercel: FREE ou $20/mois si besoin Pro
**Total: $10-15/an (ou $250/an avec Pro)**

---

## 🆘 Troubleshooting

### "Build failed"
```bash
npm run build
# Fix les erreurs montrées
```

### "DNS not resolving"
- Attends 30 min
- Vérifie les DNS: https://dnschecker.org
- Check que Proxy Cloudflare est OFF

### "Site down"
- Check Vercel status: https://vercel-status.com
- Check logs: Vercel Dashboard → Deployment → Logs

---

## 📞 Support rapide

**Vercel:**
- Docs: https://vercel.com/docs
- Support: support@vercel.com

**Cloudflare:**
- Docs: https://developers.cloudflare.com
- Community: https://community.cloudflare.com

---

# 🚀 TU ES PRÊT À LAUNCH!

**Étape suivante: Exécute ce script**
```bash
./scripts/deploy.sh
```

**Ou manuellement:**
```bash
npm run build
vercel --prod
```

**Puis configure ton domaine sur Vercel! 🎉**

