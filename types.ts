
import React from 'react';

export enum AppView {
  HOME = 'HOME',
  LEAD_FORM = 'LEAD_FORM',
  BANT_ASSISTANT = 'BANT_ASSISTANT',
  CONFIRMATION = 'CONFIRMATION',
  SERVICE_DETAIL = 'SERVICE_DETAIL',
  AI_SOLUTION_FINDER = 'AI_SOLUTION_FINDER',
  LISTINGS_MARKETPLACE = 'LISTINGS_MARKETPLACE',
  POST_REQUIREMENT = 'POST_REQUIREMENT',
  ABOUT = 'ABOUT',
  CONTACT = 'CONTACT',
  FAQ = 'FAQ',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  DASHBOARD = 'DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  LEADS = 'LEADS',
  PROMO_BANNER = 'PROMO_BANNER',
  PRODUCTS = 'PRODUCTS',
  BECOME_VENDOR = 'BECOME_VENDOR',
  ADMIN_APPLICATIONS = 'ADMIN_APPLICATIONS',
}

export interface LeadDetails {
  name: string;
  company: string;
  email: string;
  service: string;
}

export interface Vendor {
  name:string;
  logoUrl: string;
  heroImageUrl: string;
  description: string;
  specialties: string[];
  pricingTier: 'SMB' | 'Enterprise' | 'Flexible';
}

export interface Service {
  name: string;
  description: string;
  icon: string;
  detailedDescription: string;
  keyBenefits: string[];
}

export enum BantStage {
  BUDGET = 'BUDGET',
  AUTHORITY = 'AUTHORITY',
  NEED = 'NEED',
  TIMELINE = 'TIMELINE',
  COMPLETED = 'COMPLETED',
}

export interface BantData {
  [BantStage.BUDGET]: string;
  [BantStage.AUTHORITY]: string;
  [BantStage.NEED]: string;
  [BantStage.TIMELINE]: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface GeminiResponse {
  analysis: string;
  extractedData: string;
  isStageComplete: boolean;
  nextQuestion: string;
}

export type ListingCategory = 'Software' | 'Hardware' | 'Service';
export type ListingStatus = 'Pending Validation' | 'Validated' | 'Assigned';

export interface AIMatch {
  vendorName: string;
  justification: string;
}

export interface RequirementListing {
  id: number;
  title: string;
  description: string;
  category: ListingCategory;
  authorName: string;
  companyName: string;
  postedDate: string; // ISO string
  aiMatches: AIMatch[];
  status: ListingStatus;
  assignedVendorNames: string[];
}

export interface AIRecommendation {
  summary: string;
  suggestedService: string | null;
  suggestedVendors: string[];
}

export interface User {
  id: number;
  name: string;
  companyName?: string;
  email: string;
  mobile?: string;
  location?: string;
  isAdmin?: boolean;
}

export interface StoredConversation {
  leadDetails: LeadDetails;
  messages: ChatMessage[];
  bantData: BantData;
  currentStage: BantStage;
  timestamp: string;
}

export interface Notification {
  id: number;
  message: string;
  timestamp: string; // ISO string
  read: boolean;
}

export type LeadStatus = 'New' | 'Assigned';

export interface QualifiedLead {
  id: number;
  leadDetails: LeadDetails;
  bantData: BantData;
  qualifiedAt: string; // ISO String
  status: LeadStatus;
  assignedVendorNames: string[];
}

export interface PromotionalBannerData {
  isActive: boolean;
  image: string; // Base64 or URL
  title: string;
  text: string;
  link: string;
}

export interface Product {
  id: number;
  name: string;
  image: string; // Base64 or URL
  price: string;
  description: string;
  features: string[];
}

export interface VendorApplication {
  id: number;
  name: string;
  companyName: string;
  email: string;
  mobile: string;
  location: string;
  products: string;
  logo: string; // Base64
  submittedAt: string; // ISO string
}
