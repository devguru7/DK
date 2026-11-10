import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  Broadcast,
  Category,
  EventDraft,
  EventItem,
  Filters,
  PersistedState,
  Person,
  Persona,
  Ticket,
} from '../types';
import { buildSeedEvents, buildSeedTickets, PERSONAS, ROOMS } from './seed';
import {
  isFull,
  isoDate,
  randomHash,
  randomTicketId,
  buildICS,
  downloadFile,
} from './utils';
import { findRoomConflicts } from './logic';

export const STORAGE_KEY = 'udea_pulse_state_v1';
export const TG_BOT = 'https://t.me/udea_pulse_bot/app';

export type ToastTone = 'success' | 'info' | 'warn' | 'error';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  tone: ToastTone;
  telegram?: boolean;
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'danger' | 'primary';
}

interface ModalState extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

export type Result = { ok: boolean; message: string; id?: string };

const defaultFilters: Filters = {
  date: null,
  track: 'all',
  category: 'all',
  campus: 'all',
  language: 'all',
  search: '',
};

function initialState(): PersistedState {
  return {
    version: 1,
    theme: 'light',
    personaId: 'usr_1',
    followedClubs: ['club_fintech', 'club_acca'],
    events: buildSeedEvents(),
    tickets: buildSeedTickets(),
    filters: { ...defaultFilters },
    broadcasts: [],
    createdEventIds: [],
  };
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed || !Array.isArray(parsed.events) || parsed.events.length === 0) return initialState();
    const campusValid = parsed.events.every((e) => e.campus === 'Boshlik' || e.campus === 'Online');
    const roomsValid = parsed.events.every((e) => ROOMS.some((r) => r.id === e.roomId));
    if (!campusValid || !roomsValid) return initialState();
    const filters = { ...defaultFilters, ...(parsed.filters || {}) };
    if (!['all', 'Boshlik', 'Online'].includes(filters.campus)) filters.campus = 'all';
    return {
      ...initialState(),
      ...parsed,
      filters,
      tickets: Array.isArray(parsed.tickets) ? parsed.tickets : [],
      broadcasts: Array.isArray(parsed.broadcasts) ? parsed.broadcasts : [],
    };
  } catch {
    return initialState();
  }
}

function selfAttendee(persona: Persona): Person {
  return {
    id: `att_${persona.id}`,
    name: persona.name,
    programme: persona.programme ?? persona.department ?? 'UDEA Staff',
    programmeShort: persona.programmeShort ?? 'Staff',
    telegram: persona.telegram,
    color: persona.color,
    lookingForTeam: false,
    teamRole: '',
    self: true,
  };
}

interface AppContextValue {
  state: PersistedState;
  persona: Persona;
  personas: Persona[];
  theme: 'light' | 'dark';
  view: string;
  setView: (view: string) => void;
  mobile: boolean;
  setMobile: (on: boolean) => void;
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  modal: ModalState | null;
  askConfirm: (options: ConfirmOptions) => Promise<boolean>;
  resolveModal: (value: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setPersona: (id: string) => void;
  setFilters: (patch: Partial<Filters>) => void;
  resetFilters: () => void;
  resetDemo: () => void;
  drawerEventId: string | null;
  openEvent: (id: string) => void;
  closeEvent: () => void;
  myTicket: (eventId: string) => Ticket | undefined;
  rsvp: (eventId: string, screeningAnswer?: string) => void;
  cancelTicket: (ticketId: string) => void;
  confirmAttendance: (ticketId: string) => void;
  releaseSpot: (ticketId: string) => void;
  setTeamOptIn: (ticketId: string, on: boolean, tag: string) => void;
  addQuestion: (eventId: string, text: string) => void;
  upvote: (eventId: string, questionId: string) => void;
  answerQuestion: (eventId: string, questionId: string, answer: string) => void;
  updateEventCapacity: (eventId: string, capacity: number) => void;
  approveEvent: (eventId: string) => void;
  rejectEvent: (eventId: string, suggestedRoomId?: string) => void;
  checkInPerson: (eventId: string, personId: string) => void;
  undoCheckIn: (eventId: string, personId: string) => void;
  broadcast: (eventId: string, text: string) => void;
  followClub: (clubId: string) => void;
  exportICS: (eventId: string) => void;
  downloadEventICS: (event: EventItem) => void;
  createEvent: (draft: EventDraft) => Result;
  certificateTicketId: string | null;
  openCertificate: (ticketId: string) => void;
  closeCertificate: () => void;
  organizerEventId: string | null;
  openOrganizer: (eventId: string) => void;
  categoryCounts: Record<Category, number>;
  pendingApprovals: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadState);
  const [view, setView] = useState<string>('explore');
  const [mobile, setMobile] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [drawerEventId, setDrawerEventId] = useState<string | null>(null);
  const [certificateTicketId, setCertificateTicketId] = useState<string | null>(null);
  const [organizerEventId, setOrganizerEventId] = useState<string | null>(null);
  const timers = useRef<Record<string, number>>({});

