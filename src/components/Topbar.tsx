import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../lib/store';
import { Avatar, Icon } from './UI';
import { LONG_ROLE, personaRoleLabel } from '../lib/labels';

const CAMPUSES = ['all', 'Boshlik', 'Online'] as const;
const LANGS = ['all', 'EN', 'UZ', 'RU'] as const;

export default function Topbar() {
  const app = useApp();
  const [personaOpen, setPersonaOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeEvents = app.state.events.filter((e) => e.approvalStatus === 'approved' && !e.past).length;
  const passCount = app.state.tickets.filter(
    (t) => t.userId === app.persona.id && t.status !== 'cancelled',
  ).length;

  useEffect(() => {
    if (!personaOpen) return;
    const onDown = (ev: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(ev.target as Node)) setPersonaOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [personaOpen]);

  const nav = useMemo(
    () => [
      { id: 'explore', label: 'Explore & Calendar', short: 'Explore', icon: 'compass', badge: 0 },
      { id: 'clubs', label: 'Clubs & Partners', short: 'Clubs', icon: 'users', badge: 0 },
      { id: 'passes', label: 'My QR Passes & Passport', short: 'Passes', icon: 'ticket', badge: passCount },
      { id: 'organizer', label: 'Organizer & Admin Studio', short: 'Studio', icon: 'shield', badge: app.pendingApprovals },
    ],
    [passCount, app.pendingApprovals],
  );

  const go = (id: string) => {
    app.setView(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button className="brand" onClick={() => go('explore')} aria-label="UDEA Pulse home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
              <path d="M8 8v9a8 8 0 0 0 16 0V8" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
              <circle cx="8" cy="6" r="2" fill="currentColor" opacity=".55" />
            </svg>
          </span>
          <span className="brand-text">
            <strong>UDEA Pulse</strong>
            <em>Campus OS · Tashkent</em>
          </span>
          <span className="live-pill">
            <i />
            {activeEvents} Active Campus Events
          </span>
        </button>

        <nav className="topbar-tabs" aria-label="Primary">
          {nav.map((item) => (
            <button
              key={item.id}
              className={`nav-tab ${app.view === item.id ? 'is-active' : ''}`}
              onClick={() => go(item.id)}
              aria-current={app.view === item.id ? 'page' : undefined}
              aria-label={item.label}
              title={item.label}
            >
              <Icon name={item.icon} size={16} />
              <span className="nav-label-full">{item.label}</span>
              <span className="nav-label-short">{item.short}</span>
              {item.badge > 0 && <b className="nav-badge">{item.badge}</b>}
            </button>
          ))}
        </nav>

        <div className="topbar-utils">
          <button
            className={`mini-toggle ${app.mobile ? 'is-on' : ''}`}
            onClick={() => app.setMobile(!app.mobile)}
            title="Toggle the Telegram Mini App viewport"
          >
            <Icon name="phone" size={15} />
            <span>{app.mobile ? 'Desktop View' : 'TG Mini App'}</span>
          </button>

          <label className="quick-select" title="Campus quick filter">
            <Icon name="pin" size={14} />
            <select
              value={app.state.filters.campus}
              onChange={(e) => app.setFilters({ campus: e.target.value as never })}
              aria-label="Campus quick filter"
            >
              {CAMPUSES.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All campuses' : c === 'Boshlik' ? 'Boshlik St' : 'Online'}
                </option>
              ))}
            </select>
          </label>

          <label className="quick-select" title="Language quick filter">
            <Icon name="flag" size={14} />
            <select
              value={app.state.filters.language}
              onChange={(e) => app.setFilters({ language: e.target.value as never })}
              aria-label="Language quick filter"
            >
              {LANGS.map((l) => (
                <option key={l} value={l}>
                  {l === 'all' ? 'ALL' : l}
                </option>
              ))}
            </select>
          </label>

          <button
            className="icon-btn theme-btn"
            onClick={app.toggleTheme}
            title={app.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-label="Toggle theme"
          >
            <Icon name={app.theme === 'dark' ? 'sun' : 'moon'} size={18} />
          </button>

          <div className="persona-wrap" ref={menuRef}>
            <button
              className={`persona-btn ${personaOpen ? 'is-open' : ''}`}
              onClick={() => setPersonaOpen((v) => !v)}
              aria-expanded={personaOpen}
            >
              <Avatar name={app.persona.name} color={app.persona.color} size={28} />
              <span className="persona-btn-text">
                <strong>{app.persona.name.split(' ').slice(-1)[0]}</strong>
                <em>{personaRoleLabel(app.persona.role)}</em>
              </span>
              <Icon name="chevron" size={13} className="rot-90" />
            </button>

            {personaOpen && (
              <div className="persona-menu">
                <div className="persona-menu-head">
                  <span className="mono">SWITCH PERSONA</span>
                  <p>Test every permission set instantly.</p>
                </div>
                {app.personas.map((p) => (
                  <button
                    key={p.id}
                    className={`persona-option ${p.id === app.persona.id ? 'is-active' : ''}`}
                    onClick={() => {
                      app.setPersona(p.id);
                      setPersonaOpen(false);
                    }}
                  >
                    <Avatar name={p.name} color={p.color} size={32} />
                    <span>
                      <strong>{p.name}</strong>
                      <em>{LONG_ROLE[p.role]}</em>
                    </span>
                    {p.id === app.persona.id && <Icon name="check" size={15} />}
                  </button>
                ))}
                <div className="persona-menu-foot">
                  <button className="link-btn" onClick={app.resetDemo}>
                    <Icon name="refresh" size={14} /> Reset demo state
                  </button>
                  <span className="mono subtle">LOCALSTORAGE V1</span>
                </div>
              </div>
            )}
          </div>

          <button className="btn btn-primary host-btn" onClick={() => go('studio')}>
            <Icon name="plus" size={16} /> Host Event
          </button>
        </div>
      </div>

      <div className="mobile-topbar-utils">
        <button className="icon-btn" onClick={app.toggleTheme} aria-label="Toggle theme">
          <Icon name={app.theme === 'dark' ? 'sun' : 'moon'} size={18} />
        </button>
        <button
          className="icon-btn"
          onClick={() => app.setMobile(false)}
          aria-label="Exit mini app view"
          title="Exit mini app view"
        >
          <Icon name="external" size={18} />
        </button>
        <button className="avatar-btn" onClick={() => setPersonaOpen((v) => !v)} aria-label="Switch persona">
          <Avatar name={app.persona.name} color={app.persona.color} size={30} />
        </button>
        {personaOpen && (
          <div className="persona-menu mobile-persona">
            <div className="persona-menu-head">
              <span className="mono">SWITCH PERSONA</span>
            </div>
            {app.personas.map((p) => (
              <button
                key={p.id}
                className={`persona-option ${p.id === app.persona.id ? 'is-active' : ''}`}
                onClick={() => {
                  app.setPersona(p.id);
                  setPersonaOpen(false);
                }}
              >
                <Avatar name={p.name} color={p.color} size={30} />
                <span>
                  <strong>{p.name}</strong>
                  <em>{LONG_ROLE[p.role]}</em>
                </span>
              </button>
            ))}
            <div className="persona-menu-foot">
              <button className="link-btn" onClick={app.resetDemo}>
                <Icon name="refresh" size={14} /> Reset demo state
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export function TelegramHeader() {
  return (
    <div className="tg-header">
      <div className="tg-handle" />
      <div className="tg-row">
        <button className="tg-back" onClick={() => undefined} aria-label="Mini app back">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m14 6-6 6 6 6" />
          </svg>
        </button>
        <div className="tg-titles">
          <strong>UDEA Pulse Bot</strong>
          <span>Mini App · @udea_pulse_bot</span>
        </div>
        <span className="tg-dots" aria-hidden="true">•••</span>
      </div>
    </div>
  );
}
