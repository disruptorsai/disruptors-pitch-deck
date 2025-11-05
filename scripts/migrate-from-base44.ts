/**
 * Migration Script: Base44 to Custom AI Presenter System
 *
 * This script migrates data from Base44 entities to the new Supabase-based system
 * Run with: npx ts-node scripts/migrate-from-base44.ts
 */

import { supabaseAdmin } from '../src/lib/supabase-client';
import { readFileSync } from 'fs';
import { join } from 'path';

interface MigrationConfig {
  clientSlug: string;
  clientName: string;
  clientDescription?: string;
  base44DataPath: string; // Path to Base44 entities.js export
}

class Base44Migration {
  private config: MigrationConfig;

  constructor(config: MigrationConfig) {
    this.config = config;
  }

  /**
   * Run complete migration
   */
  async migrate() {
    console.log('🚀 Starting Base44 Migration...\n');

    try {
      // Step 1: Create client
      console.log('📝 Step 1: Creating client...');
      const client = await this.createClient();
      console.log(`✅ Client created: ${client.name} (${client.id})\n`);

      // Step 2: Migrate presentation data
      console.log('📊 Step 2: Migrating presentation...');
      const presentation = await this.migratePresentation(client.id);
      console.log(`✅ Presentation created: ${presentation.id}\n`);

      // Step 3: Migrate slides
      console.log('📑 Step 3: Migrating slides...');
      const slides = await this.migrateSlides(presentation.id);
      console.log(`✅ ${slides.length} slides migrated\n`);

      // Step 4: Migrate services
      console.log('🛠️  Step 4: Migrating services...');
      const services = await this.migrateServices(client.id);
      console.log(`✅ ${services.length} services migrated\n`);

      // Step 5: Migrate case studies
      console.log('📚 Step 5: Migrating case studies...');
      const caseStudies = await this.migrateCaseStudies(client.id);
      console.log(`✅ ${caseStudies.length} case studies migrated\n`);

      // Step 6: Migrate team members
      console.log('👥 Step 6: Migrating team members...');
      const teamMembers = await this.migrateTeamMembers(client.id);
      console.log(`✅ ${teamMembers.length} team members migrated\n`);

      // Step 7: Create initial access link
      console.log('🔗 Step 7: Creating access link...');
      const accessLink = await this.createAccessLink(client.id);
      console.log(`✅ Access link created: ${accessLink.token}\n`);

      // Summary
      console.log('✨ Migration Complete!\n');
      console.log('═══════════════════════════════════════');
      console.log('📊 Migration Summary:');
      console.log(`   • Client: ${client.name}`);
      console.log(`   • Presentation: ${presentation.title}`);
      console.log(`   • Slides: ${slides.length}`);
      console.log(`   • Services: ${services.length}`);
      console.log(`   • Case Studies: ${caseStudies.length}`);
      console.log(`   • Team Members: ${teamMembers.length}`);
      console.log(`   • Access Token: ${accessLink.token}`);
      console.log('═══════════════════════════════════════\n');
      console.log(`🌐 Access URL: ${process.env.NEXT_PUBLIC_APP_URL}/p/${accessLink.token}`);
      console.log(`🔧 Admin URL: ${process.env.NEXT_PUBLIC_APP_URL}/admin/clients/${client.slug}\n`);

    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  /**
   * Create client record
   */
  private async createClient() {
    const { data, error } = await supabaseAdmin
      .from('ai_presenter_clients')
      .insert([
        {
          name: this.config.clientName,
          slug: this.config.clientSlug,
          description: this.config.clientDescription || '',
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Migrate presentation data from Base44
   */
  private async migratePresentation(clientId: string) {
    // Load Base44 data
    const base44Data = this.loadBase44Data();

    const { data, error } = await supabaseAdmin
      .from('ai_presenter_presentations')
      .insert([
        {
          client_id: clientId,
          title: base44Data.presentation?.title || this.config.clientName,
          subtitle: base44Data.presentation?.subtitle || '',
          description: base44Data.presentation?.description || '',
          hero_image_url: base44Data.presentation?.heroImage || null,
          cta_text: 'Learn More',
          is_default: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Migrate slides from Base44
   */
  private async migrateSlides(presentationId: string) {
    const base44Data = this.loadBase44Data();
    const slides = base44Data.slides || [];

    if (slides.length === 0) {
      console.log('⚠️  No slides found in Base44 data');
      return [];
    }

    const slidesData = slides.map((slide: any, index: number) => ({
      presentation_id: presentationId,
      title: slide.title || `Slide ${index + 1}`,
      subtitle: slide.subtitle || null,
      content: slide.content || null,
      image_url: slide.imageUrl || null,
      background_image_url: slide.backgroundImage || null,
      slide_type: slide.type || 'content',
      order_index: index,
      is_visible: true,
    }));

    const { data, error } = await supabaseAdmin
      .from('ai_presenter_slides')
      .insert(slidesData)
      .select();

    if (error) throw error;
    return data;
  }

  /**
   * Migrate services from Base44
   */
  private async migrateServices(clientId: string) {
    const base44Data = this.loadBase44Data();
    const services = base44Data.services || [];

    if (services.length === 0) {
      console.log('⚠️  No services found in Base44 data');
      return [];
    }

    const servicesData = services.map((service: any, index: number) => ({
      client_id: clientId,
      name: service.name || `Service ${index + 1}`,
      slug: this.slugify(service.name || `service-${index + 1}`),
      tagline: service.tagline || null,
      description: service.description || null,
      features: service.features || [],
      icon_url: service.iconUrl || null,
      image_url: service.imageUrl || null,
      order_index: index,
      is_visible: true,
      is_featured: service.featured || false,
    }));

    const { data, error } = await supabaseAdmin
      .from('ai_presenter_services')
      .insert(servicesData)
      .select();

    if (error) throw error;
    return data;
  }

  /**
   * Migrate case studies from Base44
   */
  private async migrateCaseStudies(clientId: string) {
    const base44Data = this.loadBase44Data();
    const caseStudies = base44Data.caseStudies || [];

    if (caseStudies.length === 0) {
      console.log('⚠️  No case studies found in Base44 data');
      return [];
    }

    const caseStudiesData = caseStudies.map((caseStudy: any, index: number) => ({
      client_id: clientId,
      title: caseStudy.title || `Case Study ${index + 1}`,
      slug: this.slugify(caseStudy.title || `case-study-${index + 1}`),
      client_name: caseStudy.clientName || 'Client',
      industry: caseStudy.industry || null,
      challenge: caseStudy.challenge || null,
      solution: caseStudy.solution || null,
      results: caseStudy.results || null,
      testimonial: caseStudy.testimonial || null,
      testimonial_author: caseStudy.testimonialAuthor || null,
      testimonial_role: caseStudy.testimonialRole || null,
      featured_image_url: caseStudy.imageUrl || null,
      logo_url: caseStudy.logoUrl || null,
      metrics: caseStudy.metrics || [],
      tags: caseStudy.tags || [],
      order_index: index,
      is_visible: true,
      is_featured: caseStudy.featured || false,
    }));

    const { data, error } = await supabaseAdmin
      .from('ai_presenter_case_studies')
      .insert(caseStudiesData)
      .select();

    if (error) throw error;
    return data;
  }

  /**
   * Migrate team members from Base44
   */
  private async migrateTeamMembers(clientId: string) {
    const base44Data = this.loadBase44Data();
    const teamMembers = base44Data.team || [];

    if (teamMembers.length === 0) {
      console.log('⚠️  No team members found in Base44 data');
      return [];
    }

    const teamMembersData = teamMembers.map((member: any, index: number) => ({
      client_id: clientId,
      name: member.name || 'Team Member',
      role: member.role || 'Team Member',
      bio: member.bio || null,
      photo_url: member.photoUrl || null,
      linkedin_url: member.linkedinUrl || null,
      twitter_url: member.twitterUrl || null,
      email: member.email || null,
      order_index: index,
      is_visible: true,
    }));

    const { data, error } = await supabaseAdmin
      .from('ai_presenter_team_members')
      .insert(teamMembersData)
      .select();

    if (error) throw error;
    return data;
  }

  /**
   * Create initial access link
   */
  private async createAccessLink(clientId: string) {
    // Generate token
    const { data: token, error: tokenError } = await supabaseAdmin.rpc(
      'ai_presenter_generate_access_token'
    );

    if (tokenError) throw tokenError;

    const { data, error } = await supabaseAdmin
      .from('ai_presenter_access_links')
      .insert([
        {
          client_id: clientId,
          token: token,
          name: 'Default Access Link',
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Load Base44 data from entities.js export
   */
  private loadBase44Data(): any {
    try {
      const dataPath = join(process.cwd(), this.config.base44DataPath);
      const fileContent = readFileSync(dataPath, 'utf-8');

      // Try to parse as JSON
      try {
        return JSON.parse(fileContent);
      } catch {
        // If not JSON, try to evaluate as JS module export
        const exportMatch = fileContent.match(/export\s+const\s+\w+\s*=\s*({[\s\S]*});?/);
        if (exportMatch) {
          return eval(`(${exportMatch[1]})`);
        }
        throw new Error('Could not parse Base44 data file');
      }
    } catch (error) {
      console.error('Error loading Base44 data:', error);
      return {
        presentation: null,
        slides: [],
        services: [],
        caseStudies: [],
        team: [],
      };
    }
  }

  /**
   * Convert string to URL-friendly slug
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

/**
 * Example usage
 */
async function runMigration() {
  const config: MigrationConfig = {
    clientSlug: 'example-client',
    clientName: 'Example Client',
    clientDescription: 'Example client description',
    base44DataPath: 'api/entities.js', // Relative to project root
  };

  const migration = new Base44Migration(config);
  await migration.migrate();
}

// Run if called directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('✅ Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

export { Base44Migration, MigrationConfig };
