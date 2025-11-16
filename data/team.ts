import { TeamMember, TeamRole } from '../types';

export const TEAM_DATA: TeamMember[] = [
  {
    id: 1,
    name: 'Platform Admin',
    email: 'team.admin@bantconfirm.com',
    role: TeamRole.Admin,
  },
  {
    id: 2,
    name: 'Lead Manager Sample',
    email: 'lead.manager@bantconfirm.com',
    role: TeamRole.LeadManager,
  }
];
