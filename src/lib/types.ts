/**
 * TypeScript Type Definitions for AI Presenter
 *
 * Complete type definitions for all database entities and API responses
 */

// =====================================================
// DATABASE TYPES
// =====================================================

export type ClientStatus = 'active' | 'archived' | 'draft';
export type AccessStatus = 'active' | 'expired' | 'revoked';
export type EventType =
  | 'presentation_view'
  | 'slide_view'
  | 'case_study_view'
  | 'service_view'
  | 'pdf_download'
  | 'link_click'
  | 'form_submit';

export interface Client {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  website?: string;
  email?: string;
  phone?: string;
  status: ClientStatus;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface AccessLink {
  id: string;
  client_id: string;
  token: string;
  name: string;
  status: AccessStatus;
  expires_at?: string;
  max_views?: number;
  view_count: number;
  password_hash?: string;
  custom_message?: string;
  allowed_sections?: string[];
  last_accessed_at?: string;
  ip_whitelist?: string[];
  created_at: string;
  created_by?: string;
}

export interface Presentation {
  id: string;
  client_id: string;
  title: string;
  subtitle?: string;
  description?: string;
  hero_image_url?: string;
  hero_video_url?: string;
  cta_text?: string;
  cta_url?: string;
  theme?: Record<string, any>;
  layout?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Slide {
  id: string;
  presentation_id: string;
  title: string;
  subtitle?: string;
  content?: string;
  image_url?: string;
  video_url?: string;
  background_image_url?: string;
  slide_type?: string;
  layout?: Record<string, any>;
  order_index: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  client_id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  features?: Array<{
    title: string;
    description?: string;
    icon?: string;
  }>;
  icon_url?: string;
  image_url?: string;
  pricing?: {
    amount?: number;
    currency?: string;
    billing_period?: string;
    features?: string[];
  };
  order_index: number;
  is_visible: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CaseStudy {
  id: string;
  client_id: string;
  title: string;
  slug: string;
  client_name: string;
  industry?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  testimonial?: string;
  testimonial_author?: string;
  testimonial_role?: string;
  featured_image_url?: string;
  logo_url?: string;
  gallery_urls?: string[];
  metrics?: Array<{
    label: string;
    value: string;
    unit?: string;
  }>;
  tags?: string[];
  category?: string;
  order_index: number;
  is_visible: boolean;
  is_featured: boolean;
  project_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CompetitiveAnalysis {
  id: string;
  client_id: string;
  title: string;
  executive_summary?: string;
  market_size?: string;
  market_trends?: Array<{
    title: string;
    description: string;
    impact?: 'high' | 'medium' | 'low';
  }>;
  competitors?: Array<{
    name: string;
    description?: string;
    strengths?: string[];
    weaknesses?: string[];
    market_share?: string;
    website?: string;
  }>;
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
  unique_value_proposition?: string;
  competitive_advantages?: string[];
  generated_by_ai: boolean;
  ai_model?: string;
  generation_prompt?: string;
  generated_at?: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  client_id: string;
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  email?: string;
  order_index: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEvent {
  id: string;
  client_id?: string;
  access_link_id?: string;
  event_type: EventType;
  event_data?: Record<string, any>;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  page_url?: string;
  page_title?: string;
  created_at: string;
}

export interface FileUpload {
  id: string;
  client_id: string;
  filename: string;
  storage_path: string;
  public_url?: string;
  file_size?: number;
  mime_type?: string;
  file_type?: string;
  entity_type?: string;
  entity_id?: string;
  uploaded_by?: string;
  created_at: string;
}

export interface CacheEntry {
  id: string;
  cache_key: string;
  cache_value: any;
  expires_at: string;
  created_at: string;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ValidationResult {
  valid: boolean;
  error?: string;
  requires_password?: boolean;
  client_id?: string;
  access_link_id?: string;
  allowed_sections?: string[];
  custom_message?: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface APIError {
  message: string;
  code: string;
  context: string;
  details?: any;
}

// =====================================================
// COMPONENT PROPS TYPES
// =====================================================

export interface PresentationData {
  client: Client;
  presentation: Presentation;
  slides: Slide[];
  services: Service[];
  caseStudies: CaseStudy[];
  competitiveAnalysis?: CompetitiveAnalysis;
  teamMembers: TeamMember[];
}

export interface AccessContext {
  isValid: boolean;
  clientId?: string;
  accessLinkId?: string;
  allowedSections?: string[];
  customMessage?: string;
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily?: string;
  customStyles?: Record<string, any>;
}

// =====================================================
// FORM TYPES
// =====================================================

export interface ClientFormData {
  name: string;
  slug: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  status?: ClientStatus;
}

export interface AccessLinkFormData {
  client_id: string;
  name: string;
  expires_at?: string;
  max_views?: number;
  password?: string;
  custom_message?: string;
  allowed_sections?: string[];
}

export interface SlideFormData {
  presentation_id: string;
  title: string;
  subtitle?: string;
  content?: string;
  slide_type?: string;
  image_url?: string;
  video_url?: string;
  background_image_url?: string;
  order_index?: number;
}

export interface ServiceFormData {
  client_id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  features?: Array<{
    title: string;
    description?: string;
    icon?: string;
  }>;
  icon_url?: string;
  image_url?: string;
  pricing?: {
    amount?: number;
    currency?: string;
    billing_period?: string;
  };
  order_index?: number;
}

export interface CaseStudyFormData {
  client_id: string;
  title: string;
  slug: string;
  client_name: string;
  industry?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  testimonial?: string;
  testimonial_author?: string;
  testimonial_role?: string;
  featured_image_url?: string;
  logo_url?: string;
  gallery_urls?: string[];
  metrics?: Array<{
    label: string;
    value: string;
    unit?: string;
  }>;
  tags?: string[];
  category?: string;
  project_date?: string;
  order_index?: number;
}

export interface TeamMemberFormData {
  client_id: string;
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  email?: string;
  order_index?: number;
}

// =====================================================
// AI SERVICE TYPES
// =====================================================

export interface AICompetitiveAnalysisInput {
  name: string;
  industry: string;
  description: string;
  competitors?: string[];
}

export interface AICompetitiveAnalysisOutput {
  title: string;
  executive_summary: string;
  market_size: string;
  market_trends: Array<{
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  competitors: Array<{
    name: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    market_share?: string;
  }>;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  unique_value_proposition: string;
  competitive_advantages: string[];
  ai_model: string;
  generation_prompt: string;
}

// =====================================================
// STORAGE SERVICE TYPES
// =====================================================

export interface UploadOptions {
  entityType?: string;
  entityId?: string;
  fileType?: string;
}

export interface UploadResult extends FileUpload {}

// =====================================================
// ANALYTICS SERVICE TYPES
// =====================================================

export interface TrackEventOptions {
  client_id?: string;
  access_link_id?: string;
  event_type: EventType;
  event_data?: Record<string, any>;
  session_id?: string;
  page_url?: string;
  page_title?: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  uniqueSessions: number;
  eventsByType: Record<string, number>;
  topPages: Array<{ page: string; views: number }>;
}

// =====================================================
// HOOK TYPES
// =====================================================

export interface UseClientResult {
  client: Client | null;
  loading: boolean;
  error: APIError | null;
  refetch: () => Promise<void>;
}

export interface UsePresentationResult {
  presentation: PresentationData | null;
  loading: boolean;
  error: APIError | null;
  refetch: () => Promise<void>;
}

export interface UseAccessLinkResult {
  isValid: boolean;
  loading: boolean;
  error: string | null;
  validate: (token: string, password?: string) => Promise<void>;
  context: AccessContext | null;
}

// =====================================================
// ADMIN TYPES
// =====================================================

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export interface AdminStats {
  totalClients: number;
  totalPresentations: number;
  totalViews: number;
  recentActivity: AnalyticsEvent[];
}

// =====================================================
// UTILITY TYPES
// =====================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type Nullable<T> = T | null;

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};
