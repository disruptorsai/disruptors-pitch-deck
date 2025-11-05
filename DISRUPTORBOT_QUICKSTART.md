# ⚡ DisruptorBot Quick Start Checklist

Follow these steps to get DisruptorBot running in the next 10 minutes!

## ✅ 5-Minute Setup (Text-Only Mode)

### Step 1: Apply Database Migration (2 min)
```bash
☐ Go to https://app.supabase.com
☐ Open your project
☐ Click SQL Editor → New Query
☐ Copy/paste: supabase/migrations/20251020_disruptorbot_voice_ai.sql
☐ Click Run
☐ Verify: "Success. No rows returned"
```

### Step 2: Start Development Server (1 min)
```bash
☐ Open terminal in project directory
☐ Run: npm run dev
☐ Wait for server to start
☐ Open: http://localhost:5173
```

### Step 3: Test It! (2 min)
```bash
☐ Navigate to any presentation page (e.g., /Home or /Introduction)
☐ Look for glowing button in bottom-right corner
☐ Click the button
☐ Type: "Tell me about your services"
☐ Watch the 3D particles react!
☐ Try: "How much does this cost?"
☐ Try: "Show me case studies"
```

**🎉 If you see responses, DisruptorBot is working in demo mode!**

---

## ✅ 15-Minute Setup (Full Voice Mode)

### Step 4: Sign Up for ElevenLabs (5 min)
```bash
☐ Go to: https://elevenlabs.io
☐ Click "Sign Up" (free tier: 15 min/month)
☐ Verify your email
☐ Go to Settings → API Keys
☐ Click "Create API Key"
☐ Copy your API key
```

### Step 5: Create Conversational AI Agent (5 min)
```bash
☐ In ElevenLabs dashboard, click "Conversational AI"
☐ Click "Create Agent"
☐ Name: "DisruptorBot"
☐ Select LLM: "Claude Sonnet 4"
☐ Select Voice: "Marin" or "Rachel" (professional voices)
☐ System Prompt: Copy from DISRUPTORBOT_SETUP.md or use default
☐ Click "Create"
☐ Copy the "Agent ID" from the agent settings
```

### Step 6: Configure Environment (2 min)
```bash
☐ Open .env.local (create from .env.example if needed)
☐ Add these lines:
   VITE_ELEVENLABS_API_KEY=your_api_key_here
   VITE_ELEVENLABS_AGENT_ID=your_agent_id_here
☐ Save the file
☐ Restart dev server: Ctrl+C, then npm run dev
```

### Step 7: Test Voice Features (3 min)
```bash
☐ Refresh the presentation page
☐ Click DisruptorBot button
☐ Click the microphone icon
☐ Grant microphone permissions if prompted
☐ Speak: "What services do you offer?"
☐ Listen for AI response
☐ Watch particles pulse with audio!
```

**🎉 Full voice mode is now active!**

---

## 🐛 Quick Troubleshooting

### Particles Not Showing
```bash
☐ Check browser console for errors (F12)
☐ Try Chrome or Firefox (best WebGL support)
☐ Refresh the page
☐ Check if Three.js loaded: console shows no errors
```

### Database Errors
```bash
☐ Verify migration ran successfully
☐ Check VITE_SUPABASE_URL in .env.local
☐ Check VITE_SUPABASE_SERVICE_ROLE_KEY in .env.local
☐ Re-run migration if needed
```

### Button Not Appearing
```bash
☐ Check if client ID exists in database
☐ Navigate to a valid presentation page
☐ Check browser console for Layout errors
☐ Verify DisruptorBot import in Layout.jsx
```

### Voice Not Working
```bash
☐ Verify ElevenLabs API key is correct
☐ Verify Agent ID is correct
☐ Check browser microphone permissions
☐ Restart dev server after changing .env.local
☐ For now, voice requires Phase 2 implementation
   (Text chat works without ElevenLabs!)
```

---

## 📝 Test Scenarios

Try these conversations to see DisruptorBot in action:

### Scenario 1: Service Inquiry
```
You: "What services do you provide?"
Bot: Lists 5 core services with descriptions
You: "Tell me more about SEO"
Bot: Explains SEO service in detail
```

### Scenario 2: Pricing Questions
```
You: "How much does this cost?"
Bot: Shows all 4 pricing tiers
You: "Which tier is best for a small business?"
Bot: Recommends Growth tier with explanation
```

### Scenario 3: Competitive Analysis
```
You: "What makes you different from other agencies?"
Bot: References client's competitive analysis
You: "What are my biggest opportunities?"
Bot: Lists opportunities from analysis
```

### Scenario 4: Case Studies
```
You: "Show me some results you've achieved"
Bot: Shares a case study with metrics
You: "Do you have examples in my industry?"
Bot: Asks about industry or shows relevant case
```

---

## 🎯 Success Metrics

You'll know it's working when:
- ✅ Glowing button appears in bottom-right corner
- ✅ Clicking button opens modal with 3D visualization
- ✅ Particles rotate and pulse smoothly (60 FPS)
- ✅ Text messages receive context-aware responses
- ✅ Messages appear in chat panel with timestamps
- ✅ Database shows new records in voice_sessions table

---

## 📚 Next Steps After Setup

1. **Customize Responses**: Edit `use-disruptorbot.js` → `getAIResponse()`
2. **Adjust Colors**: Edit `ParticleEntity.jsx` gradient colors
3. **Configure ElevenLabs Agent**: Fine-tune voice and personality
4. **Add Knowledge Base**: Upload documents to ElevenLabs
5. **Implement Phase 2**: Full voice integration (see TODO markers)

---

## 🚀 You're Ready!

- **Text Mode**: Working immediately after Step 3
- **Voice Mode**: Working after Step 7 + Phase 2 implementation
- **Full System**: All features ready to enhance

**Enjoy your new AI-powered presentation assistant! 🤖✨**
