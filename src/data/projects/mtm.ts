import type { Blueprint } from '../types';
import type { IconName } from '../../components/Icon';

/* ═══════════════ Kiểu dữ liệu của một dự án thực chiến ═══════════════ */

export type ItemType = 'PI' | 'BUG' | 'CR' | 'TASK';

/** Một item trong trận phát lại. Mốc thời gian tính bằng phút kể từ lúc trận bắt đầu (theo state.json của kit). */
export interface ReplayItem {
  id: string;
  type: ItemType;
  max: number;
  got: number;
  /** Đề hiện trên trang trận */
  seen: number;
  /** Kit giao cho worker */
  disp: number;
  /** Bài nộp được Game API nhận (có receipt) */
  sub: number;
  deadline?: number;
  effort: 'low' | 'medium';
  /** Phạm vi gate: full = cả bộ test, item = test của item, schema = chỉ kiểm schema đáp án */
  gate: 'full' | 'item' | 'schema';
  /** Vì sao mất điểm (nếu có) */
  loss?: string;
}

export interface ReplayNote {
  at: number;
  kind: 'info' | 'warn' | 'ok' | 'bad';
  text: string;
}

export interface Replay {
  matchId: string;
  date: string;
  kit: string;
  minutes: number;
  score: number;
  rank: string;
  items: ReplayItem[];
  notes: ReplayNote[];
}

export interface RuleCard {
  type: ItemType;
  name: string;
  body: string;
  mvs: string;
}

export interface Situation {
  id: string;
  title: string;
  icon: IconName;
  signal: string;
  steps: string[];
  why: string;
  source: string;
}

export interface Milestone {
  ver: string;
  date: string;
  match: string;
  problem: string;
  fix: string;
  metric: string;
}

export interface Project {
  slug: string;
  cert: 'agents';
  mono: string;
  title: string;
  short: string;
  role: string;
  tagline: string;
  period: string;
  stats: [string, string][];
  rules: { cards: RuleCard[]; facts: [IconName, string, string][] };
  blueprint: Blueprint;
  lifecycle: { icon: IconName; title: string; body: string; tool: string }[];
  priority: { title: string; body: string }[];
  models: [string, string, string, string][];
  gates: [string, string, string][];
  situations: Situation[];
  replay: Replay;
  results: { match: string; kit: string; score: string; note: string }[];
  milestones: Milestone[];
  lessons: { title: string; body: string }[];
}

/* ═══════════════ Master the Machine ═══════════════ */

