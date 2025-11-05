# AI Presenter - Quick Reference Card

> **Status:** ✅ FULLY OPERATIONAL | **Build:** ✅ SUCCESS | **Ready:** DEPLOYMENT

---

## 🚀 Getting Started (5 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local

# 3. Edit .env.local with your keys

# 4. Start development
npm run dev
```

**Then:** Open http://localhost:5173/admin

---

## 🔑 Required Environment Variables

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-key
ANTHROPIC_API_KEY=your-anthropic-key
VITE_APP_URL=http://localhost:5173
```

**Get these from:**
- Supabase: https://app.supabase.com/project/YOUR_PROJECT/settings/api
- Anthropic: https://console.anthropic.com/

---

## 🗄️ Database Setup (2 Minutes)

1. Go to Supabase → SQL Editor
2. Run `supabase/migrations/20250113_ai_presenter_schema.sql`
3. Run `supabase/migrations/20250114_add_pricing_tiers.sql`
4. Go to Storage → Create bucket `ai-presenter-files` (private)

---

## 📍 Key Routes

### Admin
- **/admin** - Dashboard
- **/admin/clients** - Manage clients
- **/admin/access-links** - Generate links

### Public
- **/** - Home page
- **/Dashboard** - Navigation
- **/Diagnostic** - AI analysis
- **/CaseStudies** - Portfolio
- **/Pricing** - Investment tiers

---

## 💻 Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server (port 5173)
npm run build     # Build for production
npm run preview   # Test production build
netlify deploy    # Deploy to Netlify
```

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables (create this) |
| `src/api/supabaseClient.js` | Database connection |
| `src/pages/admin/` | Admin interface |
| `src/pages/index.jsx` | Route configuration |
| `supabase/migrations/` | Database schema |

---

## ✅ First Time Setup Checklist

- [ ] Run `npm install`
- [ ] Create `.env.local` with your keys
- [ ] Apply database migrations in Supabase
- [ ] Create storage bucket `ai-presenter-files`
- [ ] Start dev server with `npm run dev`
- [ ] Open http://localhost:5173/admin
- [ ] Create your first client
- [ ] Generate an access link
- [ ] Test the presentation

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| "Supabase credentials not found" | Check `.env.local` has `VITE_` prefix |
| Tables don't exist | Run SQL migrations in Supabase |
| Port 5173 in use | Use `npm run dev -- --port 3000` |
| Build fails | Delete `node_modules` and run `npm install` |

---

## 📚 Documentation

- **SETUP.md** - Complete setup guide
- **COMPLETION_SUMMARY.md** - What was built
- **README.md** - Project overview
- **docs/** - Detailed documentation

---

## 🎯 Next Steps

1. **Set up environment** - Add your API keys to `.env.local`
2. **Run migrations** - Apply database schema in Supabase
3. **Start server** - Run `npm run dev`
4. **Create client** - Use admin dashboard
5. **Generate link** - Share presentations
6. **Deploy** - Push to Netlify when ready

---

## 🔗 Quick Links

- **Admin Dashboard:** http://localhost:5173/admin
- **Supabase Dashboard:** https://app.supabase.com
- **Anthropic Console:** https://console.anthropic.com
- **Netlify:** https://app.netlify.com

---

## 💡 Pro Tips

1. **Use admin dashboard** to manage everything visually
2. **Set expiration dates** on all access links
3. **Monitor view counts** to track engagement
4. **Use password protection** for sensitive presentations
5. **Test locally first** before deploying

---

## 🎉 You're Ready!

Your AI Presenter is **fully operational**. Start creating amazing presentations!

---

*Need help? Check SETUP.md for detailed instructions.*
