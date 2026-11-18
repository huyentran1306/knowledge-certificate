import type { Cert } from '../types';

export const architect: Cert = {
  id: 'architect',
  mono: 'AX',
  title: 'Agentic AI Business Solutions Architect Expert',
  short: 'Agentic AI Architect',
  issuer: 'Microsoft',
  level: 'Expert',
  earned: '2026-11-17',
  expires: '2027-11-18',
  theme: { color: '#D97706', tint: '#FFF4E5', ink: '#9A4A07' },
  tagline:
    'Thiết kế giải pháp agentic cho doanh nghiệp: chọn kiến trúc single/multi-agent, quản trị & bảo mật, và chứng minh giá trị kinh doanh.',
  tags: ['Kiến trúc multi-agent', 'Governance', 'ROI & business case'],
  overview: {
    proves: 'Bạn dẫn dắt được một sáng kiến agentic AI từ bài toán kinh doanh tới kiến trúc, quản trị và đo lường giá trị.',
    tools: 'Microsoft 365 Copilot, Copilot Studio, Microsoft Foundry, Power Platform / Dynamics 365, Microsoft Purview, Microsoft Entra.',
    when: 'Khi tư vấn chọn nền tảng agent, thiết kế multi-agent, hoặc dựng khung governance và đo ROI.',
  },
  demo: {
    title: 'Từ bài toán kinh doanh tới agent chạy thật',
    trace: 'initiative · roadmap',
    steps: [
      {
        label: 'Bài toán',
        icon: 'user',
        title: 'Xác định bài toán & giá trị',
        body: 'Bắt đầu từ quy trình tốn thời gian (ví dụ xử lý yêu cầu hoàn tiền) và đo hiện trạng: thời gian, chi phí, tỉ lệ lỗi.',
        tip: 'Không có baseline thì không chứng minh được ROI.',
        log: ['discover', '#A78BFA', 'baseline captured'],
      },
      {
        label: 'Chọn nền tảng',
        icon: 'layers',
        title: 'Extend, low-code hay pro-code?',
        body: 'Mở rộng Microsoft 365 Copilot, dựng agent low-code trên Copilot Studio, hay pro-code trên Foundry — tuỳ độ phức tạp, tích hợp và đội ngũ.',
        tip: 'Chọn phương án đơn giản nhất đáp ứng được yêu cầu.',
        log: ['decide', '#60A5FA', 'platform selected'],
      },
      {
        label: 'Thiết kế agent',
        icon: 'brain',
        title: 'Kiến trúc single/multi-agent',
        body: 'Tách agent theo trách nhiệm (tiếp nhận, kiểm tra chính sách, xử lý thanh toán) với một agent điều phối và điểm duyệt của con người.',
        tip: 'Mỗi agent chỉ có quyền tối thiểu cho việc của nó.',
        log: ['design', '#FBBF24', '3 agents + orchestrator'],
      },
      {
        label: 'Quản trị',
        icon: 'shield',
        title: 'Governance & bảo mật',
        body: 'Định danh agent, phân quyền dữ liệu, chính sách DLP, ghi log và kiểm toán; quy trình ALM từ dev → test → prod.',
        tip: 'Governance thiết kế từ đầu, không vá sau.',
        log: ['govern', '#F472B6', 'policies applied'],
      },
      {
        label: 'Đo giá trị',
        icon: 'chart',
        title: 'Triển khai & đo ROI',
        body: 'Triển khai theo giai đoạn, theo dõi mức độ sử dụng, thời gian tiết kiệm, chất lượng và chi phí vận hành để quyết định mở rộng.',
        tip: 'Kết hợp số liệu định lượng với phản hồi người dùng.',
        log: ['measure', '#34D399', 'adoption + time saved tracked'],
      },
    ],
  },
  domains: [
    {
      title: 'Chiến lược & giá trị',
      sub: 'Use case, ROI, ưu tiên',
      points: [
        'Chọn use case theo giá trị × khả thi.',
        'Đo baseline trước khi triển khai.',
        'Business case gồm cả chi phí vận hành, không chỉ chi phí xây dựng.',
      ],
      remember: 'ROI cần baseline và chỉ số đo được.',
    },
    {
      title: 'Chọn nền tảng',
      sub: 'M365 Copilot, Copilot Studio, Foundry',
      points: [
        'Mở rộng Microsoft 365 Copilot khi nhu cầu xoay quanh công việc văn phòng.',
        'Copilot Studio cho agent low-code, tích hợp qua connector.',
        'Foundry khi cần pro-code, tự chọn model, orchestration phức tạp.',
      ],
      remember: 'Chọn phương án đơn giản nhất đáp ứng yêu cầu.',
    },
    {
      title: 'Kiến trúc agent',
      sub: 'Single, multi-agent, human-in-the-loop',
      points: [
        'Single agent cho tác vụ gọn, ít tool.',
        'Multi-agent khi cần chuyên môn và quyền tách biệt.',
        'Điểm duyệt của con người cho quyết định rủi ro cao.',
      ],
      remember: 'Thêm agent = thêm chi phí phối hợp; chỉ tách khi có lý do.',
    },
    {
      title: 'Governance & bảo mật',
      sub: 'Danh tính, dữ liệu, ALM',
      points: [
        'Mỗi agent có danh tính và quyền tối thiểu.',
        'DLP, phân loại dữ liệu, kiểm toán hoạt động.',
        'ALM: môi trường dev/test/prod, kiểm thử trước khi phát hành.',
      ],
      remember: 'Least privilege áp dụng cho cả agent.',
    },
    {
      title: 'Vận hành & cải tiến',
      sub: 'Giám sát, đánh giá, adoption',
      points: [
        'Theo dõi chất lượng, chi phí và mức độ sử dụng.',
        'Đánh giá định kỳ, có kênh phản hồi.',
        'Change management để người dùng thực sự dùng.',
      ],
      remember: 'Adoption thấp = chưa có giá trị, dù kỹ thuật tốt.',
    },
  ],
  concepts: [
    { tag: 'KIẾN TRÚC', term: 'Orchestrator', def: 'Agent điều phối: chia việc, gọi agent chuyên trách và tổng hợp kết quả.' },
    { tag: 'KIẾN TRÚC', term: 'Human-in-the-loop', def: 'Con người duyệt ở các bước rủi ro cao trước khi agent hành động.' },
    { tag: 'NỀN TẢNG', term: 'Copilot Studio', def: 'Nền tảng low-code để dựng agent với topic, action, connector và knowledge.' },
    { tag: 'QUẢN TRỊ', term: 'Least privilege', def: 'Agent chỉ được cấp đúng quyền cần cho nhiệm vụ của nó.' },
    { tag: 'QUẢN TRỊ', term: 'ALM', def: 'Quản lý vòng đời: phát triển, kiểm thử, phát hành và cập nhật agent qua các môi trường.' },
    { tag: 'GIÁ TRỊ', term: 'Baseline', def: 'Số đo hiện trạng trước khi có agent — điểm so sánh để tính ROI.' },
  ],
  code: {
    note: 'Khung tư duy dạng cấu hình (ví dụ minh hoạ) — dùng làm mẫu khi viết tài liệu kiến trúc.',
    samples: [
      {
        label: 'Agent spec',
        lang: 'yaml',
        code: `agent: refund-orchestrator
goal: Xử lý yêu cầu hoàn tiền trong 24 giờ
platform: copilot-studio        # hoặc foundry khi cần pro-code
sub_agents:
  - intake        # đọc email/form, trích thông tin
  - policy-check  # đối chiếu chính sách hoàn tiền
  - payment       # tạo lệnh hoàn tiền
human_in_the_loop:
  - when: amount > 5000000
    approver: finance-team`,
      },
      {
        label: 'Governance',
        lang: 'yaml',
        code: `identity: mỗi agent một danh tính riêng
permissions:
  intake: [read: mailbox/refunds]
  policy-check: [read: sharepoint/policies]
  payment: [write: erp/refunds]   # quyền cao nhất, có duyệt
data:
  dlp: chặn chia sẻ PII ra ngoài tổ chức
audit: ghi log mọi hành động
alm: dev -> test -> prod, kiểm thử trước khi phát hành`,
      },
      {
        label: 'Đo ROI',
        lang: 'yaml',
        code: `baseline:            # đo trước khi triển khai
  avg_handle_time: <phút / yêu cầu>
  volume: <yêu cầu / tháng>
target:
  avg_handle_time: <mục tiêu>
metrics:
  - thời gian xử lý trung bình
  - tỉ lệ cần người can thiệp
  - mức độ hài lòng (CSAT)
  - chi phí vận hành / tháng`,
      },
    ],
  },
  traps: [
    {
      title: 'Multi-agent không phải lúc nào cũng tốt hơn',
      body: 'Nếu một agent với vài tool làm được, tách thành nhiều agent chỉ thêm độ trễ, chi phí và điểm lỗi.',
    },
    {
      title: 'Bắt đầu bằng công nghệ',
      body: 'Đáp án đúng thường bắt đầu từ bài toán kinh doanh và chỉ số đo lường, không phải từ việc chọn model.',
    },
    {
      title: 'Governance để sau',
      body: 'Đáp án “triển khai trước, bổ sung bảo mật sau” gần như luôn sai.',
    },
  ],
  mindmap: [
    {
      title: 'Chiến lược & giá trị',
      hint: 'Use case, baseline, business case',
      leaves: ['Giá trị × khả thi', 'Baseline trước triển khai', 'Business case đầy đủ'],
      summary: 'Agent chỉ đáng làm khi giải được bài toán có giá trị đo được.',
      points: ['Ưu tiên use case giá trị cao, khả thi cao.', 'Đo hiện trạng trước khi thay đổi.', 'Tính cả chi phí vận hành và thay đổi quy trình.'],
      remember: 'Không có baseline → không có ROI.',
    },
    {
      title: 'Chọn nền tảng',
      hint: 'Extend, low-code, pro-code',
      leaves: ['Mở rộng M365 Copilot', 'Copilot Studio low-code', 'Foundry pro-code'],
      summary: 'Đi từ phương án đơn giản nhất, chỉ lên mức phức tạp hơn khi cần.',
      points: ['M365 Copilot cho công việc văn phòng.', 'Copilot Studio cho agent nghiệp vụ với connector.', 'Foundry cho kiểm soát sâu và orchestration phức tạp.'],
      remember: 'Đề mô tả đội ngũ ít dev → nghiêng về low-code.',
    },
    {
      title: 'Governance',
      hint: 'Danh tính, dữ liệu, ALM',
      leaves: ['Danh tính cho agent', 'DLP & kiểm toán', 'ALM dev → test → prod'],
      summary: 'Agent là “nhân viên số” — cần danh tính, quyền hạn và nhật ký như người thật.',
      points: ['Danh tính riêng, quyền tối thiểu.', 'DLP và phân loại dữ liệu.', 'Phát hành qua các môi trường có kiểm thử.'],
      remember: 'Governance thiết kế từ đầu.',
    },
    {
      title: 'Kiến trúc agent',
      hint: 'Single, multi, human',
      leaves: ['Single vs multi-agent', 'Orchestrator', 'Human-in-the-loop'],
      summary: 'Tách agent theo trách nhiệm và quyền, không theo cảm hứng.',
      points: ['Một agent khi việc gọn.', 'Orchestrator điều phối các agent chuyên trách.', 'Con người duyệt ở bước rủi ro cao.'],
      remember: 'Nhiều agent hơn = nhiều điểm lỗi hơn.',
    },
    {
      title: 'Vận hành',
      hint: 'Chất lượng, chi phí',
      leaves: ['Giám sát chất lượng', 'Chi phí vận hành', 'Đánh giá định kỳ'],
      summary: 'Sau go-live mới là lúc bắt đầu đo thật.',
      points: ['Theo dõi chất lượng câu trả lời và hành động.', 'Kiểm soát chi phí model và tích hợp.', 'Đánh giá định kỳ, cập nhật khi quy trình đổi.'],
      remember: 'Agent không có giám sát là rủi ro vận hành.',
    },
    {
      title: 'Adoption',
      hint: 'Con người & thay đổi',
      leaves: ['Change management', 'Kênh phản hồi', 'Mở rộng theo giai đoạn'],
      summary: 'Giá trị chỉ đến khi người dùng thật sự dùng.',
      points: ['Đào tạo và truyền thông thay đổi.', 'Kênh phản hồi để cải tiến.', 'Pilot → mở rộng dần theo kết quả.'],
      remember: 'Adoption là chỉ số kinh doanh, không phải chỉ số kỹ thuật.',
    },
  ],
  flashcards: [
    { q: 'Khi nào nên tách thành nhiều agent?', a: 'Khi cần chuyên môn tách biệt, quyền truy cập khác nhau, hoặc quy trình nhiều bước cần điểm kiểm duyệt riêng.' },
    { q: 'Vì sao cần baseline?', a: 'Để có điểm so sánh khi tính ROI — không đo hiện trạng thì không chứng minh được cải thiện.' },
    { q: 'Copilot Studio hay Foundry?', a: 'Copilot Studio cho low-code, connector sẵn; Foundry khi cần pro-code, tự chọn model, orchestration phức tạp.' },
    { q: 'Human-in-the-loop đặt ở đâu?', a: 'Ở các bước rủi ro cao hoặc không đảo ngược được, như duyệt thanh toán lớn.' },
  ],
  quiz: [
    {
      q: 'Khách hàng muốn agent hỗ trợ nhân viên soạn email và tóm tắt cuộc họp trong Outlook, Teams. Hướng đi hợp lý nhất?',
      opts: ['Tự huấn luyện model riêng', 'Mở rộng Microsoft 365 Copilot', 'Dựng multi-agent trên Foundry', 'Viết chatbot rule-based'],
      ans: 1,
      why: 'Nhu cầu nằm gọn trong công việc văn phòng trên Microsoft 365 — mở rộng M365 Copilot là phương án đơn giản và nhanh nhất.',
    },
    {
      q: 'Agent thanh toán có thể tạo lệnh hoàn tiền lớn. Biện pháp quan trọng nhất?',
      opts: ['Tăng temperature của model', 'Human-in-the-loop duyệt trên ngưỡng', 'Thêm nhiều agent hơn', 'Tắt log để tăng tốc'],
      ans: 1,
      why: 'Hành động rủi ro cao, khó đảo ngược cần con người duyệt; kèm quyền tối thiểu và log kiểm toán.',
    },
  ],
  resources: [
    { label: 'Tìm chứng chỉ trên Microsoft Learn', url: 'https://learn.microsoft.com/credentials/browse/?terms=Agentic%20AI' },
    { label: 'Tài liệu Copilot Studio', url: 'https://learn.microsoft.com/microsoft-copilot-studio/' },
  ],
};
