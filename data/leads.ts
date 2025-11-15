import { QualifiedLead, BantStage } from '../types';

export const LEADS_DATA: QualifiedLead[] = [
  {
    id: 1,
    leadDetails: {
      name: 'Alice Martin',
      company: 'Innovate Corp',
      email: 'alice.martin@innovatecorp.com',
      service: 'Cloud Solutions',
    },
    bantData: {
      [BantStage.BUDGET]: '$20,000 - $25,000 per year',
      [BantStage.AUTHORITY]: 'VP of Technology, Mark Chen',
      [BantStage.NEED]: 'We are looking to migrate our on-premise servers to a hybrid cloud environment to improve scalability and reduce maintenance costs.',
      [BantStage.TIMELINE]: 'Within the next 3 months',
    },
    qualifiedAt: '2024-07-28T11:45:00Z',
    status: 'New',
    assignedVendorNames: [],
    assignmentHistory: [],
  },
  {
    id: 2,
    leadDetails: {
      name: 'Bob Johnson',
      company: 'Global Tech',
      email: 'bob.j@globaltech.com',
      service: 'Cybersecurity Services',
    },
    bantData: {
      [BantStage.BUDGET]: 'Around $50,000 for an initial audit and retainer.',
      [BantStage.AUTHORITY]: 'The decision will be made by the CISO and the IT steering committee.',
      [BantStage.NEED]: 'We need to achieve SOC 2 compliance and require a full security audit and ongoing vulnerability management.',
      [BantStage.TIMELINE]: 'As soon as possible, ideally starting next month.',
    },
    qualifiedAt: '2024-07-27T16:20:00Z',
    status: 'Assigned',
    assignedVendorNames: ['SecureData Corp', 'CyberGuardians'],
    assignmentHistory: [
      {
        assignedAt: '2024-07-27T17:00:00Z',
        vendorNames: ['SecureData Corp', 'CyberGuardians']
      }
    ],
  },
  {
    id: 3,
    leadDetails: {
      name: 'Charlie Brown',
      company: 'Future Solutions',
      email: 'charlie@futuresolutions.com',
      service: 'Unified Communications',
    },
    bantData: {
      [BantStage.BUDGET]: 'Flexible, looking for best value. Approximately $150 per user per month.',
      [BantStage.AUTHORITY]: 'I am the IT Director and have the final say.',
      [BantStage.NEED]: 'Our remote team is growing, and we need a reliable system that integrates chat, video, and phone calls on both desktop and mobile.',
      [BantStage.TIMELINE]: 'We want to roll this out in the next fiscal quarter.',
    },
    qualifiedAt: '2024-07-26T09:10:00Z',
    status: 'New',
    assignedVendorNames: [],
    assignmentHistory: [],
  },
];