# AI & Voice Features - Complete Guide

## 🎯 Overview

Your presentation tablet now has **cutting-edge AI and voice capabilities** powered by OpenAI's GPT-5 and Whisper. These features eliminate the keyboard input problem on tablets and showcase your AI expertise to high-value clients.

---

## 🚀 What's Included

### 1. **Floating AI Assistant**
A GPT-5 powered conversational assistant accessible from anywhere in your app.

**Features:**
- Chat interface with streaming responses
- Voice input via Whisper
- Text-to-speech responses
- Context-aware help about your presentation
- Knows what page you're on and client info
- Accessible via floating button (bottom-right)

**How to Use:**
- Tap the orange floating button (bottom-right corner)
- Ask questions about your pitch
- Use voice or text input
- Get instant, intelligent answers
- Minimize when not needed

**Example Questions:**
- "What are the key points on this slide?"
- "Tell me about this client's industry"
- "Navigate to pricing"
- "What should I emphasize in this section?"

---

### 2. **Voice Commands**
Hands-free navigation and control throughout the entire app.

**Features:**
- Navigate between pages with your voice
- No keyboard needed
- Always listening (when enabled)
- Natural language understanding
- Touch-optimized toggle (bottom-left)

**Supported Commands:**
```
"Go to dashboard"
"Open introduction"
"Next slide"
"Previous page"
"Show AI assistant"
"Go to pricing"
"Open case studies"
```

**How to Use:**
1. Tap the microphone button (bottom-left corner)
2. The button turns red when listening
3. Speak your command naturally
4. App responds immediately

**Pro Tips:**
- Speak clearly but naturally
- Commands work even with background noise
- Say "help" or "assistant" to open AI chat
- Toggle off when not presenting

---

### 3. **VoiceInput Component**
Standalone voice input for any use case.

**Features:**
- Large 80px touch-friendly button
- Real-time audio waveform visualization
- Whisper transcription
- Auto-submit option
- Error handling with user feedback

**How to Use in Your Code:**
```jsx
import VoiceInput from '@/components/ai/VoiceInput';

<VoiceInput
  onTranscript={(text) => console.log('Transcribed:', text)}
  placeholder="Tap to speak..."
  autoSubmit={true}
  showWaveform={true}
/>
```

**Perfect For:**
- Form inputs
- Search bars
- Note taking
- Quick data entry
- Client feedback capture

---

### 4. **AITextInput Component**
Enhanced text input with voice + AI suggestions.

**Features:**
- Voice input button built-in
- AI-powered smart suggestions
- Auto-complete based on context
- Replaces standard input fields
- Touch-optimized 60px+ targets

**How to Use:**
```jsx
import AITextInput from '@/components/ai/AITextInput';

<AITextInput
  value={value}
  onChange={setValue}
  placeholder="Type or speak..."
  context="User is filling out client name field"
  showVoiceButton={true}
  showSuggestions={true}
/>
```

**Benefits:**
- Faster data entry
- Fewer typos
- Context-aware completions
- Professional appearance
- Client-friendly

---

## 🔧 Setup Instructions

### Step 1: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy the key (starts with `sk-...`)

### Step 2: Add to Environment

Open `.env.local` and add:
```env
VITE_OPENAI_API_KEY=sk-your-actual-key-here
```

### Step 3: Install OpenAI SDK

```bash
npm install openai
```

### Step 4: Integrate AIProvider (If Not Already Done)

In your `App.jsx`:
```jsx
import AIProvider from '@/components/ai/AIProvider';

function App() {
  return (
    <AIProvider>
      {/* Your existing app content */}
    </AIProvider>
  );
}
```

### Step 5: Test!

1. Run `npm run dev`
2. Look for floating buttons (bottom-left and bottom-right)
3. Tap microphone to test voice commands
4. Tap chat button to test AI assistant
5. Say "Go to dashboard" to test navigation

---

## 📱 Tablet-Specific Optimizations

All components are built with your 32" presentation tablet in mind:

✅ **Minimum 60px touch targets** (80px for primary actions)
✅ **Large, readable text** (18-24pt)
✅ **High contrast UI** for visibility
✅ **No hover dependencies** (everything works via touch)
✅ **Touch gestures** (tap, hold, swipe)
✅ **Instant feedback** (<100ms response)
✅ **Clear visual states** (active, processing, error)

---

## 🎨 Component Reference

