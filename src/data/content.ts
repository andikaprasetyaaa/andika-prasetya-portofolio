// All portfolio copy lives here so layout and presentation remain clean and editorial.

export const SECTION_IDS = ['hero', 'about', 'projects', 'stack', 'timeline', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export interface SectionMeta {
  id: SectionId;
  index: string;
  /** Short nav label */
  label: string;
  /** GTA VI chapter eyebrow */
  caption: string;
  /** One-line teaser for pause menu */
  teaser: string;
}

export const SECTIONS: SectionMeta[] = [
  {
    id: 'hero',
    index: '01',
    label: 'INTRO',
    caption: 'GIANYAR · BALI, INDONESIA',
    teaser: 'AI Engineer & Automation Specialist',
  },
  {
    id: 'about',
    index: '02',
    label: 'PROFILE',
    caption: 'THE ARCHITECT',
    teaser: 'Background, Udayana degree & key numbers',
  },
  {
    id: 'projects',
    index: '03',
    label: 'WORK',
    caption: 'SELECTED WORK',
    teaser: 'Interactive 3D showcase of eight AI builds',
  },
  {
    id: 'stack',
    index: '04',
    label: 'STACK',
    caption: 'THE ARSENAL',
    teaser: 'Models, retrieval engines & infrastructure',
  },
  {
    id: 'timeline',
    index: '05',
    label: 'CAREER',
    caption: 'THE RECORD',
    teaser: 'Industry experience & Universitas Udayana',
  },
  {
    id: 'contact',
    index: '06',
    label: 'CONTACT',
    caption: 'MAKE CONTACT',
    teaser: 'Direct inbox, socials & resume',
  },
];

export const PROFILE = {
  name: 'I PUTU ANDIKA PRASETYA',
  nameLines: ['ANDIKA', 'PRASETYA'],
  title: 'AI ENGINEER & AUTOMATION SPECIALIST',
  brand: 'ANDIKA',
  monogram: 'AP',
  availability: 'AVAILABLE FOR HIRE',
  email: 'andikaprasetyaa@gmail.com',
  cvUrl: 'https://drive.google.com/file/d/1ds1m5DI1xfXoVL6_EQa2WoXo65RanzeZ/view?usp=sharing',
  githubUrl: 'https://github.com/andikaprasetyaaa',
  linkedinUrl: 'https://linkedin.com/in/andikaprasetya',
  repoUrl: 'https://github.com/andikaprasetyaaa/andika-prasetya-portofolio',
  domain: 'andikaprasetya.dev',
  location: 'Gianyar, Bali, Indonesia · UTC+8 · Remote Worldwide',
  coords: '8.54° S · 115.32° E · GIANYAR, BALI',
};

export const HERO = {
  eyebrow: 'I PUTU ANDIKA PRASETYA',
  roles: ['AI ENGINEER', 'MACHINE LEARNING', 'DATA ENGINEERING', 'NLP & LLMS', 'AGENTIC WORKFLOWS'],
  lead: 'Engineering intelligent systems, retrieval pipelines, and autonomous workflows built to hold up in production.',
  primaryCta: 'EXPLORE WORK',
  secondaryCta: 'THE ARCHITECT',
  scrollCue: 'SCROLL TO EXPLORE',
};

export const ABOUT = {
  headline: 'BUILT FROM RAW DATA TO PRODUCTION.',
  quote: 'I build intelligent systems from raw data to something that actually works.',
  body: 'Based in Gianyar, Bali and graduating with a 3.91 GPA in Data Science from Universitas Udayana, I turn unstructured text, graphs, and live video streams into fast, reliable software.',
  focusLabel: 'Current Obsession',
  focus: 'Low-resource Indonesian NLP, GraphRAG knowledge engines, and autonomous automation.',
  dossierFields: [
    { label: 'DEGREE', value: 'B.Sc. IT (Data Science)' },
    { label: 'UNIVERSITY', value: 'Universitas Udayana · 2026' },
    { label: 'STANDING', value: '3.91 / 4.00 GPA' },
    { label: 'LOCATION', value: 'Gianyar, Bali · ID' },
  ],
  metrics: [
    { value: '3.91', unit: '/ 4.00 GPA', subtitle: 'Highest Distinction' },
    { value: '18+', unit: 'AI Systems', subtitle: 'Shipped to Production' },
    { value: '08', unit: 'Featured Builds', subtitle: 'Open Source & Live' },
  ],
  domains: [
    'LLM RAG & Knowledge Graphs',
    'Multilingual Indonesian NLP',
    'High-Throughput ETL',
    'Computer Vision',
    'Autonomous Workflows',
  ],
};

export const PROJECTS_COPY = {
  heading: 'FEATURED WORK',
  sub: 'Eight production builds. Drag the hologram to inspect, or open the full briefing.',
  inspect: 'OPEN BRIEFING',
  openRepo: 'GITHUB',
  dragHint: 'DRAG TO ROTATE',
  modal: {
    overview: 'THE BRIEF',
    features: 'KEY CAPABILITIES',
    engine: 'INTERACTIVE 3D HOLOGRAM',
    openRepo: 'VIEW ON GITHUB',
  },
};

export const SHAPE_LABELS: Record<string, string> = {
  boxing: '3D BOXING RING',
  'ufc-octagon': '3D OCTAGON ARENA',
  newspaper: '3D NEWS MATRIX',
  'fashion-hanger': '3D APPAREL TELEMETRY',
  'discount-tag': '3D PRICING AUDIT',
  'shopping-cart': '3D COMMERCE STREAM',
  'chat-shield': '3D MODERATION SHIELD',
  'vision-apple': '3D EDGE VISION TARGET',
};

export type StackIcon = 'cpu' | 'layers' | 'database' | 'terminal';

export const STACK = {
  heading: 'THE ARSENAL',
  lead: 'Core models, retrieval engines, and infrastructure behind every shipped system.',
  orbitHint: 'SELECT A QUADRANT TO INSPECT',
  categories: [
    {
      id: '01',
      title: 'AI & MACHINE LEARNING',
      icon: 'cpu' as StackIcon,
      summary: 'Deep learning architectures, edge quantization, and multimodal inference.',
      skills: ['Python', 'PyTorch', 'TensorFlow', 'Hugging Face', 'Jupyter'],
    },
    {
      id: '02',
      title: 'NLP & LLM ARCHITECTURE',
      icon: 'layers' as StackIcon,
      summary: 'Hybrid retrieval, entity disambiguation, and grounded text synthesis.',
      skills: ['RAG Systems', 'FAISS / ANN', 'BM25', 'Gemini API', 'Cohere'],
    },
    {
      id: '03',
      title: 'DATA & GRAPH SYSTEMS',
      icon: 'database' as StackIcon,
      summary: 'Relational warehousing, connected knowledge graphs, and fast analytics.',
      skills: ['PostgreSQL', 'Pandas / NumPy', 'MySQL', 'MongoDB', 'Neo4j'],
    },
    {
      id: '04',
      title: 'BACKEND & AUTOMATION',
      icon: 'terminal' as StackIcon,
      summary: 'Containerized async services, scheduled pipelines, and live ops UIs.',
      skills: ['FastAPI', 'Docker', 'n8n', 'Streamlit', 'Git & CI/CD'],
    },
  ],
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
};

export const TIMELINE = {
  heading: 'THE RECORD',
  lead: 'Production engineering across computer vision, enterprise analytics, and mobile AI.',
  experiences: [
    {
      period: 'SEP 2026 — PRESENT',
      status: 'CURRENT ROLE',
      role: 'AI Automation Specialist',
      company: 'PT In Fashion',
      description:
        'Architecting computer vision segmentation and multi-camera OCR barcode tracking pipelines for apparel manufacturing logistics.',
      tags: ['CV Segmentation', 'OCR Pipeline', 'Docker'],
      current: true,
    },
    {
      period: 'APR — JUN 2026',
      status: 'ANALYTICS',
      role: 'Data Analyst',
      company: 'PT Indo Apps Solusindo',
      description:
        'Built automated ETL workflows, retention scoring models, and executive analytics dashboards across multi-client software platforms.',
      tags: ['ETL Pipelines', 'Predictive Modeling', 'SQL'],
      current: false,
    },
    {
      period: '2024',
      status: 'GOOGLE & GOTO',
      role: 'Android Developer',
      company: 'Bangkit Academy 2024',
      description:
        'Graduated with distinction building native Kotlin apps with on-device TensorFlow Lite neural inference and clean architecture.',
      tags: ['Kotlin', 'TensorFlow Lite', 'Compose'],
      current: false,
    },
  ],
  education: {
    badge: 'CLASS OF 2026',
    gpa: '3.91 / 4.00 GPA',
    school: 'Universitas Udayana',
    degree: 'B.Sc. Information Technology · Data Science',
    description:
      'Focused on Deep Learning, Distributed Systems, and NLP. Undergraduate thesis tackles factual hallucination in Indonesian news summarization using IndoBERT NLI and IndoT5.',
    tags: ['Data Science', 'NLP Thesis', 'Summa Cum Laude Track'],
  },
};

export type ChannelIcon = 'github' | 'linkedin' | 'globe' | 'file';

export const CONTACT = {
  eyebrow: 'DIRECT LINE',
  lead: 'Based in Gianyar, Bali (UTC+8). Open for AI Engineering, Machine Learning, and Automation roles worldwide.',
  inbox: {
    label: 'DIRECT INBOX',
    hint: 'Click to copy address or open your mail client',
    copy: 'COPY',
    copied: 'COPIED',
    toast: 'Email copied to clipboard',
  },
  channels: [
    {
      id: '01',
      title: 'GitHub',
      handle: 'github.com/andikaprasetyaaa',
      href: 'https://github.com/andikaprasetyaaa',
      icon: 'github' as ChannelIcon,
    },
    {
      id: '02',
      title: 'LinkedIn',
      handle: 'linkedin.com/in/andikaprasetya',
      href: 'https://linkedin.com/in/andikaprasetya',
      icon: 'linkedin' as ChannelIcon,
    },
    {
      id: '03',
      title: 'Portfolio Source',
      handle: 'andikaprasetya.dev',
      href: 'https://github.com/andikaprasetyaaa/andika-prasetya-portofolio',
      icon: 'globe' as ChannelIcon,
    },
    {
      id: '04',
      title: 'Curriculum Vitae',
      handle: 'Download PDF via Google Drive',
      href: 'https://drive.google.com/file/d/1ds1m5DI1xfXoVL6_EQa2WoXo65RanzeZ/view?usp=sharing',
      icon: 'file' as ChannelIcon,
    },
  ],
  footer: {
    rights: 'I Putu Andika Prasetya. Crafted in Gianyar, Bali.',
  },
};
