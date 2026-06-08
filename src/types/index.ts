export interface User {
  id: string
  email: string
  role: 'student' | 'specialist' | 'admin'
  full_name?: string
  university?: string
  course?: string
  bio?: string
  subject_specialties?: string[]
  is_available?: boolean
  requirement_type?: string
}

export interface RequestItem {
  id: string
  student_id: string
  specialist_id?: string
  service_type: string
  subject_code?: string
  description: string
  file_urls?: string[]
  price?: number
  currency: 'USD' | 'EUR' | 'GBP' | 'AUD'
  status: 'Submitted' | 'Matched' | 'In progress' | 'Ready' | 'Delivered'
  created_at: string
  updated_at: string
  
  // Joined fields
  student_name?: string
  student_university?: string
  specialist_name?: string
}

export interface Message {
  id: string
  request_id: string
  sender_id: string
  sender_role: string
  sender_name?: string
  content: string
  file_url?: string
  created_at: string
}

export interface PricingConfig {
  base_rate_usd: number
  base_rate_eur: number
  base_rate_aud: number
  price_per_page_usd: number
  price_per_page_eur: number
  price_per_page_aud: number
  academic_support_multiplier: number
  slm_multiplier: number
  app_studio_multiplier: number
}