export const mtm: Project = {
  slug: 'mtm',
  cert: 'agents',
  mono: 'MTM',
  title: 'Master the Machine',
  short: 'Master the Machine',
  role: 'Đội BAK · thiết kế & vận hành kit Team Orchestrator',
  tagline:
    'Cuộc thi 40 phút: ban tổ chức mở dần các ticket BUG, CR, TASK, PI trên một codebase thật; người chỉ được ngồi xem. Mình xây một đội agent trên Codex CLI tự đọc đề, chia việc cho nhiều worker song song, kiểm thử, push và nộp bài.',
  period: '24/10 – 13/11/2026',
  stats: [
    ['6 + 6', 'worker code + worker trả lời chạy song song'],
    ['18', 'tool MCP của helper'],
    ['349', 'test hồi quy'],
    ['132', 'commit trên nhánh kit'],
  ],

  rules: {
    cards: [
      {
        type: 'BUG',
        name: 'Sửa lỗi',
        body: 'Tái hiện, sửa đúng chỗ, viết test hồi quy. Grader chạy cả bộ test trên bản nộp và thêm kịch bản ẩn.',
        mvs: 'Có MVS: bắt buộc pass + evidence',
      },
      {
        type: 'CR',
        name: 'Thay đổi tính năng',
        body: 'Làm theo yêu cầu và chuẩn nội bộ của “công ty” (tra trong knowledge base qua MCP của trận).',
        mvs: 'Có MVS: bắt buộc pass + evidence',
      },
      {
        type: 'TASK',
        name: 'Việc kỹ thuật',
        body: 'Viết test suite, tính số liệu, phân tích… Nhiều TASK chỉ cần nộp đáp án theo schema, không đổi code.',
        mvs: 'Không có MVS',
      },
      {
        type: 'PI',
        name: 'Sự cố production',
        body: 'Đua tốc độ: đọc log production, tìm nguyên nhân, nộp báo cáo. Nhất 100%, nhì 90%, ba 75%, còn lại 60%.',
        mvs: 'Không MVS — tính giờ tới lúc PASSED',
      },
    ],
    facts: [
      ['clock', '40 phút, tối đa 1.000 điểm', 'Đề mở theo đợt (wave); một số item có deadline riêng, tính theo đồng hồ server.'],
      ['shield', 'Mỗi item chỉ nộp 1 lần', 'Phải Start working trước. Bài gồm source + answers/<ID>/submit.json + evidence trong cùng một Git revision.'],
      ['warn', 'Chạm vào máy: −50 điểm/lần', 'Từ lúc Start Match người chỉ được xem. Đội phải tự xử lý mọi sự cố bằng code của kit.'],
      ['chart', 'Hoà điểm xét tốc độ và credit', 'Xong item cuối nhanh hơn trung bình và tốn ít credit Codex hơn trung bình đều được cộng điểm phụ.'],
    ],
  },

  blueprint: {
    caption: 'Kiến trúc kit: agent lo code, helper lo mọi thứ chạm tới Game Master',
    nodes: [
      {
        id: 'player',
        label: 'MTM Player',
        sub: 'của ban tổ chức',
        icon: 'play',
        x: 110,
        y: 225,
        what: 'Chương trình của BTC chạy trên máy đội: nạp team pack, khởi động Codex CLI với root agent team_orchestrator, gửi lifecycle input (PREPARE, START, PAUSE, RESUME, END) và đọc progress log để biết đội đang làm gì.',
        tip: 'Player chỉ tin progress log: event nào sai schema là bị coi như không xảy ra.',
      },
      {
        id: 'orch',
        label: 'Orchestrator',
        sub: 'Codex root agent',
        icon: 'brain',
        x: 390,
        y: 225,
        what: 'Agent điều phối. Không tự code: nó gọi dispatch_ready, spawn worker với đúng model/effort helper chọn, nhận READY rồi gọi ship. Quy tắc nằm trong skill team-orchestrator (15 dòng “quick card”).',
        tip: 'Mọi việc cơ học đã được chuyển sang code của helper, để orchestrator chỉ còn việc ra quyết định và chuyển lời.',
      },
      {
        id: 'workers',
        label: 'Workers × N',
        sub: 'mỗi item một worktree',
        icon: 'layers',
        x: 390,
        y: 380,
        what: 'team_feature_worker làm một item trong git worktree riêng: DB test riêng, cặp cổng riêng, node_modules riêng. Đọc brief file, code, test, ghi evidence, commit rồi báo READY. Không có credential, không gọi Game API.',
        tip: 'Tối đa 6 worker code + 6 worker trả lời; PI luôn được tạo worker ngay, vượt mọi giới hạn.',
      },
      {
        id: 'helper',
        label: 'MCP helper',
        sub: '18 tool · Node',
        icon: 'tool',
        x: 680,
        y: 225,
        what: 'Bộ não cơ học viết bằng Node thuần (~10k dòng): giữ mật khẩu, team key, cookie trong RAM; planner xếp hạng item; dispatch; worktree; gate; ship; autopilot; replay bài nộp an toàn; ghi progress log đúng schema.',
        tip: 'Credential không bao giờ nằm trong file, log, prompt của worker hay Git config — có test kiểm.',
      },
      {
        id: 'log',
        label: 'progress.ndjson',
        sub: 'kênh trạng thái',
        icon: 'doc',
        x: 680,
        y: 70,
        kind: 'side',
        what: 'Mỗi dòng một JSON đúng schema của BTC: ORCHESTRATOR_*, PREPARATION_STATUS, ENVIRONMENT_READY, DISCOVERED, IN_PROGRESS, BACKLOG_TESTS, SUBMITTED… Không timestamp, không field lạ.',
        tip: 'Gần mốc 180 KiB helper tự bỏ telemetry tuỳ chọn nhưng không bao giờ để cặp REQUESTED/kết quả bị hở.',
      },
      {
        id: 'portal',
        label: 'Portal · Game API',
        sub: 'start · submissions',
        icon: 'bolt',
        x: 1010,
        y: 100,
        what: 'Trang /match/<id> để đọc backlog, đồng hồ, trạng thái; API start và submissions với Idempotency-Key. Helper kiểm tra assignment (đúng trận, đúng repo/branch/folder) trước khi báo sẵn sàng.',
        tip: 'Nộp bị timeout → gửi lại đúng body và clientSubmissionId, server trả receipt cũ, không bao giờ nộp trùng.',
      },
      {
        id: 'kb',
        label: 'Match MCP',
        sub: 'KB · log · QA data',
        icon: 'search',
        x: 1010,
        y: 225,
        what: '“Hệ thống nội bộ công ty” do BTC cung cấp: chuẩn, tài liệu, fixture QA và log production. Helper tải trước tài liệu cho từng item, quét toàn bộ log cho PI, gộp thành một file đã khử trùng lặp.',
        tip: 'Không bao giờ chờ thông tin không có: ghi giả định có nguồn rồi nộp.',
      },
      {
        id: 'git',
        label: 'Git repo',
        sub: 'branch được giao',
        icon: 'code',
        x: 1010,
        y: 350,
        what: 'Repo của trận: src/ (app thật), env-require/, answers/. Helper cherry-pick commit của worker vào main, chạy gate, push fast-forward rồi nộp đúng SHA đó.',
        tip: 'Không force-push, không sửa exam-info.json, env-require/ hay challenge/.',
      },
    ],
    edges: [
      ['player', 'orch', 'lifecycle'],
      ['orch', 'helper', 'gọi tool'],
      ['orch', 'workers', 'spawn'],
      ['workers', 'helper', 'READY · query'],
      ['helper', 'portal', 'start · submit'],
      ['helper', 'kb', 'tải tài liệu'],
      ['helper', 'git', 'integrate · push'],
      ['helper', 'log', 'ghi event'],
      ['log', 'player', undefined, true],
    ],
  },

  lifecycle: [
    { icon: 'search', title: 'Đề mở', body: 'Helper đọc trang trận mỗi 5 giây, thấy item mới thì ghi DISCOVERED và bật cảnh báo !! DISPATCH NOW.', tool: 'wait_for_update' },
    { icon: 'bolt', title: 'Giao việc', body: 'Một lệnh làm start_work + tạo worktree cho MỌI item đang mở, viết brief file, chọn model/effort, trả danh sách spawn.', tool: 'dispatch_ready' },
    { icon: 'code', title: 'Worker làm', body: 'Đọc brief + digest tài liệu, sửa nhỏ nhất, test, ghi evidence, commit trong worktree, chạy ready handshake.', tool: 'team_feature_worker' },
    { icon: 'layers', title: 'Integrate', body: 'Cherry-pick đúng dải commit của item vào main. Conflict thì huỷ, main không đổi, gửi worker rebase.', tool: 'ship → integrate' },
    { icon: 'shield', title: 'Gate', body: 'Chạy thẳng vitest/tsc với giới hạn thời gian. Kết luận GREEN / CODE_FAILURE (rollback) / ENVIRONMENT (không rollback).', tool: 'ship → gate' },
    { icon: 'download', title: 'Push + nộp', body: 'BACKLOG_TESTS với số thật → push fast-forward → preflight → POST có Idempotency-Key → receipt.', tool: 'ship → submit_work' },
    { icon: 'check', title: 'Tiếp', body: 'Xoá worktree, giải phóng slot, không chờ chấm điểm: lấy ngay item kế tiếp.', tool: 'dispatch_ready' },
  ],

  priority: [
    { title: 'READY có deadline', body: 'Bài đã xong mà sắp hết hạn được ship trước mọi việc khác.' },
    { title: 'PARKED dở dang', body: 'Item đã tạm dừng còn kịp làm nốt bước còn lại thì làm tiếp trước khi nhận việc mới.' },
    { title: 'PI mới', body: 'Đua hạng: luôn có worker ngay, vượt mọi giới hạn số worker và RAM.' },
    { title: 'Deadline gần nhất', body: 'Item có deadline sớm hơn được build slot và lượt đọc MCP trước.' },
    { title: 'Điểm trên phút', body: 'Còn lại xếp theo điểm tối đa chia thời gian ước tính.' },
  ],

  models: [
    ['PI lượt đầu', 'GPT-6.1 Sol', 'low → medium khi còn < 4 phút', 'Đua hạng cần model mạnh nhất cho phần suy luận từ log.'],
    ['TASK chỉ trả lời', 'GPT-6.1 Terra', 'low → medium khi còn < 4 phút', 'Tính toán + điền schema, không cần đắt.'],
    ['BUG / CR lượt đầu', 'GPT-6.1 Terra', 'medium', 'Cân bằng chất lượng code và credit.'],
    ['Làm lại (rollback, mất worker)', 'GPT-6.1 Sol', 'high nếu còn ≥ 10 phút', 'Lần hai phải chắc: dùng model mạnh, suy nghĩ kỹ hơn.'],
  ],

  gates: [
    ['Diff chỉ đổi answers/', 'Kiểm schema đáp án', 'vài giây'],
    ['Diff code, item có deadline', 'Test của chính item + typecheck', '≤ 2 phút'],
    ['Diff code, không deadline', 'Cả bộ test + typecheck (+ build nếu đổi dependency/route/schema)', '≤ 2 phút, quá thì chạy nền'],
  ],

  situations: [
    {
      id: 'pi',
      title: 'PI mở khi mọi slot đang bận',
      icon: 'bolt',
      signal: 'Phút 11,5: đợt mới gồm PI-01 + 2 item code. Đang có 4 worker code chạy.',
      steps: [
        'wait_for_update thấy item mới → tự gọi dispatch_ready ngay trong lượt đó',
        'PI bỏ qua giới hạn worker và RAM → model Sol, effort low',
        'Helper quét trước toàn bộ log production, gộp một file, kèm danh sách service bị cắt',
        'Worker đi FAST PATH: đọc digest một lần → điền submit.json → finish-answer → READY',
      ],
      why: 'PI chấm theo thứ tự nộp. Trận DZCZCBAT orchestrator mất ~37 giây suy nghĩ mới giao PI và về thứ 3 (mất 40 điểm) — vì vậy việc giao PI được chuyển hẳn sang code.',
      source: 'kit 2.9.2 · 2.9.3',
    },
    {
      id: 'red',
      title: 'Gate đỏ vì lỗi code của worker',
      icon: 'warn',
      signal: 'ship BUG-01 → gate CODE_FAILURE: 2 test của item fail trên main.',
      steps: [
        'Không push, không nộp — main không bao giờ chứa code đỏ',
        'Rollback đúng dải commit vừa integrate (revert, không reset)',
        'Gửi worker đường dẫn log gate + SHA main + retryBaseSha để rebase --onto',
        'Trong lúc chờ, ship các item READY khác',
      ],
      why: 'Trước 2.8.8 commit đỏ nằm lại trong main; item kế tiếp ship sẽ push luôn code đỏ vào bài nộp của chính nó.',
      source: 'kit 2.8.8',
    },
    {
      id: 'env',
      title: 'Gate treo, sát deadline',
      icon: 'clock',
      signal: 'pnpm test chạy 118 giây rồi báo ELIFECYCLE dù 15/15 test đạt; còn 1 phút tới deadline.',
      steps: [
        'Kết luận ENVIRONMENT chứ không phải CODE_FAILURE → không rollback',
        'Gate chạy thẳng binary vitest/tsc thay vì qua pnpm (1,9 giây)',
        'Sát deadline: ship force với allowUntested + lý do, dựa trên lần chạy xanh của worker',
      ],
      why: 'Trận set2: BUG-03 bị rollback nhầm và push trễ deadline 10 giây chỉ vì môi trường, không phải vì code.',
      source: 'kit 2.8.2',
    },
    {
      id: 'waits',
      title: 'Test đỏ vì luật của item khác',
      icon: 'layers',
      signal: 'Worker BUG-02 thấy bộ test đỏ do quy tắc trạng thái thuộc phạm vi BUG-03.',
      steps: [
        'Worker KHÔNG sửa luật của item khác, báo READY kèm WAITS-FOR: BUG-03',
        'Nếu BUG-03 kịp ship trước deadline của BUG-02 ≥ 3 phút: ship BUG-03 trước',
        'Gửi BUG-02 một dòng: rebase lên SHA main mới, chạy lại test, commit, READY',
        'Autopilot tôn trọng WAITS-FOR: không tự ship BUG-02 trước BUG-03 (trừ khi tới cutoff)',
      ],
      why: 'Grader chạy cả bộ test trên bản nộp. BUG-02 mất 20/100 ở hai trận vì sửa luôn luật của BUG-03; các đội không sửa đạt 100.',
      source: 'kit 2.9.2 · 2.9.4',
    },
    {
      id: 'silent',
      title: 'Orchestrator im lặng',
      icon: 'pause',
      signal: '3 phút không có lượt gọi tool nào từ orchestrator; có 2 item READY đang chờ.',
      steps: [
        'AUTOPILOT: helper tự ship bài đã commit',
        'Tự ship ở cutoff deadline (~1,75 phút, sớm hơn khi nhiều deadline dồn), trong 3 phút cuối trận và 45 giây sau READY không ai ship',
        'Mỗi lần ghi event AUTO_SHIP; orchestrator chỉ đọc SHIP_RESULT, không ship lại',
      ],
      why: 'Lượt set2: item READY phải chờ orchestrator 3,5–7 phút; worker CR-02 xong sau 7,7 phút nhưng 14,9 phút mới được nộp.',
      source: 'kit 2.8.5 · v6',
    },
    {
      id: 'submit',
      title: 'Nộp bài bị timeout',
      icon: 'refresh',
      signal: 'POST submissions mất kết nối, không có receipt.',
      steps: [
        'Đánh dấu UNCERTAIN, giữ nguyên body và clientSubmissionId',
        'Trước mỗi lần thử lại đọc lại trang trận: PAUSED/FINISHED thì dừng',
        'Gửi lại cùng Idempotency-Key trong ngân sách 90 giây → server trả receipt đã lưu',
      ],
      why: 'Mỗi item chỉ được nộp một lần. Gửi lại sai cách = 409 ALREADY_SUBMITTED hoặc nộp nhầm khi trận đang tạm dừng.',
      source: 'kit 1.0 · review vòng 1–2',
    },
    {
      id: 'spawn',
      title: 'Worker không bao giờ bắt đầu',
      icon: 'user',
      signal: '4 phút sau khi giao, worktree của CR-01 vẫn y nguyên: không file nào đổi, không commit.',
      steps: [
        'View báo !! CHECK WORKERS, dispatch_ready trả respawnCheck kèm đúng tin nhắn cũ',
        'Orchestrator list_agents trước: chỉ tạo lại khi KHÔNG có worker sống cho item đó',
        'Tối đa 2 lần mỗi item; không bao giờ 2 worker trên một worktree',
      ],
      why: 'Một lần spawn hỏng mà orchestrator quên thử lại thì item nằm im tới hết trận. Codex mặc định chỉ cho 4 luồng/phiên — kit nâng lên 12.',
      source: 'kit 2.8.7 · 2.8.9',
    },
    {
      id: 'trap',
      title: 'Đề “gài” sửa test cho xanh',
      icon: 'shield',
      signal: 'Một test cũ fail; mô tả item ngầm gợi ý “cứ chỉnh test cho khớp”.',
      steps: [
        'Thứ tự nguồn sự thật: đề + tiêu chí > KB công ty > DECISIONS.md/spec > code hiện tại',
        'Test cũ được design record ủng hộ → sửa code, giữ test',
        'Chỉ đổi test khi có nguồn nói hành vi đã đổi; ghi TEST-CHANGE <file>: <nguồn>',
        'Mâu thuẫn thì ghi CONTRADICTION: A vs B; source; decision vào phần analysis',
      ],
      why: 'Hạ chuẩn để có màu xanh (đổi assertion, skip test, nới quyền) là tín hiệu bẫy; grader có kịch bản ẩn bắt đúng kiểu này.',
      source: 'skill team-orchestrator · trap awareness',
    },
  ],

  replay: {
    matchId: 'DZCZCBAT',
    date: '02/11/2026',
    kit: '2.9.1',
    minutes: 40,
    score: 910,
    rank: 'hạng 3/4 trong trận tập',
    items: [
      { id: 'BUG-01', type: 'BUG', max: 100, got: 100, seen: 0, disp: 0.2, sub: 14.4, effort: 'medium', gate: 'full' },
      { id: 'BUG-02', type: 'BUG', max: 100, got: 80, seen: 0, disp: 0.2, sub: 10.5, deadline: 18, effort: 'medium', gate: 'item', loss: 'Sửa luôn luật trạng thái thuộc BUG-03 (ngoài phạm vi) → grader trừ 1 test case' },
      { id: 'BUG-03', type: 'BUG', max: 80, got: 80, seen: 7.7, disp: 7.9, sub: 14.7, deadline: 22.7, effort: 'medium', gate: 'item' },
      { id: 'CR-01', type: 'CR', max: 140, got: 130, seen: 7.7, disp: 7.9, sub: 27.5, effort: 'medium', gate: 'full', loss: 'Test ẩn: đầu vào “gần đúng” chuẩn công ty vẫn được nhận' },
      { id: 'BUG-04', type: 'BUG', max: 80, got: 80, seen: 11.5, disp: 12.2, sub: 19.3, effort: 'medium', gate: 'full' },
      { id: 'CR-02', type: 'CR', max: 120, got: 110, seen: 11.5, disp: 12.2, sub: 20.8, effort: 'medium', gate: 'full', loss: 'Test ẩn: chuẩn công ty áp chưa đủ chặt' },
      { id: 'PI-01', type: 'PI', max: 160, got: 120, seen: 11.5, disp: 12.2, sub: 15.8, deadline: 26.5, effort: 'low', gate: 'schema', loss: 'Đúng nhưng nộp thứ 3 → 75% điểm' },
      { id: 'CR-03', type: 'CR', max: 100, got: 90, seen: 20, disp: 20.3, sub: 28.5, effort: 'medium', gate: 'full', loss: 'Test ẩn: thiếu test phủ định cho dạng gần đúng' },
      { id: 'TASK-03', type: 'TASK', max: 50, got: 50, seen: 20, disp: 20.2, sub: 22.3, deadline: 28, effort: 'low', gate: 'schema' },
      { id: 'TASK-04', type: 'TASK', max: 70, got: 70, seen: 20, disp: 20.3, sub: 22.5, effort: 'low', gate: 'schema' },
    ],
    notes: [
      { at: 0, kind: 'info', text: 'START_GAME_V4 · kiểm team key SHA-256 · BACKLOG_SYNC' },
      { at: 11.6, kind: 'warn', text: '!! DISPATCH NOW · PI-01 đã mở — orchestrator còn đang suy nghĩ' },
      { at: 12.2, kind: 'warn', text: 'Giao PI-01 sau ~37 giây → bài học: wait_for_update tự giao việc (2.9.2)' },
      { at: 15.8, kind: 'info', text: 'PI-01 PASSED nhưng về thứ 3 → 75%' },
      { at: 28.6, kind: 'ok', text: '10/10 item đã nộp · không còn worker · wait_for_update 55 s' },
      { at: 40, kind: 'ok', text: 'MATCH_ENDED_V1 → final_result end:true · ORCHESTRATOR_ENDED' },
    ],
  },

  results: [
    { match: 'Tập dượt với Game Master giả lập', kit: 'mock · 29/10', score: '2625 / 2900', note: '10 item, có “chaos”: hết phiên, nộp bị timeout một lần' },
    { match: 'Trận tập DZCZCBAT', kit: '2.9.1', score: '910 / 1000', note: 'Phát lại ngay bên trên — mất điểm ở PI (hạng 3) và test ẩn' },
  ],

  milestones: [
    { ver: '1.0', date: '25/10', match: 'Review 3 vòng', problem: 'Trận tạm dừng bị hiểu là kết thúc; dryRun vẫn gửi bài thật khi replay.', fix: 'Đọc lại trang chính thức trước khi kết luận PAUSED/FINISHED; một cổng kiểm chung cho bài mới và bài gửi lại.', metric: '32/32 test' },
    { ver: '2.8.1', date: '31/10', match: 'Trận tập 2.8.0', problem: 'CR-01 mở phút 8 mà phút 14,2 mới được giao.', fix: 'dispatch_ready: một lệnh giao MỌI item đang mở.', metric: '−6 phút trễ' },
    { ver: '2.8.2', date: '31/10', match: 'set2', problem: 'pnpm test mất 118 s, báo lỗi giả → rollback nhầm, trễ deadline 10 s.', fix: 'Gate do helper chạy, gọi thẳng vitest/tsc, có hộp thời gian.', metric: '118 s → 1,9 s' },
    { ver: '2.8.5', date: '31/10', match: 'set2', problem: 'Item READY chờ orchestrator 3,5–7 phút.', fix: 'Tool ship: integrate → gate → push → nộp trong một lần gọi.', metric: '1 lệnh thay 6' },
    { ver: '2.8.7', date: '31/10', match: 'RBKTH8OM', problem: 'spawn_agent bị từ chối: Codex chỉ cho 4 luồng/phiên.', fix: 'Nâng max_concurrent_threads_per_session lên 12.', metric: '4 → 12 luồng' },
    { ver: '2.9.1', date: '02/11', match: 'H6GGOXRM', problem: 'Worker ngồi không 11 phút chờ orchestrator chuyển lời “được build”.', fix: 'Worker tự lấy build slot bằng lock thư mục (mkdir nguyên tử).', metric: '11 phút → 0' },
    { ver: '2.9.2', date: '02/11', match: 'DZCZCBAT', problem: 'PI mở phút 12,0, orchestrator 37 s sau mới giao → hạng 3.', fix: 'wait_for_update tự dispatch và trả spawn ngay trong lượt.', metric: '−37 s cho PI' },
    { ver: '2.9.3', date: '03/11', match: 'DZCZCBAT', problem: 'Worker PI phải nhờ tra log ~10 lần, mất 2,5 phút.', fix: 'Quét trước toàn bộ log mọi service, gộp một file theo UTC.', metric: '−2,5 phút' },
    { ver: '2.9.4', date: '03/11', match: 'EFMN62ZO', problem: 'BUG-02 nộp khi lỗi của BUG-03 còn trong main → mất TC-04.', fix: 'WAITS-FOR + digest.md + finish-answer một lệnh.', metric: '−45 s/answer' },
    { ver: 'v6', date: '10–13/11', match: 'nhiều trận', problem: 'Phụ thuộc vào việc orchestrator nhớ gọi đúng lúc.', fix: 'Autopilot tự ship + bộ mô phỏng trận không tốn model (4 kịch bản: lũ đề, PI dồn, deadline dồn, chaos).', metric: '0 credit để thử' },
  ],

  lessons: [
    { title: 'Chuyển việc cơ học sang code', body: 'Mỗi lần agent tốn 30 giây cho một việc lặp lại (giao việc, gõ lại brief, chạy validator, chờ chuyển lời), mình biến nó thành một tool của helper. Model chỉ giữ phần cần phán đoán.' },
    { title: 'Mỗi trận thua là một test', body: 'Mọi lỗi trong trận tập đều thành một test tái hiện trước khi sửa: fail trên bản cũ, pass trên bản mới. 349 test giữ cho kit không lùi.' },
    { title: 'Test xanh chưa đủ', body: 'Một lần đổi kit (do agent viết) hỏng âm thầm mà test vẫn xanh, mất ~330 điểm. Từ đó: sau mỗi thay đổi phải chạy một trận tập và đếm lại các chỉ số (giờ ngủ của worker, ô đáp án trống).' },
    { title: 'Thời gian là tài nguyên chính', body: 'Điểm mất nhiều nhất không phải do code sai mà do chờ: chờ giao việc, chờ build slot, chờ ship. Kit đo từng khoảng chờ trong transcript và cắt dần.' },
  ],
};

export const PROJECTS: Project[] = [mtm];

export function getProject(slug: string | undefined): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
