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
  resources: [
    { label: 'Tìm chứng chỉ trên Microsoft Learn', url: 'https://learn.microsoft.com/credentials/browse/?terms=Azure%20AI%20Apps%20and%20Agents' },
    { label: 'Tài liệu Microsoft Foundry', url: 'https://learn.microsoft.com/azure/ai-foundry/' },
  ],
};
