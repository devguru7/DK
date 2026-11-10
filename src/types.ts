export type Category = 'fintech' | 'tech' | 'academic' | 'sports' | 'culture';
export type EventType = 'official' | 'peer_meetup';
export type ApprovalStatus = 'approved' | 'pending_room_approval' | 'rejected';
export type Campus = 'Boshlik' | 'Online';
export type Lang = 'EN' | 'UZ' | 'RU';
export type RegistrationMode = 'internal_1click' | 'internal_screening' | 'external_link';
export type TicketStatus = 'confirmed' | 'waitlisted' | 'checked_in' | 'cancelled' | 'external_saved';
export type Role = 'student' | 'club_lead' | 'admin';
export type Theme = 'light' | 'dark';
export type View = 'explore' | 'clubs' | 'passes' | 'organizer' | 'studio';

export interface Persona {
  id: string;
  name: string;
  role: Role;
  programme?: string;
  programmeShort?: string;
  year?: string;
  department?: string;
  telegram: string;
  studentId: string;
  xp: number;
  reliabilityScore: number;
  clubId?: string;
  color: string;
}

export interface Room {
  id: string;
  campus: Campus;
  name: string;
  code: string;
  capacity: number;
  equipment: string[];
  address: string;
  floor: string;
  kind: 'hall' | 'lab' | 'sports' | 'lounge' | 'library' | 'online';
}

export interface Club {
  id: string;
  name: string;
  short: string;
  category: Category;
  description: string;
  members: number;
  verified: boolean;
  partner?: string;
  color: string;
}

export interface Person {
  id: string;
  name: string;
  programme: string;
  programmeShort: string;
  telegram: string;
  color: string;
  lookingForTeam?: boolean;
  teamRole?: string;
  self?: boolean;
}

export interface Question {
  id: string;
  userId?: string;
  author: string;
  programme: string;
  text: string;
  upvotes: number;
  upvotedByMe: boolean;
  timestamp: string;
  answered: boolean;
  answerText?: string;
}

export interface AgendaItem {
  time: string;
  title: string;
  speaker?: string;
}

export interface WaitlistEntry {
  id: string;
  name: string;
  programme: string;
  programmeShort: string;
  telegram: string;
  studentId: string;
}

export interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  outcomes: string[];
  prerequisites?: string;
  agenda: AgendaItem[];
  category: Category;
  eventType: EventType;
  approvalStatus: ApprovalStatus;
  campus: Campus;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  language: Lang;
  hostClubId: string | null;
  hostName: string;
  createdBy?: string;
  registrationMode: RegistrationMode;
  externalUrl?: string;
  screeningPrompt?: string;
  capacity: number;
  registeredCount: number;
  waitlistCount: number;
  issueCertificate: boolean;
  coverStyle: string;
  coverImage?: string;
  pattern: 'grid' | 'dots' | 'waves' | 'clean';
  equipmentRequested: string[];
  teamFinder: boolean;
  waitlistEnabled: boolean;
  attendees: Person[];
  questions: Question[];
  waitlistRoster: WaitlistEntry[];
  checkIns: Record<string, string>;
  featured?: boolean;
  past?: boolean;
}

export interface Ticket {
  ticketId: string;
  eventId: string;
  userId: string;
  status: TicketStatus;
  seatNumber?: number;
  waitlistPosition?: number;
  qrHash: string;
  confirmedAttendance4h: boolean;
  checkedInAt?: string;
  screeningAnswer?: string;
  screeningStatus?: 'pending' | 'approved' | 'rejected';
  lookingForTeam: boolean;
  teamSkillTag: string;
  issuedAt: string;
}

export interface Filters {
  date: string | null;
  track: 'all' | 'official' | 'peer';
  category: Category | 'all';
  campus: Campus | 'all';
  language: Lang | 'all';
  search: string;
}

export interface Broadcast {
  id: string;
  eventId: string;
  text: string;
  at: string;
  recipients: number;
}

export interface PersistedState {
  version: number;
  theme: Theme;
  personaId: string;
  followedClubs: string[];
  events: EventItem[];
  tickets: Ticket[];
  filters: Filters;
  broadcasts: Broadcast[];
  createdEventIds: string[];
}

export interface EventDraft {
  title: string;
  subtitle: string;
  description: string;
  track: EventType;
  category: Category;
  language: Lang;
  coverStyle: string;
  coverImage: string;
  pattern: 'grid' | 'dots' | 'waves' | 'clean';
  date: string;
  startTime: string;
  endTime: string;
  campus: Campus;
  roomId: string;
  equipment: string[];
  registrationMode: RegistrationMode;
  externalUrl: string;
  screeningPrompt: string;
  capacity: number;
  waitlistEnabled: boolean;
  teamFinder: boolean;
  certificate: boolean;
}