### AIAssistant
**File:** `src/components/ai/AIAssistant.jsx`

Floating chat interface with GPT-5.

**Props:** None (self-contained)

**Global Events:**
- Listen: `window.addEventListener('openAIAssistant', handler)`
- Trigger: `window.dispatchEvent(new CustomEvent('openAIAssistant'))`

---

### VoiceInput
**File:** `src/components/ai/VoiceInput.jsx`

Standalone voice input component.

**Props:**
- `onTranscript: (text: string) => void` - Callback with transcribed text
- `placeholder: string` - Placeholder text (default: "Tap to speak...")
- `autoSubmit: boolean` - Auto-submit after transcription (default: false)
- `showWaveform: boolean` - Show audio visualization (default: true)
- `className: string` - Additional CSS classes

---

### AITextInput
**File:** `src/components/ai/AITextInput.jsx`

Enhanced input with voice + AI suggestions.

**Props:**
- `value: string` - Input value
- `onChange: (value: string) => void` - Change handler
- `placeholder: string` - Placeholder text
- `context: string` - Context for AI suggestions
- `showVoiceButton: boolean` - Show voice button (default: true)
- `showSuggestions: boolean` - Show AI suggestions (default: true)
- `multiline: boolean` - Textarea vs input (default: false)
- Plus all standard input props

---

### useVoiceCommands
**File:** `src/hooks/use-voice-commands.js`

React hook for voice command integration.

**Usage:**
```jsx
const { isListening, startListening, stopListening, lastCommand } = useVoiceCommands({
  onCommand: (command) => console.log(command),
  autoStart: false,
  continuous: true,
});
```

**Returns:**
- `isListening: boolean` - Whether actively listening
- `lastCommand: string` - Last recognized command
- `error: string|null` - Any error message
- `startListening: () => void` - Start listening
- `stopListening: () => void` - Stop listening
- `toggleListening: () => void` - Toggle on/off

---

## 🧠 OpenAI Service API

**File:** `src/lib/openai-service.ts`

Central service for all OpenAI interactions.

### Available Methods:

#### **transcribeAudio(audioBlob: Blob): Promise<string>**
Convert speech to text using Whisper.

```js
const text = await openAIService.transcribeAudio(audioBlob);
```

#### **textToSpeech(text: string, voice?: string): Promise<Blob>**
Convert text to speech.

```js
const audioBlob = await openAIService.textToSpeech("Hello world", "nova");
```

**Available voices:** alloy, echo, fable, onyx, nova, shimmer

#### **chat(messages: ChatMessage[], streaming?: boolean): Promise<string>**
Get GPT-5 response.

```js
const response = await openAIService.chat([
  { role: 'system', content: 'You are a helpful assistant' },
  { role: 'user', content: 'What is AI?' }
]);
```

#### **chatStream(messages: ChatMessage[]): AsyncGenerator<string>**
Stream GPT-5 response for real-time UX.

```js
for await (const chunk of openAIService.chatStream(messages)) {
  console.log(chunk); // Partial response
}
```

#### **getSuggestions(context: string, userInput: string): Promise<string[]>**
Get AI-powered autocomplete suggestions.

```js
const suggestions = await openAIService.getSuggestions(
  "User is entering company name",
  "Acm"
);
// Returns: ["Acme Corp", "Acme Industries", "ACME Solutions"]
```

#### **interpretCommand(voiceInput: string): Promise<VoiceCommand>**
Parse natural language commands.

```js
const command = await openAIService.interpretCommand("go to the pricing page");
// Returns: { action: 'navigate', parameters: { target: 'pricing' }, confidence: 0.95 }
```

---

## 🎯 Use Cases

### During Client Presentations

**Scenario:** Client asks unexpected question mid-presentation

**Solution:**
1. Tap AI assistant button
2. Ask: "How do we compare to [competitor]?"
3. Get instant, intelligent answer
4. Continue seamlessly

---

**Scenario:** Need to navigate without interrupting flow

**Solution:**
1. Enable voice commands (bottom-left mic)
2. Say: "Go to case studies"
3. Navigate hands-free
4. Keep talking to client

---

**Scenario:** Client wants to leave feedback/notes

**Solution:**
1. Use AITextInput component in feedback form
2. Client speaks naturally
3. Whisper transcribes perfectly
4. Save to database

---

### Form Filling

Replace all standard inputs with `AITextInput`:

