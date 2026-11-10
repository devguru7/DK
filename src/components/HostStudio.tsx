import React, { useMemo, useState } from 'react';
import { useApp } from '../lib/store';
import type { Category, Campus, EventDraft, EventItem, Lang, RegistrationMode } from '../types';
import { ROOMS, CLUBS } from '../lib/seed';
import { Icon, Mono, Poster, SectionHeader } from './UI';
import {
  CATEGORY_LABEL,
  copyText,
  dayLabel,
  isoOffset,
  minutesFromTime,
  pct,
  timeFromMinutes,
} from '../lib/utils';
import { availableRooms, findRoomConflicts, nextFreeSlot } from '../lib/logic';

const COVERS = [
  { id: 'emerald', label: 'Emerald Matrix' },
  { id: 'violet', label: 'Violet Cyber Mesh' },
  { id: 'blueprint', label: 'Coventry Royal Blueprint' },
  { id: 'lime', label: 'Acid Lime Arena' },
  { id: 'sunset', label: 'Sunset Terracotta' },
  { id: 'obsidian', label: 'Obsidian Minimal' },
];

const PATTERNS: { id: EventDraft['pattern']; label: string }[] = [
  { id: 'grid', label: 'Grid' },
  { id: 'dots', label: 'Dots' },
  { id: 'waves', label: 'Topographic Waves' },
  { id: 'clean', label: 'Clean' },
];

const EQUIPMENT = ['4K Projector', 'Wireless Mics', 'Whiteboard & Markers', 'Power Strips', 'LED Wall', 'Scoreboard'];

const emptyDraft = (): EventDraft => ({
  title: '',
  subtitle: '',
  description: '',
  track: 'official',
  category: 'tech',
  language: 'EN',
  coverStyle: 'violet',
  coverImage: '',
  pattern: 'grid',
  date: isoOffset(2),
  startTime: '14:00',
  endTime: '16:00',
  campus: 'Boshlik',
  roomId: 'rm_boshlik_204',
  equipment: ['4K Projector', 'Wireless Mics'],
  registrationMode: 'internal_1click',
  externalUrl: '',
  screeningPrompt: '',
  capacity: 40,
  waitlistEnabled: true,
  teamFinder: true,
  certificate: true,
});

