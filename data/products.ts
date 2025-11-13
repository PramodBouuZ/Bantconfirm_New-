import { Product } from '../types';

export const PRODUCTS_DATA: Product[] = [
  {
    id: 1,
    name: 'Enterprise Cloud Suite',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop',
    price: '₹499/mo',
    description: 'A complete cloud solution for large businesses, offering maximum performance and security.',
    features: ['Unlimited Bandwidth', '24/7 Priority Support', 'Dedicated IP', 'Advanced Security Suite'],
  },
  {
    id: 2,
    name: 'SMB Cybersecurity Package',
    image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=2069&auto=format&fit=crop',
    price: '₹199/mo',
    description: 'Comprehensive security protection tailored for small and medium businesses.',
    features: ['Firewall Management', 'Endpoint Protection', 'Employee Training', 'Monthly Reporting'],
  },
  {
    id: 3,
    name: 'Unified Comms Platform',
    image: 'https://images.unsplash.com/photo-1611095790444-1dfa3c3e6a18?q=80&w=2070&auto=format&fit=crop',
    price: '₹45/user/mo',
    description: 'Integrate voice, video, and messaging in one seamless application for ultimate collaboration.',
    features: ['HD Video Conferencing', 'VoIP Business Phone', 'Team Messaging', 'Mobile & Desktop Apps'],
  },
  {
    id: 4,
    name: 'Proactive IT Support',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop',
    price: 'Starting at ₹1,000/mo',
    description: 'Our team of experts proactively manages and monitors your IT infrastructure.',
    features: ['24/7 Network Monitoring', 'Helpdesk Support', 'Vendor Management', 'Strategic IT Consulting'],
  },
  {
    id: 5,
    name: 'Cloud Storage Pro',
    image: 'https://images.unsplash.com/photo-1580820267682-426da823b514?q=80&w=2148&auto=format&fit=crop',
    price: '₹50/TB/mo',
    description: 'Secure and scalable cloud storage with easy access and powerful sharing features.',
    features: ['End-to-end Encryption', 'File Versioning', 'Team Folders', 'Granular Permissions'],
  },
];