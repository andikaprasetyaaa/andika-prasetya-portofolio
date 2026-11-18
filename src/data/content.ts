// All portfolio copy lives here so the presentation layer can change without touching the content.

export const SECTION_IDS = ['hero', 'about', 'projects', 'stack', 'timeline', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export interface SectionMeta {
  id: SectionId;
  index: string;
  /** Short nav label */
  label: string;
  /** Section caption, as used in the section header */
  caption: string;
  /** One-line teaser used by the pause menu and the area banner */
  teaser: string;
}

export const SECTIONS: SectionMeta[] = [
  {
    id: 'hero',
    index: '01',
    label: 'HERO',
    caption: 'ARTIFICIAL INTELLIGENCE & SYSTEMS AUTOMATION',
    teaser: 'AI Engineer & Automation Specialist',
  },
  {
    id: 'about',
    index: '02',
    label: 'ABOUT',
    caption: 'PERSONA & QUANTITATIVE RECORD',
    teaser: 'Operator dossier, education and key metrics',
  },
  {
    id: 'projects',
    index: '03',
    label: 'PROJECTS',
    caption: 'SELECTED WORKS & SYSTEM DEPLOYMENTS',
    teaser: 'Production protocols — featured AI projects',
  },
  {
    id: 'stack',
    index: '04',
    label: 'STACK',
    caption: 'TECHNICAL MATRIX & TOOLCHAIN',
    teaser: 'Capabilities & computational rigor',
  },
  {
    id: 'timeline',
    index: '05',
    label: 'TIMELINE',
    caption: 'CHRONOLOGY & ENGINEERING PRACTICE',
    teaser: 'Experience & technical record',
  },
  {
    id: 'contact',
    index: '06',
    label: 'CONTACT',
    caption: 'TERMINAL HANDSHAKE & TRANSMISSION',
    teaser: "Let's build something intelligent",
  },
];

export const PROFILE = {
  name: 'I PUTU ANDIKA PRASETYA',
  nameLines: ['I PUTU ANDIKA', 'PRASETYA'],
  title: 'AI ENGINEER & AUTOMATION SPECIALIST',
  brand: 'PORTFOLIO',
  monogram: 'P',
  availability: 'AVAILABLE FOR HIRE',
  email: 'andikaprasetyaa@gmail.com',
  cvUrl: 'https://drive.google.com/file/d/1ds1m5DI1xfXoVL6_EQa2WoXo65RanzeZ/view?usp=sharing',
  githubUrl: 'https://github.com/andikaprasetyaaa',
  linkedinUrl: 'https://linkedin.com/in/andikaprasetya',
  repoUrl: 'https://github.com/andikaprasetyaaa/andika-prasetya-portofolio',
  domain: 'andikaprasetya.dev',
  location: 'BALI, INDONESIA // REMOTE',
  coords: 'LAT 8.3405° S, 115.0920° E / BALI - ID',
};

export const HERO = {
  roles: ['AI ENGINEER', 'MACHINE LEARNING', 'DATA ENGINEERING', 'NLP & LLMS', 'AGENTIC WORKFLOWS'],
  lead: 'Engineering deterministic intelligence, autonomous agentic workflows, and high-throughput natural language systems with mathematical rigor.',
  primaryCta: 'EXPLORE ARTIFACTS',
  secondaryCta: 'SYSTEM VITALS [3.91 GPA]',
  metrics: [
    { value: '12+', label: 'AUTONOMOUS PIPELINES' },
    { value: '99.8%', label: 'RAG FIDELITY' },
    { value: '< 150MS', label: 'EDGE INFERENCE' },
  ],
  telemetry: {
    loc: 'LOC // 8.3405° S, 115.0920° E',
    node: 'NODE // ID_DPS_CORE',
    security: 'SECURITY_LAYER: ED25519',
    verified: 'SHA-256 VERIFIED',
  },
  scrollCue: 'SCROLL TO COMMENCE INQUIRY',
};

export const ABOUT = {
  status: ['SYS_STATUS: NOMINAL', 'INDEX REF: ARCH-PERS-2026', 'SECURITY TIER: ALPHA'],
  dossier: {
    heading: 'OPERATOR // DOSSIER',
    verified: 'VERIFIED IDENT',
    fields: [
      { label: 'DEGREE', value: 'S.Kom (Data Science)' },
      { label: 'GPA RECORD', value: '3.91 / 4.00 (Summa)' },
      { label: 'SYSTEM CORE', value: 'NLP & GraphRAG' },
      { label: 'AVAILABILITY', value: 'OPEN FOR HIRE' },
    ],
  },
  quote:
    'I build intelligent systems from raw data to something that actually works. Models, retrieval, APIs, automation, databases.',
  focusLabel: 'Current Focus:',
  focus: 'Making machines understand text, retrieve the right context, and do useful things with it.',
  footnotes: ['DOMAIN: andikaprasetya.dev', 'INFERENCE: FP8_OPTIMIZED'],
  kicker: 'DISCIPLINE // CORE ARCHITECTURE',
  headline: 'ENGINEERING AT THE INTERSECTION OF DEEP LEARNING & DETERMINISTIC SCALE.',
  body: 'Bridging foundational algorithmic rigor with production systems engineering. My trajectory anchors on resolving computational friction within multilingual NLP frameworks and transforming probabilistic LLM uncertainty into deterministic execution graphs.',
  education: {
    label: 'EDUCATION // BACKGROUND',
    school: 'Universitas Udayana — B.Sc. Information Technology (Data Science)',
    detail: 'GPA 3.91 (Highest Distinction), Graduated 2026',
  },
  metrics: [
    { id: 'METRIC_01', value: '3.91', unit: '/ 4.00 GPA', subtitle: 'Highest Distinction' },
    { id: 'METRIC_02', value: '18+', unit: 'AI Systems', subtitle: 'Shipped To Production' },
    { id: 'METRIC_03', value: '08', unit: 'Core Protocols', subtitle: 'Featured AI Projects' },
    { id: 'METRIC_04', value: '99.4%', unit: 'Pipeline SLA', subtitle: 'Automated Uptime' },
  ],
  domainsLabel: 'PRIMARY INVESTIGATION DOMAINS',
  domainsCount: '[ N=05 AXES ]',
  domains: [
    'LLM RAG & Knowledge Graphs',
    'Low-Resource Multilingual NLP',
    'High-Throughput ETL & Event Streams',
    'Computer Vision Kinematics',
    'Autonomous Multi-Agent Swarms',
  ],
  footer: ['QUANTITATIVE PROFILE', 'STATUS: CERTIFIED'],
};

export const PROJECTS_COPY = {
  heading: 'PRODUCTION PROTOCOLS',
  sub: 'MISSION-CRITICAL NEURAL AGENTS & EDGE DISTRIBUTIONS',
  inspect: 'INSPECT PROTOCOL',
  openRepo: 'OPEN REPOSITORY',
  totalLabel: 'TOTAL VERIFIED DEPLOYMENTS',
  online: 'ONLINE',
  modal: {
    overview: '// ARCHITECTURAL OVERVIEW',
    features: '// PROTOCOL CAPABILITIES & SUBROUTINES',
    verificationLabel: 'VERIFICATION',
    verificationValue: 'SHA-256 AUDITED',
    renderNote: 'PROCEDURAL R3F RENDER',
    engine: 'RENDER ENGINE: WEBGL / THREE.JS',
    interactive: 'INTERACTIVE TELEMETRY',
    status: 'STATUS: PRODUCTION REPOSITORY',
  },
};

export const SHAPE_LABELS: Record<string, string> = {
  boxing: '3D BOXING RING // 4-ROPE PRO',
  'ufc-octagon': '3D UFC OCTAGON CAGE',
  newspaper: '3D NEWS DOCUMENT SCAN',
  'fashion-hanger': '3D GARMENT & HANGER',
  'discount-tag': '3D DISCOUNT PRICE TAG',
  'shopping-cart': '3D SHOPPING CART & PULSE',
  'chat-shield': '3D CHAT BUBBLE & SHIELD',
  'vision-apple': '3D VISION AI RETICLE',
};

export type StackIcon = 'cpu' | 'layers' | 'database' | 'terminal';

export const STACK = {
  status: ['CLOCK: 3.4 GHz TENSOR-PIPE', 'STATE: REAL-TIME ARBITRAGE'],
  heading: 'CAPABILITIES & COMPUTATIONAL RIGOR',
  lead: 'Hardened architectural models, deterministic orchestration, and high-throughput vector compute pipelines.',
  orbitLabel: '// 3D ORBITAL TENSOR RUNTIME',
  categories: [
    {
      id: 'CAT_01',
      title: 'AI & MACHINE LEARNING',
      icon: 'cpu' as StackIcon,
      skills: [
        { name: 'Python', role: 'Core Lang' },
        { name: 'PyTorch', role: 'Deep Learning' },
        { name: 'TensorFlow', role: 'Neural Nets' },
        { name: 'Hugging Face', role: 'Transformers' },
        { name: 'Jupyter', role: 'Notebooks' },
      ],
    },
    {
      id: 'CAT_02',
      title: 'NLP & LLM ARCHITECTURE',
      icon: 'layers' as StackIcon,
      skills: [
        { name: 'RAG Systems', role: 'Retrieval' },
        { name: 'FAISS / ANN', role: 'Vector Search' },
        { name: 'BM25', role: 'Hybrid Rank' },
        { name: 'Gemini API', role: 'Multimodal' },
        { name: 'Cohere', role: 'Embeddings' },
      ],
    },
    {
      id: 'CAT_03',
      title: 'DATA ENGINEERING & OLAP',
      icon: 'database' as StackIcon,
      skills: [
        { name: 'PostgreSQL', role: 'Relational' },
        { name: 'Pandas / NumPy', role: 'Vectorized' },
        { name: 'MySQL', role: 'Transactions' },
        { name: 'MongoDB', role: 'Document' },
        { name: 'Neo4j', role: 'Graph DB' },
      ],
    },
    {
      id: 'CAT_04',
      title: 'BACKEND & INFRASTRUCTURE',
      icon: 'terminal' as StackIcon,
      skills: [
        { name: 'FastAPI', role: 'REST / Async' },
        { name: 'Docker', role: 'Containers' },
        { name: 'n8n', role: 'Automation' },
        { name: 'Streamlit', role: 'UI Dashboards' },
        { name: 'Git & CI/CD', role: 'VCS Workflow' },
      ],
    },
  ],
  /** The eight headline tools that orbit the core */
  orbit: [
    { label: 'PyTorch', category: 'ML' },
    { label: 'GraphRAG', category: 'NLP' },
    { label: 'PostgreSQL', category: 'DATA' },
    { label: 'FastAPI', category: 'API' },
    { label: 'IndoBERT', category: 'LLM' },
    { label: 'Docker', category: 'INFRA' },
    { label: 'Neo4j', category: 'GRAPH' },
    { label: 'FAISS', category: 'VEC' },
  ],
  footer: ['SYSTEM ARCHITECTURE & CAPABILITIES', 'COMPUTATIONAL DISCIPLINE: 100% PRODUCTION COMPLIANT'],
};

export const TIMELINE = {
  dept: 'DEPT: AI AUTOMATION & DATA SYSTEMS',
  heading: 'EXPERIENCE & TECHNICAL RECORD',
  chips: ['STATUS: PRODUCTION SPECIALIST', 'GPA: 3.91 HIGHEST DISTINCTION'],
  rolesLabel: 'PROFESSIONAL INDUSTRY ROLES',
  rolesCount: '[ 3 PRODUCTION MILESTONES ]',
  experiences: [
    {
      period: '7 SEP 2026 — PRESENT',
      status: 'PRODUCTION ACTIVE',
      role: 'AI Automation Specialist',
      company: 'PT In Fashion',
      description:
        'Architected fashion logistics and inventory neural pipelines with computer vision semantic segmentation, multi-camera OCR barcode tracking, and distributed telemetry syncing.',
      tags: ['CV SEGMENTATION', 'OCR PIPELINE', 'NEURAL AUTOMATION', 'DOCKER'],
      current: true,
    },
    {
      period: 'APR 2026 — JUN 2026',
      status: 'ANALYTICS & BI',
      role: 'Data Analyst',
      company: 'PT Indo Apps Solusindo',
      description:
        'Spearheaded enterprise data modeling, automated ETL pipelines, predictive customer retention scoring, and high-frequency analytical dashboards across multi-client software ecosystems.',
      tags: ['ETL PIPELINES', 'PREDICTIVE MODELING', 'BUSINESS TELEMETRY', 'SQL'],
      current: false,
    },
    {
      period: '2024',
      status: 'GOOGLE & GOTO CONSORTIUM',
      role: 'Android Developer',
      company: 'Bangkit Academy 2024',
      description:
        'Graduated with distinction; built native Android applications integrating on-device TensorFlow Lite neural models, clean architecture with Jetpack Compose, and background task management.',
      tags: ['KOTLIN / COMPOSE', 'TENSORFLOW LITE', 'CLEAN ARCHITECTURE'],
      current: false,
    },
  ],
  education: {
    badge: 'CLASS OF 2026 // ACCREDITED DEGREE',
    gpa: 'GPA: 3.91 / 4.00 (SUMMA CUM LAUDE EQUIVALENT)',
    school: 'Universitas Udayana',
    degree: 'B.Sc. Information Technology',
    specialization: 'Specialization in Data Science',
    description:
      'Rigorous academic curriculum in Artificial Intelligence, Linear Algebra, Distributed Systems, Deep Learning Optimization, and Natural Language Processing. Undergraduate thesis solving factual hallucination in low-resource Indonesian summarization via IndoBERT NLI and IndoT5.',
    chips: ['MAJOR: DATA SCIENCE', 'THESIS: NLP & NLI SUMMARIZATION', 'GPA 3.91 / 4.00'],
    audit: 'INSTITUTION ID: #UNUD-TI-2026 // VERIFIED AUDIT',
  },
  footer: ['VERIFIED PROFESSIONAL & ACADEMIC RECORD', 'STATUS: ACTIVE PRODUCTION SPECIALIST'],
};

export type ChannelIcon = 'github' | 'linkedin' | 'globe' | 'file';

export const CONTACT = {
  status: ['PROTOCOL: SECURE_WSS_V4', 'LATENCY: 12ms', 'NODE_STATUS: LISTENING'],
  destinationLabel: 'TRANSMISSION DESTINATION',
  destination: 'FOUNDER / ENG LEADERSHIP',
  headline: "LET'S BUILD SOMETHING INTELLIGENT.",
  lead: 'Direct connection with I Putu Andika Prasetya — AI Engineer & Automation Specialist.',
  inbox: {
    label: 'PRIMARY COMM CHANNEL // DIRECT INBOX',
    hint: 'CLICK TO COPY ENCRYPTED ADDRESS OR SEND DIRECT TRANSMISSION',
    copy: 'COPY ADDRESS',
    copied: 'COPIED!',
    toast: 'COPIED TO SYSTEM CLIPBOARD',
  },
  channels: [
    {
      id: '01',
      kicker: 'CODEBASE',
      title: 'GITHUB',
      handle: 'github.com/andikaprasetyaaa',
      href: 'https://github.com/andikaprasetyaaa',
      icon: 'github' as ChannelIcon,
      stats: [
        { label: 'PUBLIC REPOS', value: '42+' },
        { label: 'COMMITS & OPS', value: '1,480+' },
        { label: 'STATUS', value: 'ACTIVE' },
      ],
    },
    {
      id: '02',
      kicker: 'NETWORK',
      title: 'LINKEDIN',
      handle: 'linkedin.com/in/andikaprasetya',
      href: 'https://linkedin.com/in/andikaprasetya',
      icon: 'linkedin' as ChannelIcon,
      stats: [
        { label: 'NETWORK METRICS', value: '500+' },
        { label: 'FOCUS', value: 'AI & AUTOMATION' },
        { label: 'VERIFICATION', value: 'VERIFIED' },
      ],
    },
    {
      id: '03',
      kicker: 'DOMAIN',
      title: 'PORTFOLIO DOMAIN',
      handle: 'andikaprasetya.dev',
      href: 'https://github.com/andikaprasetyaaa/andika-prasetya-portofolio',
      icon: 'globe' as ChannelIcon,
      stats: [
        { label: 'SSL TLS PROTOCOL', value: 'ENCRYPTED' },
        { label: 'STATUS', value: 'LIVE ONLINE' },
        { label: 'HOSTING', value: 'EDGE GLOBAL' },
      ],
    },
    {
      id: '04',
      kicker: 'DOSSIER',
      title: 'CURRICULUM VITAE',
      handle: 'CV Dossier [Google Drive]',
      href: 'https://drive.google.com/file/d/1ds1m5DI1xfXoVL6_EQa2WoXo65RanzeZ/view?usp=sharing',
      icon: 'file' as ChannelIcon,
      stats: [
        { label: 'DOCUMENT FORMAT', value: 'VERIFIED PDF' },
        { label: 'DEGREE', value: 'B.Sc. (GPA 3.91)' },
        { label: 'VALIDATION', value: 'AUTHENTICATED' },
      ],
    },
  ],
  location: {
    label: 'LOCATION TELEMETRY',
    value: 'LOCATION: BALI / UTC+8 (REMOTE WORLDWIDE)',
    note: 'GEO_LAT: -8.3405 / GEO_LONG: 115.0920 // TIMEZONE SYNCHRONIZATION WITH SF, NYC, LONDON & SINGAPORE',
  },
  readiness: {
    label: 'DEPLOYMENT READINESS',
    value: 'AVAILABILITY: ACCEPTING HIGH-IMPACT AI & AUTOMATION ROLES',
    note: 'FULL-CYCLE ARCHITECTURE / AI AUTOMATION / RAG & LLM SYSTEMS',
  },
  heartbeat: { label: 'SYSTEM HEARTBEAT', value: '100% OPERATIONAL' },
  footer: {
    system: 'DESIGN SYSTEM: VICE DUSK NEON',
    systemNote: 'OPEN-WORLD HUD // TROPICAL SUNSET CORE',
    rights: 'I PUTU ANDIKA PRASETYA. ALL RIGHTS RESERVED.',
  },
};
