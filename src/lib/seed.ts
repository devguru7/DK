import type {
  AgendaItem,
  Category,
  Club,
  EventItem,
  Persona,
  Person,
  Question,
  Room,
  WaitlistEntry,
} from '../types';
import { isoOffset, randomHash, isoDate } from './utils';

export const PERSONAS: Persona[] = [
  {
    id: 'usr_1',
    name: 'Soliyev Firdavs',
    role: 'student',
    programme: 'BSc (Hons) International Finance and Banking',
    programmeShort: 'Finance',
    year: 'Year 2',
    telegram: '@firdavs_udea',
    studentId: 'UDEA-24-1089',
    xp: 450,
    reliabilityScore: 98,
    color: '#2563EB',
  },
  {
    id: 'usr_2',
    name: 'Malika Karimova',
    role: 'club_lead',
    programme: 'BSc (Hons) Business Data Analytics',
    programmeShort: 'Data Analytics',
    year: 'Year 3',
    telegram: '@malika_analytics',
    studentId: 'UDEA-23-0412',
    xp: 820,
    reliabilityScore: 100,
    clubId: 'club_fintech',
    color: '#8B5CF6',
  },
  {
    id: 'usr_3',
    name: 'Timur Alimov',
    role: 'admin',
    department: 'UDEA Student Affairs & Campus Operations',
    telegram: '@udea_admin',
    studentId: 'STAFF-009',
    xp: 0,
    reliabilityScore: 100,
    color: '#10B981',
  },
];

export const ROOMS: Room[] = [
  {
    id: 'rm_boshlik_hall',
    campus: 'Boshlik',
    name: 'Grand Assembly Hall',
    code: 'ASSEMBLY HALL',
    capacity: 200,
    equipment: ['LED Wall', '4x Wireless Mics', 'Stage Audio', '4K Laser Projector', 'Lecture Capture'],
    address: '3 Boshlik Street, Yakkasaray District, Tashkent',
    floor: 'Ground floor',
    kind: 'hall',
  },
  {
    id: 'rm_boshlik_lab',
    campus: 'Boshlik',
    name: 'Innovation & IoT Lab B2',
    code: 'LAB B2',
    capacity: 35,
    equipment: ['35x Workstations', 'High-Speed VLAN', 'Smartboard'],
    address: '3 Boshlik Street, Yakkasaray District, Tashkent',
    floor: '2nd floor',
    kind: 'lab',
  },
  {
    id: 'rm_boshlik_204',
    campus: 'Boshlik',
    name: 'Seminar Room 204',
    code: 'ROOM 204',
    capacity: 40,
    equipment: ['Projector', 'HDMI', 'Glass Whiteboard'],
    address: '3 Boshlik Street, Yakkasaray District, Tashkent',
    floor: '2nd floor',
    kind: 'hall',
  },
  {
    id: 'rm_boshlik_lrc',
    campus: 'Boshlik',
    name: 'Learning Resource Centre Zone B',
    code: 'LRC ZONE B',
    capacity: 25,
    equipment: ['Roundtable', 'Quiet Acoustic Pods'],
    address: '3 Boshlik Street, Yakkasaray District, Tashkent',
    floor: '3rd floor',
    kind: 'library',
  },
  {
    id: 'rm_boshlik_sports',
    campus: 'Boshlik',
    name: 'UDEA Sports Complex',
    code: 'SPORTS HALL',
    capacity: 80,
    equipment: ['Futsal Court', '4x Table Tennis Tables', 'Scoreboard'],
    address: '3 Boshlik Street, Yakkasaray District, Tashkent',
    floor: 'Ground floor',
    kind: 'sports',
  },
  {
    id: 'rm_online',
    campus: 'Online',
    name: 'Telegram Live Stream',
    code: 'TG LIVE',
    capacity: 500,
    equipment: ['Telegram Live Stream', 'Live Q&A Bot'],
    address: 'UDEA Pulse Telegram Channel',
    floor: 'Online',
    kind: 'online',
  },
];

export const CLUBS: Club[] = [
  {
    id: 'club_agrobank',
    name: 'Agrobank Innovation Hub',
    short: 'Agrobank Hub',
    category: 'fintech',
    description:
      'Industry-backed innovation hub running grant challenges, credit-scoring sprints and agri-lending clinics with JSCB Agrobank engineers.',
    members: 214,
    verified: true,
    partner: 'JSCB Agrobank',
    color: '#10B981',
  },
  {
    id: 'club_fintech',
    name: 'UDEA FinTech & Quant Society',
    short: 'FinTech Society',
    category: 'fintech',
    description:
      'Student-led quant, trading and payments community. Weekly market labs, hackathon teams and CFA/ACCA study circles.',
    members: 168,
    verified: true,
    partner: 'Coventry University',
    color: '#10B981',
  },
  {
    id: 'club_debate',
    name: 'Coventry Debate & Diplomacy Club',
    short: 'Debate Club',
    category: 'culture',
    description:
      'British Parliamentary debate training, model diplomacy simulations and public-speaking coaching in three languages.',
    members: 132,
    verified: true,
    partner: 'Coventry University',
    color: '#F97316',
  },
  {
    id: 'club_acca',
    name: 'ACCA Silver Partner Study Circle',
    short: 'ACCA Circle',
    category: 'academic',
    description:
      'Official ACCA Silver partner study circle: F3 mock exams, tutor crash reviews and exam-bootcamp weekends.',
    members: 196,
    verified: true,
    partner: 'ACCA',
    color: '#2563EB',
  },
  {
    id: 'club_agritech',
    name: 'UDEA AgriTech & Robotics Lab',
    short: 'AgriTech Lab',
    category: 'tech',
    description:
      'Sensors, drones and smart-farming builds. Maintains the campus LoRaWAN testbed and the greenhouse telemetry kit.',
    members: 87,
    verified: true,
    partner: 'Agrobank Agri Lab',
    color: '#8B5CF6',
  },
  {
    id: 'club_ielts',
    name: 'Academic Writing & IELTS Center',
    short: 'IELTS Center',
    category: 'academic',
    description:
      'Peer-run speaking mocks, essay clinics and academic integrity workshops supporting the UDEA Foundation Year.',
    members: 240,
    verified: true,
    color: '#2563EB',
  },
  {
    id: 'club_sports',
    name: 'UDEA Sports & Cybersport Union',
    short: 'Sports Union',
    category: 'sports',
    description:
      'Inter-faculty futsal leagues, table tennis ladders, chess nights and the campus cybersport roster.',
    members: 305,
    verified: true,
    color: '#84CC16',
  },
];

