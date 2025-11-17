


import React from 'react';

export enum LeadPosterStage {
  GREETING = 'GREETING',
  DETAILS = 'DETAILS',
  BUDGET = 'BUDGET',
  AUTHORITY = 'AUTHORITY',
  NEED = 'NEED',
  TIMELINE = 'TIMELINE',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
}

export interface DraftRequirement {
  title: string;
  description: string;
  category: ListingCategory | '';
  bantData: BantData;
}

export interface LeadDetails {
  name: string;
  company: string;
  email: string;
  mobile?: string;
  service: string;
}

export interface Vendor {
  name:string;
  logoUrl: string;
  heroImageUrl: string;
  description: string;
  specialties: string[];
  pricingTier: 'SMB' | 'Enterprise' | 'Flexible';
  mobile?: string;
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
  bantData?: BantData;
  assignmentHistory?: AssignmentHistoryEntry[];
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

export enum TeamRole {
    Admin = 'Admin',
    LeadManager = 'Lead Manager',
}

export interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: TeamRole;
}

export interface StoredConversation {
  leadDetails: LeadDetails;
  messages: ChatMessage[];
  bantData: BantData;
  currentStage: BantStage;
  timestamp: string;
}

export interface StoredLeadPosterConversation {
  messages: ChatMessage[];
  requirementData: DraftRequirement;
  currentStage: LeadPosterStage;
  timestamp: string;
}

export interface Notification {
  id: number;
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  timestamp: string; // ISO string
  read: boolean;
}

export type LeadStatus = 'New' | 'Assigned';

export interface AssignmentHistoryEntry {
  assignedAt: string; // ISO String
  vendorNames: string[];
}

export interface QualifiedLead {
  id: number;
  leadDetails: LeadDetails;
  bantData: BantData;
  qualifiedAt: string; // ISO String
  status: LeadStatus;
  assignedVendorNames: string[];
  assignmentHistory: AssignmentHistoryEntry[];
}

export interface PromotionalBannerData {
  isActive: boolean;
  image: string; // Base64 or URL
  title: string;
  text: string;
  link: string;
}

export interface WhatsAppConfig {
    enabled: boolean;
    apiKey: string;
    apiEndpoint: string;
    adminMobile: string; // To receive system notifications
}

export interface SiteConfig {
    promoBanner: PromotionalBannerData;
    socialLinks: {
        linkedin: string;
        instagram: string;
        facebook: string;
    }
    logo?: string; // Base64
    favicon?: string; // Base64
    whatsappConfig?: WhatsAppConfig;
}

export interface ProductCategory {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  image: string; // Base64 or URL
  price: string;
  oldPrice?: string;
  priceUnit?: string;
  description: string;
  features: string[];
  author?: string;
  sales?: number;
  category: string;
  rating?: {
    rate: number;
    count: number;
  };
  tags?: string[];
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