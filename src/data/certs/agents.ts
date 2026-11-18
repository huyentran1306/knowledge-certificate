import type { Cert } from '../types';

export const agents: Cert = {
  id: 'agents',
  mono: 'AG',
  title: 'Azure AI Apps and Agents Developer Associate',
  short: 'Apps & Agents Developer',
  issuer: 'Microsoft',
  level: 'Associate',
  earned: '2026-10-11',
  expires: '2027-10-12',
  theme: { color: '#7C3AED', tint: '#F2ECFF', ink: '#6D28D9' },
  tagline:
    'Xây ứng dụng generative AI và agent trên Azure: từ triển khai model, RAG, tool calling đến đánh giá chất lượng và an toàn nội dung.',
  tags: ['Agent Service', 'Tool calling', 'Evaluation'],
  overview: {
    proves: 'Bạn đưa được một ứng dụng AI/agent từ prototype lên production trên Azure — đúng, an toàn và đo lường được.',
    tools: 'Microsoft Foundry, Agent Service, Azure OpenAI, Azure AI Search, Content Safety, SDK azure-ai-projects.',
    when: 'Khi thiết kế chatbot nội bộ, chọn giữa File Search và Azure AI Search, hoặc dựng pipeline đánh giá.',
  },
  demo: {
    title: 'Vòng đời một câu hỏi đi qua agent',
    trace: 'trace · thread_7f3a',
    steps: [
      {
        label: 'Người dùng hỏi',
        icon: 'user',
        title: 'Câu hỏi vào thread',
        body: 'Người dùng hỏi “Chính sách hoàn tiền cho đơn quá 30 ngày là gì?”. Tin nhắn được thêm vào một thread — nơi lưu toàn bộ lịch sử hội thoại.',
        tip: 'Thread giữ ngữ cảnh; bạn không phải tự nối lịch sử vào prompt.',
        log: ['thread.message', '#A78BFA', 'role=user created'],
      },
      {
        label: 'Agent lập kế hoạch',
        icon: 'brain',
        title: 'Run bắt đầu, model đọc instructions',
        body: 'Một run được tạo cho thread. Model đọc instructions (“chỉ trả lời dựa trên tài liệu chính sách”) và quyết định cần tra cứu trước khi trả lời.',
        tip: 'Instructions rõ ràng giúp agent biết khi nào phải gọi tool.',
        log: ['run', '#60A5FA', 'queued → in_progress'],
      },
      {
        label: 'Gọi File Search',
        icon: 'tool',
        title: 'Tool call: truy xuất tài liệu',
        body: 'Agent gọi tool File Search trên vector store chứa PDF chính sách, lấy về các đoạn liên quan nhất theo độ tương đồng ngữ nghĩa.',
        tip: 'Với function calling, run dừng ở requires_action — code của bạn chạy hàm rồi gửi kết quả lại.',
        log: ['run.step', '#FBBF24', 'tool_calls: file_search'],
      },
      {
        label: 'Trả lời có trích dẫn',
        icon: 'doc',
        title: 'Câu trả lời được grounding',
        body: 'Model tổng hợp câu trả lời từ các đoạn vừa truy xuất và gắn annotation trích dẫn về đúng file nguồn.',
        tip: 'Không có trích dẫn thì khó kiểm chứng và dễ bịa.',
        log: ['thread.message', '#34D399', 'role=assistant · citations'],
      },
      {
        label: 'Đánh giá & an toàn',
        icon: 'shield',
        title: 'Content filter + evaluation',
        body: 'Content filter kiểm tra đầu vào/đầu ra lúc chạy. Ngoài ra, các evaluator (groundedness, relevance) chấm chất lượng trên tập dữ liệu thử.',
        tip: 'Filter chặn nội dung nguy hại; evaluation đo chất lượng — hai việc khác nhau.',
        log: ['run', '#F472B6', 'completed · eval: groundedness, relevance'],
      },
    ],
  },
  domains: [
    {
      title: 'Lập kế hoạch & quản lý giải pháp',
      sub: 'Foundry project, triển khai model, bảo mật, chi phí',
      points: [
        'Chọn model và kiểu triển khai phù hợp (Standard vs Provisioned).',
        'Xác thực bằng managed identity + RBAC thay vì API key trong code.',
        'Theo dõi quota, chi phí và log qua Azure Monitor.',
      ],
      remember: 'Đáp án “không lưu secret” thường là đáp án đúng.',
    },
    {
      title: 'Ứng dụng generative AI',
      sub: 'Prompt, RAG, fine-tuning',
      points: [
        'System message định vai trò, giới hạn và định dạng đầu ra.',
        'RAG: chunk → embed → index → truy xuất → grounding câu trả lời.',
        'Fine-tune khi cần đổi phong cách/định dạng, không phải để thêm kiến thức mới.',
      ],
      remember: 'Thiếu kiến thức → RAG. Sai phong cách → fine-tune.',
    },
    {
      title: 'Phát triển agent',
      sub: 'Agent Service, tools, multi-agent',
      points: [
        'Agent = model + instructions + tools; hội thoại nằm trong thread, mỗi lần xử lý là một run.',
        'Tools: File Search, Code Interpreter, function calling, OpenAPI, MCP.',
        'Multi-agent: tách vai trò chuyên biệt, có agent điều phối.',
      ],
      remember: 'requires_action nghĩa là code của bạn phải chạy hàm và gửi kết quả lại.',
    },
    {
      title: 'Đánh giá & giám sát',
      sub: 'Evaluators, tracing',
      points: [
        'Evaluator chất lượng: groundedness, relevance, coherence, fluency.',
        'Tracing để xem từng bước run và tool call.',
        'Đánh giá trên tập dữ liệu cố định trước mỗi lần đổi prompt/model.',
      ],
      remember: 'Groundedness cần context; relevance cần query.',
    },
    {
      title: 'AI có trách nhiệm',
      sub: 'Content Safety, Prompt Shields',
      points: [
        'Content filter theo mức độ nghiêm trọng cho từng nhóm nội dung.',
        'Prompt Shields phát hiện jailbreak và tấn công gián tiếp qua tài liệu.',
        'Minh bạch với người dùng rằng họ đang nói chuyện với AI.',
      ],
      remember: 'Tấn công qua tài liệu truy xuất = indirect prompt injection.',
    },
  ],
  concepts: [
    { tag: 'AGENT SERVICE', term: 'Thread', def: 'Phiên hội thoại lưu toàn bộ tin nhắn giữa người dùng và agent; service tự quản lý độ dài ngữ cảnh.' },
    { tag: 'AGENT SERVICE', term: 'Run', def: 'Một lần agent xử lý thread: đọc instructions, gọi tool nếu cần, rồi thêm câu trả lời vào thread.' },
    { tag: 'RAG', term: 'Vector store', def: 'Kho chứa các đoạn tài liệu đã được embed để File Search truy xuất theo ngữ nghĩa.' },
    { tag: 'TOOLS', term: 'Function calling', def: 'Model trả về tên hàm + tham số JSON; ứng dụng của bạn thực thi hàm và gửi kết quả lại cho model.' },
    { tag: 'EVALUATION', term: 'Groundedness', def: 'Mức độ câu trả lời được hỗ trợ bởi ngữ cảnh truy xuất — chỉ số chính để phát hiện bịa đặt.' },
    { tag: 'SAFETY', term: 'Prompt Shields', def: 'Phát hiện jailbreak từ người dùng và chỉ dẫn độc hại cài trong tài liệu (indirect injection).' },
  ],
  code: {
    note: 'Minh hoạ bằng Python SDK — kiểm tra lại tên API theo phiên bản SDK bạn dùng.',
    samples: [
      {
        label: 'Tạo agent',
        lang: 'python',
        code: `from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

project = AIProjectClient(
    endpoint=PROJECT_ENDPOINT,
    credential=DefaultAzureCredential(),  # managed identity, không cần key
)

agent = project.agents.create_agent(
    model="gpt-4o-mini",
    name="refund-helper",
    instructions="Chỉ trả lời dựa trên tài liệu chính sách. Luôn trích dẫn.",
    tools=file_search.definitions,
    tool_resources=file_search.resources,
)`,
      },
      {
        label: 'Chạy hội thoại',
        lang: 'python',
        code: `thread = project.agents.threads.create()

project.agents.messages.create(
    thread_id=thread.id,
    role="user",
    content="Chính sách hoàn tiền cho đơn quá 30 ngày?",
)

run = project.agents.runs.create_and_process(
    thread_id=thread.id,
    agent_id=agent.id,
)
print(run.status)  # completed | failed`,
      },
      {
        label: 'Đánh giá',
        lang: 'python',
        code: `from azure.ai.evaluation import GroundednessEvaluator

groundedness = GroundednessEvaluator(model_config)

result = groundedness(
    query="Chính sách hoàn tiền cho đơn quá 30 ngày?",
    context=retrieved_chunks,
    response=answer,
)
print(result["groundedness"])  # thang điểm 1–5`,
      },
    ],
  },
  traps: [
    {
      title: 'File Search hay Azure AI Search?',
      body: 'File Search: tải file lên agent và dùng ngay. Azure AI Search: khi đã có index doanh nghiệp, cần hybrid/semantic ranking hoặc tự kiểm soát chunking.',
    },
    {
      title: 'Content filter ≠ Evaluation',
      body: 'Filter chặn nội dung nguy hại lúc chạy. Evaluation đo chất lượng câu trả lời. Đề hay đánh tráo hai khái niệm này.',
    },
    {
      title: 'Key hay managed identity?',
      body: 'Khi đề hỏi cách an toàn nhất để ứng dụng gọi dịch vụ, ưu tiên managed identity + RBAC, không lưu key trong code hay config.',
    },
  ],
  mindmap: [
    {
      title: 'Nền tảng & triển khai',
      hint: 'Foundry, kiểu triển khai, chi phí',
      leaves: ['Foundry project & tài nguyên', 'Standard vs Provisioned', 'Quota, chi phí, giám sát'],
      summary: 'Mọi giải pháp bắt đầu từ một Foundry project: nơi gom model, kết nối dữ liệu, agent và quyền truy cập.',
      points: [
        'Chọn model theo bài toán: chất lượng, độ trễ, chi phí.',
        'Standard trả theo token cho tải biến động; Provisioned cho tải ổn định, cần độ trễ dự đoán được.',
        'Theo dõi quota và chi phí qua Azure Monitor.',
      ],
      remember: 'Đề hỏi “tải ổn định, cần đảm bảo throughput” → Provisioned.',
    },
    {
      title: 'Prompt & Model',
      hint: 'System message, few-shot, fine-tune',
      leaves: ['System message rõ vai trò', 'Few-shot & định dạng đầu ra', 'Fine-tune khi cần đổi phong cách'],
      summary: 'Prompt tốt giải quyết phần lớn vấn đề trước khi nghĩ tới fine-tune.',
      points: [
        'System message nêu vai trò, giới hạn và định dạng đầu ra.',
        'Few-shot giúp model theo đúng mẫu trả lời.',
        'Fine-tune để đổi phong cách/định dạng, không để thêm kiến thức mới.',
      ],
      remember: 'Thiếu kiến thức → RAG. Sai phong cách → fine-tune.',
    },
    {
      title: 'An toàn & bảo mật',
      hint: 'Filter, Prompt Shields, danh tính',
      leaves: ['Content filter theo mức độ', 'Prompt Shields chống injection', 'Managed identity + RBAC'],
      summary: 'Hai lớp: chặn nội dung nguy hại lúc chạy, và không để lộ thông tin xác thực.',
      points: [
        'Content filter chấm mức độ nghiêm trọng cho từng nhóm nội dung.',
        'Prompt Shields phát hiện jailbreak và chỉ dẫn độc hại cài trong tài liệu.',
        'Managed identity + RBAC thay cho API key trong code.',
      ],
      remember: 'Tấn công qua tài liệu truy xuất = indirect prompt injection.',
    },
    {
      title: 'Agent Service',
      hint: 'Thread, run, tools',
      leaves: ['Thread · Run · Message', 'File Search · Code Interpreter', 'Function calling · OpenAPI · MCP'],
      summary: 'Agent = model + instructions + tools. Service lo phần lưu hội thoại và điều phối gọi tool.',
      points: [
        'Thread lưu hội thoại; mỗi lần agent xử lý là một run.',
        'Tool có sẵn: File Search, Code Interpreter.',
        'Tool tự viết: function calling, OpenAPI, MCP — run dừng ở requires_action chờ kết quả.',
      ],
      remember: 'requires_action = code của bạn phải chạy hàm và gửi kết quả lại.',
    },
    {
      title: 'RAG & Grounding',
      hint: 'Truy xuất, trích dẫn',
      leaves: ['Chunk → Embed → Index', 'Azure AI Search: hybrid + semantic', 'Trả lời kèm trích dẫn nguồn'],
      summary: 'Đưa dữ liệu riêng vào câu trả lời mà không cần huấn luyện lại model.',
      points: [
        'Pipeline: chunk → embed → index → truy xuất → grounding.',
        'Azure AI Search khi cần hybrid search, semantic ranking, index sẵn có.',
        'Luôn trả lời kèm trích dẫn để người dùng kiểm chứng.',
      ],
      remember: 'File Search để làm nhanh; Azure AI Search khi cần kiểm soát.',
    },
    {
      title: 'Đánh giá & giám sát',
      hint: 'Evaluators, tracing',
      leaves: ['Groundedness · Relevance', 'Tracing từng run step', 'Bộ test cố định trước khi đổi'],
      summary: 'Đo trước khi tin: chấm chất lượng trên bộ test và theo dõi từng bước khi chạy thật.',
      points: [
        'Evaluator: groundedness, relevance, coherence, fluency.',
        'Tracing cho thấy từng run step và tool call.',
        'Giữ một bộ test cố định để so sánh mỗi lần đổi prompt/model.',
      ],
      remember: 'Groundedness cần context; relevance cần query.',
    },
  ],
  flashcards: [
    { q: 'Thread và Run khác nhau thế nào?', a: 'Thread lưu lịch sử hội thoại. Run là một lần agent xử lý thread đó — có thể gọi tool rồi thêm câu trả lời.' },
    { q: 'Groundedness đo điều gì?', a: 'Câu trả lời có được hỗ trợ bởi ngữ cảnh truy xuất hay không — dùng để phát hiện bịa đặt.' },
    { q: 'Trạng thái requires_action nghĩa là gì?', a: 'Run đang chờ ứng dụng thực thi function mà model đã gọi và gửi kết quả (tool outputs) lại.' },
    { q: 'Khi nào chọn Azure AI Search thay vì File Search?', a: 'Khi đã có index doanh nghiệp, cần hybrid/semantic ranking, hoặc muốn tự kiểm soát chunking và cập nhật dữ liệu.' },
  ],
  quiz: [
    {
      q: 'Agent cần trả lời dựa trên ~200 file PDF nội bộ, có trích dẫn nguồn, triển khai nhanh nhất. Chọn tool nào?',
      opts: ['Code Interpreter', 'File Search', 'Function calling tới API tự viết', 'Fine-tune model trên các PDF'],
      ans: 1,
      why: 'File Search tự chunk, embed và truy xuất tài liệu tải lên, trả lời kèm trích dẫn. Fine-tune không dùng để thêm kiến thức.',
    },
    {
      q: 'Bạn muốn phát hiện chỉ dẫn độc hại được cài trong tài liệu mà agent truy xuất. Dùng gì?',
      opts: ['Groundedness evaluator', 'Prompt Shields', 'Rate limiting', 'Fine-tuning'],
      ans: 1,
      why: 'Prompt Shields phát hiện cả jailbreak trực tiếp và tấn công gián tiếp qua tài liệu (indirect prompt injection).',
    },
  ],
  blueprint: {
    caption: 'Kiến trúc một ứng dụng agent trên Azure',
    nodes: [
      { id: 'user', label: 'Người dùng', sub: 'Đặt câu hỏi', icon: 'user', x: 95, y: 220, what: 'Gửi câu hỏi qua giao diện chat của ứng dụng.', tip: 'Minh bạch: cho người dùng biết họ đang nói chuyện với AI.' },
      { id: 'app', label: 'Ứng dụng', sub: 'SDK azure-ai-projects', icon: 'code', x: 345, y: 220, what: 'Code của bạn: tạo thread, thêm tin nhắn, khởi chạy run và chạy các hàm khi agent yêu cầu.', tip: 'Xác thực bằng managed identity + RBAC — không để API key trong code.' },
      { id: 'agent', label: 'Agent Service', sub: 'Thread · Run', icon: 'brain', x: 600, y: 220, what: 'Agent = model + instructions + tools. Thread lưu hội thoại, mỗi lần xử lý là một run.', tip: 'Run ở trạng thái requires_action → ứng dụng phải chạy hàm và gửi kết quả lại.' },
      { id: 'model', label: 'Model', sub: 'Azure OpenAI', icon: 'sparkle', x: 600, y: 70, what: 'Đọc instructions + lịch sử, quyết định trả lời luôn hay gọi tool trước.', tip: 'Tải ổn định, cần throughput đảm bảo → Provisioned; tải biến động → Standard.' },
      { id: 'tools', label: 'Tools', sub: 'Agent tự chọn dùng', icon: 'tool', x: 855, y: 220, what: 'Có sẵn: File Search, Code Interpreter. Tự viết: function calling, OpenAPI, MCP.', tip: 'Có OpenAPI spec sẵn → OpenAPI tool; không có → function calling.' },
      { id: 'search', label: 'File Search', sub: 'Vector store', icon: 'search', x: 1100, y: 110, what: 'Tự chunk, embed và truy xuất tài liệu tải lên; trả lời kèm trích dẫn.', tip: 'Cần index doanh nghiệp, hybrid + semantic ranking → Azure AI Search.' },
      { id: 'func', label: 'Hàm của bạn', sub: 'Function calling', icon: 'database', x: 1100, y: 330, what: 'Model trả về tên hàm + tham số JSON; ứng dụng của bạn thực thi rồi gửi kết quả lại.', tip: 'Model không tự chạy hàm — code của bạn chạy.' },
      { id: 'safety', label: 'Content Safety', sub: 'Filter · Prompt Shields', icon: 'shield', x: 345, y: 70, kind: 'side', what: 'Lọc nội dung nguy hại ở đầu vào/đầu ra; Prompt Shields chặn jailbreak và chỉ dẫn độc hại giấu trong tài liệu.', tip: 'Tấn công qua tài liệu truy xuất = indirect prompt injection → Prompt Shields.' },
      { id: 'eval', label: 'Evaluation', sub: 'Evaluators · Tracing', icon: 'chart', x: 600, y: 380, kind: 'side', what: 'Chấm chất lượng trên bộ test cố định (groundedness, relevance…) và xem từng bước run qua tracing.', tip: 'Groundedness cần context; relevance cần query.' },
    ],
    edges: [
      ['user', 'app', 'hỏi'],
      ['app', 'agent', 'thread + run'],
      ['agent', 'model', 'suy luận'],
      ['agent', 'tools', 'gọi tool'],
      ['tools', 'search', 'truy xuất'],
      ['tools', 'func', 'requires_action'],
      ['safety', 'app', '', true],
      ['eval', 'agent', '', true],
    ],
  },
  decide: {
    title: 'Mình nên dùng gì?',
    start: 'start',
    nodes: {
      start: {
        q: 'Vấn đề bạn đang gặp là gì?',
        opts: [
          ['Model không biết dữ liệu riêng của công ty', 'data'],
          ['Model trả lời sai giọng văn / sai định dạng', 'style'],
          ['Agent cần thao tác với hệ thống khác', 'action'],
          ['Cần tính toán, vẽ biểu đồ từ file dữ liệu', 'ci'],
          ['Lo bị jailbreak hoặc nội dung độc hại', 'safe'],
          ['Muốn biết câu trả lời có bịa không', 'eval'],
        ],
      },
      data: {
        q: 'Bạn đã có index tìm kiếm doanh nghiệp, hoặc cần hybrid + semantic ranking?',
        opts: [
          ['Có / cần kiểm soát chunking', 'ais'],
          ['Không, chỉ cần tải vài trăm file lên và dùng ngay', 'fs'],
        ],
      },
      style: {
        q: 'Đã thử system message rõ ràng + vài ví dụ (few-shot) chưa?',
        opts: [
          ['Chưa', 'prompt'],
          ['Rồi, vẫn sai', 'ft'],
        ],
      },
      action: {
        q: 'Hệ thống kia đã có OpenAPI spec chưa?',
        opts: [
          ['Có sẵn OpenAPI spec', 'openapi'],
          ['Chưa có, mình tự viết hàm', 'fc'],
        ],
      },
      ais: { answer: 'Azure AI Search', why: 'Kết nối index sẵn có, hỗ trợ hybrid search và semantic ranking, tự kiểm soát cách chunk và cập nhật dữ liệu.', remember: 'Kiểm soát → AI Search. Nhanh → File Search.' },
      fs: { answer: 'File Search', why: 'Tải file lên agent, service tự chunk, embed, lưu vào vector store và trả lời kèm trích dẫn. Không cần huấn luyện lại model.', remember: 'Thiếu kiến thức → RAG, không phải fine-tune.' },
      prompt: { answer: 'System message + few-shot', why: 'Nêu rõ vai trò, giới hạn, định dạng đầu ra và cho 2–3 ví dụ mẫu. Rẻ và nhanh hơn fine-tune rất nhiều.', remember: 'Luôn thử prompt trước khi nghĩ tới fine-tune.' },
      ft: { answer: 'Fine-tuning', why: 'Huấn luyện thêm để model theo đúng phong cách/định dạng mong muốn một cách ổn định.', remember: 'Fine-tune đổi phong cách, không dùng để nạp kiến thức mới.' },
      openapi: { answer: 'OpenAPI tool', why: 'Agent đọc spec và tự gọi API theo đúng định nghĩa, không cần viết code xử lý từng hàm.', remember: 'Có spec → OpenAPI. Không có → function calling.' },
      fc: { answer: 'Function calling', why: 'Khai báo hàm cho agent; model trả về tên hàm + tham số JSON, run dừng ở requires_action để code của bạn chạy hàm và gửi kết quả lại.', remember: 'requires_action = đến lượt code của bạn.' },
      ci: { answer: 'Code Interpreter', why: 'Agent viết và chạy Python trong sandbox để tính toán, phân tích file CSV/Excel, vẽ biểu đồ.', remember: 'Cần “chạy code thật” → Code Interpreter.' },
      safe: { answer: 'Content filter + Prompt Shields', why: 'Content filter chặn nội dung nguy hại theo mức độ; Prompt Shields phát hiện jailbreak và chỉ dẫn độc hại cài trong tài liệu.', remember: 'Tấn công qua tài liệu = indirect prompt injection.' },
      eval: { answer: 'Groundedness evaluator', why: 'Đo câu trả lời có được hỗ trợ bởi ngữ cảnh truy xuất hay không — chỉ số chính để phát hiện bịa đặt.', remember: 'Groundedness cần context; relevance cần query.' },
    },
  },
  compare: [
    {
      a: 'File Search',
      b: 'Azure AI Search',
      rows: [
        ['Thiết lập', 'Tải file lên agent, dùng ngay', 'Tự tạo index, cấu hình kết nối'],
        ['Chunking', 'Tự động', 'Tự kiểm soát'],
        ['Kiểu tìm kiếm', 'Vector', 'Hybrid + semantic ranking'],
        ['Hợp khi', 'Vài trăm file, cần nhanh', 'Đã có index doanh nghiệp, cần chất lượng xếp hạng'],
      ],
      rule: 'Nhanh → File Search. Kiểm soát → Azure AI Search.',
    },
    {
      a: 'RAG',
      b: 'Fine-tuning',
      rows: [
        ['Giải quyết', 'Model thiếu kiến thức', 'Sai phong cách, sai định dạng'],
        ['Cập nhật dữ liệu', 'Thêm tài liệu là xong', 'Phải huấn luyện lại'],
        ['Trích dẫn nguồn', 'Có', 'Không'],
        ['Chi phí', 'Thấp', 'Cao hơn'],
      ],
      rule: 'Thiếu kiến thức → RAG. Sai phong cách → fine-tune.',
    },
    {
      a: 'Content filter',
      b: 'Evaluation',
      rows: [
        ['Chạy khi nào', 'Mỗi request, lúc chạy thật', 'Trên bộ test, trước khi phát hành'],
        ['Mục đích', 'Chặn nội dung nguy hại', 'Đo chất lượng câu trả lời'],
        ['Kết quả', 'Chặn hoặc cho qua', 'Điểm số (groundedness, relevance…)'],
      ],
      rule: 'Filter = bảo vệ. Evaluation = đo lường.',
    },
    {
      a: 'Standard',
      b: 'Provisioned',
      rows: [
        ['Tính tiền', 'Theo token dùng thực tế', 'Theo throughput đặt trước'],
        ['Hợp với tải', 'Biến động, khó đoán', 'Ổn định, lớn'],
        ['Độ trễ', 'Có thể dao động', 'Dự đoán được'],
      ],
      rule: '“Tải ổn định, cần đảm bảo throughput” → Provisioned.',
    },
  ],
  resources: [
    { label: 'Tìm chứng chỉ trên Microsoft Learn', url: 'https://learn.microsoft.com/credentials/browse/?terms=Azure%20AI%20Apps%20and%20Agents' },
    { label: 'Tài liệu Microsoft Foundry', url: 'https://learn.microsoft.com/azure/ai-foundry/' },
  ],
};
