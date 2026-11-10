import type { EventItem, Persona, Room } from '../types';
import { isFull, minutesFromTime, overlaps, timeFromMinutes } from './utils';

export function findRoomConflicts(
  events: EventItem[],
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeEventId?: string,
): EventItem[] {
  return events.filter(
    (e) =>
      e.id !== excludeEventId &&
      e.roomId === roomId &&
      e.date === date &&
      e.approvalStatus === 'approved' &&
      overlaps(startTime, endTime, e.startTime, e.endTime),
  );
}

export function nextFreeSlot(
  events: EventItem[],
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeEventId?: string,
): string | null {
  const duration = Math.max(30, minutesFromTime(endTime) - minutesFromTime(startTime));
  const dayStart = minutesFromTime('08:00');
  const dayEnd = minutesFromTime('21:30');
  for (let start = minutesFromTime(startTime) + 30; start + duration <= dayEnd; start += 30) {
    const candidateStart = timeFromMinutes(start);
    const candidateEnd = timeFromMinutes(start + duration);
    if (findRoomConflicts(events, roomId, date, candidateStart, candidateEnd, excludeEventId).length === 0) {
      return candidateStart;
    }
  }
  for (let start = dayStart; start + duration <= minutesFromTime(startTime); start += 30) {
    const candidateStart = timeFromMinutes(start);
    const candidateEnd = timeFromMinutes(start + duration);
    if (findRoomConflicts(events, roomId, date, candidateStart, candidateEnd, excludeEventId).length === 0) {
      return candidateStart;
    }
  }
  return null;
}

export function availableRooms(
  events: EventItem[],
  rooms: Room[],
  campus: string,
  date: string,
  startTime: string,
  endTime: string,
  minCapacity: number,
  excludeEventId?: string,
): Room[] {
  return rooms.filter(
    (r) =>
      r.campus === campus &&
      r.kind !== 'online' &&
      r.capacity >= Math.min(minCapacity, 30) &&
      findRoomConflicts(events, r.id, date, startTime, endTime, excludeEventId).length === 0,
  );
}

export function canManage(event: EventItem, persona: Persona): boolean {
  if (persona.role === 'admin') return true;
  if (event.createdBy === persona.id) return true;
  if (persona.clubId && event.hostClubId === persona.clubId) return true;
  return false;
}

export function capacityTone(event: EventItem): 'open' | 'almost' | 'full' {
  if (isFull(event)) return 'full';
  return event.registeredCount / event.capacity >= 0.75 ? 'almost' : 'open';
}

export function screenStatusLabel(status?: string): string {
  if (status === 'pending') return 'Screening pending';
  if (status === 'approved') return 'Screening approved';
  if (status === 'rejected') return 'Screening rejected';
  return 'No screening';
}
