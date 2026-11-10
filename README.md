# UDEA Pulse

Campus event discovery, calendar, room booking, QR ticketing and co-curricular passport for the
University of Digital Economics and Agrotechnologies (Tashkent), built to run as a desktop web portal
and as a Telegram Mini App viewport.

## Run

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # typecheck + production bundle in dist/
npm run preview  # serve the production build
```

## Demo state

Everything is client-side and persisted to `localStorage` under `udea_pulse_state_v1`
(tickets, waitlists, Q&A, approvals, follows, filters, theme). Use **Reset demo state** in the persona
menu or the footer to restore the seeded campus.

| Persona | Unlocks |
| --- | --- |
| Soliyev Firdavs (`usr_1`) | RSVP, waitlist, team finder, QR passes, passport, certificate printing |
| Malika Karimova (`usr_2`) | Club president: instant publishing, host Q&A answers, scanner for her club events |
| Timur Alimov (`usr_3`) | Campus admin: room approval queue and every event's organizer toolkit |

### Seeded flows worth trying

- **Agrobank Hackathon** — 59/60 seats: claim the last seat, then release it from the drawer.
- **IoT Workshop** — full with 4 waiting: join as waitlist #5.
- **Careers Fair** — full, with the student already confirmed: releasing the seat promotes waitlist #1.
- **Debate** — screening application with a required answer.
- **Robotics Expo** — pending room approval: switch to Timur and approve it.
- **Past Agrobank Forum** — checked in, so the printable certificate works immediately.
- **Host Event Studio** — poster preview, Telegram post preview, room conflict detection and auto-pick.
- **Organizer Studio** — offline scanner simulation, manual check-in, CSV export, Telegram broadcast.

## Notes

- Telegram bot actions (reminders, broadcasts, promotion notifications, DM handshakes) are simulated
  in-app with toast/banner feedback and stored history; no bot token is required.
- The external-link event opens the real partner portal in a new tab and records a tracked save.
- `Print / Save as PDF` on the certificate uses the browser print dialog with a print-only A4 layout.
- Seed dates are generated relative to the day the demo state is first created, so "today" events stay
  on today on every fresh reset.