```jsx
// Before
<input
  value={clientName}
  onChange={(e) => setClientName(e.target.value)}
  placeholder="Client name"
/>

// After
<AITextInput
  value={clientName}
  onChange={setClientName}
  placeholder="Client name"
  context="User is entering a company name"
  showVoiceButton={true}
  showSuggestions={true}
/>
```

**Benefits:**
- Voice input for awkward tablet typing
- AI suggestions reduce errors
- Faster completion
- Professional appearance

---

## 🔒 Security & Privacy

### API Key Safety

**Current Setup:** API key exposed to browser (for demo)

**For Production:**
1. Move OpenAI calls to backend (Netlify Functions)
2. Never expose API key client-side
3. Use server-side proxy

**Quick Fix:**
```js
// Create netlify/functions/openai-chat.js
exports.handler = async (event) => {
  const { messages } = JSON.parse(event.body);

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ response: response.choices[0].message.content }),
  };
};
```

### Microphone Permissions

Browser will prompt for microphone access on first use.

**Best Practice:**
- Explain why you need mic access
- Show visual indicator when recording
- Allow easy disable

---

## 🎨 Customization

### Change AI Assistant Personality

Edit `src/lib/openai-service.ts`:

```js
const systemPrompt = `You are a professional business consultant...`;
```

### Adjust Voice Command Sensitivity

Edit `src/hooks/use-voice-commands.js`:

```js
if (interpretation.confidence > 0.8) { // Increase for more accuracy
  executeCommand(interpretation);
}
```

### Custom Voice Commands

Add to `pageMap` in `use-voice-commands.js`:

```js
const pageMap = {
  // ... existing
  'secret menu': '/hidden-features',
  'admin panel': '/admin',
};
```

---

## 📊 Cost Estimates

**OpenAI Pricing (as of 2025):**

| Feature | Model | Cost |
|---------|-------|------|
| Voice Input | Whisper | $0.006 / minute |
| AI Chat | GPT-4 Turbo | $0.01 / 1K tokens |
| Text-to-Speech | TTS-1 | $0.015 / 1K chars |
| Suggestions | GPT-4 Turbo | $0.01 / 1K tokens |

**Estimated Monthly Cost:**
- 50 presentations/month
- 10 voice commands each
- 5 AI chat messages each
- **Total: ~$5-10/month**

Very affordable for the value added!

---

## 🐛 Troubleshooting

### Voice Commands Not Working

**Check:**
1. Microphone permissions granted?
2. Voice button showing red when active?
3. Browser supports speech recognition?
4. Check console for errors

**Fix:**
```js
// Fallback to Whisper if browser API fails
if (!('webkitSpeechRecognition' in window)) {
  // Use Whisper instead
}
```

---

### AI Assistant Not Responding

**Check:**
1. OpenAI API key set in `.env.local`?
2. Key starts with `sk-`?
3. Check browser console for errors
4. Network tab shows API calls?

**Fix:**
```bash
# Verify env variable loaded
echo $VITE_OPENAI_API_KEY

# Restart dev server
npm run dev
```

---

### Transcription Accuracy Issues

**Improve:**
1. Speak clearly and at moderate pace
2. Reduce background noise
3. Use better microphone if available
4. Add custom vocabulary in Whisper prompt

---

## 🚀 Next Steps

1. **Add more voice commands** for your specific workflow
2. **Create custom AI assistants** for different presentation types
3. **Integrate with your CRM** - save voice notes to Supabase
4. **Add voice search** across all content
5. **Voice-controlled slide animations** for dramatic reveals
6. **Multi-language support** via Whisper
7. **Real-time translation** for international clients

---

## 📚 Additional Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Whisper Model Card](https://github.com/openai/whisper)
- [GPT-4 Best Practices](https://platform.openai.com/docs/guides/gpt-best-practices)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

## 💡 Pro Tips

1. **Demo the AI features first** when presenting to clients - it sets the tone
2. **Use voice commands** for navigation to keep eye contact with client
3. **Pre-load common questions** in AI assistant for faster responses
4. **Practice voice commands** before real presentations
5. **Keep AI assistant minimized** until needed - less distracting
6. **Use text-to-speech** for reading long content while showing visuals
7. **Enable continuous voice mode** only during active presentation

---

**Your tablet is now an AI-powered presentation machine! 🚀**

Questions? Check the inline code documentation or ask the AI assistant itself!
