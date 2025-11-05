# Quick Start Guide - Custom Presentations

## 🚀 Get Started in 5 Minutes

### 1. Apply Database Migration (1 minute)

Open Supabase SQL Editor and run:

```sql
CREATE POLICY "Public can view active clients"
    ON ai_presenter_clients
    FOR SELECT
    USING (status = 'active');
```

**URL**: https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/sql/new

### 2. Start Dev Server (30 seconds)

```bash
npm run dev
```

### 3. Create Test Data (2 minutes)

#### Create a Client
1. Go to: http://localhost:5173/admin/clients
2. Click "Add New Client"
3. Fill in:
   - Name: "Demo Client"
   - Slug: "demo"
   - Status: **Active**
4. Save

#### Create Presentation & Slides

In Supabase SQL Editor, run (replace `CLIENT_ID`):

```sql
-- Create presentation
INSERT INTO ai_presenter_presentations (client_id, title, is_default)
VALUES ('CLIENT_ID', 'Demo Presentation', true)
RETURNING id;

-- Create slides (replace PRESENTATION_ID)
INSERT INTO ai_presenter_slides (presentation_id, title, content, order_index, is_visible)
VALUES
    ('PRESENTATION_ID', 'Welcome', '<p>Welcome to our demo!</p>', 0, true),
    ('PRESENTATION_ID', 'Features', '<p>Here are our amazing features.</p>', 1, true),
    ('PRESENTATION_ID', 'Contact Us', '<p>Ready to get started?</p>', 2, true);
```

### 4. Generate Access Link (30 seconds)

1. Go to: http://localhost:5173/admin/access-links
2. Select "Demo Client"
3. Click "Generate Access Link"
4. Copy the link

### 5. Test It! (1 minute)

1. Open the copied link in a new tab
2. See your presentation with keyboard navigation:
   - `←` `→` to navigate
   - `F` for fullscreen

## 🎉 Done!

You now have a working custom presentation system.

## 📚 Full Documentation

- **Complete Guide**: `PRESENTATION_VIEWER_IMPLEMENTATION.md`
- **Implementation Status**: `CUSTOM_PRESENTATIONS_STATUS.md`
- **Migration Details**: `APPLY_RLS_FIX.md`

## ⚡ Key Features

✅ Token-based access control
✅ Password protection
✅ Expiration dates
✅ View limits
✅ Client branding
✅ Analytics tracking
✅ Keyboard shortcuts
✅ Mobile support

## 🔑 Keyboard Shortcuts

- `← →` Navigate slides
- `F` Toggle fullscreen
- `ESC` Exit fullscreen
- `Space` Next slide