  const persona = useMemo(
    () => PERSONAS.find((p) => p.id === state.personaId) ?? PERSONAS[0],
    [state.personaId],
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked — the app still works in memory */
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', state.theme === 'dark' ? '#090A0D' : '#F6F5F2');
  }, [state.theme]);

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current[id];
    if (timer) {
      window.clearTimeout(timer);
      delete timers.current[id];
    }
  };

  const pushToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
    timers.current[id] = window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timers.current[id];
    }, 5400);
  };

  const askConfirm = (options: ConfirmOptions): Promise<boolean> =>
    new Promise((resolve) => {
      setModal({ ...options, resolve });
    });

  const resolveModal = (value: boolean) => {
    setModal((current) => {
      current?.resolve(value);
      return null;
    });
  };

  const setTheme = (theme: 'light' | 'dark') => setState((prev) => ({ ...prev, theme }));

  const toggleTheme = () =>
    setState((prev) => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));

  const setPersona = (id: string) => {
    const next = PERSONAS.find((p) => p.id === id);
    if (!next || next.id === state.personaId) return;
    setState((prev) => ({ ...prev, personaId: id }));
    const permission =
      next.role === 'admin'
        ? 'You can now approve room requests, see every event’s scanner and broadcast campus-wide.'
        : next.role === 'club_lead'
          ? 'You can now publish official club events instantly and answer Q&A as a host.'
          : 'Student view: RSVP, team finder, tickets, passport and certificate printing.';
    pushToast({
      tone: 'info',
      title: `Signed in as ${next.name}`,
      message: permission,
    });
  };

  const setFilters = (patch: Partial<Filters>) =>
    setState((prev) => ({ ...prev, filters: { ...prev.filters, ...patch } }));

  const resetFilters = () => setState((prev) => ({ ...prev, filters: { ...defaultFilters } }));

  const resetDemo = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setState(initialState());
    setView('explore');
    setMobile(false);
    setDrawerEventId(null);
    setCertificateTicketId(null);
    setOrganizerEventId(null);
    setToasts([]);
    pushToast({
      tone: 'success',
      title: 'Demo state reset',
      message: 'Seed events, tickets, waitlists and approvals are back to their opening state.',
    });
  };

  const openEvent = (id: string) => {
    setDrawerEventId(id);
    setCertificateTicketId(null);
  };
  const closeEvent = () => setDrawerEventId(null);

  const myTicket = (eventId: string): Ticket | undefined =>
    state.tickets.find(
      (t) => t.eventId === eventId && t.userId === persona.id && t.status !== 'cancelled',
    );

  const rsvp = (eventId: string, screeningAnswer?: string) => {
    const event = state.events.find((e) => e.id === eventId);
    if (!event) return;
    if (myTicket(eventId)) {
      pushToast({
        tone: 'info',
        title: 'You already hold a pass',
        message: 'Open My QR Passes to show the ticket or to release your seat.',
      });
      return;
    }

    if (event.registrationMode === 'external_link') {
      const ticket: Ticket = {
        ticketId: randomTicketId(),
        eventId,
        userId: persona.id,
        status: 'external_saved',
        qrHash: randomHash('UDEA-EXT'),
        confirmedAttendance4h: false,
        lookingForTeam: false,
        teamSkillTag: '',
        issuedAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        tickets: [...prev.tickets, ticket],
        events: prev.events.map((e) =>
          e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e,
        ),
      }));
      const url = event.externalUrl ?? 'https://udea.uz/';
      window.open(url, '_blank', 'noopener,noreferrer');
      pushToast({
        tone: 'success',
        telegram: true,
        title: 'Partner registration tracked',
        message: `Opened ${url.replace(/^https?:\/\//, '')} in a new tab. Telegram reminder scheduled 4h before.`,
      });
      return;
    }

    if (isFull(event)) {
      if (!event.waitlistEnabled) {
        pushToast({
          tone: 'error',
          title: 'This event is full',
          message: 'The host did not enable a waitlist. Follow the club to hear about the next edition.',
        });
        return;
      }
      const position = event.waitlistCount + 1;
      const ticket: Ticket = {
        ticketId: randomTicketId(),
        eventId,
        userId: persona.id,
        status: 'waitlisted',
        waitlistPosition: position,
        qrHash: randomHash('UDEA-WL'),
        confirmedAttendance4h: false,
        lookingForTeam: false,
        teamSkillTag: '',
        screeningAnswer,
        issuedAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        tickets: [...prev.tickets, ticket],
        events: prev.events.map((e) =>
          e.id === eventId ? { ...e, waitlistCount: e.waitlistCount + 1 } : e,
        ),
      }));
      pushToast({
        tone: 'warn',
        telegram: true,
        title: `Waitlist #${position} secured`,
        message: `You are #${position} for “${event.title}”. The bot promotes you automatically if a seat frees up.`,
      });
      return;
    }

    const seat = event.registeredCount + 1;
    const ticket: Ticket = {
      ticketId: randomTicketId(),
      eventId,
      userId: persona.id,
      status: 'confirmed',
      seatNumber: seat,
      qrHash: randomHash(),
      confirmedAttendance4h: false,
      lookingForTeam: false,
      teamSkillTag: '',
      screeningAnswer,
      screeningStatus: event.registrationMode === 'internal_screening' ? 'pending' : undefined,
      issuedAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      tickets: [...prev.tickets, ticket],
      events: prev.events.map((e) => {
        if (e.id !== eventId) return e;
        const alreadyListed = e.attendees.some((a) => a.id === `att_${persona.id}`);
        return {
          ...e,
          registeredCount: e.registeredCount + 1,
          attendees: alreadyListed ? e.attendees : [...e.attendees, selfAttendee(persona)],
        };
      }),
    }));

    if (event.registrationMode === 'internal_screening') {
      pushToast({
        tone: 'success',
        telegram: true,
        title: 'Application received — seat held',
        message: 'The host reviews your screening answer. Your QR pass activates after approval.',
      });
    } else {
      pushToast({
        tone: 'success',
        telegram: true,
        title: `Seat #${seat} confirmed`,
        message: `Holographic QR pass generated for “${event.title}”. Telegram reminder set for 4h before.`,
      });
    }
  };

  const cancelTicket = (ticketId: string) => {
    const ticket = state.tickets.find((t) => t.ticketId === ticketId);
    if (!ticket) return;
    const event = state.events.find((e) => e.id === ticket.eventId);
    if (!event) return;
    const wasConfirmed = ticket.status === 'confirmed' || ticket.status === 'checked_in';
    const promoted =
      wasConfirmed && event.registeredCount >= event.capacity && event.waitlistRoster.length > 0
        ? event.waitlistRoster[0]
        : undefined;

    setState((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) =>
        t.ticketId === ticketId ? { ...t, status: 'cancelled' } : t,
      ),
      events: prev.events.map((e) => {
        if (e.id !== ticket.eventId) return e;
        const next: EventItem = { ...e };
        if (wasConfirmed) {
          next.registeredCount = Math.max(0, e.registeredCount - 1);
          next.attendees = e.attendees.filter((a) => a.id !== `att_${ticket.userId}`);
          const checkIns = { ...e.checkIns };
          delete checkIns[`att_${ticket.userId}`];
          next.checkIns = checkIns;
          if (promoted) {
            next.registeredCount += 1;
            next.waitlistCount = Math.max(0, e.waitlistCount - 1);
            next.waitlistRoster = e.waitlistRoster.slice(1);
            next.attendees = [
              ...next.attendees,
              {
                id: promoted.id,
                name: promoted.name,
                programme: promoted.programme,
                programmeShort: promoted.programmeShort,
                telegram: promoted.telegram,
                color: '#10B981',
              },
            ];
          }
        } else if (ticket.status === 'waitlisted') {
          next.waitlistCount = Math.max(0, e.waitlistCount - 1);
        }
        return next;
      }),
    }));

    if (promoted) {
      pushToast({
        tone: 'success',
        telegram: true,
        title: 'Waitlist promotion sent',
        message: `${promoted.name} was moved from waitlist #1 to a confirmed seat. Telegram notification delivered.`,
      });
    } else {
      pushToast({
        tone: 'info',
        title: wasConfirmed ? 'Seat released' : 'Waitlist place released',
        message: wasConfirmed
          ? 'Your QR pass is cancelled. No waitlisted student was pending for this event.'
          : 'You left the waitlist. You can rejoin at any time.',
      });
    }
  };

  const confirmAttendance = (ticketId: string) => {
    const ticket = state.tickets.find((t) => t.ticketId === ticketId);
    const event = ticket ? state.events.find((e) => e.id === ticket.eventId) : undefined;
    setState((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) =>
        t.ticketId === ticketId ? { ...t, confirmedAttendance4h: true } : t,
      ),
    }));
    pushToast({
      tone: 'success',
      telegram: true,
      title: 'Attendance confirmed',
      message: event
        ? `Your seat for “${event.title}” is locked. Door check-in opens 30 minutes before ${event.startTime}.`
        : 'Your seat is locked.',
    });
  };

  const releaseSpot = (ticketId: string) => cancelTicket(ticketId);

  const setTeamOptIn = (ticketId: string, on: boolean, tag: string) => {
    const ticket = state.tickets.find((t) => t.ticketId === ticketId);
    if (!ticket) return;
    setState((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) =>
        t.ticketId === ticketId ? { ...t, lookingForTeam: on, teamSkillTag: tag } : t,
      ),
      events: prev.events.map((e) =>
        e.id !== ticket.eventId
          ? e
          : {
              ...e,
              attendees: e.attendees.map((a) =>
                a.id === `att_${ticket.userId}`
                  ? { ...a, lookingForTeam: on, teamRole: on ? tag : '' }
                  : a,
              ),
            },
      ),
    }));
    pushToast({
      tone: on ? 'success' : 'info',
      title: on ? 'Team finder is on' : 'Team finder off',
      message: on
        ? `Classmates can now see you are looking for a team${tag ? ` as “${tag}”` : ''}.`
        : 'You are hidden from the teammate matchmaker.',
    });
  };

  const addQuestion = (eventId: string, text: string) => {
    if (!text.trim()) return;
    const question = {
      id: `q_${Date.now()}`,
      userId: persona.id,
      author: persona.name,
      programme: persona.programmeShort ?? 'Staff',
      text: text.trim(),
      upvotes: 1,
      upvotedByMe: true,
      timestamp: new Date().toISOString(),
      answered: false,
    };
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === eventId ? { ...e, questions: [question, ...e.questions] } : e,
      ),
    }));
    pushToast({
      tone: 'success',
      title: 'Question submitted',
      message: 'It is live on the board. The speaker sees the highest-upvoted questions first.',
    });
  };

  const upvote = (eventId: string, questionId: string) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id !== eventId
          ? e
          : {
              ...e,
              questions: e.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      upvotes: q.upvotes + (q.upvotedByMe ? -1 : 1),
                      upvotedByMe: !q.upvotedByMe,
                    }
                  : q,
              ),
            },
      ),
    }));
  };

  const answerQuestion = (eventId: string, questionId: string, answer: string) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id !== eventId
          ? e
          : {
              ...e,
              questions: e.questions.map((q) =>
                q.id === questionId
                  ? { ...q, answered: true, answerText: answer.trim() || 'Answered live in the room.' }
                  : q,
              ),
            },
      ),
    }));
    pushToast({ tone: 'success', title: 'Answer pinned', message: 'Students see “Answered by Speaker” on the board.' });
  };

  const updateEventCapacity = (eventId: string, capacity: number) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === eventId ? { ...e, capacity: Math.max(capacity, e.registeredCount, 5) } : e,
      ),
    }));
  };

  const approveEvent = (eventId: string) => {
    const event = state.events.find((e) => e.id === eventId);
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === eventId ? { ...e, approvalStatus: 'approved' } : e,
      ),
    }));
    pushToast({
      tone: 'success',
      telegram: true,
      title: 'Approved & auto-posted',
      message: event
        ? `“${event.title}” is live on the Explore feed and announced to @udeauz_events.`
        : 'Event approved.',
    });
  };

  const rejectEvent = (eventId: string, suggestedRoomId?: string) => {
    const event = state.events.find((e) => e.id === eventId);
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) => {
        if (e.id !== eventId) return e;
        if (suggestedRoomId) return { ...e, roomId: suggestedRoomId };
        return { ...e, approvalStatus: 'rejected' };
      }),
    }));
    pushToast({
      tone: suggestedRoomId ? 'warn' : 'error',
      telegram: true,
      title: suggestedRoomId ? 'Room suggestion sent' : 'Request rejected',
      message: suggestedRoomId
        ? `The organiser can re-submit “${event?.title ?? 'the event'}” with the suggested room.`
        : `“${event?.title ?? 'The event'}” was declined; the organiser has been notified on Telegram.`,
    });
  };

  const checkInPerson = (eventId: string, personId: string) => {
    const timestamp = new Date().toISOString();
    const userId = personId.startsWith('att_') ? personId.slice(4) : null;
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === eventId ? { ...e, checkIns: { ...e.checkIns, [personId]: timestamp } } : e,
      ),
      tickets: prev.tickets.map((t) =>
        userId && t.eventId === eventId && t.userId === userId && t.status !== 'cancelled'
          ? { ...t, status: 'checked_in', checkedInAt: timestamp }
          : t,
      ),
    }));
    const person = state.events.find((e) => e.id === eventId)?.attendees.find((a) => a.id === personId);
    pushToast({
      tone: 'success',
      title: `${person?.name ?? 'Guest'} checked in`,
      message: 'Cached pass validated offline and synced to the attendance log.',
    });
  };

  const undoCheckIn = (eventId: string, personId: string) => {
    const userId = personId.startsWith('att_') ? personId.slice(4) : null;
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) => {
        if (e.id !== eventId) return e;
        const checkIns = { ...e.checkIns };
        delete checkIns[personId];
        return { ...e, checkIns };
      }),
      tickets: prev.tickets.map((t) =>
        userId &&
        t.eventId === eventId &&
        t.userId === userId &&
        t.status === 'checked_in'
          ? { ...t, status: 'confirmed', checkedInAt: undefined }
          : t,
      ),
    }));
    pushToast({ tone: 'info', title: 'Check-in undone', message: 'The guest is back on the not-arrived list.' });
  };

  const broadcast = (eventId: string, text: string) => {
    if (!text.trim()) return;
    const event = state.events.find((e) => e.id === eventId);
    if (!event) return;
    const record: Broadcast = {
      id: `bc_${Date.now()}`,
      eventId,
      text: text.trim(),
      at: new Date().toISOString(),
      recipients: event.registeredCount,
    };
    setState((prev) => ({ ...prev, broadcasts: [record, ...prev.broadcasts] }));
    pushToast({
      tone: 'success',
      telegram: true,
      title: `Broadcast sent to ${event.registeredCount} attendees`,
      message: `@udea_pulse_bot · “${record.text}”`,
    });
  };

  const followClub = (clubId: string) => {
    const following = state.followedClubs.includes(clubId);
    setState((prev) => ({
      ...prev,
      followedClubs: following
        ? prev.followedClubs.filter((id) => id !== clubId)
        : [...prev.followedClubs, clubId],
    }));
    pushToast({
      tone: following ? 'info' : 'success',
      title: following ? 'Unfollowed club' : 'Following club',
      message: following
        ? 'You will stop receiving Telegram announcements from this club.'
        : 'Every new event from this club now pings your Telegram.',
    });
  };

  const downloadEventICS = (event: EventItem) => {
    const room = ROOMS.find((r) => r.id === event.roomId);
    downloadFile(`${event.id}.ics`, buildICS(event, room), 'text/calendar;charset=utf-8');
    pushToast({
      tone: 'success',
      title: '.ics calendar file downloaded',
      message: 'Open it to add the event to Google Calendar, Apple Calendar or Outlook.',
    });
  };

  const exportICS = (eventId: string) => {
    const event = state.events.find((e) => e.id === eventId);
    if (event) downloadEventICS(event);
  };

  const createEvent = (draft: EventDraft): Result => {
    if (!draft.title.trim()) return { ok: false, message: 'Add an event title before publishing.' };
    if (!draft.subtitle.trim()) return { ok: false, message: 'Add a one-line summary for the event card.' };
    if (!draft.date) return { ok: false, message: 'Pick an event date.' };
    if (draft.startTime >= draft.endTime) {
      return { ok: false, message: 'The end time must be after the start time.' };
    }
    if (!draft.roomId) return { ok: false, message: 'Select a room for this event.' };
    if (draft.registrationMode === 'external_link' && !/^https?:\/\/.+\..+/.test(draft.externalUrl)) {
      return { ok: false, message: 'Enter a valid https:// partner registration link.' };
    }
    if (draft.registrationMode === 'internal_screening' && !draft.screeningPrompt.trim()) {
      return { ok: false, message: 'Add the screening question students must answer.' };
    }
    const conflicts = findRoomConflicts(
      state.events,
      draft.roomId,
      draft.date,
      draft.startTime,
      draft.endTime,
    );
    if (conflicts.length > 0) {
      return {
        ok: false,
        message: `Schedule conflict: ${conflicts[0].title} occupies this room at that time. Use Auto-Pick or switch rooms.`,
      };
    }
    const isStudentOfficial = draft.track === 'official' && persona.role === 'student';
    const id = `evt_${Date.now()}`;
    const capacity = draft.track === 'peer_meetup' ? Math.min(30, draft.capacity) : draft.capacity;
    const event: EventItem = {
      id,
      title: draft.title.trim(),
      subtitle: draft.subtitle.trim(),
      description: draft.description.trim() || draft.subtitle.trim(),
      outcomes: [],
      agenda: [
        { time: draft.startTime, title: 'Doors open & registration', speaker: persona.name },
        { time: draft.startTime, title: 'Programme begins', speaker: persona.name },
      ],
      category: draft.category,
      eventType: draft.track,
      approvalStatus: isStudentOfficial ? 'pending_room_approval' : 'approved',
      campus: draft.campus,
      roomId: draft.roomId,
      date: draft.date,
      startTime: draft.startTime,
      endTime: draft.endTime,
      language: draft.language,
      hostClubId: persona.clubId ?? null,
      hostName: persona.name,
      createdBy: persona.id,
      registrationMode: draft.registrationMode,
      externalUrl: draft.externalUrl || undefined,
      screeningPrompt: draft.screeningPrompt || undefined,
      capacity,
      registeredCount: 0,
      waitlistCount: 0,
      issueCertificate: draft.certificate,
      coverStyle: draft.coverStyle,
      pattern: draft.pattern,
      equipmentRequested: draft.equipment,
      teamFinder: draft.teamFinder,
      waitlistEnabled: draft.waitlistEnabled,
      attendees: [],
      questions: [],
      waitlistRoster: [],
      checkIns: {},
    };
    setState((prev) => ({
      ...prev,
      events: [...prev.events, event],
      createdEventIds: [...prev.createdEventIds, id],
    }));
    pushToast({
      tone: isStudentOfficial ? 'warn' : 'success',
      telegram: true,
      title: isStudentOfficial ? 'Submitted to admin approval' : 'Event published instantly',
      message: isStudentOfficial
        ? 'Campus Operations reviews the room request. Switch to Timur (Admin) to approve it now.'
        : draft.track === 'peer_meetup'
          ? `“${event.title}” is live. Peer meetups publish instantly and cap at 30 participants.`
          : `“${event.title}” is live and announced to @udeauz_events.`,
    });
    return {
      ok: true,
      message: isStudentOfficial
        ? 'Event submitted — waiting on Campus Operations room approval.'
        : 'Event published.',
      id,
    };
  };

  const openCertificate = (ticketId: string) => setCertificateTicketId(ticketId);
  const closeCertificate = () => setCertificateTicketId(null);
  const openOrganizer = (eventId: string) => {
    setOrganizerEventId(eventId);
    setView('organizer');
    setDrawerEventId(null);
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      fintech: 0,
      tech: 0,
      academic: 0,
      sports: 0,
      culture: 0,
    };
    state.events
      .filter((e) => e.approvalStatus === 'approved' && !e.past)
      .forEach((e) => {
        counts[e.category] += 1;
      });
    return counts;
  }, [state.events]);

  const pendingApprovals = state.events.filter((e) => e.approvalStatus === 'pending_room_approval').length;

  const value: AppContextValue = {
    state,
    persona,
    personas: PERSONAS,
    theme: state.theme,
    view,
    setView,
    mobile,
    setMobile,
    toasts,
    pushToast,
    dismissToast,
    modal,
    askConfirm,
    resolveModal,
    setTheme,
    toggleTheme,
    setPersona,
    setFilters,
    resetFilters,
    resetDemo,
    drawerEventId,
    openEvent,
    closeEvent,
    myTicket,
    rsvp,
    cancelTicket,
    confirmAttendance,
    releaseSpot,
    setTeamOptIn,
    addQuestion,
    upvote,
    answerQuestion,
    updateEventCapacity,
    approveEvent,
    rejectEvent,
    checkInPerson,
    undoCheckIn,
    broadcast,
    followClub,
    exportICS,
    downloadEventICS,
    createEvent,
    certificateTicketId,
    openCertificate,
    closeCertificate,
    organizerEventId,
    openOrganizer,
    categoryCounts,
    pendingApprovals,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