const NAMES = [
  'Amirbek Ne’matilloyev',
  'Jasur Rakhimov',
  'Diyora Rustamova',
  'Sardorbek Aliev',
  'Kamola Yusupova',
  'Bekzod Tursunov',
  'Nilufar Abdullaeva',
  'Aziz Khakimov',
  'Zarina Ismoilova',
  'Temur Ergashev',
  'Shahzoda Nazarova',
  'Rustam Yo’ldoshev',
  'Gulnora Sattorova',
  'Abdulloh Qodirov',
  'Sevinch Rahimova',
  'Islombek Matkarimov',
  'Maftuna Ochilova',
  'Javohir Sultonov',
  'Dildora Karimova',
  'Bobur Mirzayev',
  'Oysha Tohirova',
  'Sanjar Umarov',
  'Madina Yoqubova',
  'Ulugbek Nazarov',
  'Farangiz Ortiqova',
  'Doniyor Safarov',
  'Robiya Xolmatova',
  'Sherzod Baratov',
  'Sitora Davlatova',
  'Nodir Hamidov',
];

const PROGRAMS: { full: string; short: string }[] = [
  { full: 'BSc (Hons) International Finance and Banking', short: 'Finance' },
  { full: 'BSc (Hons) Business Data Analytics', short: 'Data Analytics' },
  { full: 'BA (Hons) Business Management and Leadership', short: 'Management' },
  { full: 'BSc Digital Economics & Agrotechnologies', short: 'AgriTech' },
  { full: 'Foundation Year (English & Academic Prep)', short: 'Foundation' },
  { full: 'MSc / MBA Project Management & FinTech', short: 'MSc FinTech' },
];

const AVATAR_COLORS = ['#10B981', '#8B5CF6', '#2563EB', '#84CC16', '#F97316', '#EC4899', '#0EA5E9'];

const TEAM_ROLES = [
  'Python / Data Analysis',
  'Pitch Deck & Finance',
  'UI/UX Designer',
  'IoT Hardware',
  'Backend / APIs',
  'Research & Writing',
];

function handleFor(name: string): string {
  const first = name.split(/\s+/).filter(Boolean).pop() ?? 'student';
  return `@${first.toLowerCase().replace(/[^a-z]/g, '')}_udea`;
}

export function buildRoster(seed: number, count: number, teamCount = 0): Person[] {
  const people: Person[] = [];
  for (let i = 0; i < count; i++) {
    const name = NAMES[(seed * 5 + i * 3) % NAMES.length];
    const program = PROGRAMS[(seed + i * 2) % PROGRAMS.length];
    const looking = i < teamCount;
    people.push({
      id: `p_${seed}_${i}`,
      name,
      programme: program.full,
      programmeShort: program.short,
      telegram: handleFor(name),
      color: AVATAR_COLORS[(seed + i) % AVATAR_COLORS.length],
      lookingForTeam: looking,
      teamRole: looking ? TEAM_ROLES[(seed + i) % TEAM_ROLES.length] : undefined,
    });
  }
  return people;
}

function selfPerson(persona: Persona, seed: number): Person {
  return {
    id: `att_${persona.id}`,
    name: persona.name,
    programme: persona.programme ?? persona.department ?? 'UDEA Staff',
    programmeShort: persona.programmeShort ?? 'Staff',
    telegram: persona.telegram,
    color: persona.color,
    lookingForTeam: false,
    self: true,
    teamRole: '',
    ...{ _seed: seed },
  } as Person;
}

function withSelf(roster: Person[], persona: Persona): Person[] {
  const out = roster.slice();
  if (out.length > 2) out[2] = selfPerson(persona, 1);
  else out.push(selfPerson(persona, 1));
  return out;
}

function questions(list: Omit<Question, 'id' | 'timestamp' | 'upvotedByMe' | 'answered'>[]): Question[] {
  return list.map((q, i) => ({
    ...q,
    id: `q_${i + 1}_${Math.random().toString(36).slice(2, 6)}`,
    upvotedByMe: false,
    answered: q.answerText ? true : false,
    timestamp: new Date(Date.now() - (i + 1) * 3600 * 1000).toISOString(),
  }));
}

