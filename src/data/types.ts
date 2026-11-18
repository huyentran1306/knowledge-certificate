import type { IconName } from '../components/Icon';

export type CertId = 'copilot' | 'sql' | 'cloud' | 'agents' | 'architect';

/** Bộ màu riêng của mỗi chứng chỉ. */
export interface CertTheme {
  /** Màu chính: huy hiệu, vòng tròn, nút. */
  color: string;
  /** Nền nhạt cho chip, khối nhấn. */
  tint: string;
  /** Màu chữ đậm đặt trên nền tint (đủ tương phản). */
  ink: string;
}

export interface DemoStep {
  label: string;
  icon: IconName;
  title: string;
  body: string;
  tip: string;
  /** [sự kiện, màu, chi tiết] — một dòng trong khung trace. */
  log: [string, string, string];
}

export interface Domain {
  title: string;
  sub: string;
  points: string[];
  remember: string;
}

export interface Concept {
  tag: string;
  term: string;
  def: string;
}

export type CodeLang = 'python' | 'sql' | 'yaml' | 'markdown' | 'text';

export interface CodeSample {
  label: string;
  lang: CodeLang;
  code: string;
}

export interface Trap {
  title: string;
  body: string;
}

/** Một nhánh của bản đồ tư duy. 3 nhánh đầu nằm bên trái, 3 nhánh sau bên phải. */
export interface Branch {
  title: string;
  hint: string;
  leaves: [string, string, string];
  summary: string;
  points: string[];
  remember: string;
}

export interface Flashcard {
  q: string;
  a: string;
}

export interface QuizItem {
  q: string;
  opts: string[];
  ans: number;
  why: string;
}

export interface Resource {
  label: string;
  url: string;
}

export interface Cert {
  id: CertId;
  /** Chữ viết tắt in trên huy hiệu. */
  mono: string;
  title: string;
  short: string;
  issuer: 'Microsoft' | 'GitHub';
  level: 'Associate' | 'Expert' | 'GitHub';
  /** YYYY-MM-DD */
  earned: string;
  /** YYYY-MM-DD */
  expires: string;
  theme: CertTheme;
  tagline: string;
  tags: string[];
  overview: { proves: string; tools: string; when: string };
  demo: { title: string; trace: string; steps: DemoStep[] };
  domains: Domain[];
  concepts: Concept[];
  code: { note: string; samples: CodeSample[] };
  traps: Trap[];
  /** Đúng 6 nhánh. */
  mindmap: Branch[];
  flashcards: Flashcard[];
  quiz: QuizItem[];
  resources: Resource[];
}

export interface Topic {
  title: string;
  desc: string;
  certs: CertId[];
}
