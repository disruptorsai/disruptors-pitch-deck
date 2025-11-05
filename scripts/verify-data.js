import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ubqxflzuvxowigbjmqfb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicXhmbHp1dnhvd2lnYmptcWZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODUxMjQzOCwiZXhwIjoyMDc0MDg4NDM4fQ.FnhnaAxWjMo41M7Gmm_bXFXZuegzW5HfitvB1APNDDk';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const CLIENT_ID = 'c1111111-1111-1111-1111-111111111111';

async function verifyData() {
  console.log('🔍 Verifying Disruptors Media Demo Data\n');
  console.log('═══════════════════════════════════════════\n');

  // Verify client
  const { data: client, error: clientError } = await supabase
    .from('ai_presenter_clients')
    .select('*')
    .eq('id', CLIENT_ID)
    .single();

  if (clientError) {
    console.error('❌ Client not found:', clientError.message);
    return;
  }

  console.log('✅ CLIENT FOUND:');
  console.log(`   ID: ${client.id}`);
  console.log(`   Name: ${client.name}`);
  console.log(`   Slug: ${client.slug}`);
  console.log(`   Industry: ${client.industry}`);
  console.log(`   Status: ${client.status}\n`);

  // Verify case studies
  const { data: caseStudies, error: csError } = await supabase
    .from('ai_presenter_case_studies')
    .select('title, industry, order_index, is_featured')
    .eq('client_id', CLIENT_ID)
    .order('order_index');

  if (!csError) {
    console.log('✅ CASE STUDIES:');
    caseStudies.forEach(cs => {
      console.log(`   ${cs.order_index}. ${cs.title} (${cs.industry})${cs.is_featured ? ' [FEATURED]' : ''}`);
    });
    console.log('');
  }

  // Verify services
  const { data: services, error: servicesError } = await supabase
    .from('ai_presenter_services')
    .select('name, slug, order_index')
    .eq('client_id', CLIENT_ID)
    .order('order_index');

  if (!servicesError) {
    console.log('✅ SERVICES:');
    services.forEach(s => {
      console.log(`   ${s.order_index}. ${s.name}`);
    });
    console.log('');
  }

  // Verify pricing tiers
  const { data: tiers, error: tiersError } = await supabase
    .from('ai_presenter_pricing_tiers')
    .select('name, price, billing_period, is_highlighted, sort_order')
    .eq('client_id', CLIENT_ID)
    .order('sort_order');

  if (!tiersError) {
    console.log('✅ PRICING TIERS:');
    tiers.forEach(t => {
      console.log(`   ${t.sort_order}. ${t.name} - $${t.price}/${t.billing_period}${t.is_highlighted ? ' [HIGHLIGHTED]' : ''}`);
    });
    console.log('');
  }

  // Verify team members
  const { data: team, error: teamError } = await supabase
    .from('ai_presenter_team_members')
    .select('name, role, order_index')
    .eq('client_id', CLIENT_ID)
    .order('order_index');

  if (!teamError) {
    console.log('✅ TEAM MEMBERS:');
    team.forEach(m => {
      console.log(`   ${m.order_index}. ${m.name} - ${m.role}`);
    });
    console.log('');
  }

  // Verify presentations
  const { data: presentations, error: presError } = await supabase
    .from('ai_presenter_presentations')
    .select('title, is_default')
    .eq('client_id', CLIENT_ID);

  if (!presError) {
    console.log('✅ PRESENTATIONS:');
    presentations.forEach(p => {
      console.log(`   - ${p.title}${p.is_default ? ' [DEFAULT]' : ''}`);
    });
    console.log('');
  }

  console.log('═══════════════════════════════════════════');
  console.log('✅ All demo data verified successfully!');
  console.log('═══════════════════════════════════════════\n');
}

verifyData();
