/**
 * Apply Sample Data Migration
 * Populates case studies, services, team members, etc.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 Applying Sample Data Migration\n');

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function applySampleData() {
  try {
    const clientId = 'c1111111-1111-1111-1111-111111111111';

    // Check if case studies already exist
    const { count: caseStudyCount } = await supabase
      .from('ai_presenter_case_studies')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId);

    if (caseStudyCount > 0) {
      console.log(`⚠ ${caseStudyCount} case studies already exist. Skipping case studies.`);
    } else {
      console.log('📝 Inserting case studies...');

      const caseStudies = [
        {
          client_id: clientId,
          title: 'SaaS Scale-Up: 300% Revenue Growth',
          slug: 'saas-scale-up',
          client_name: 'CloudTech Solutions',
          industry: 'B2B SaaS',
          challenge: 'A growing SaaS platform struggled to convert trial users into paying customers. Their organic traffic was high but conversion rates were below industry benchmarks.',
          solution: 'We implemented an AI-powered lead scoring system combined with personalized email sequences and strategic content marketing. Automated workflows identified high-intent prospects and delivered targeted messaging at optimal times.',
          results: {
            roi_percentage: 327,
            revenue_increase: '$2.4M',
            conversion_lift: '185%',
            time_to_value: '90 days'
          },
          metrics: [
            { label: 'Revenue Growth', value: '327%', type: 'percentage' },
            { label: 'Trial-to-Paid Conversion', value: '185%', type: 'percentage' },
            { label: 'MRR Increase', value: '$2.4M', type: 'currency' }
          ],
          order_index: 1,
          is_featured: true
        },
        {
          client_id: clientId,
          title: 'E-Commerce: Doubled ROAS in 6 Months',
          slug: 'ecommerce-doubled-roas',
          client_name: 'StyleHub Retail',
          industry: 'E-Commerce',
          challenge: 'An established e-commerce brand was experiencing declining ad performance and rising customer acquisition costs across paid channels.',
          solution: 'We restructured their entire paid media strategy using AI-driven audience segmentation and dynamic creative optimization. Implemented automated bidding strategies and cross-channel attribution modeling.',
          results: {
            roi_percentage: 215,
            roas_improvement: '2.4x',
            cac_reduction: '-42%',
            time_to_value: '120 days'
          },
          metrics: [
            { label: 'ROAS', value: '2.4x', type: 'multiplier' },
            { label: 'CAC Reduction', value: '-42%', type: 'percentage' },
            { label: 'Revenue Increase', value: '215%', type: 'percentage' }
          ],
          order_index: 2,
          is_featured: true
        },
        {
          client_id: clientId,
          title: 'Healthcare: AI-Powered Patient Acquisition',
          slug: 'healthcare-patient-acquisition',
          client_name: 'MedCare Specialists',
          industry: 'Healthcare',
          challenge: 'A multi-location healthcare provider needed to fill appointment slots while maintaining HIPAA compliance and trust.',
          solution: 'Developed a compliant digital marketing system with AI-optimized local SEO, targeted content, and intelligent lead routing based on specialty and location.',
          results: {
            roi_percentage: 198,
            new_patients: '2,400+',
            cost_per_acquisition: '-55%',
            time_to_value: '75 days'
          },
          metrics: [
            { label: 'New Patients', value: '2,400+', type: 'number' },
            { label: 'Cost Per Acquisition', value: '-55%', type: 'percentage' },
            { label: 'ROI', value: '198%', type: 'percentage' }
          ],
          order_index: 3,
          is_featured: true
        }
      ];

      const { error } = await supabase
        .from('ai_presenter_case_studies')
        .insert(caseStudies);

      if (error) throw error;
      console.log(`✅ Inserted ${caseStudies.length} case studies`);
    }

    // Check if services exist
    const { count: serviceCount } = await supabase
      .from('ai_presenter_services')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId);

    if (serviceCount > 0) {
      console.log(`⚠ ${serviceCount} services already exist. Skipping services.`);
    } else {
      console.log('📝 Inserting services...');

      const services = [
        {
          client_id: clientId,
          name: 'AI-Powered Strategy',
          slug: 'ai-strategy',
          description: 'Machine learning algorithms analyze your market, competitors, and audience to identify optimal growth opportunities and predict campaign performance.',
          icon: 'brain',
          features: [
            'Predictive Analytics & Forecasting',
            'Automated Audience Segmentation',
            'Competitive Intelligence Dashboard',
            'AI-Driven Budget Optimization'
          ],
          pricing_model: 'custom',
          is_featured: true,
          order_index: 1
        },
        {
          client_id: clientId,
          name: 'Performance Marketing',
          slug: 'performance-marketing',
          description: 'Data-driven paid acquisition across Google, Meta, LinkedIn, and emerging platforms with continuous optimization and transparent ROI tracking.',
          icon: 'target',
          features: [
            'Multi-Channel Campaign Management',
            'Advanced A/B Testing & Experimentation',
            'Real-Time Performance Dashboards',
            'Attribution Modeling & Analysis'
          ],
          pricing_model: 'percentage_of_spend',
          is_featured: true,
          order_index: 2
        },
        {
          client_id: clientId,
          name: 'Content Excellence',
          slug: 'content-marketing',
          description: 'AI-assisted content creation and distribution that resonates with your audience, drives engagement, and improves search rankings.',
          icon: 'pen-tool',
          features: [
            'SEO-Optimized Content Strategy',
            'AI-Powered Content Generation',
            'Multi-Channel Distribution',
            'Performance Tracking & Optimization'
          ],
          pricing_model: 'retainer',
          is_featured: true,
          order_index: 3
        },
        {
          client_id: clientId,
          name: 'Analytics & Insights',
          slug: 'analytics',
          description: 'Comprehensive reporting, custom dashboards, and actionable insights that guide strategic decisions and prove marketing ROI.',
          icon: 'chart-line',
          features: [
            'Custom Analytics Dashboards',
            'Automated Reporting & Alerts',
            'Predictive Performance Modeling',
            'Marketing Attribution Analysis'
          ],
          pricing_model: 'included',
          is_featured: false,
          order_index: 4
        }
      ];

      const { error } = await supabase
        .from('ai_presenter_services')
        .insert(services);

      if (error) throw error;
      console.log(`✅ Inserted ${services.length} services`);
    }

    console.log('\n✅ Sample data migration complete!\n');

  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error);
    process.exit(1);
  }
}

applySampleData();
