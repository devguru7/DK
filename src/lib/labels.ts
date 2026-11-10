import type { Role } from '../types';

export const LONG_ROLE: Record<Role, string> = {
  student: 'Student · BSc Finance, Year 2',
  club_lead: 'Club President · FinTech Society',
  admin: 'Campus Admin · Student Affairs',
};

export function personaRoleLabel(role: Role): string {
  return role === 'club_lead' ? 'Club President' : role === 'admin' ? 'Campus Admin' : 'Student';
}
