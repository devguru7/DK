import React from 'react';
import { useApp } from '../lib/store';
import { CLUBS, ROOMS } from '../lib/seed';
import { Avatar, CategoryBadge, Icon, Mono, SectionHeader } from './UI';
import { dayLabel, isoDate } from '../lib/utils';

export default function Clubs() {
  const app = useApp();
  const today = isoDate();
  const approved = app.state.events.filter((e) => e.approvalStatus === 'approved' && !e.past);

  const nextEventFor = (clubId: string) =>
    approved
      .filter((e) => e.hostClubId === clubId && e.date >= today)
      .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))[0];

  const upcomingClubEvents = approved.filter((e) => e.hostClubId).length;

  return (
    <div className="clubs-view">
      <SectionHeader
        icon="users"
        title="Clubs & Partners"
        subtitle="The official UDEA student organisations, ACCA and Agrobank partners. Follow a club to get its events on Telegram."
        action={<Mono>{app.state.followedClubs.length} FOLLOWED</Mono>}
      />

      <div className="clubs-stats">
        <div className="clubs-stat">
          <Mono>STUDENT ORGANISATIONS</Mono>
          <strong>{CLUBS.length}</strong>
          <span>verified by Student Affairs</span>
        </div>
        <div className="clubs-stat">
          <Mono>CLUB EVENTS LIVE</Mono>
          <strong>{upcomingClubEvents}</strong>
          <span>in the next 14 days</span>
        </div>
        <div className="clubs-stat">
          <Mono>INDUSTRY PARTNERS</Mono>
          <strong>Agrobank · ACCA · Coventry</strong>
          <span>grant, certification and validation partners</span>
        </div>
        <div className="clubs-stat">
          <Mono>YOUR FOLLOWING</Mono>
          <strong>{app.state.followedClubs.length}</strong>
          <span>Telegram announcements on</span>
        </div>
      </div>

      <div className="club-grid">
        {CLUBS.map((club) => {
          const following = app.state.followedClubs.includes(club.id);
          const next = nextEventFor(club.id);
          const room = next ? ROOMS.find((r) => r.id === next.roomId) : undefined;
          return (
            <article key={club.id} className={`club-card cat-${club.category} ${following ? 'is-following' : ''}`}>
              <div className="club-top">
                <span className="club-emblem" style={{ background: `linear-gradient(140deg, ${club.color}, ${club.color}88)` }}>
                  {club.short.slice(0, 2).toUpperCase()}
                </span>
                <div className="club-id">
                  <h3>{club.name}</h3>
                  <div className="club-meta">
                    <CategoryBadge category={club.category} small />
                    <span className="verified-label"><Icon name="check" size={11} /> Verified</span>
                    {club.partner && <Mono>{club.partner}</Mono>}
                  </div>
                </div>
              </div>

              <p className="club-desc">{club.description}</p>

              <div className="club-numbers">
                <span><Mono>{club.members}</Mono> members</span>
                <span className="dotsep" />
                <span>{approved.filter((e) => e.hostClubId === club.id).length} events this fortnight</span>
              </div>

              {next ? (
                <button className="club-next" onClick={() => app.openEvent(next.id)}>
                  <span className="club-next-dot" />
                  <span>
                    <strong>{next.title}</strong>
                    <em className="mono">{dayLabel(next.date)} • {next.startTime} • {room?.code}</em>
                  </span>
                  <Icon name="chevron" size={14} />
                </button>
              ) : (
                <div className="club-next is-empty">
                  <span className="club-next-dot" />
                  <span>
                    <strong>No events scheduled</strong>
                    <em className="mono">Follow to hear first</em>
                  </span>
                </div>
              )}

              <div className="club-actions">
                <button
                  className={`btn ${following ? 'btn-ghost' : 'btn-primary'} btn-sm`}
                  onClick={() => app.followClub(club.id)}
                >
                  <Icon name={following ? 'check' : 'bell'} size={13} /> {following ? 'Following' : 'Follow Club'}
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    app.setFilters({ search: club.name, track: 'all', category: 'all', date: null });
                    app.setView('explore');
                  }}
                >
                  View events <Icon name="arrow" size={13} />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="partner-strip">
        <div className="partner-logo">UDEA</div>
        <div className="partner-logo">COVENTRY<br />UNIVERSITY</div>
        <div className="partner-logo">AGROBANK</div>
        <div className="partner-logo">ACCA<br />SILVER</div>
        <p className="mono">STRATEGIC SCHOLARSHIP & INDUSTRY PARTNERS OF UDEA TASHKENT</p>
      </div>
    </div>
  );
}