function agenda(items: [string, string, string?][]): AgendaItem[] {
  return items.map(([time, title, speaker]) => ({ time, title, speaker }));
}

function waitlist(seed: number, count: number): WaitlistEntry[] {
  return buildRoster(seed, count).map((p) => ({
    id: `wl_${seed}_${p.id}`,
    name: p.name,
    programme: p.programme,
    programmeShort: p.programmeShort,
    telegram: p.telegram,
    studentId: `UDEA-2${seed}-${1000 + seed * 37 + p.id.length}`,
  }));
}

const COV = 'Coventry University (UK)';
const AGRO = 'JSCB Agrobank';

function ev(partial: Partial<EventItem> & Pick<EventItem, 'id' | 'title' | 'category' | 'date' | 'startTime' | 'endTime' | 'roomId' | 'hostName'>): EventItem {
  return {
    subtitle: '',
    description: '',
    outcomes: [],
    agenda: [],
    eventType: 'official',
    approvalStatus: 'approved',
    campus: 'Boshlik',
    language: 'EN',
    hostClubId: null,
    registrationMode: 'internal_1click',
    capacity: 40,
    registeredCount: 0,
    waitlistCount: 0,
    issueCertificate: false,
    coverStyle: 'emerald',
    pattern: 'grid',
    equipmentRequested: [],
    teamFinder: false,
    waitlistEnabled: true,
    attendees: [],
    questions: [],
    waitlistRoster: [],
    checkIns: {},
    ...partial,
  };
}

