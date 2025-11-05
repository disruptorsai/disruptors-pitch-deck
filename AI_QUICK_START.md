# AI & Voice Features - Quick Start

## 🚀 5-Minute Setup

Get your tablet AI-powered in just 5 minutes!

---

## Step 1: Install OpenAI SDK

```bash
npm install openai
```

---

## Step 2: Add Your OpenAI API Key

1. Get your key from: https://platform.openai.com/api-keys
2. Open `.env.local`
3. Add this line:

```env
VITE_OPENAI_API_KEY=sk-your-actual-key-here
```

---

## Step 3: Wrap Your App with AIProvider

Open `src/App.jsx` and add:

```jsx
import AIProvider from '@/components/ai/AIProvider';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AIProvider>  {/* Add this wrapper */}
        <Pages />
      </AIProvider>
    </QueryClientProvider>
  );
}
```

---

## Step 4: Restart Dev Server

```bash
npm run dev
```

---

## Step 5: Test!

1. Look for **two floating buttons**:
   - **Bottom-left:** Microphone (voice commands)
   - **Bottom-right:** Chat bubble (AI assistant)

2. **Test voice commands:**
   - Tap bottom-left mic button
   - Say: "Go to dashboard"
   - App should navigate automatically

3. **Test AI assistant:**
   - Tap bottom-right chat button
   - Ask: "What can you help me with?"
   - Should get intelligent response

---

## ✅ You're Done!

### What You Now Have:

✅ **Floating AI Assistant** (GPT-5 powered chat)
✅ **Voice Commands** (hands-free navigation)
✅ **Whisper Transcription** (speech-to-text)
✅ **Text-to-Speech** (voice responses)
✅ **Smart Suggestions** (AI autocomplete)

---

## 🎯 Quick Usage Examples

### Use Voice Commands

```
"Go to pricing"
"Open introduction"
"Next slide"
"Show AI assistant"
```

### Use AI Assistant

Tap the chat button and ask:
- "What should I emphasize on this slide?"
- "Tell me about this client's industry"
- "How do we compare to competitors?"

### Use Voice Input in Forms

Replace standard inputs with:

```jsx
import AITextInput from '@/components/ai/AITextInput';

<AITextInput
  value={value}
  onChange={setValue}
  placeholder="Type or speak..."
  showVoiceButton={true}
/>
```

---

## 🐛 Troubleshooting

### "OpenAI API key not found"

Check `.env.local`:
```env
VITE_OPENAI_API_KEY=sk-...  # Must start with sk-
```

Then restart: `npm run dev`

### Voice commands not working

1. Grant microphone permissions
2. Check browser console for errors
3. Try different browser (Chrome/Edge work best)

### AI assistant not responding

1. Verify API key is correct
2. Check network tab in DevTools
3. Ensure you have OpenAI API credits

---

## 📚 Full Documentation

For complete guide with all features:
**Read: `AI_VOICE_FEATURES.md`**

Includes:
- All component APIs
- Advanced usage
- Customization guide
- Security best practices
- Cost estimates
- Pro tips

---

## 💡 Pro Tips

1. **Test microphone first** - Tap voice button to ensure permissions work
2. **Practice commands** - Try all voice commands before presenting
3. **Keep AI minimized** - Less distracting until needed
4. **Use context** - AI knows what page you're on and client info
5. **Show it off!** - Demo the AI features early in presentation

---

## 🎨 Optional: Customize

### Change AI Assistant Position

Edit `src/components/ai/AIAssistant.jsx`:
```css
className="fixed bottom-8 right-8..."  // Change position here
```

### Add Custom Voice Commands

Edit `src/hooks/use-voice-commands.js`:
```js
const pageMap = {
  // Add your custom commands
  'special page': '/your-route',
};
```

### Adjust Voice Button Position

Edit `src/components/ai/AIProvider.jsx`:
```css
className="fixed bottom-8 left-8..."  // Change position
```

---

## 🚀 Next Steps

**Basics Working?** Move on to:

1. **Replace input fields** with `AITextInput` components
2. **Add VoiceInput** to search bars
3. **Customize AI personality** in `openai-service.ts`
4. **Add more voice commands** for your workflow
5. **Test on actual 32" tablet**

---

## ⚡ Performance Notes

**First Load:**
- OpenAI SDK: ~50KB gzipped
- Negligible impact on performance

**API Costs:**
- ~$5-10/month for typical usage
- See `AI_VOICE_FEATURES.md` for detailed cost breakdown

**Microphone:**
- Only active when explicitly enabled
- No always-on recording
- Privacy-safe

---

## 🔐 Security Reminder

**For Production:**
Move OpenAI calls to backend (Netlify Functions).

Current setup exposes API key in browser for demo purposes.

Quick fix:
```js
// netlify/functions/openai-chat.js
const OpenAI = require('openai');

exports.handler = async (event) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY  // Server-side
  });

  // Your logic here
};
```

---

## 📞 Need Help?

1. Check `AI_VOICE_FEATURES.md` for detailed docs
2. Review inline code comments
3. Test components individually
4. Check browser console for errors
5. Ask the AI assistant itself!

---

**Your tablet is now voice-powered! 🎤🚀**

Try saying: "Go to pricing" right now!
