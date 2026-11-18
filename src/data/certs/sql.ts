import type { Cert } from '../types';

export const sql: Cert = {
  id: 'sql',
  mono: 'SQL',
  title: 'SQL AI Developer Associate',
  short: 'SQL AI Developer',
  issuer: 'Microsoft',
  level: 'Associate',
  earned: '2026-09-04',
  expires: '2027-09-05',
  theme: { color: '#0E9384', tint: '#E6F6F4', ink: '#0B6B61' },
  tagline:
    'Đưa AI vào ngay trong database: lưu embedding, tìm kiếm vector bằng T-SQL, gọi model từ SQL và dựng RAG trên dữ liệu quan hệ.',
  tags: ['Vector search', 'T-SQL + AI', 'RAG trên SQL'],
  overview: {
    proves:
      'Bạn xây được tính năng AI dựa trên dữ liệu SQL — từ embedding, vector search tới RAG — mà vẫn giữ bảo mật và hiệu năng của database.',
    tools: 'SQL Server 2025 / Azure SQL Database, kiểu VECTOR, VECTOR_DISTANCE, external model, sp_invoke_external_rest_endpoint, Azure OpenAI.',
    when: 'Khi cần semantic search trên dữ liệu sản phẩm/ticket, hoặc chatbot trả lời dựa trên bảng SQL.',
  },
  demo: {
    title: 'RAG ngay trong database',
    trace: 'sql · session',
    steps: [
      {
        label: 'Câu hỏi',
        icon: 'user',
        title: 'Người dùng hỏi',
        body: 'Ứng dụng nhận câu hỏi “Áo khoác nào chống nước, dưới 1 triệu?” và chuyển xuống database.',
        tip: 'Điều kiện có cấu trúc (giá) lọc bằng WHERE; phần ngữ nghĩa để vector lo.',
        log: ['request', '#A78BFA', 'question received'],
      },
      {
        label: 'Sinh embedding',
        icon: 'sparkle',
        title: 'Biến câu hỏi thành vector',
        body: 'Gọi AI_GENERATE_EMBEDDINGS với external model đã đăng ký để có vector của câu hỏi.',
        tip: 'Câu hỏi và dữ liệu phải dùng cùng một embedding model.',
        log: ['embed', '#60A5FA', 'VECTOR(1536)'],
      },
      {
        label: 'Tìm vector',
        icon: 'database',
        title: 'Tìm các dòng gần nhất',
        body: "Sắp xếp theo VECTOR_DISTANCE('cosine', …) kết hợp WHERE Price < 1000000, lấy TOP 5.",
        tip: 'Bảng lớn → cân nhắc vector index (ANN) thay vì quét toàn bảng.',
        log: ['query', '#FBBF24', 'TOP 5 · cosine'],
      },
      {
        label: 'Ghép prompt',
        icon: 'doc',
        title: 'Đưa kết quả vào prompt',
        body: 'Các dòng tìm được được chuyển thành JSON và ghép vào prompt cùng câu hỏi gốc.',
        tip: 'Chỉ đưa cột cần thiết — tiết kiệm token và tránh lộ dữ liệu.',
        log: ['prompt', '#F472B6', '5 rows as JSON'],
      },
      {
        label: 'Gọi chat model',
        icon: 'brain',
        title: 'Trả lời có căn cứ',
        body: 'Gọi chat completion qua sp_invoke_external_rest_endpoint (hoặc từ tầng ứng dụng) để trả lời dựa trên dữ liệu thật.',
        tip: 'Xác thực bằng managed identity qua database scoped credential.',
        log: ['answer', '#34D399', 'grounded on 5 products'],
      },
    ],
  },
  domains: [
    {
      title: 'Dữ liệu vector trong SQL',
      sub: 'Kiểu VECTOR, lưu & so sánh',
      points: [
        'Kiểu VECTOR(n) lưu embedding với số chiều cố định.',
        'VECTOR_DISTANCE hỗ trợ cosine, euclidean và dot.',
        'Chunk văn bản dài trước khi embed.',
      ],
      remember: 'Số chiều của cột phải khớp với embedding model.',
    },
    {
      title: 'Gọi model từ database',
      sub: 'External model, REST endpoint',
      points: [
        'CREATE EXTERNAL MODEL đăng ký endpoint embedding.',
        'AI_GENERATE_EMBEDDINGS sinh vector ngay trong T-SQL.',
        'sp_invoke_external_rest_endpoint gọi API bên ngoài như chat completion.',
      ],
      remember: 'Thông tin xác thực lưu bằng database scoped credential, không hard-code key.',
    },
    {
      title: 'Tìm kiếm & RAG',
      sub: 'Vector search, hybrid, prompt',
      points: [
        'Exact search: ORDER BY VECTOR_DISTANCE kèm TOP k.',
        'Approximate search với vector index cho bảng lớn.',
        'Hybrid: kết hợp full-text hoặc WHERE với điểm vector.',
      ],
      remember: 'Lọc cứng bằng WHERE, xếp hạng ngữ nghĩa bằng vector.',
    },
    {
      title: 'Bảo mật & hiệu năng',
      sub: 'Danh tính, quyền, chi phí',
      points: [
        'Managed identity để database gọi Azure OpenAI.',
        'Row-level security vẫn áp dụng khi truy xuất cho RAG.',
        'Lưu sẵn embedding, chỉ sinh lại khi dữ liệu thay đổi.',
      ],
      remember: 'RAG không được vượt quyền truy cập của người dùng.',
    },
    {
      title: 'Công cụ cho developer',
      sub: 'JSON, API, Copilot',
      points: [
        'FOR JSON là cầu nối giữa kết quả SQL và prompt.',
        'Data API builder có thể expose bảng qua REST/GraphQL.',
        'Copilot trong công cụ SQL hỗ trợ viết và giải thích truy vấn.',
      ],
      remember: 'FOR JSON biến kết quả truy vấn thành ngữ cảnh cho prompt.',
    },
  ],
  concepts: [
    { tag: 'VECTOR', term: 'VECTOR(n)', def: 'Kiểu dữ liệu lưu mảng số thực n chiều — dùng cho embedding.' },
    { tag: 'VECTOR', term: 'VECTOR_DISTANCE', def: 'Hàm tính khoảng cách giữa hai vector theo cosine, euclidean hoặc dot. Càng nhỏ càng giống.' },
    { tag: 'MODEL', term: 'External model', def: 'Đối tượng database trỏ tới endpoint AI (ví dụ embedding) để gọi trực tiếp từ T-SQL.' },
    { tag: 'RAG', term: 'Chunking', def: 'Chia văn bản dài thành đoạn nhỏ trước khi embed để tìm kiếm chính xác hơn.' },
    { tag: 'TÌM KIẾM', term: 'ANN index', def: 'Vector index tìm gần đúng — nhanh hơn nhiều trên bảng lớn, đổi lại có thể bỏ sót một ít kết quả.' },
    { tag: 'BẢO MẬT', term: 'Scoped credential', def: 'Thông tin xác thực gắn với database, dùng khi gọi endpoint bên ngoài.' },
  ],
  code: {
    note: 'Minh hoạ T-SQL trên SQL Server 2025 / Azure SQL — kiểm tra lại cú pháp theo phiên bản bạn dùng.',
    samples: [
      {
        label: 'Bảng vector',
        lang: 'sql',
        code: `CREATE TABLE dbo.Products (
    Id          INT IDENTITY PRIMARY KEY,
    Name        NVARCHAR(200),
    Description NVARCHAR(MAX),
    Price       DECIMAL(12, 0),
    Embedding   VECTOR(1536)   -- khớp số chiều của model
);`,
      },
      {
        label: 'Sinh embedding',
        lang: 'sql',
        code: `CREATE EXTERNAL MODEL EmbeddingModel
WITH (
    LOCATION   = 'https://<resource>.openai.azure.com/openai/deployments/text-embedding-3-small/embeddings?api-version=2024-02-01',
    API_FORMAT = 'Azure OpenAI',
    MODEL_TYPE = EMBEDDINGS,
    MODEL      = 'text-embedding-3-small',
    CREDENTIAL = [https://<resource>.openai.azure.com/]
);

UPDATE dbo.Products
SET Embedding = AI_GENERATE_EMBEDDINGS(Description USE MODEL EmbeddingModel);`,
      },
      {
        label: 'Tìm kiếm',
        lang: 'sql',
        code: `DECLARE @q VECTOR(1536) =
    AI_GENERATE_EMBEDDINGS(N'áo khoác chống nước' USE MODEL EmbeddingModel);

SELECT TOP 5 Name, Price,
       VECTOR_DISTANCE('cosine', Embedding, @q) AS Distance
FROM dbo.Products
WHERE Price < 1000000
ORDER BY Distance;   -- càng nhỏ càng giống`,
      },
    ],
  },
  traps: [
    {
      title: 'Khác model, khác không gian vector',
      body: 'Embedding của câu hỏi và của dữ liệu phải sinh từ cùng một model, nếu không khoảng cách giữa chúng là vô nghĩa.',
    },
    {
      title: 'Khoảng cách nhỏ mới là gần',
      body: 'VECTOR_DISTANCE trả về khoảng cách, không phải độ tương đồng — sắp xếp tăng dần để lấy kết quả giống nhất.',
    },
    {
      title: 'Full-text không phải vector search',
      body: 'CONTAINS/FREETEXT tìm theo từ khoá. Câu hỏi về “ý nghĩa tương tự” cần embedding và VECTOR_DISTANCE.',
    },
  ],
  mindmap: [
    {
      title: 'Vector trong SQL',
      hint: 'Kiểu dữ liệu, phép đo',
      leaves: ['Kiểu VECTOR(n)', 'Cosine · Euclidean · Dot', 'Chunk trước khi embed'],
      summary: 'Embedding được lưu như một cột bình thường, nằm ngay cạnh dữ liệu nghiệp vụ.',
      points: ['VECTOR(n) với n khớp model.', 'Chọn phép đo phù hợp — cosine phổ biến nhất cho văn bản.', 'Chunk văn bản dài để vector đại diện tốt hơn.'],
      remember: 'Số chiều sai → không insert được.',
    },
    {
      title: 'Gọi model',
      hint: 'External model, REST',
      leaves: ['CREATE EXTERNAL MODEL', 'AI_GENERATE_EMBEDDINGS', 'Gọi REST endpoint từ T-SQL'],
      summary: 'Database tự gọi AI, không cần thêm tầng ứng dụng cho bước embedding.',
      points: ['Đăng ký endpoint bằng external model.', 'Sinh embedding trong UPDATE/SELECT.', 'Gọi REST cho các tác vụ khác như chat completion.'],
      remember: 'Embedding trong T-SQL → AI_GENERATE_EMBEDDINGS.',
    },
    {
      title: 'Bảo mật',
      hint: 'Danh tính, quyền dữ liệu',
      leaves: ['Managed identity', 'Database scoped credential', 'Row-level security'],
      summary: 'AI không được trở thành lối tắt vượt qua phân quyền dữ liệu.',
      points: ['Managed identity thay key.', 'Credential gắn với database.', 'RLS vẫn lọc dữ liệu đưa vào prompt.'],
      remember: 'Không bao giờ lưu key trong stored procedure.',
    },
    {
      title: 'Tìm kiếm',
      hint: 'Exact, ANN, hybrid',
      leaves: ['Exact: TOP k + ORDER BY', 'ANN vector index', 'Hybrid với WHERE / full-text'],
      summary: 'Kết hợp lọc có cấu trúc và xếp hạng ngữ nghĩa.',
      points: ['Bảng nhỏ: exact search là đủ.', 'Bảng lớn: vector index tìm gần đúng.', 'Hybrid cho kết quả vừa đúng điều kiện vừa đúng ý.'],
      remember: 'ORDER BY khoảng cách tăng dần.',
    },
    {
      title: 'RAG trên SQL',
      hint: 'JSON, prompt, câu trả lời',
      leaves: ['Kết quả → JSON', 'Ghép prompt', 'Trả lời có căn cứ'],
      summary: 'Dữ liệu quan hệ trở thành ngữ cảnh cho LLM.',
      points: ['FOR JSON chuyển kết quả thành ngữ cảnh.', 'Prompt gồm câu hỏi + dữ liệu + chỉ dẫn.', 'Câu trả lời dẫn lại sản phẩm/ID cụ thể.'],
      remember: 'Chỉ đưa cột cần thiết vào prompt.',
    },
    {
      title: 'Hiệu năng',
      hint: 'Chi phí, độ trễ',
      leaves: ['Lưu sẵn embedding', 'Chỉ embed khi dữ liệu đổi', 'Chọn cột cần thiết'],
      summary: 'Gọi model tốn tiền và thời gian — chỉ gọi khi thật cần.',
      points: ['Embed một lần, dùng nhiều lần.', 'Trigger/job embed lại khi mô tả thay đổi.', 'Giảm token bằng cách chọn cột gọn.'],
      remember: 'Không sinh embedding cho dữ liệu trong mỗi lần truy vấn.',
    },
  ],
  flashcards: [
    { q: 'Lưu embedding trong SQL bằng kiểu dữ liệu nào?', a: "Kiểu VECTOR(n); so khoảng cách bằng VECTOR_DISTANCE('cosine', a, b)." },
    { q: 'VECTOR_DISTANCE trả về độ tương đồng hay khoảng cách?', a: 'Khoảng cách — giá trị càng nhỏ càng giống, nên ORDER BY tăng dần.' },
    { q: 'Vì sao phải dùng cùng embedding model cho câu hỏi và dữ liệu?', a: 'Mỗi model tạo một không gian vector riêng; so khoảng cách giữa hai không gian khác nhau là vô nghĩa.' },
    { q: 'Khi nào dùng vector index thay vì quét toàn bảng?', a: 'Khi bảng lớn và cần độ trễ thấp, chấp nhận kết quả gần đúng (ANN).' },
  ],
  quiz: [
    {
      q: 'Bảng Products có cột Embedding. Bạn cần 5 sản phẩm gần nhất với vector truy vấn @q. Dùng gì?',
      opts: ['CONTAINS(Embedding, @q)', "TOP 5 … ORDER BY VECTOR_DISTANCE('cosine', Embedding, @q)", 'SOUNDEX(Embedding)', 'FREETEXT(Embedding, @q)'],
      ans: 1,
      why: 'VECTOR_DISTANCE trả khoảng cách; sắp xếp tăng dần và lấy TOP 5. CONTAINS/FREETEXT là full-text search, không dùng cho vector.',
    },
    {
      q: 'Database cần gọi Azure OpenAI mà không lưu key trong T-SQL. Cách nào phù hợp?',
      opts: ['Ghi key vào stored procedure', 'Managed identity + database scoped credential', 'Lưu key trong bảng Config', 'Truyền key qua tham số từ ứng dụng'],
      ans: 1,
      why: 'Managed identity kết hợp database scoped credential cho phép xác thực mà không lưu secret trong code hay dữ liệu.',
    },
  ],
  resources: [
    { label: 'Tìm chứng chỉ trên Microsoft Learn', url: 'https://learn.microsoft.com/credentials/browse/?terms=SQL%20AI%20Developer' },
    { label: 'Vector search trong SQL', url: 'https://learn.microsoft.com/sql/relational-databases/vectors/vectors-sql-server' },
  ],
};
