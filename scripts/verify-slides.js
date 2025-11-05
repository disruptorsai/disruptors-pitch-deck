/**
 * Verify Slides Data
 *
 * Queries and displays detailed information about inserted slides
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const CLIENT_ID = 'c1111111-1111-1111-1111-111111111111';

async function verifySlides() {
  console.log('🔍 Fetching slide details...\n');

  const { data: slides, error } = await supabase
    .from('ai_presenter_slides')
    .select(`
      id,
      presentation_id,
      order_index,
      title,
      subtitle,
      content,
      slide_type,
      is_visible,
      created_at,
      presentation:ai_presenter_presentations(id, title, client_id)
    `)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`📊 Total slides found: ${slides.length}\n`);

  slides.forEach((slide, idx) => {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`Slide ${idx + 1}/${slides.length}`);
    console.log('───────────────────────────────────────────────────────────────');
    console.log(`Order:        ${slide.order_index}`);
    console.log(`Type:         ${slide.slide_type}`);
    console.log(`Title:        ${slide.title}`);
    console.log(`Subtitle:     ${slide.subtitle || '(none)'}`);
    console.log(`Visible:      ${slide.is_visible ? 'Yes' : 'No'}`);
    console.log(`Content:      ${slide.content ? slide.content.substring(0, 80) + '...' : '(none)'}`);
    console.log(`ID:           ${slide.id}`);
    console.log(`Presentation: ${slide.presentation?.id || 'N/A'}`);
    console.log(`Created:      ${new Date(slide.created_at).toLocaleString()}`);
  });

  console.log('═══════════════════════════════════════════════════════════════\n');

  // Summary
  const slideTypes = slides.reduce((acc, s) => {
    acc[s.slide_type] = (acc[s.slide_type] || 0) + 1;
    return acc;
  }, {});

  console.log('📈 Summary:');
  console.log(`   Total slides: ${slides.length}`);
  console.log(`   All visible: ${slides.every(s => s.is_visible) ? 'Yes ✓' : 'No ✗'}`);
  console.log(`   Slide types:`, slideTypes);
  console.log(`   Order indexes: ${slides.map(s => s.order_index).join(', ')}`);
  console.log(`   Presentation ID: ${slides[0]?.presentation?.id || 'N/A'}`);
  console.log(`   Client ID: ${slides[0]?.presentation?.client_id || 'N/A'}`);
}

verifySlides().then(() => process.exit(0));
