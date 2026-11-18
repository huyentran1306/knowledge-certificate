import type { Cert } from '../types';

export const copilot: Cert = {
  id: 'copilot',
  mono: 'GH',
  title: 'GitHub Copilot',
  short: 'GitHub Copilot',
  issuer: 'GitHub',
  level: 'GitHub',
  earned: '2026-06-29',
  expires: '2028-06-30',
  theme: { color: '#1F2937', tint: '#EEF0F3', ink: '#1F2937' },
  tagline:
    'Dùng Copilot hiệu quả và có trách nhiệm: viết prompt tốt, hiểu cách Copilot lấy ngữ cảnh, nắm tính năng theo từng gói và cách quản trị trong tổ chức.',
  tags: ['Prompt trong IDE', 'Copilot Chat', 'Agent mode'],
  overview: {
    proves:
      'Bạn biết dùng Copilot đúng cách trong vòng đời phát triển phần mềm, hiểu nó xử lý dữ liệu ra sao và quản trị được ở quy mô tổ chức.',
    tools: 'Copilot trong IDE (gợi ý inline, Chat, agent mode), Copilot trên github.com, Copilot CLI, chính sách tổ chức.',
    when: 'Khi onboard team dùng Copilot, viết custom instructions, hoặc trả lời câu hỏi về quyền riêng tư và content exclusion.',
  },
  demo: {
    title: 'Một gợi ý code đi từ IDE tới bạn',
    trace: 'copilot · session',
    steps: [
      {
        label: 'Thu thập ngữ cảnh',
        icon: 'code',
        title: 'Bạn gõ code hoặc hỏi Chat',
        body: 'Copilot gom ngữ cảnh: file đang mở, đoạn code quanh con trỏ, các tab liên quan và tham chiếu bạn thêm như #file hay @workspace.',
        tip: 'Mở sẵn các file liên quan giúp gợi ý chính xác hơn.',
        log: ['context', '#A78BFA', 'active file + neighbor tabs'],
      },
      {
        label: 'Lọc đầu vào',
        icon: 'shield',
        title: 'Prompt đi qua proxy và bộ lọc',
        body: 'Prompt được gửi qua kết nối mã hoá tới dịch vụ Copilot và đi qua các bộ lọc trước khi tới model.',
        tip: 'File bị content exclusion sẽ không được dùng làm ngữ cảnh.',
        log: ['proxy', '#60A5FA', 'filters passed'],
      },
      {
        label: 'Model sinh gợi ý',
        icon: 'brain',
        title: 'LLM tạo đề xuất',
        body: 'Model sinh một hoặc nhiều đề xuất dựa trên prompt và ngữ cảnh đã gom.',
        tip: 'Gợi ý mang tính xác suất — luôn đọc lại trước khi chấp nhận.',
        log: ['model', '#FBBF24', 'candidates generated'],
      },
      {
        label: 'Lọc đầu ra',
        icon: 'search',
        title: 'Hậu xử lý và lọc code công khai',
        body: 'Kết quả được kiểm tra lại. Nếu tổ chức chặn gợi ý trùng khớp code công khai, đề xuất khớp sẽ bị loại.',
        tip: 'Khi cho phép gợi ý trùng khớp, code referencing hiển thị nguồn và license.',
        log: ['filter', '#F472B6', 'public-code match: none'],
      },
      {
        label: 'Bạn review',
        icon: 'check',
        title: 'Developer quyết định',
        body: 'Bạn chấp nhận, sửa hoặc bỏ đề xuất. Trách nhiệm về chất lượng, bảo mật và test vẫn thuộc về bạn.',
        tip: 'Copilot là pair programmer — không thay cho code review.',
        log: ['accept', '#34D399', 'suggestion accepted · tests run'],
      },
    ],
  },
  domains: [
    {
      title: 'AI có trách nhiệm',
      sub: 'Rủi ro, giới hạn, vai trò con người',
      points: [
        'Hiểu giới hạn của LLM: có thể sai, lỗi thời hoặc thiên lệch.',
        'Luôn review, test và quét bảo mật code do AI sinh.',
        'Minh bạch khi dùng AI trong quy trình làm việc.',
      ],
      remember: 'Đáp án đúng hiếm khi là “tin hoàn toàn vào Copilot”.',
    },
    {
      title: 'Gói & tính năng',
      sub: 'Individual · Business · Enterprise',
      points: [
        'Business/Enterprise có quản lý chính sách, content exclusion và audit log.',
        'Enterprise mở rộng thêm tính năng trên github.com và tuỳ biến cho tổ chức.',
        'Quản trị viên bật/tắt tính năng và model qua policy.',
      ],
      remember: 'Câu hỏi về quản trị tập trung → gói Business/Enterprise.',
    },
    {
      title: 'Cách Copilot xử lý dữ liệu',
      sub: 'Ngữ cảnh, proxy, bộ lọc',
      points: [
        'Ngữ cảnh lấy từ file đang mở, code quanh con trỏ và tham chiếu trong Chat.',
        'Prompt đi qua proxy, bộ lọc rồi tới model; đầu ra được hậu xử lý.',
        'Content exclusion loại file/repo nhạy cảm khỏi ngữ cảnh.',
      ],
      remember: 'Muốn Copilot “không thấy” file bí mật → content exclusion.',
    },
    {
      title: 'Prompt engineering',
      sub: 'Rõ ràng, cụ thể, có ví dụ',
      points: [
        'Nêu mục tiêu, ràng buộc, ngôn ngữ và ví dụ đầu vào/đầu ra.',
        'Chia việc lớn thành từng bước nhỏ.',
        'Dùng @workspace, #file và slash command như /tests, /explain, /fix.',
      ],
      remember: 'Prompt tốt = ngữ cảnh + ý định + ví dụ.',
    },
    {
      title: 'Tình huống cho developer',
      sub: 'Test, refactor, tài liệu, agent',
      points: [
        'Sinh unit test và các edge case.',
        'Giải thích code cũ, refactor, viết tài liệu.',
        'Agent mode tự sửa nhiều file và chạy lệnh — cần review từng thay đổi.',
      ],
      remember: '/tests sinh test, /fix sửa lỗi, /explain giải thích.',
    },
  ],
  concepts: [
    { tag: 'IDE', term: 'Ghost text', def: 'Gợi ý inline hiện mờ trong editor; Tab để chấp nhận, có thể xem các đề xuất thay thế.' },
    { tag: 'CHAT', term: '@workspace', def: 'Cho Copilot tìm ngữ cảnh trong toàn bộ workspace để trả lời câu hỏi về codebase.' },
    { tag: 'CHAT', term: 'Slash command', def: 'Lệnh tắt như /explain, /fix, /tests giúp nói rõ ý định mà không cần prompt dài.' },
    { tag: 'TUỲ BIẾN', term: 'Custom instructions', def: 'File .github/copilot-instructions.md mô tả quy ước của repo để Copilot Chat tự áp dụng.' },
    { tag: 'QUẢN TRỊ', term: 'Content exclusion', def: 'Cấu hình loại file hoặc đường dẫn khỏi ngữ cảnh của Copilot (gói Business/Enterprise).' },
    { tag: 'AGENT', term: 'Agent mode', def: 'Copilot tự lập kế hoạch, sửa nhiều file, chạy lệnh terminal và lặp lại tới khi xong việc.' },
  ],
  code: {
    note: 'Ví dụ prompt và file cấu hình — điều chỉnh theo repo của bạn.',
    samples: [
      {
        label: 'Prompt tốt',
        lang: 'python',
        code: `# Viết hàm validate_email(email: str) -> bool
# - Dùng regex, không dùng thư viện ngoài
# - Trả False với chuỗi rỗng hoặc None
# - Ví dụ: "a@b.co" -> True, "a@b" -> False
def validate_email(email: str) -> bool:`,
      },
      {
        label: 'copilot-instructions.md',
        lang: 'markdown',
        code: `# Quy ước của repo

- TypeScript strict, không dùng \`any\`.
- Component React viết dạng function, đặt trong src/components.
- Test dùng Vitest, đặt cạnh file nguồn: *.test.ts.
- Thông báo lỗi cho người dùng viết bằng tiếng Việt.`,
      },
      {
        label: 'Chat commands',
        lang: 'text',
        code: `@workspace Luồng đăng nhập nằm ở đâu và đi qua những file nào?
/explain  # giải thích đoạn code đang chọn
/tests    # sinh unit test cho hàm đang chọn
/fix      # đề xuất sửa lỗi trong đoạn đang chọn
#file:src/auth.ts Thêm kiểm tra token hết hạn`,
      },
    ],
  },
  traps: [
    {
      title: '.gitignore không ẩn file khỏi Copilot',
      body: 'Đừng giả định .gitignore sẽ giấu file khỏi Copilot. Cách chính thức để loại file khỏi ngữ cảnh là content exclusion.',
    },
    {
      title: 'Tính năng nào thuộc gói nào',
      body: 'Đề hay hỏi tính năng thuộc gói nào. Quản trị chính sách và audit log là của Business/Enterprise, không phải Individual.',
    },
    {
      title: 'Copilot không thay code review',
      body: 'Đáp án “chấp nhận gợi ý rồi merge ngay” luôn sai. Gợi ý cần được review, test và quét bảo mật như code bình thường.',
    },
  ],
  mindmap: [
    {
      title: 'AI có trách nhiệm',
      hint: 'Giới hạn, review, minh bạch',
      leaves: ['Giới hạn của LLM', 'Review & test code do AI sinh', 'Minh bạch khi dùng AI'],
      summary: 'Copilot tăng tốc, nhưng con người vẫn chịu trách nhiệm cuối cùng về code.',
      points: ['LLM có thể sai, lỗi thời hoặc thiên lệch.', 'Code AI sinh vẫn phải qua review, test, quét bảo mật.', 'Nói rõ khi một phần công việc do AI hỗ trợ.'],
      remember: 'Không có đáp án nào cho phép bỏ qua review.',
    },
    {
      title: 'Gói & quản trị',
      hint: 'Individual, Business, Enterprise',
      leaves: ['Individual · Business · Enterprise', 'Policy bật/tắt tính năng', 'Audit log'],
      summary: 'Gói càng cao càng nhiều quyền kiểm soát tập trung cho tổ chức.',
      points: ['Business/Enterprise: quản lý seat, policy, content exclusion.', 'Policy cho gợi ý khớp code công khai: Block/Allow.', 'Audit log theo dõi thay đổi cấu hình.'],
      remember: 'Quản trị tập trung → Business/Enterprise.',
    },
    {
      title: 'Dữ liệu & quyền riêng tư',
      hint: 'Ngữ cảnh, proxy, exclusion',
      leaves: ['Ngữ cảnh lấy từ đâu', 'Proxy & bộ lọc', 'Content exclusion'],
      summary: 'Biết dữ liệu nào rời máy bạn, đi đâu và bị lọc thế nào.',
      points: ['Ngữ cảnh: file đang mở, code quanh con trỏ, tham chiếu Chat.', 'Prompt qua proxy, bộ lọc, rồi tới model.', 'Content exclusion loại file nhạy cảm khỏi ngữ cảnh.'],
      remember: '.gitignore không phải cơ chế loại trừ của Copilot.',
    },
    {
      title: 'Prompt engineering',
      hint: 'Mục tiêu, ràng buộc, ví dụ',
      leaves: ['Mục tiêu + ràng buộc + ví dụ', 'Chia nhỏ tác vụ', '#file · @workspace'],
      summary: 'Prompt cụ thể cho gợi ý cụ thể.',
      points: ['Viết comment mô tả rõ hàm cần làm gì.', 'Chia việc lớn thành từng bước.', 'Chỉ đúng file/ngữ cảnh bằng #file, @workspace.'],
      remember: 'Ví dụ đầu vào/đầu ra là cách nhanh nhất để Copilot hiểu ý.',
    },
    {
      title: 'Copilot Chat',
      hint: 'Slash command, instructions',
      leaves: ['/explain · /fix · /tests', 'Custom instructions', 'Chọn model phù hợp'],
      summary: 'Chat là nơi hỏi đáp, giải thích và ra lệnh theo ngữ cảnh.',
      points: ['Slash command thể hiện ý định ngắn gọn.', '.github/copilot-instructions.md áp quy ước repo.', 'Có thể chọn model tuỳ tác vụ (nếu policy cho phép).'],
      remember: 'Quy ước chung cho cả repo → custom instructions.',
    },
    {
      title: 'Tình huống developer',
      hint: 'Test, refactor, agent',
      leaves: ['Sinh unit test', 'Refactor & tài liệu', 'Agent mode nhiều file'],
      summary: 'Copilot hữu ích nhất ở việc lặp lại và việc cần ngữ cảnh rộng.',
      points: ['Sinh test và edge case.', 'Giải thích, refactor code cũ, viết docs.', 'Agent mode sửa nhiều file và chạy lệnh — review từng bước.'],
      remember: 'Agent mode mạnh nhưng vẫn cần bạn duyệt thay đổi.',
    },
  ],
  flashcards: [
    { q: 'Copilot Chat lấy ngữ cảnh từ đâu?', a: 'File đang mở, đoạn code đang chọn, cùng các tham chiếu bạn thêm như #file hoặc @workspace.' },
    { q: 'Muốn Copilot không dùng file chứa bí mật làm ngữ cảnh?', a: 'Cấu hình content exclusion cho file/đường dẫn đó (gói Business/Enterprise).' },
    { q: '/tests, /fix, /explain dùng để làm gì?', a: '/tests sinh unit test, /fix đề xuất sửa lỗi, /explain giải thích đoạn code đang chọn.' },
    { q: 'File nào chứa custom instructions cho cả repo?', a: '.github/copilot-instructions.md' },
  ],
  quiz: [
    {
      q: 'Bạn muốn Copilot Chat trả lời câu hỏi dựa trên toàn bộ codebase trong VS Code. Dùng gì?',
      opts: ['/fix', '#selection', '@workspace', 'Gợi ý inline (ghost text)'],
      ans: 2,
      why: '@workspace cho Copilot tìm ngữ cảnh trong toàn bộ workspace; #selection chỉ lấy đoạn đang chọn.',
    },
    {
      q: 'Tổ chức muốn chặn các gợi ý trùng khớp với code công khai. Cách đúng?',
      opts: ['Tắt Copilot cho cả tổ chức', 'Đặt policy chặn gợi ý khớp code công khai', 'Thêm repo vào .gitignore', 'Yêu cầu developer tự kiểm tra'],
      ans: 1,
      why: 'Quản trị viên đặt policy cho gợi ý khớp code công khai (Block/Allow) ở cấp tổ chức hoặc doanh nghiệp.',
    },
  ],
  resources: [
    { label: 'Chứng chỉ GitHub', url: 'https://resources.github.com/learn/certifications/' },
    { label: 'Tài liệu GitHub Copilot', url: 'https://docs.github.com/copilot' },
  ],
};
