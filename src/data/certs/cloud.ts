import type { Cert } from '../types';

export const cloud: Cert = {
  id: 'cloud',
  mono: 'AI',
  title: 'Azure AI Cloud Developer Associate',
  short: 'Azure AI Cloud Developer',
  issuer: 'Microsoft',
  level: 'Associate',
  earned: '2026-09-26',
  expires: '2027-09-27',
  theme: { color: '#2563EB', tint: '#EAF1FF', ink: '#1D4ED8' },
  tagline:
    'Xây và vận hành giải pháp AI trên Azure: chọn đúng dịch vụ (vision, language, speech, document), triển khai model, bảo mật và giám sát.',
  tags: ['Azure OpenAI', 'AI Services', 'Bảo mật & triển khai'],
  overview: {
    proves:
      'Bạn chọn được dịch vụ AI phù hợp cho từng bài toán và đưa nó lên Azure một cách an toàn, có giám sát và kiểm soát chi phí.',
    tools: 'Azure OpenAI, Azure AI Vision, Language, Speech, Document Intelligence, Azure AI Search, Key Vault, Azure Monitor.',
    when: 'Khi cần OCR hoá đơn, phân tích cảm xúc, chuyển giọng nói thành văn bản, hoặc đưa model GPT vào ứng dụng doanh nghiệp.',
  },
  demo: {
    title: 'Pipeline xử lý hoá đơn tự động',
    trace: 'pipeline · invoices',
    steps: [
      {
        label: 'Tải hoá đơn',
        icon: 'doc',
        title: 'File vào Blob Storage',
        body: 'Người dùng tải hoá đơn PDF lên; sự kiện Blob kích hoạt Azure Function xử lý.',
        tip: 'Tách lưu trữ và xử lý bằng sự kiện giúp hệ thống dễ mở rộng.',
        log: ['blob', '#A78BFA', 'invoice-0412.pdf uploaded'],
      },
      {
        label: 'Trích xuất',
        icon: 'search',
        title: 'Document Intelligence',
        body: 'Gọi model prebuilt-invoice để lấy nhà cung cấp, ngày, tổng tiền và từng dòng hàng — kèm độ tin cậy cho mỗi trường.',
        tip: 'Mẫu riêng không có model dựng sẵn → huấn luyện custom model.',
        log: ['analyze', '#60A5FA', 'prebuilt-invoice · fields extracted'],
      },
      {
        label: 'Che PII',
        icon: 'shield',
        title: 'Azure AI Language',
        body: 'Phát hiện và che thông tin cá nhân (số điện thoại, email) trước khi lưu hoặc đưa vào dịch vụ AI khác.',
        tip: 'Trường có độ tin cậy thấp → chuyển cho người duyệt.',
        log: ['pii', '#FBBF24', 'entities redacted'],
      },
      {
        label: 'Tóm tắt',
        icon: 'brain',
        title: 'Azure OpenAI',
        body: 'Model GPT tóm tắt và phân loại hoá đơn theo nhóm chi phí bằng structured output (JSON).',
        tip: 'Dùng JSON schema để đầu ra ổn định, dễ lưu vào database.',
        log: ['chat', '#F472B6', 'category=Thiết bị'],
      },
      {
        label: 'Giám sát',
        icon: 'chart',
        title: 'Theo dõi & cảnh báo',
        body: 'Log, metric và chi phí được đưa vào Azure Monitor; cảnh báo khi lỗi tăng hoặc sắp chạm quota.',
        tip: 'Bật diagnostic settings cho từng resource AI.',
        log: ['monitor', '#34D399', 'latency ok · cost tracked'],
      },
    ],
  },
  domains: [
    {
      title: 'Lập kế hoạch & quản lý',
      sub: 'Chọn dịch vụ, tài nguyên, chi phí',
      points: [
        'Chọn resource đơn dịch vụ hay đa dịch vụ.',
        'Chọn region theo model khả dụng và yêu cầu về dữ liệu.',
        'Theo dõi chi phí, quota và đặt cảnh báo.',
      ],
      remember: 'Đọc kỹ yêu cầu: bài toán đã có model dựng sẵn chưa?',
    },
    {
      title: 'Bảo mật',
      sub: 'Danh tính, key, mạng',
      points: [
        'Ưu tiên Microsoft Entra ID + managed identity thay vì key.',
        'Nếu phải dùng key: lưu trong Key Vault và xoay vòng định kỳ.',
        'Private endpoint và tắt public network access khi cần.',
      ],
      remember: 'Mỗi resource có 2 key để xoay vòng không gián đoạn.',
    },
    {
      title: 'Generative AI',
      sub: 'Azure OpenAI, prompt, RAG',
      points: [
        'Triển khai model và chọn kiểu deployment.',
        'Content filter mặc định, có thể tuỳ chỉnh mức độ.',
        'RAG với Azure AI Search để trả lời trên dữ liệu riêng.',
      ],
      remember: 'Thiếu kiến thức → RAG, không phải fine-tune.',
    },
    {
      title: 'Vision, Language, Speech',
      sub: 'Chọn đúng dịch vụ',
      points: [
        'Vision: phân tích ảnh, đọc chữ (OCR).',
        'Language: cảm xúc, thực thể, PII, hỏi đáp.',
        'Speech: speech-to-text, text-to-speech, dịch giọng nói.',
      ],
      remember: 'Đề mô tả bài toán — bạn ánh xạ sang dịch vụ.',
    },
    {
      title: 'Trích xuất tri thức',
      sub: 'Document Intelligence, AI Search',
      points: [
        'Prebuilt model cho hoá đơn, biên lai, giấy tờ tuỳ thân.',
        'Custom model khi biểu mẫu là mẫu riêng.',
        'AI Search với skillset để làm giàu dữ liệu khi index.',
      ],
      remember: 'Biểu mẫu có cấu trúc → Document Intelligence.',
    },
  ],
  concepts: [
    { tag: 'BẢO MẬT', term: 'Managed identity', def: 'Danh tính do Azure quản lý cho ứng dụng — xác thực tới dịch vụ khác mà không cần lưu secret.' },
    { tag: 'TRIỂN KHAI', term: 'Deployment', def: 'Một model cụ thể được triển khai trong resource Azure OpenAI; ứng dụng gọi theo tên deployment.' },
    { tag: 'GEN AI', term: 'Content filter', def: 'Bộ lọc nội dung chạy trên cả prompt và kết quả, theo mức độ nghiêm trọng.' },
    { tag: 'DOCUMENT', term: 'Prebuilt model', def: 'Model dựng sẵn cho loại tài liệu phổ biến như hoá đơn, biên lai — không cần huấn luyện.' },
    { tag: 'SEARCH', term: 'Skillset', def: 'Chuỗi bước AI (OCR, trích thực thể, embedding) chạy khi indexer nạp dữ liệu.' },
    { tag: 'VẬN HÀNH', term: 'Container', def: 'Một số dịch vụ AI chạy được trong container để đáp ứng yêu cầu xử lý dữ liệu tại chỗ.' },
  ],
  code: {
    note: 'Minh hoạ bằng Python SDK — kiểm tra lại tên API theo phiên bản SDK bạn dùng.',
    samples: [
      {
        label: 'Azure OpenAI + Entra ID',
        lang: 'python',
        code: `from openai import AzureOpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

token_provider = get_bearer_token_provider(
    DefaultAzureCredential(),
    "https://cognitiveservices.azure.com/.default",
)

client = AzureOpenAI(
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    azure_ad_token_provider=token_provider,  # không cần API key
    api_version="2024-10-21",
)

resp = client.chat.completions.create(
    model="gpt-4o-mini",  # tên deployment
    messages=[{"role": "user", "content": "Tóm tắt hoá đơn này"}],
)`,
      },
      {
        label: 'Document Intelligence',
        lang: 'python',
        code: `from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.identity import DefaultAzureCredential

client = DocumentIntelligenceClient(ENDPOINT, DefaultAzureCredential())

with open("invoice.pdf", "rb") as f:
    poller = client.begin_analyze_document("prebuilt-invoice", body=f)

for doc in poller.result().documents:
    total = doc.fields.get("InvoiceTotal")
    print(total.content, total.confidence)  # kèm độ tin cậy`,
      },
      {
        label: 'Language · PII',
        lang: 'python',
        code: `from azure.ai.textanalytics import TextAnalyticsClient
from azure.identity import DefaultAzureCredential

client = TextAnalyticsClient(ENDPOINT, DefaultAzureCredential())

docs = ["Call Lan at 555-0100 or lan@example.com"]
result = client.recognize_pii_entities(docs)

print(result[0].redacted_text)  # số điện thoại, email đã được che`,
      },
    ],
  },
  traps: [
    {
      title: 'Key hay managed identity?',
      body: 'Khi đề hỏi cách an toàn nhất để ứng dụng gọi dịch vụ, ưu tiên managed identity + RBAC, không lưu key trong code hay config.',
    },
    {
      title: 'Đúng dịch vụ cho đúng bài toán',
      body: 'Biểu mẫu có cấu trúc → Document Intelligence; ảnh tự do → Vision; văn bản → Language. Đề hay đặt các dịch vụ gần giống nhau cạnh nhau.',
    },
    {
      title: 'Xoay vòng key không gián đoạn',
      body: 'Chuyển ứng dụng sang key 2, tạo lại key 1, rồi chuyển lại — mỗi resource có hai key chính là cho việc này.',
    },
  ],
  mindmap: [
    {
      title: 'Quản lý tài nguyên',
      hint: 'Resource, region, chi phí',
      leaves: ['Đơn dịch vụ vs đa dịch vụ', 'Region & quota', 'Chi phí & cảnh báo'],
      summary: 'Chọn đúng loại resource và nơi đặt nó trước khi viết dòng code nào.',
      points: ['Resource đa dịch vụ: một endpoint cho nhiều dịch vụ.', 'Region quyết định model nào dùng được.', 'Đặt budget và cảnh báo chi phí.'],
      remember: 'Model không có ở region đã chọn → đổi region hoặc deployment.',
    },
    {
      title: 'Bảo mật',
      hint: 'Danh tính, key, mạng',
      leaves: ['Entra ID + managed identity', 'Key Vault & xoay key', 'Private endpoint'],
      summary: 'Không secret trong code, không public khi không cần.',
      points: ['Managed identity + RBAC là lựa chọn mặc định.', 'Key (nếu có) nằm trong Key Vault.', 'Private endpoint cho truy cập nội bộ.'],
      remember: 'Hai key tồn tại để xoay vòng không gián đoạn.',
    },
    {
      title: 'Giám sát',
      hint: 'Log, metric, container',
      leaves: ['Diagnostic settings', 'Azure Monitor metric', 'Container khi cần tại chỗ'],
      summary: 'Biết hệ thống đang chạy ra sao và tốn bao nhiêu.',
      points: ['Diagnostic settings đẩy log về Log Analytics.', 'Metric: số lời gọi, độ trễ, lỗi.', 'Container cho yêu cầu dữ liệu không rời hạ tầng.'],
      remember: 'Không bật diagnostic settings thì không có log để điều tra.',
    },
    {
      title: 'Azure OpenAI',
      hint: 'Deployment, filter, output',
      leaves: ['Deployment & model', 'Content filter', 'Structured output'],
      summary: 'Đưa model GPT vào ứng dụng một cách kiểm soát được.',
      points: ['Gọi model qua tên deployment.', 'Content filter chạy trên prompt và kết quả.', 'Structured output (JSON schema) cho đầu ra ổn định.'],
      remember: 'Trường model trong API là tên deployment.',
    },
    {
      title: 'Dịch vụ AI chuyên biệt',
      hint: 'Vision, Language, Speech',
      leaves: ['Vision: ảnh & OCR', 'Language: cảm xúc, PII', 'Speech: STT · TTS'],
      summary: 'Bài toán quen thuộc đã có dịch vụ chuyên biệt — đừng tự làm lại.',
      points: ['Vision cho ảnh và chữ trong ảnh.', 'Language cho phân tích văn bản.', 'Speech cho giọng nói hai chiều.'],
      remember: 'Ánh xạ bài toán → dịch vụ là dạng câu hỏi rất hay gặp.',
    },
    {
      title: 'Trích xuất tri thức',
      hint: 'Document, Search',
      leaves: ['Document Intelligence', 'AI Search + skillset', 'Custom model cho mẫu riêng'],
      summary: 'Biến tài liệu thô thành dữ liệu có cấu trúc và tìm kiếm được.',
      points: ['Prebuilt model cho tài liệu phổ biến.', 'Skillset làm giàu dữ liệu khi index.', 'Custom model khi biểu mẫu riêng.'],
      remember: 'Biểu mẫu → Document Intelligence; tìm kiếm → AI Search.',
    },
  ],
  flashcards: [
    { q: 'Khi nào chọn Provisioned thay vì Standard?', a: 'Khi tải ổn định, cần độ trễ dự đoán được và dung lượng đảm bảo. Standard trả theo token, hợp tải biến động.' },
    { q: 'Managed identity giải quyết vấn đề gì?', a: 'Ứng dụng xác thực tới dịch vụ Azure mà không cần lưu key; quyền được cấp qua RBAC.' },
    { q: 'Xoay vòng key không gián đoạn thế nào?', a: 'Chuyển ứng dụng sang key thứ hai, tạo lại key thứ nhất, sau đó chuyển lại.' },
    { q: 'Hoá đơn PDF → lấy tổng tiền, ngày. Dịch vụ nào?', a: 'Document Intelligence với model prebuilt-invoice.' },
  ],
  quiz: [
    {
      q: 'Ứng dụng cần phát hiện số điện thoại, email trong ticket hỗ trợ và che đi trước khi lưu. Dùng gì?',
      opts: ['Azure AI Vision', 'Azure AI Language — PII detection', 'Azure AI Speech', 'Document Intelligence prebuilt-receipt'],
      ans: 1,
      why: 'PII detection của Azure AI Language nhận diện và che thông tin cá nhân trong văn bản.',
    },
    {
      q: 'Bạn cần đổi API key của resource AI mà ứng dụng không bị gián đoạn. Bước đầu tiên?',
      opts: ['Tạo lại key 1 ngay', 'Chuyển ứng dụng sang dùng key 2', 'Xoá resource và tạo mới', 'Tắt public network access'],
      ans: 1,
      why: 'Chuyển sang key 2 trước, sau đó mới tạo lại key 1 — ứng dụng không mất kết nối.',
    },
  ],
  resources: [
    { label: 'Tìm chứng chỉ trên Microsoft Learn', url: 'https://learn.microsoft.com/credentials/browse/?terms=Azure%20AI' },
    { label: 'Tài liệu Azure AI services', url: 'https://learn.microsoft.com/azure/ai-services/' },
  ],
};
