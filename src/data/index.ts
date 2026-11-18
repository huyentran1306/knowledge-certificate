import type { Cert, CertId, Topic } from './types';
import { copilot } from './certs/copilot';
import { sql } from './certs/sql';
import { cloud } from './certs/cloud';
import { agents } from './certs/agents';
import { architect } from './certs/architect';
import { ccaf } from './certs/ccaf';

/** Thêm chứng chỉ mới: tạo file trong ./certs rồi thêm vào mảng này. */
export const CERTS: Cert[] = [copilot, sql, cloud, agents, architect, ccaf].sort((a, b) => a.earned.localeCompare(b.earned));

export const CERT_BY_ID = Object.fromEntries(CERTS.map((c) => [c.id, c])) as Record<CertId, Cert>;

export function getCert(id: string | undefined): Cert | undefined {
  return id && id in CERT_BY_ID ? CERT_BY_ID[id as CertId] : undefined;
}

/** Chứng chỉ đạt gần nhất. */
export const LATEST = CERTS[CERTS.length - 1];

export const TOPICS: Topic[] = [
  {
    title: 'RAG & Vector search',
    desc: 'Chunking, embeddings, hybrid search, grounding câu trả lời vào dữ liệu riêng.',
    certs: ['sql', 'cloud', 'agents', 'architect'],
  },
  {
    title: 'Prompt engineering',
    desc: 'System message, few-shot, ngữ cảnh rõ ràng — áp dụng từ IDE đến agent.',
    certs: ['copilot', 'sql', 'cloud', 'agents', 'architect', 'ccaf'],
  },
  {
    title: 'Agents & tool calling',
    desc: 'Agent tự lập kế hoạch, gọi tool, phối hợp nhiều agent cho tác vụ nhiều bước.',
    certs: ['copilot', 'agents', 'architect', 'ccaf'],
  },
  {
    title: 'Responsible AI',
    desc: 'Content filter, Prompt Shields, minh bạch và con người trong vòng lặp.',
    certs: ['copilot', 'cloud', 'agents', 'architect'],
  },
  {
    title: 'Bảo mật & danh tính',
    desc: 'Managed identity, RBAC, không để key trong code, kiểm soát dữ liệu đưa vào AI.',
    certs: ['copilot', 'sql', 'cloud', 'agents', 'architect'],
  },
  {
    title: 'Đánh giá & giám sát',
    desc: 'Groundedness, relevance, tracing — đo chất lượng trước và sau khi lên production.',
    certs: ['cloud', 'agents', 'architect', 'ccaf'],
  },
];

export const SKILLS: { label: string; cert: CertId }[] = [
  { label: 'Azure OpenAI', cert: 'cloud' },
  { label: 'Microsoft Foundry', cert: 'agents' },
  { label: 'RAG', cert: 'sql' },
  { label: 'Vector search', cert: 'sql' },
  { label: 'Embeddings', cert: 'cloud' },
  { label: 'Agent Service', cert: 'agents' },
  { label: 'Function calling', cert: 'agents' },
  { label: 'MCP', cert: 'architect' },
  { label: 'Multi-agent', cert: 'architect' },
  { label: 'Governance', cert: 'architect' },
  { label: 'Document Intelligence', cert: 'cloud' },
  { label: 'Prompt Shields', cert: 'agents' },
  { label: 'T-SQL', cert: 'sql' },
  { label: 'Copilot Chat', cert: 'copilot' },
  { label: 'Agent mode', cert: 'copilot' },
  { label: 'Copilot Studio', cert: 'architect' },
  { label: 'Claude Code', cert: 'ccaf' },
  { label: 'Subagents', cert: 'ccaf' },
  { label: 'Hooks', cert: 'ccaf' },
  { label: 'Structured output', cert: 'ccaf' },
];

/** Màu cho 6 nhánh bản đồ tư duy (dùng chung cho mọi chứng chỉ). */
export const BRANCH_PALETTE = [
  { color: '#4F46E5', tint: '#EEF0FF', ink: '#3730A3', soft: '#C7CAF7' },
  { color: '#DB2777', tint: '#FDEEF6', ink: '#9D174D', soft: '#F3B5D3' },
  { color: '#D97706', tint: '#FFF4E5', ink: '#92400E', soft: '#F5CD94' },
  { color: '#7C3AED', tint: '#F2ECFF', ink: '#5B21B6', soft: '#D5C2F8' },
  { color: '#0E9384', tint: '#E6F6F4', ink: '#0B5A51', soft: '#A4DCD4' },
  { color: '#2563EB', tint: '#EAF1FF', ink: '#1E40AF', soft: '#B3CBF7' },
];