export default function HostStudio() {
  const app = useApp();
  const [draft, setDraft] = useState<EventDraft>(emptyDraft);
  const [previewMode, setPreviewMode] = useState<'card' | 'telegram'>('card');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const set = <K extends keyof EventDraft>(key: K, value: EventDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const rooms = useMemo(
    () => ROOMS.filter((r) => r.campus === draft.campus),
    [draft.campus],
  );

  const conflicts = findRoomConflicts(app.state.events, draft.roomId, draft.date, draft.startTime, draft.endTime);
  const suggestion = conflicts.length
    ? nextFreeSlot(app.state.events, draft.roomId, draft.date, draft.startTime, draft.endTime)
    : null;
  const altRooms = conflicts.length
    ? availableRooms(
        app.state.events,
        ROOMS,
        draft.campus,
        draft.date,
        draft.startTime,
        draft.endTime,
        draft.track === 'peer_meetup' ? 30 : draft.capacity,
      )
    : [];

  const selectedRoom = ROOMS.find((r) => r.id === draft.roomId);
  const persona = app.persona;
  const studentOfficial = draft.track === 'official' && persona.role === 'student';
  const pendingMine = app.state.events.filter(
    (e) => e.createdBy === persona.id && e.approvalStatus === 'pending_room_approval',
  );

  const previewEvent: EventItem = {
    id: 'preview',
    title: draft.title || 'Your event title appears here',
    subtitle: draft.subtitle || 'A one-line summary pulls students in — keep it concrete.',
    description: draft.description,
    outcomes: [],
    prerequisites: '',
    agenda: [],
    category: draft.category,
    eventType: draft.track,
    approvalStatus: 'approved',
    campus: draft.campus,
    roomId: draft.roomId,
    date: draft.date,
    startTime: draft.startTime,
    endTime: draft.endTime,
    language: draft.language,
    hostClubId: persona.clubId ?? null,
    hostName: persona.role === 'student' ? persona.name : CLUBS.find((c) => c.id === persona.clubId)?.name ?? persona.name,
    createdBy: persona.id,
    registrationMode: draft.registrationMode,
    externalUrl: draft.externalUrl,
    screeningPrompt: draft.screeningPrompt,
    capacity: draft.track === 'peer_meetup' ? Math.min(30, draft.capacity) : draft.capacity,
    registeredCount: 0,
    waitlistCount: 0,
    issueCertificate: draft.certificate,
    coverStyle: draft.coverStyle,
    coverImage: draft.coverImage || undefined,
    pattern: draft.pattern,
    equipmentRequested: draft.equipment,
    teamFinder: draft.teamFinder,
    waitlistEnabled: draft.waitlistEnabled,
    attendees: [],
    questions: [],
    waitlistRoster: [],
    checkIns: {},
  };

  const submit = () => {
    setError('');
    setNotice('');
    const result = app.createEvent(draft);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setNotice(result.message);
    const createdId = result.id;
    if (createdId) {
      const created = app.state.events.find((e) => e.id === createdId);
      if (created && created.approvalStatus === 'approved') {
        setDraft(emptyDraft());
        app.setView('explore');
        app.openEvent(createdId);
        return;
      }
    }
    setDraft(emptyDraft());
  };

  const telegramText = `${draft.track === 'peer_meetup' ? '⚡' : '🏛️'} ${draft.title || 'Your event title'}\n\n${
    draft.subtitle || 'One-line summary'
  }\n\n📅 ${dayLabel(draft.date)} · ${draft.startTime}–${draft.endTime}\n📍 ${
    selectedRoom ? `${draft.campus} · ${selectedRoom.name}` : draft.campus
  }\n🎟 ${draft.track === 'peer_meetup' ? Math.min(30, draft.capacity) : draft.capacity} seats · ${
    draft.registrationMode === 'external_link'
      ? 'Partner registration'
      : draft.registrationMode === 'internal_screening'
        ? 'Screening required'
        : '1-click RSVP'
  }${draft.certificate ? '\n🎓 Verified UDEA certificate' : ''}\n\nOpen the Mini App to claim your seat.`;

  return (
    <div className="studio">
      <SectionHeader
        icon="plus"
        title="Host Event Studio"
        subtitle="Split-screen builder with a live poster preview, Telegram post preview and a real-time room conflict engine."
        action={
          <button className="btn btn-ghost btn-sm" onClick={() => app.setView('explore')}>
            <Icon name="compass" size={14} /> Back to Explore
          </button>
        }
      />

      <div className="studio-grid">
        <div className="studio-form">
          {error && (
            <div className="inline-alert is-error">
              <Icon name="x" size={15} /> {error}
            </div>
          )}
          {notice && (
            <div className="inline-alert is-success">
              <Icon name="check" size={15} /> {notice}
            </div>
          )}

          <section className="form-card">
            <div className="form-step">
              <span className="step-num mono">01</span>
              <h3>Event track & basics</h3>
            </div>

            <div className="track-cards">
              <button
                className={`track-card ${draft.track === 'official' ? 'is-active' : ''}`}
                onClick={() => set('track', 'official')}
              >
                <span className="track-icon">🏛️</span>
                <strong>Official Club / University Event</strong>
                <em>
                  Lecture hall booking, equipment requests, certificates. Students submit to the admin approval queue;
                  club leads and admin publish directly when the room is free.
                </em>
              </button>
              <button
                className={`track-card ${draft.track === 'peer_meetup' ? 'is-active' : ''}`}
                onClick={() => {
                  set('track', 'peer_meetup');
                  set('capacity', 15);
                  set('roomId', 'rm_boshlik_lrc');
                  set('certificate', false);
                  set('campus', 'Boshlik');
                }}
              >
                <span className="track-icon">⚡</span>
                <strong>Quick Student Peer Meetup</strong>
                <em>
                  Study groups, IELTS practice, board games or futsal. Publishes instantly with no bureaucracy and caps at
                  30 participants.
                </em>
              </button>
            </div>

            <label className="field">
              <span className="field-label">Event title</span>
              <input
                value={draft.title}
                onChange={(e) => set('title', e.target.value)}
                maxLength={90}
                placeholder="e.g. Python, Pandas & SQL Peer Study Sprint"
              />
              <span className="field-hint">{draft.title.length}/90</span>
            </label>

            <label className="field">
              <span className="field-label">Subtitle / summary</span>
              <input
                value={draft.subtitle}
                onChange={(e) => set('subtitle', e.target.value)}
                maxLength={140}
                placeholder="One concrete line about what happens in the room"
              />
            </label>

            <label className="field">
              <span className="field-label">Description</span>
              <textarea
                rows={4}
                value={draft.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="What students will do, who it is for and what to bring."
              />
            </label>

            <div className="field-row">
              <label className="field">
                <span className="field-label">Category</span>
                <select value={draft.category} onChange={(e) => set('category', e.target.value as Category)}>
                  {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
                    <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field-label">Language</span>
                <select value={draft.language} onChange={(e) => set('language', e.target.value as Lang)}>
                  <option value="EN">English (EN)</option>
                  <option value="UZ">Uzbek (UZ)</option>
                  <option value="RU">Russian (RU)</option>
                </select>
              </label>
            </div>
          </section>

          <section className="form-card">
            <div className="form-step">
              <span className="step-num mono">02</span>
              <h3>Generative poster studio</h3>
            </div>
            <div className="cover-grid">
              {COVERS.map((c) => (
                <button
                  key={c.id}
                  className={`cover-swatch cover-${c.id} ${draft.coverStyle === c.id ? 'is-active' : ''}`}
                  onClick={() => set('coverStyle', c.id)}
                >
                  <span>{c.label}</span>
                  {draft.coverStyle === c.id && <Icon name="check" size={13} />}
                </button>
              ))}
            </div>
            <div className="field-row">
              <label className="field">
                <span className="field-label">Pattern overlay</span>
                <select value={draft.pattern} onChange={(e) => set('pattern', e.target.value as EventDraft['pattern'])}>
                  {PATTERNS.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field-label">Custom cover image URL (optional)</span>
                <input
                  value={draft.coverImage}
                  onChange={(e) => set('coverImage', e.target.value)}
                  placeholder="https://…"
                />
              </label>
            </div>
          </section>

          <section className="form-card">
            <div className="form-step">
              <span className="step-num mono">03</span>
              <h3>Date, time & room conflict check</h3>
            </div>

            <div className="field-row three">
              <label className="field">
                <span className="field-label">Date</span>
                <input type="date" value={draft.date} min={isoOffset(0)} onChange={(e) => set('date', e.target.value)} />
              </label>
              <label className="field">
                <span className="field-label">Start</span>
                <input type="time" value={draft.startTime} onChange={(e) => set('startTime', e.target.value)} />
              </label>
              <label className="field">
                <span className="field-label">End</span>
                <input type="time" value={draft.endTime} onChange={(e) => set('endTime', e.target.value)} />
              </label>
            </div>

            <div className="field-row">
              <label className="field">
                <span className="field-label">Campus</span>
                <select
                  value={draft.campus}
                  onChange={(e) => {
                    const campus = e.target.value as Campus;
                    const nextRoom = ROOMS.find((r) => r.campus === campus);
                    set('campus', campus);
                    set('roomId', nextRoom?.id ?? 'rm_online');
                  }}
                >
                  <option value="Boshlik">Boshlik Campus (3 Boshlik St)</option>
                  <option value="Online">Online / Telegram Live</option>
                </select>
              </label>
              <label className="field">
                <span className="field-label">Room</span>
                <select value={draft.roomId} onChange={(e) => set('roomId', e.target.value)}>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} · cap {r.capacity}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {conflicts.length === 0 ? (
              <div className="conflict-badge is-free">
                <Icon name="check" size={15} />
                <span>
                  <strong>Room available</strong> — {selectedRoom?.name} · capacity {selectedRoom?.capacity} ·{' '}
                  {draft.date} {draft.startTime}–{draft.endTime}
                </span>
              </div>
            ) : (
              <div className="conflict-badge is-conflict">
                <Icon name="x" size={15} />
                <div>
                  <strong>Schedule conflict</strong>
                  <p>
                    Occupied by “{conflicts[0].title}” from {conflicts[0].startTime} to {conflicts[0].endTime}. Pick the
                    next free slot or switch rooms.
                  </p>
                  <div className="conflict-actions">
                    {suggestion && (
                      <button
                        className="btn btn-primary btn-xs"
                        onClick={() => {
                          const duration = minutesFromTime(draft.endTime) - minutesFromTime(draft.startTime);
                          set('startTime', suggestion);
                          set('endTime', timeFromMinutes(minutesFromTime(suggestion) + Math.max(30, duration)));
                        }}
                      >
                        Auto-Pick Next Free Slot ({suggestion})
                      </button>
                    )}
                    {altRooms.length > 0 && (
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => set('roomId', altRooms[0].id)}
                      >
                        Switch to Available Room ({altRooms[0].name})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="equipment-block">
              <span className="field-label">Equipment checklist</span>
              <div className="equipment-grid">
                {EQUIPMENT.map((eq) => {
                  const on = draft.equipment.includes(eq);
                  return (
                    <button
                      key={eq}
                      className={`equip-toggle ${on ? 'is-on' : ''}`}
                      onClick={() =>
                        set('equipment', on ? draft.equipment.filter((x) => x !== eq) : [...draft.equipment, eq])
                      }
                    >
                      <span className="checkbox">{on && <Icon name="check" size={11} />}</span>
                      {eq}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="form-card">
            <div className="form-step">
              <span className="step-num mono">04</span>
              <h3>Registration & anti-ghosting rules</h3>
            </div>

            <div className="radio-stack">
              {(
                [
                  ['internal_1click', '⚡ 1-Click Internal RSVP + Holographic QR Ticket'],
                  ['internal_screening', '📋 Screening Application RSVP'],
                  ['external_link', '🔗 External Partner Link'],
                ] as [RegistrationMode, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  className={`radio-card ${draft.registrationMode === id ? 'is-active' : ''}`}
                  onClick={() => set('registrationMode', id)}
                >
                  <span className="radio-dot" />
                  {label}
                </button>
              ))}
            </div>

            {draft.registrationMode === 'external_link' && (
              <label className="field">
                <span className="field-label">Partner registration URL</span>
                <input
                  value={draft.externalUrl}
                  onChange={(e) => set('externalUrl', e.target.value)}
                  placeholder="https://udea.uz/admissions"
                />
                <span className="field-hint">Students still get a Telegram reminder and calendar save.</span>
              </label>
            )}

            {draft.registrationMode === 'internal_screening' && (
              <label className="field">
                <span className="field-label">Screening question</span>
                <input
                  value={draft.screeningPrompt}
                  onChange={(e) => set('screeningPrompt', e.target.value)}
                  placeholder="e.g. Share your GitHub or your motivation in one line."
                />
              </label>
            )}

            <label className="field">
              <span className="field-label">Capacity — {draft.track === 'peer_meetup' ? Math.min(30, draft.capacity) : draft.capacity} seats</span>
              <input
                type="range"
                min={5}
                max={250}
                value={draft.capacity}
                onChange={(e) => set('capacity', Number(e.target.value))}
              />
              <span className="field-hint">
                {draft.track === 'peer_meetup' ? 'Peer meetups are capped at 30 by policy.' : '5 to 250 seats.'}
              </span>
            </label>

            <div className="toggle-stack">
              <ToggleRow
                label="Automatic waitlist queue"
                hint="Promote the first waitlisted student when a seat is released."
                on={draft.waitlistEnabled}
                onChange={(v) => set('waitlistEnabled', v)}
              />
              <ToggleRow
                label="Team finder matchmaking"
                hint="Lets attendees publish a skill tag and find teammates."
                on={draft.teamFinder}
                onChange={(v) => set('teamFinder', v)}
              />
              <ToggleRow
                label="Official UDEA co-curricular certificate"
                hint="Checked-in attendance counts toward the diploma supplement."
                on={draft.certificate}
                onChange={(v) => set('certificate', v)}
              />
            </div>

            <div className="submit-block">
              <button className="btn btn-primary btn-lg" onClick={submit}>
                <Icon name="plus" size={16} /> {studentOfficial ? 'Submit for Room Approval' : 'Publish Event'}
              </button>
              <span className="mono subtle">
                {studentOfficial ? 'ADMIN QUEUE → TIMUR ALIMOV' : 'PUBLISHES INSTANTLY + TELEGRAM POST'}
              </span>
            </div>
          </section>

          {pendingMine.length > 0 && (
            <section className="form-card pending-card">
              <div className="form-step">
                <span className="step-num mono">!</span>
                <h3>Waiting on Campus Operations</h3>
              </div>
              {pendingMine.map((e) => (
                <div key={e.id} className="pending-row">
                  <div>
                    <strong>{e.title}</strong>
                    <span className="mono">{dayLabel(e.date)} • {ROOMS.find((r) => r.id === e.roomId)?.code}</span>
                  </div>
                  <span className="badge badge-warn">PENDING APPROVAL</span>
                </div>
              ))}
            </section>
          )}
        </div>

        <aside className="studio-preview">
          <div className="preview-tabs">
            <button className={previewMode === 'card' ? 'is-active' : ''} onClick={() => setPreviewMode('card')}>
              <Icon name="ticket" size={14} /> Live Event Card
            </button>
            <button className={previewMode === 'telegram' ? 'is-active' : ''} onClick={() => setPreviewMode('telegram')}>
              <Icon name="telegram" size={14} /> Telegram Post
            </button>
          </div>

          <div className={`preview-stage ${previewMode === 'telegram' ? 'is-chat' : ''}`}>
            {previewMode === 'card' ? (
              <div className="preview-card cat-scope">
                <div className="event-cover">
                  <Poster event={previewEvent} showTitle />
                </div>
                <div className="event-body">
                  <div className="event-host">
                    <span className={`host-cat cat-${draft.category}`}><i className="dot" />{CATEGORY_LABEL[draft.category]}</span>
                    <span className="host-name">{previewEvent.hostName}</span>
                  </div>
                  <h3 className="event-title">{previewEvent.title}</h3>
                  <p className="event-sub">{previewEvent.subtitle}</p>
                  <div className="capacity">
                    <div className="capacity-head">
                      <Mono>0 / {previewEvent.capacity} SEATS</Mono>
                      <span className="capacity-note cap-open">Just opened</span>
                    </div>
                    <div className="capacity-track"><div className="capacity-fill cap-open" style={{ width: '3%' }} /></div>
                  </div>
                  <div className="preview-card-foot">
                    <span className="mono">{dayLabel(draft.date)} • {draft.startTime}</span>
                    <span className="btn btn-primary btn-sm">1-Click RSVP</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="tg-preview">
                <div className="tg-channel">
                  <span className="tg-avatar">U</span>
                  <div>
                    <strong>UDEA Events</strong>
                    <span>@udeauz_events · 12.4k subscribers</span>
                  </div>
                </div>
                <div className="tg-bubble">
                  <p className="tg-bubble-text">{telegramText}</p>
                  <div className="tg-buttons">
                    <span>🎟️ 1-Click RSVP in Mini App</span>
                    <span>👥 Find Teammates</span>
                  </div>
                  <span className="tg-time mono">PREVIEW · {pct(0, 1)}% SEATS FILLED</span>
                </div>
                <div className="tg-foot mono">@udea_pulse_bot PREVIEW · NOT SENT</div>
              </div>
            )}
          </div>

          <div className="preview-notes">
            <div className="preview-note">
              <Icon name="shield" size={15} />
              <span>
                <strong>Your permissions:</strong>{' '}
                {persona.role === 'student'
                  ? 'official events go to the admin room queue; peer meetups publish instantly.'
                  : persona.role === 'club_lead'
                    ? 'official club events publish directly when the room is free.'
                    : 'full publish and approval rights.'}
              </span>
            </div>
            <div className="preview-note">
              <Icon name="clock" size={15} />
              <span>
                <strong>Conflict engine:</strong>{' '}
                {conflicts.length === 0 ? 'room is free for this slot.' : `${conflicts.length} overlapping booking(s) found.`}
              </span>
            </div>
            <button
              className="preview-copy"
              onClick={async () => {
                const ok = await copyText(telegramText);
                app.pushToast({
                  tone: ok ? 'success' : 'error',
                  title: ok ? 'Telegram post copied' : 'Copy blocked',
                  message: ok ? 'Paste it straight into @udeauz_events.' : 'Clipboard access was denied by the browser.',
                });
              }}
            >
              <Icon name="copy" size={13} /> Copy Telegram post text
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="toggle-row">
      <div>
        <strong>{label}</strong>
        <span>{hint}</span>
      </div>
      <button className={`switch ${on ? 'is-on' : ''}`} onClick={() => onChange(!on)} aria-pressed={on}>
        <i />
      </button>
    </div>
  );
}
