import { User } from '../types';

export const USERS: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@bantconfirm.com',
    companyName: 'BANTConfirm',
    isAdmin: true,
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane.doe@innovatecorp.com',
    companyName: 'Innovate Corp',
    isAdmin: false,
  },
  {
    id: 3,
    name: 'John Smith',
    email: 'john.smith@globaltech.com',
    companyName: 'Global Tech',
    isAdmin: false,
  },
  {
    id: 4,
    name: 'Emily White',
    email: 'emily.white@futuresolutions.com',
    companyName: 'Future Solutions',
    isAdmin: false,
  },
  {
    id: 5,
    name: 'Michael Brown',
    email: 'michael.brown@securefinance.com',
    companyName: 'Secure Finance',
    isAdmin: false,
  }
];
