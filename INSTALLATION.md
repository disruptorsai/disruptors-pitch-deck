# AI Presenter - Installation & Setup Guide

Complete step-by-step instructions for installing and configuring AI Presenter.

---

## Prerequisites

Before you begin, ensure you have:

- [x] **Node.js 18+** installed ([Download](https://nodejs.org/))
- [x] **npm or yarn** package manager
- [x] **Supabase account** with existing Disruptors AI project
- [x] **Anthropic API key** ([Get one](https://console.anthropic.com/))
- [x] **Netlify account** for deployment ([Sign up](https://app.netlify.com/signup))
- [x] **Git** installed

---

## Installation Steps

### 1. Install Required Dependencies

The migration requires these additional npm packages:

```bash
npm install @supabase/supabase-js @anthropic-ai/sdk
```

Or add to your `package.json`:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "@anthropic-ai/sdk": "^0.20.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

Install all dependencies:

```bash
npm install
```

### 2. Database Migration

#### Apply SQL Migration

1. **Open Supabase Dashboard**
   - Navigate to: `https://app.supabase.com/project/[your-project-id]`

2. **Go to SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

3. **Copy Migration SQL**
   - Open: `supabase/migrations/20250113_ai_presenter_schema.sql`
   - Copy entire contents (Ctrl+A, Ctrl+C)

4. **Execute Migration**
   - Paste into SQL Editor
   - Click **Run** (bottom right)
   - Wait for completion
   - Verify: "Success. No rows returned"

5. **Verify Tables Created**
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name LIKE 'ai_presenter_%';
   ```

   Expected result: 11 tables listed

#### Create Storage Bucket

1. **Go to Storage**
   - Click **Storage** in Supabase Dashboard

2. **Create Bucket**
   - Click **Create Bucket**
   - Name: `ai-presenter-files`
   - Public: **Unchecked** (private)
   - File size limit: `52428800` (50MB)
   - Allowed MIME types: Leave empty
   - Click **Create Bucket**

3. **Verify Bucket**
   - You should see `ai-presenter-files` in the bucket list

### 3. Environment Configuration

#### Get Supabase Credentials

1. **Navigate to Settings → API**
   - Project URL: `https://[project-id].supabase.co`
   - anon public key: `eyJh...` (visible)
   - service_role key: `eyJh...` (click to reveal)

2. **Copy these values** - You'll need them next

#### Get Anthropic API Key

1. **Visit Anthropic Console**
   - Go to: https://console.anthropic.com/
   - Log in or sign up

2. **Generate API Key**
   - Navigate to **API Keys**
   - Click **Create Key**
   - Copy the key immediately (it won't be shown again)

#### Create Environment File

1. **Copy Template**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`**
   ```bash
   # Open in your editor
   nano .env.local
   # or
   code .env.local
   ```

3. **Fill in Values**
   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...your-anon-key...
   SUPABASE_SERVICE_ROLE_KEY=eyJh...your-service-role-key...

   # Anthropic API
   ANTHROPIC_API_KEY=sk-ant-...your-anthropic-key...

   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   NEXT_PUBLIC_ANALYTICS_ENABLED=true
   NEXT_PUBLIC_DEBUG=false
   NEXT_PUBLIC_VERBOSE_LOGGING=false
   ```

4. **Save and Close**

#### Verify Configuration

```bash
# Check that all required env vars are set
node -e "
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ANTHROPIC_API_KEY'
];
const missing = required.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error('Missing required environment variables:', missing);
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set');
}
"
```

### 4. Data Migration

You have two options: automated migration from Base44 or manual client creation.

#### Option A: Automated Migration (If Migrating from Base44)

1. **Configure Migration**

   Edit `scripts/migrate-from-base44.ts`:

   ```typescript
   const config: MigrationConfig = {
     clientSlug: 'your-client-slug',
     clientName: 'Your Client Name',
     clientDescription: 'Description of your client',
     base44DataPath: 'api/entities.js', // Relative to project root
   };
   ```

2. **Run Migration**
   ```bash
   npx ts-node scripts/migrate-from-base44.ts
   ```

3. **Verify Output**
   ```
   🚀 Starting Base44 Migration...
   ✅ Client created: Your Client Name
   ✅ Presentation created
   ✅ 5 slides migrated
   ✅ 3 services migrated
   ✅ 2 case studies migrated
   ✅ 4 team members migrated
   ✅ Access link created: [token]
   ```

#### Option B: Manual Test Client Creation

1. **Create Test Script**

   Create `scripts/create-test-client.ts`:

   ```typescript
   import { adminSDK } from '../src/lib/ai-presenter-sdk';

   async function createTestClient() {
     console.log('Creating test client...');

     // 1. Create client
     const client = await adminSDK.createClient({
       name: 'Test Client',
       slug: 'test-client',
       description: 'A test client for development',
       website: 'https://example.com',
       status: 'active',
     });

     console.log('✅ Client created:', client.id);

     // 2. Create presentation
     const presentation = await adminSDK.createPresentation({
       client_id: client.id,
       title: 'Test Presentation',
       subtitle: 'Getting Started with AI Presenter',
       description: 'This is a test presentation',
       is_default: true,
     });

     console.log('✅ Presentation created:', presentation.id);

     // 3. Create slides
     const slides = [
       {
         title: 'Welcome',
         subtitle: 'Introduction',
         content: '# Welcome to AI Presenter\n\nYour presentation platform',
         slide_type: 'hero',
         order_index: 0,
       },
       {
         title: 'Features',
         subtitle: 'What We Offer',
         content: '- Feature 1\n- Feature 2\n- Feature 3',
         slide_type: 'content',
         order_index: 1,
       },
     ];

     for (const slideData of slides) {
       await adminSDK.createSlide({
         presentation_id: presentation.id,
         ...slideData,
       });
     }

     console.log('✅ 2 slides created');

     // 4. Create access link
     const accessLink = await adminSDK.createAccessLink({
       client_id: client.id,
       name: 'Test Access Link',
       status: 'active',
     });

     console.log('✅ Access link created!');
     console.log('\n═══════════════════════════════════════');
     console.log('🔗 Access Token:', accessLink.token);
     console.log('🌐 URL:', `http://localhost:3000/p/${accessLink.token}`);
     console.log('═══════════════════════════════════════\n');
   }

   createTestClient()
     .then(() => {
       console.log('✅ Test client created successfully!');
       process.exit(0);
     })
     .catch((error) => {
       console.error('❌ Error:', error);
       process.exit(1);
     });
   ```

2. **Run Test Script**
   ```bash
   npx ts-node scripts/create-test-client.ts
   ```

3. **Save Access Token**
   - Copy the access token from the output
   - You'll use this to test the presentation

### 5. Start Development Server

```bash
npm run dev
```

Expected output:
```
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.1.x:3000/
```

### 6. Verify Installation

#### Test Database Connection

1. **Create Test File:** `scripts/test-connection.ts`

```typescript
import { supabase, supabaseAdmin } from '../src/lib/supabase-client';

async function testConnection() {
  console.log('Testing Supabase connection...');

  // Test public client
  const { data: clients, error: publicError } = await supabase
    .from('ai_presenter_clients')
    .select('count');

  if (publicError) {
    console.error('❌ Public client error:', publicError);
  } else {
    console.log('✅ Public client connection successful');
  }

  // Test admin client
  const { data: adminData, error: adminError } = await supabaseAdmin
    .from('ai_presenter_clients')
    .select('*')
    .limit(1);

  if (adminError) {
    console.error('❌ Admin client error:', adminError);
  } else {
    console.log('✅ Admin client connection successful');
    console.log('✅ Found', adminData?.length || 0, 'client(s)');
  }
}

testConnection();
```

2. **Run Test**
```bash
npx ts-node scripts/test-connection.ts
```

#### Test Presentation Access

1. **Open Browser**
   - Navigate to: `http://localhost:3000/p/[your-access-token]`
   - Replace `[your-access-token]` with the token from step 4

2. **Verify**
   - You should see your test presentation
   - Slides should be navigable
   - No console errors

#### Test Analytics Tracking

1. **View Presentation**
   - Navigate between slides
   - Spend a few seconds on each slide

2. **Check Database**
   ```sql
   -- In Supabase SQL Editor
   SELECT
     event_type,
     COUNT(*) as count
   FROM ai_presenter_analytics_events
   GROUP BY event_type;
   ```

3. **Expected Result**
   ```
   event_type       | count
   -----------------+-------
   presentation_view | 1
   slide_view        | 2+
   ```

#### Test AI Generation (Optional)

1. **Create Test File:** `scripts/test-ai.ts`

```typescript
import { adminSDK } from '../src/lib/ai-presenter-sdk';

async function testAI() {
  console.log('Testing AI generation...');

  const client = await adminSDK.getClientBySlug('test-client');

  if (!client) {
    console.error('❌ Test client not found');
    return;
  }

  console.log('Generating competitive analysis...');

  const analysis = await adminSDK.generateCompetitiveAnalysis(
    client.id,
    {
      name: 'Test Company',
      industry: 'Technology',
      description: 'A test company in the technology sector',
    }
  );

  console.log('✅ AI analysis generated!');
  console.log('\nExecutive Summary:');
  console.log(analysis.executive_summary);
  console.log('\nUnique Value Proposition:');
  console.log(analysis.unique_value_proposition);
}

testAI()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
```

2. **Run Test**
```bash
npx ts-node scripts/test-ai.ts
```

---

## Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"

**Solution:**
```bash
npm install @supabase/supabase-js @anthropic-ai/sdk
```

### Issue: "Multiple GoTrueClient instances" Warning

**Cause:** Creating multiple Supabase client instances

**Solution:** Always import from centralized client:
```typescript
// ✅ Correct
import { supabase, supabaseAdmin } from '@/lib/supabase-client';

// ❌ Wrong
import { createClient } from '@supabase/supabase-js';
const myClient = createClient(...);
```

### Issue: Database Migration Fails

**Check:**
1. SQL syntax errors in migration file
2. Existing tables with same names
3. Missing PostgreSQL extensions
4. Insufficient permissions

**Solution:**
```sql
-- Check for existing tables
SELECT table_name
FROM information_schema.tables
WHERE table_name LIKE 'ai_presenter_%';

-- If tables exist, drop them (CAREFUL!)
-- DROP TABLE IF EXISTS ai_presenter_clients CASCADE;

-- Check extensions
SELECT * FROM pg_extension
WHERE extname IN ('uuid-ossp', 'pgcrypto');

-- Install missing extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### Issue: Environment Variables Not Loading

**Check:**
1. File is named `.env.local` (not `.env`)
2. No extra spaces around `=`
3. No quotes around values (unless needed)
4. File is in project root

**Solution:**
```bash
# Verify file exists
ls -la .env.local

# Check content
cat .env.local

# Verify variables are loaded
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

### Issue: Access Token Validation Fails

**Debug:**
```typescript
import { sdk } from '@/lib/ai-presenter-sdk';

const result = await sdk.validateAccessToken('your-token-here');
console.log(result);
// Check result.error for specific issue
```

**Common Causes:**
- Token doesn't exist
- Link expired
- Max views reached
- Wrong password
- Link revoked

### Issue: TypeScript Errors

**Solution:**
```bash
# Install type definitions
npm install --save-dev @types/react @types/react-dom @types/node

# Check TypeScript config
cat tsconfig.json

# Run type check
npx tsc --noEmit
```

---

## Next Steps

After successful installation:

1. **Read Documentation**
   - [Quick Start Guide](./docs/QUICK_START.md)
   - [Complete Migration Guide](./docs/AI_PRESENTER_MIGRATION_COMPLETE.md)
   - [API Reference](./docs/AI_PRESENTER_MIGRATION_COMPLETE.md#api-reference)

2. **Build Admin Interface**
   - Create client management pages
   - Add access link generator
   - Build analytics dashboard

3. **Customize Presentation UI**
   - Update slide templates
   - Add custom themes
   - Enhance animations

4. **Deploy to Production**
   - Follow [Deployment Guide](./docs/AI_PRESENTER_MIGRATION_COMPLETE.md#deployment-guide)
   - Configure Netlify
   - Set production environment variables

---

## Support

If you encounter issues not covered here:

1. Check [Troubleshooting Guide](./docs/AI_PRESENTER_MIGRATION_COMPLETE.md#troubleshooting)
2. Review error logs in browser console
3. Check Supabase Dashboard logs
4. Verify all environment variables are correct

---

**Installation Time:** ~20-30 minutes
**Difficulty:** Intermediate
**Prerequisites:** Basic knowledge of JavaScript, TypeScript, and command line

Happy building! 🚀
