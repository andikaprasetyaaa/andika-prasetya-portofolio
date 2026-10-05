export interface Project {
  id: string;
  name: string;
  repoName: string;
  title: string;
  strata: string;
  category: 'AI / NLP' | 'Data & Analytics' | 'Automation & Vision' | 'E-Commerce';
  language: string;
  langColor: string;
  updatedAt: string;
  description: string;
  fullOverview: string;
  telemetry: {
    label: string;
    value: string;
  }[];
  techStack: string[];
  githubUrl: string;
  liveDemoUrl?: string;
  schematicType: 'nlp' | 'graph' | 'dashboard' | 'vision' | 'pipeline' | 'pulse';
  starsCount: number;
}

export type ThemeMode = 'day' | 'night';

export interface StrataSection {
  id: string;
  label: string;
  depth: string;
  numericDepth: number;
  subTitle: string;
}

