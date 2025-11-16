

import { Product } from '../types';

export const PRODUCTS_DATA: Product[] = [
  {
    id: 1,
    name: 'Cloud Storage Pro',
    image: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?q=80&w=2069&auto=format&fit=crop',
    price: '₹50/TB',
    description: 'Secure and scalable cloud storage for your business.',
    features: ['99.99% Uptime', 'Data Encryption', '24/7 Support', 'Scalable Infrastructure'],
    author: 'BANTConfirm',
    category: 'IT',
  },
  {
    id: 2,
    name: 'Internet lease line',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=870&auto=format&fit=crop',
    price: '₹7000/mo',
    oldPrice: '₹7500/mo',
    description: 'High-speed dedicated internet for your business.',
    features: ['Symmetrical Speeds', 'Guaranteed Bandwidth', 'Low Latency', 'Service Level Agreement'],
    author: 'BANTConfirm',
    category: 'Telco',
  },
  {
    id: 3,
    name: 'SMB Cybersecurity Package',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=870&auto=format&fit=crop',
    price: '₹199/mo',
    description: 'Comprehensive security for small and medium businesses.',
    features: ['Firewall Management', 'Endpoint Protection', 'Threat Detection', 'Security Audits'],
    author: 'BANTConfirm',
    category: 'IT',
  },
  {
    id: 4,
    name: 'Unified Comms Platform',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=870&auto=format&fit=crop',
    price: '₹45/user/mo',
    description: 'Integrate all your communication channels.',
    features: ['VoIP Calling', 'Video Conferencing', 'Instant Messaging', 'Mobile App'],
    author: 'BANTConfirm',
    category: 'Telco',
  },
  {
    id: 5,
    name: 'Proactive IT Support',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=870&auto=format&fit=crop',
    price: 'Starting at ₹1,000/mo',
    description: 'Managed IT support to keep your business running smoothly.',
    features: ['24/7 Monitoring', 'Helpdesk Support', 'Network Management', 'On-site Visits'],
    author: 'BANTConfirm',
    category: 'IT',
  },
];