export function buildSeedEvents(): EventItem[] {
  const today = isoOffset(0);

  const hackRoster = buildRoster(1, 24, 4);
  const iotRoster = buildRoster(2, 24, 1);
  const coventryRoster = buildRoster(3, 24, 2);
  const accaRoster = withSelf(buildRoster(4, 24, 0), PERSONAS[0]);
  const pythonRoster = withSelf(buildRoster(5, 15, 2), PERSONAS[0]);
  const ieltsRoster = buildRoster(6, 16, 1);
  const futsalRoster = buildRoster(7, 24, 3);
  const debateRoster = buildRoster(8, 24, 1);
  const careersRoster = withSelf(buildRoster(9, 24, 2), PERSONAS[0]);
  const cybersportRoster = buildRoster(10, 9, 2);
  const movieRoster = buildRoster(11, 18, 0);
  const pastRoster = withSelf(buildRoster(12, 24, 0), PERSONAS[0]);

  const pastCheckIns: Record<string, string> = {};
  pastRoster.forEach((p, i) => {
    pastCheckIns[p.id] = new Date(Date.now() - 4 * 86400000 + 3600000 + i * 90000).toISOString();
  });
  const accaCheckIns: Record<string, string> = {};
  accaRoster.slice(0, 8).forEach((p, i) => {
    accaCheckIns[p.id] = new Date(Date.now() - 5400000 + i * 240000).toISOString();
  });

  const events: EventItem[] = [
    ev({
      id: 'evt_1',
      featured: true,
      title: 'Agrobank x UDEA FinTech & AI Hackathon 2026',
      subtitle: 'Eight hours, three tracks, one working prototype. Agrobank grant money and fast-track interviews on the line.',
      description:
        'UDEA’s flagship campus build sprint, delivered with the Agrobank Innovation Hub and validated by Coventry University. Teams of three or four ship working prototypes across payments, credit scoring for smallholder farmers, and agri-lending analytics. Agrobank engineers open their sandbox APIs for the day, mentors rotate through the assembly hall, and every finisher receives a Coventry-validated co-curricular certificate. The top two teams present again at the Agrobank Tashkent demo day and enter the 15M UZS prize pool.',
      outcomes: [
        'Ship a working prototype in a single day',
        'Hands-on access to the Agrobank sandbox API',
        'Mentor feedback from Agrobank engineers and Coventry judges',
        'Verified certificate plus a portfolio-ready case study',
      ],
      prerequisites: 'Bring a laptop and basic Python or JavaScript. Solo builders get matched into teams at 10:30.',
      agenda: agenda([
        ['10:00', 'Registration, coffee & team matching', 'FinTech Society crew'],
        ['10:30', 'Problem briefing: lending for the last mile', 'Agrobank FinTech Lead'],
        ['11:00', 'Build sprint I — data pipelines & scoring', 'Mentor floor'],
        ['14:00', 'Mentor office hours & API clinic', 'Agrobank engineering'],
        ['16:30', 'Pitch rehearsal & judging criteria', 'Coventry academic panel'],
        ['17:30', 'Final pitches, judging & awards', 'Agrobank + Coventry'],
      ]),
      category: 'fintech',
      eventType: 'official',
      campus: 'Boshlik',
      roomId: 'rm_boshlik_hall',
      date: isoOffset(1),
      startTime: '10:00',
      endTime: '18:00',
      hostClubId: 'club_fintech',
      hostName: 'UDEA FinTech & Quant Society',
      registrationMode: 'internal_1click',
      capacity: 60,
      registeredCount: 59,
      waitlistCount: 0,
      issueCertificate: true,
      coverStyle: 'emerald',
      pattern: 'grid',
      equipmentRequested: ['LED Wall', '4x Wireless Mics', 'Power Strips'],
      teamFinder: true,
      attendees: hackRoster,
      waitlistRoster: [],
      questions: questions([
        {
          author: 'Jasur Rakhimov',
          programme: 'Data Analytics',
          text: 'Do we need our own Agrobank sandbox credentials or do we get them at registration?',
          upvotes: 24,
          answerText:
            'Credentials are printed on your badge at 10:00 — each team gets one sandbox key with a 50k-row synthetic lending dataset.',
        },
        {
          author: 'Diyora Rustamova',
          programme: 'Finance',
          text: 'Can Foundation Year students join a team, or is it second year and above?',
          upvotes: 17,
        },
        {
          author: 'Sardorbek Aliev',
          programme: 'AgriTech',
          text: 'Is there a hardware track for soil-sensor data, or is it software only?',
          upvotes: 11,
        },
      ]),
    }),
    ev({
      id: 'evt_2',
      title: 'AgriTech & Smart Farming IoT Sensor Workshop',
      subtitle: 'Deploy live soil-moisture sensors on LoRaWAN and watch a real greenhouse dashboard come alive.',
      description:
        'A hands-on lab with the UDEA AgriTech & Robotics Lab. You will wire low-cost soil-moisture and micro-climate sensors, provision them onto the campus LoRaWAN gateway, and build the dashboard that turns raw telemetry into irrigation decisions. All hardware is provided — the lab keeps the kits, you keep the code. Delivered in Uzbek with English lab notes.',
      outcomes: [
        'Wire and calibrate a soil-moisture sensor node',
        'Provision a device onto the campus LoRaWAN gateway',
        'Build a live telemetry dashboard',
        'Understand irrigation thresholds for Tashkent cotton and vegetable plots',
      ],
      prerequisites: 'No hardware experience needed. Bring a laptop with VS Code installed.',
      agenda: agenda([
        ['14:00', 'Sensor kit unboxing & safety briefing', 'AgriTech Lab leads'],
        ['14:30', 'LoRaWAN gateway provisioning', 'Robotics engineer'],
        ['15:15', 'Telemetry dashboard build', 'Lab mentors'],
        ['16:00', 'Field deployment walkthrough & Q&A', 'AgriTech Lab leads'],
      ]),
      category: 'tech',
      eventType: 'official',
      campus: 'Boshlik',
      roomId: 'rm_boshlik_lab',
      date: isoOffset(2),
      startTime: '14:00',
      endTime: '16:30',
      language: 'UZ',
      hostClubId: 'club_agritech',
      hostName: 'UDEA AgriTech & Robotics Lab',
      capacity: 25,
      registeredCount: 25,
      waitlistCount: 4,
      issueCertificate: true,
      coverStyle: 'violet',
      pattern: 'dots',
      equipmentRequested: ['Smartboard', 'Power Strips'],
      attendees: iotRoster,
      waitlistRoster: waitlist(21, 4),
      questions: questions([
        {
          author: 'Bekzod Tursunov',
          programme: 'AgriTech',
          text: 'Will the LoRaWAN gateway credentials be shared with students after the workshop?',
          upvotes: 9,
          answerText: 'Yes — lab members keep read access to the testbed gateway for the whole semester.',
        },
      ]),
    }),
    ev({
      id: 'evt_3',
      title: 'Coventry University UK Mobility & Dual-Degree Briefing',
      subtitle: 'One semester in Coventry, UK: eligibility, fees, visa timeline and the dual-degree pathway.',
      description:
        'The official Coventry University mobility briefing for UDEA students. The UK mobility office walks through the semester-abroad options, the dual-degree credit transfer rules, tuition and living-cost planning, and the visa timeline for the January and September intakes. Bring your transcript questions — there is a 30-minute open floor at the end. Registration is handled through the UDEA admissions portal, and saving a seat here adds the event to your calendar with a Telegram reminder.',
      outcomes: [
        'Understand dual-degree credit transfer rules',
        'Plan your January or September mobility application',
        'Check English-language and GPA eligibility',
        'Meet the Coventry mobility coordinator',
      ],
      agenda: agenda([
        ['15:00', 'Welcome & UDEA–Coventry partnership overview', 'Mobility Coordinator'],
        ['15:20', 'Semester abroad: modules, credits & transcripts', 'Coventry academic lead'],
        ['16:00', 'Fees, scholarships and visa timeline', 'Admissions office'],
        ['16:20', 'Open floor Q&A', 'All speakers'],
      ]),
      category: 'academic',
      eventType: 'official',
      campus: 'Boshlik',
      roomId: 'rm_boshlik_hall',
      date: isoOffset(3),
      startTime: '15:00',
      endTime: '16:30',
      hostClubId: null,
      hostName: 'UDEA International Office',
      registrationMode: 'external_link',
      externalUrl: 'https://udea.uz/admissions',
      capacity: 120,
      registeredCount: 84,
      waitlistCount: 0,
      coverStyle: 'blueprint',
      pattern: 'waves',
      equipmentRequested: ['4K Laser Projector', '2x Mics', 'Lecture Capture'],
      attendees: coventryRoster,
      questions: questions([
        {
          author: 'Nilufar Abdullaeva',
          programme: 'Management',
          text: 'Is the mobility semester available to Year 1 students or only Year 2 and above?',
          upvotes: 14,
        },
      ]),
    }),
    ev({
      id: 'evt_4',
      title: 'ACCA F3 Financial Accounting Mock Exam & Crash Review',
      subtitle: 'Sit a timed F3 paper under exam conditions, then tear it apart section by section with the tutor.',
      description:
        'The ACCA Silver Partner Study Circle runs a full timed F3 mock in Seminar Room 204, followed by a two-hour crash review of the sections that hurt the cohort most: consolidated statements, accruals, and suspense accounts. Papers are marked on the spot and you leave with a personalised weak-topic sheet. Certificate-eligible and counts toward your co-curricular passport.',
      outcomes: [
        'Sit a full F3 paper under exam timing',
        'Get your script marked on the day',
        'Personal weak-topic sheet for the last revision week',
        'Peer revision group assignment',
      ],
      agenda: agenda([
        ['16:00', 'Seated, briefed and papers out', 'ACCA Circle invigilators'],
        ['16:10', 'Timed mock exam', 'Exam conditions'],
        ['17:00', 'Marking break & coffee', 'Study Circle'],
        ['17:15', 'Crash review of toughest sections', 'ACCA tutor'],
        ['17:50', 'Weak-topic sheets & study groups', 'Study Circle leads'],
      ]),
      category: 'academic',
      eventType: 'official',
      campus: 'Boshlik',
      roomId: 'rm_boshlik_204',
      date: today,
      startTime: '16:00',
      endTime: '18:00',
      hostClubId: 'club_acca',
      hostName: 'ACCA Silver Partner Study Circle',
      capacity: 40,
      registeredCount: 34,
      issueCertificate: true,
      coverStyle: 'royal',
      pattern: 'grid',
      equipmentRequested: ['Projector', 'HDMI', 'Glass Whiteboard'],
      attendees: accaRoster,
      checkIns: accaCheckIns,
      questions: questions([
        {
          author: 'Kamola Yusupova',
          programme: 'Finance',
          text: 'Are we allowed to bring our own calculators, or does the room provide them?',
          upvotes: 6,
          answerText: 'Bring your own non-programmable calculator — the exam centre only has four spares.',
        },
      ]),
    }),
    ev({
      id: 'evt_5',
      title: 'Python, Pandas & SQL Peer Study Sprint',
      subtitle: 'Bring your data assignment. We pair-debug, review each other’s notebooks and finish the SQL set together.',
      description:
        'An informal student-run sprint in the Learning Resource Centre Zone B. Third-year students host a pair-debugging clinic for the Pandas group assignment and the SQL joins exercise. No slides, no lecture — laptops open, problems on the whiteboard, coffee on. Team finder is on, so you can see who is looking for a project partner for the analytics module.',
      outcomes: [
        'Finish the Pandas group assignment with a partner',
        'Debug SQL joins with a peer reviewer',
        'Meet project partners for the module coursework',
      ],
      agenda: agenda([
        ['17:30', 'Check-in & problem wall', 'Peer hosts'],
        ['17:45', 'Pair-debug rotations', 'All attendees'],
        ['18:30', 'SQL clinic on the whiteboard', 'Firdavs Soliyev'],
        ['18:50', 'Wrap-up & next session poll', 'Peer hosts'],
      ]),
      category: 'tech',
      eventType: 'peer_meetup',
      campus: 'Boshlik',
      roomId: 'rm_boshlik_lrc',
      date: today,
      startTime: '17:30',
      endTime: '19:00',
      hostClubId: null,
      hostName: 'Soliyev Firdavs',
      createdBy: 'usr_1',
      capacity: 15,
      registeredCount: 11,
      coverStyle: 'obsidian',
      pattern: 'dots',
      equipmentRequested: ['Whiteboards'],
      teamFinder: true,
      attendees: pythonRoster,
      questions: questions([
        {
          author: 'Aziz Khakimov',
          programme: 'Data Analytics',
          text: 'Will the notebook from today be shared in the Telegram group afterwards?',
          upvotes: 3,
        },
      ]),
    }),
    ev({
      id: 'evt_6',
      title: 'Academic Writing & IELTS 8.0+ Speaking Mock Club',
      subtitle: 'Three timed speaking rounds, peer band scoring and an essay clinic for the Foundation cohort.',
      description:
        'A peer-run speaking mock in the quiet LRC Zone B. You rotate through Part 2 cue cards and a full Part 3 discussion, then score each other against the public band descriptors with a tutor moderating. The last twenty minutes are an essay clinic: bring one paragraph and leave with a corrected version.',
      outcomes: [
        'Complete a full three-part speaking mock',
        'Understand band descriptor scoring',
        'Corrected essay paragraph',
      ],
      agenda: agenda([
        ['13:30', 'Cue card rotation round 1', 'Peer examiners'],
        ['14:05', 'Part 3 discussion rounds', 'Peer examiners'],
        ['14:40', 'Essay clinic & feedback', 'Writing tutors'],
      ]),
      category: 'culture',
      eventType: 'peer_meetup',
      campus: 'Boshlik',
      roomId: 'rm_boshlik_lrc',
      date: isoOffset(4),
      startTime: '13:30',
      endTime: '15:00',
      hostClubId: null,
      hostName: 'Kamola Yusupova',
      createdBy: 'usr_2',
      capacity: 20,
      registeredCount: 16,
      coverStyle: 'sunset',
      pattern: 'waves',
      attendees: ieltsRoster,
      questions: questions([
        {
          author: 'Maftuna Ochilova',
          programme: 'Foundation',
          text: 'Should we prepare a Part 2 cue card in advance or will they be handed out on the day?',
          upvotes: 5,
        },
      ]),
    }),
    ev({
      id: 'evt_7',
      title: 'UDEA Cup: Inter-Faculty Futsal & Table Tennis Night',
      subtitle: 'Six faculties, one cup. Bring a squad or get drafted on the night — spectators welcome.',
      description:
        'The Sports Complex turns into a festival of futsal and table tennis for the UDEA Cup. Faculty squads compete in a group stage followed by knockout finals, while the ping-pong ladder runs continuously on four tables. Officials referee every futsal match, and the winning faculty takes the UDEA Cup trophy plus 500 XP per squad member. Team finder is enabled for players looking to fill a squad.',
      outcomes: [
        'Play at least two futsal matches or ladder rounds',
        'Meet players across all faculties',
        'Compete for the UDEA Cup and campus XP',
      ],
      agenda: agenda([
        ['18:00', 'Squad registration & warm-up', 'Sports Union'],
        ['18:30', 'Futsal group stage', 'Officials'],
        ['19:45', 'Table tennis ladder finals', 'Sports Union'],
        ['20:30', 'Futsal knockout finals', 'Officials'],
      ]),
      category: 'sports',
      eventType: 'official',
      campus: 'Boshlik',
      roomId: 'rm_boshlik_sports',
      date: isoOffset(5),
      startTime: '18:00',
      endTime: '21:00',
      language: 'RU',
      hostClubId: 'club_sports',
      hostName: 'UDEA Sports & Cybersport Union',
      capacity: 64,
      registeredCount: 52,
      coverStyle: 'lime',
      pattern: 'grid',
      equipmentRequested: ['Scoreboard', '4x Table Tennis Tables'],
      teamFinder: true,
      attendees: futsalRoster,
      questions: questions([
        {
          author: 'Rustam Yo’ldoshev',
          programme: 'Management',
          text: 'Can we register a mixed faculty squad if we only have five players including the keeper?',
          upvotes: 8,
          answerText: 'Yes — five is enough, and the Sports Union can lend you a keeper from the draft pool.',
        },
      ]),
    }),
    ev({
      id: 'evt_8',
      title: 'British Parliamentary Debate: CBDCs & the Digital Som Future',
      subtitle: 'Motions, roles and a live adjudication panel. Screening question required to claim a speaking slot.',
      description:
        'A British Parliamentary debate on central bank digital currencies and the future of the digital som, hosted with the Coventry Debate & Diplomacy Club. Four teams, two motions, and an adjudication panel trained on the BP scoring rubric. Speaking roles are allocated after screening — tell us whether you want to speak, adjudicate, or watch from the floor.',
      outcomes: [
        'Debate or adjudicate under BP rules',
        'Work with a live adjudication rubric',
        'Understand CBDC trade-offs in an emerging economy',
      ],
      prerequisites: 'Read the motion pack in the Telegram channel before arriving.',
      agenda: agenda([
        ['15:30', 'Role confirmation & motion reveal', 'Debate Club'],
        ['15:45', 'Round 1 — government vs opposition', 'Adjudication panel'],
        ['16:30', 'Round 2 — closing half debates', 'Adjudication panel'],
        ['17:15', 'Adjudication feedback & awards', 'Head adjudicator'],
      ]),
      category: 'culture',
      eventType: 'official',
      campus: 'Boshlik',
      roomId: 'rm_boshlik_204',
      date: isoOffset(6),
      startTime: '15:30',
      endTime: '17:30',
      hostClubId: 'club_debate',
      hostName: 'Coventry Debate & Diplomacy Club',
      registrationMode: 'internal_screening',
      screeningPrompt: 'Which role do you want — Speaker, Adjudicator or Spectator? Add one line on your experience.',
      capacity: 40,
      registeredCount: 29,
      coverStyle: 'terracotta',
      pattern: 'waves',
      equipmentRequested: ['Projector', 'Glass Whiteboard'],
      attendees: debateRoster,
      questions: questions([
        {
          author: 'Shahzoda Nazarova',
          programme: 'Management',
          text: 'Is prior BP experience required to adjudicate, or will there be a rubric briefing first?',
          upvotes: 12,
          answerText: 'No experience needed — the head adjudicator runs a 15-minute rubric briefing before round one.',
        },
        {
          author: 'Abdulloh Qodirov',
          programme: 'Finance',
          text: 'Will the motion pack include both the digital som and a cross-border payments motion?',
          upvotes: 7,
        },
      ]),
    }),
    ev({
      id: 'evt_9',
      title: 'Coventry–UDEA Careers & Internship Fair',
      subtitle: 'Eighteen employers, on-the-spot CV reviews and internship interviews in the assembly hall.',
      description:
        'The biggest careers event of the semester. Eighteen employers — including Agrobank, ACCA-approved audit firms, Tashkent fintech startups and Coventry alumni networks — set up in the Grand Assembly Hall. Bring printed CVs for on-the-spot reviews, book interview slots at the registration desk, and attend the 20-minute internship clinic. This edition is fully booked with a live waitlist; releasing your seat promotes the next student automatically.',
      outcomes: [
        'Meet 18 hiring partners in one afternoon',
        'On-the-spot CV review',
        'Book an interview slot for open internships',
        'Verified attendance for your diploma supplement',
      ],
      agenda: agenda([
        ['11:00', 'Doors open & employer booths', 'UDEA Careers Office'],
        ['11:30', 'Internship clinic: how UDEA students get hired', 'Agrobank HR'],
        ['13:00', 'Speed interviews — booked slots', 'Employer panel'],
        ['15:00', 'Coventry alumni panel', 'Alumni network'],
        ['15:45', 'Closing & follow-up instructions', 'Careers Office'],
      ]),
      category: 'academic',
      eventType: 'official',
      campus: 'Boshlik',
      roomId: 'rm_boshlik_hall',
      date: isoOffset(7),
      startTime: '11:00',
      endTime: '16:00',
      hostClubId: null,
      hostName: 'UDEA Careers & Employability Office',
      capacity: 80,
      registeredCount: 80,
      waitlistCount: 2,
      issueCertificate: true,
      coverStyle: 'blueprint',
      pattern: 'grid',
      equipmentRequested: ['LED Wall', 'Stage Audio', 'Power Strips'],
      attendees: careersRoster,
      waitlistRoster: waitlist(31, 2),
      questions: questions([
        {
          author: 'Gulnora Sattorova',
          programme: 'Finance',
          text: 'Are the speed-interview slots first come first served, or can we pre-book online?',
          upvotes: 15,
          answerText: 'Pre-book at the registration desk from 11:00 — 8-minute slots, 40 available.',
        },
      ]),
    }),
    ev({
      id: 'evt_10',
      title: 'Cybersport Ladder: EA FC 26 & Dota 2 Practice',
      subtitle: 'Open ladder night. Bring your controller or use the campus setup, climb the board before the regional qualifier.',
      description:
        'A peer-run practice ladder for the campus cybersport roster. EA FC 26 runs on two consoles with rotating challengers, Dota 2 stacks queue on the LAN setup, and the ladder board is updated live on the scoreboard. This is a casual night with bragging rights — but the top two ladder players get seeded into the regional qualifier squad.',
      outcomes: ['Play competitive practice matches', 'Climb the campus ladder board', 'Try out for the regional qualifier squad'],
      agenda: agenda([
        ['19:00', 'Ladder sign-up & warm-up matches', 'Cybersport crew'],
        ['19:30', 'EA FC challenger rotation', 'Ladder marshal'],
        ['20:30', 'Dota 2 stack queues', 'Ladder marshal'],
        ['21:45', 'Ladder results & qualifier seeding', 'Sports Union'],
      ]),
      category: 'sports',
      eventType: 'peer_meetup',
      campus: 'Boshlik',
      roomId: 'rm_boshlik_sports',
      date: isoOffset(8),
      startTime: '19:00',
      endTime: '22:00',
      language: 'RU',
      hostClubId: null,
      hostName: 'Sardorbek Aliev',
      createdBy: 'usr_2',
      capacity: 24,
      registeredCount: 9,
      coverStyle: 'obsidian',
      pattern: 'dots',
      equipmentRequested: ['Scoreboard'],
      teamFinder: true,
      attendees: cybersportRoster,
      questions: [],
    }),
    ev({
      id: 'evt_11',
      title: 'Movie Night: The Big Short + Finance Discussion',
      subtitle: 'Popcorn, a whiteboard and a 25-minute debate on what the film gets right about credit risk.',
      description:
        'The FinTech Society screens The Big Short in Seminar Room 204, then opens a 25-minute discussion on synthetic CDOs, ratings agencies and what the 2008 mechanics look like in today’s emerging-market lending. Low-key, peer-led, and open to every programme.',
      outcomes: ['Understand the 2008 credit mechanics', 'Discuss modern parallels in emerging markets', 'Meet the FinTech Society crew'],
      agenda: agenda([
        ['19:00', 'Doors, popcorn & seating', 'FinTech Society'],
        ['19:15', 'Screening — The Big Short', 'Film'],
        ['21:00', 'Whiteboard discussion & Q&A', 'Peer hosts'],
      ]),
      category: 'culture',
      eventType: 'peer_meetup',
      campus: 'Boshlik',
      roomId: 'rm_boshlik_204',
      date: isoOffset(10),
      startTime: '19:00',
      endTime: '21:30',
      language: 'EN',
      hostClubId: 'club_fintech',
      hostName: 'UDEA FinTech & Quant Society',
      capacity: 30,
      registeredCount: 18,
      coverStyle: 'sunset',
      pattern: 'clean',
      equipmentRequested: ['Whiteboards'],
      attendees: movieRoster,
      questions: [],
    }),
    ev({
      id: 'evt_past',
      title: 'Agrobank Scholarship Induction & FinTech Forum',
      subtitle: 'Scholarship cohort induction with Agrobank and the Coventry validation panel.',
      description:
        'The opening forum of the Agrobank scholarship cycle: cohort induction, the grant application walkthrough, and a panel on fintech careers in Uzbekistan. Attendance counted toward the co-curricular diploma supplement and is certificate-eligible.',
      outcomes: ['Scholarship obligations and grant cycle explained', 'Panel with Agrobank leadership', 'Certificate-eligible attendance'],
      agenda: agenda([
        ['14:00', 'Cohort induction & welcome', 'Student Affairs'],
        ['14:40', 'Grant application walkthrough', 'Agrobank programme office'],
        ['15:30', 'FinTech careers panel', 'Agrobank + Coventry'],
        ['16:30', 'Certificates & networking', 'UDEA'],
      ]),
      category: 'fintech',
      eventType: 'official',
      campus: 'Boshlik',
      roomId: 'rm_boshlik_hall',
      date: isoOffset(-4),
      startTime: '14:00',
      endTime: '17:00',
      hostClubId: 'club_agrobank',
      hostName: 'Agrobank Innovation Hub',
      capacity: 30,
      registeredCount: 24,
      issueCertificate: true,
      coverStyle: 'emerald',
      pattern: 'grid',
      equipmentRequested: ['LED Wall', 'Stage Audio'],
      attendees: pastRoster,
      checkIns: pastCheckIns,
      past: true,
      questions: [],
    }),
    ev({
      id: 'evt_pending',
      title: 'UDEA AgriTech Robotics Expo 2026',
      subtitle: 'Student robotics showcase requesting the Grand Assembly Hall and stage audio.',
      description:
        'A student-organised robotics expo: line-following bots, a greenhouse rover prototype and a drone cage demo. Requesting the Grand Assembly Hall for the exhibition floor plus stage audio for the demo commentary. Awaiting campus operations approval.',
      outcomes: ['Showcase student robotics builds', 'Demo the greenhouse rover', 'Recruit first-year lab members'],
      agenda: agenda([
        ['13:00', 'Exhibition floor opens', 'AgriTech Lab'],
        ['14:00', 'Rover live demo', 'Robotics team'],
        ['15:30', 'Drone cage showcase', 'AgriTech Lab'],
        ['16:30', 'Recruitment & closing', 'Student organisers'],
      ]),
      category: 'tech',
      eventType: 'official',
      approvalStatus: 'pending_room_approval',
      campus: 'Boshlik',
      roomId: 'rm_boshlik_hall',
      date: isoOffset(11),
      startTime: '13:00',
      endTime: '17:00',
      hostClubId: null,
      hostName: 'Soliyev Firdavs',
      createdBy: 'usr_1',
      capacity: 120,
      registeredCount: 0,
      coverStyle: 'violet',
      pattern: 'waves',
      equipmentRequested: ['LED Wall', 'Stage Audio', 'Power Strips'],
      attendees: [],
      questions: [],
    }),
  ];

  return events;
}

export function buildSeedTickets() {
  const now = new Date().toISOString();
  return [
    {
      ticketId: 'tkt_seed_acca',
      eventId: 'evt_4',
      userId: 'usr_1',
      status: 'confirmed' as const,
      seatNumber: 14,
      qrHash: 'UDEA-PASS-9941-X7',
      confirmedAttendance4h: false,
      lookingForTeam: false,
      teamSkillTag: '',
      issuedAt: now,
    },
    {
      ticketId: 'tkt_seed_careers',
      eventId: 'evt_9',
      userId: 'usr_1',
      status: 'confirmed' as const,
      seatNumber: 31,
      qrHash: randomHash(),
      confirmedAttendance4h: true,
      lookingForTeam: false,
      teamSkillTag: '',
      issuedAt: now,
    },
    {
      ticketId: 'tkt_seed_past',
      eventId: 'evt_past',
      userId: 'usr_1',
      status: 'checked_in' as const,
      seatNumber: 22,
      qrHash: randomHash(),
      confirmedAttendance4h: true,
      checkedInAt: new Date(Date.now() - 4 * 86400000 + 3600000).toISOString(),
      lookingForTeam: false,
      teamSkillTag: '',
      issuedAt: now,
    },
    {
      ticketId: 'tkt_seed_python',
      eventId: 'evt_5',
      userId: 'usr_1',
      status: 'confirmed' as const,
      seatNumber: 4,
      qrHash: randomHash(),
      confirmedAttendance4h: true,
      lookingForTeam: true,
      teamSkillTag: 'Python / Data Analysis',
      issuedAt: now,
    },
  ];
}

export const CATEGORY_COVERS: { id: string; label: string; css: string }[] = [
  {
    id: 'emerald',
    label: 'Emerald Matrix',
    css: 'radial-gradient(at 15% 15%, #059669 0%, #064E3B 55%, #022C22 100%)',
  },
  {
    id: 'violet',
    label: 'Violet Cyber Mesh',
    css: 'radial-gradient(at 80% 20%, #7C3AED 0%, #3B0764 55%, #1E1B4B 100%)',
  },
  {
    id: 'blueprint',
    label: 'Coventry Royal Blueprint',
    css: 'radial-gradient(at 20% 80%, #2563EB 0%, #1E3A8A 55%, #0F172A 100%)',
  },
  {
    id: 'lime',
    label: 'Acid Lime Arena',
    css: 'radial-gradient(at 75% 25%, #65A30D 0%, #365314 55%, #14532D 100%)',
  },
  {
    id: 'sunset',
    label: 'Sunset Terracotta',
    css: 'radial-gradient(at 25% 25%, #EA580C 0%, #7C2D12 55%, #431407 100%)',
  },
  {
    id: 'obsidian',
    label: 'Obsidian Minimal',
    css: 'radial-gradient(at 60% 10%, #2B2F3A 0%, #12141A 60%, #090A0D 100%)',
  },
  {
    id: 'royal',
    label: 'Royal Cobalt',
    css: 'radial-gradient(at 20% 80%, #2563EB 0%, #1E3A8A 55%, #0F172A 100%)',
  },
  {
    id: 'terracotta',
    label: 'Debate Terracotta',
    css: 'radial-gradient(at 25% 25%, #EA580C 0%, #7C2D12 55%, #431407 100%)',
  },
];

export const CATEGORY_IDS: Category[] = ['fintech', 'tech', 'academic', 'sports', 'culture'];
export const SEED_DATE_STAMP = isoDate();
