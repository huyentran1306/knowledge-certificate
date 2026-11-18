import type { Cert } from '../types';

/**
 * Claude Certified Architect – Foundations (Anthropic).
 * Tên domain và tỉ trọng theo các study guide cộng đồng (exam guide chính thức cần đăng nhập Anthropic Academy) —
 * đối chiếu lại với tài liệu chính thức tại https://clau.de/CCAF.
 */
export const ccaf: Cert = {
  id: 'ccaf',
  mono: 'CA',
  title: 'Claude Certified Architect – Foundations',
  short: 'Claude Architect (CCA-F)',
  issuer: 'Anthropic',
  level: 'Foundations',
  // TODO: thay bằng ngày đạt / hết hạn thật trên chứng chỉ của bạn.
  earned: '2026-11-18',
  expires: '2027-11-18',
  theme: { color: '#C2410C', tint: '#FFF1E8', ink: '#9A3412' },
  tagline:
    'Thiết kế hệ thống chạy bằng Claude cho production: agent loop, điều phối subagent, Claude Code cho team, tool & MCP, structured output và giữ hệ thống ổn định khi context dài.',
  tags: ['Agent loop', 'Claude Code', 'MCP'],
  overview: {
    proves:
      'Bạn chọn đúng kiến trúc cho bài toán với Claude: khi nào một lần gọi là đủ, khi nào cần agent hay subagent, quy tắc nào phải đặt trong code thay vì prompt, và cách giữ hệ thống đáng tin cậy.',
    tools: 'Claude API (Messages, tool use, Message Batches, prompt caching), Claude Agent SDK, Claude Code (CLAUDE.md, skills, hooks, subagents), MCP.',
    when: 'Khi thiết kế agent chăm sóc khách hàng, hệ thống research nhiều agent, trích xuất dữ liệu hàng loạt, hoặc chuẩn hoá Claude Code cho cả team và CI.',
  },
  demo: {
    title: 'Một vòng agent loop với Claude',
    trace: 'messages · agent_loop',
    steps: [
      {
        label: 'Gửi yêu cầu',
        icon: 'user',
        title: 'Messages + danh sách tools',
        body: 'Ứng dụng gửi lịch sử hội thoại kèm định nghĩa các tool (tên, mô tả, JSON schema đầu vào). Claude đọc yêu cầu “Hoàn tiền cho đơn #A1023” và quyết định cần tra cứu đơn trước.',
        tip: 'Mô tả tool là thứ Claude dùng để chọn tool — viết rõ khi nào dùng, khi nào không.',
        log: ['messages.create', '#FDBA74', 'tools=[get_order, refund, escalate]'],
      },
      {
        label: 'Claude gọi tool',
        icon: 'tool',
        title: 'stop_reason = "tool_use"',
        body: 'Claude không tự chạy gì cả. Nó trả về một khối tool_use (tên tool + tham số) và dừng với stop_reason = "tool_use", chờ ứng dụng thực thi.',
        tip: 'Vòng lặp chỉ dừng khi stop_reason khác "tool_use" (ví dụ end_turn).',
        log: ['response', '#60A5FA', 'stop_reason=tool_use · get_order(A1023)'],
      },
      {
        label: 'Code chạy tool',
        icon: 'code',
        title: 'Trả tool_result — kể cả khi lỗi',
        body: 'Code của bạn chạy get_order và gửi lại tool_result. Nếu lỗi, trả lỗi có cấu trúc (loại lỗi, có nên thử lại không) để Claude biết thử lại, đổi tham số hay báo người.',
        tip: 'Lỗi tạm thời (timeout) → isRetryable: true. Sai quyền / sai input → false.',
        log: ['tool_result', '#FBBF24', 'order: delivered 41 ngày trước'],
      },
      {
        label: 'Kiểm tra luật cứng',
        icon: 'shield',
        title: 'Chính sách đặt trong code, không chỉ trong prompt',
        body: 'Đơn quá 30 ngày không được hoàn tự động. Tool refund kiểm tra điều kiện này bằng code và từ chối; Claude chuyển sang tool escalate kèm bản tóm tắt có cấu trúc.',
        tip: 'Quy tắc phải luôn đúng → enforce bằng code (tool, hook, permission).',
        log: ['tool_result', '#F472B6', 'refund rejected · policy_window=30d'],
      },
      {
        label: 'Kết thúc',
        icon: 'check',
        title: 'stop_reason = "end_turn"',
        body: 'Claude trả lời khách: đơn đã quá hạn hoàn tiền tự động, yêu cầu đã chuyển cho nhân viên kèm mã ticket. Vòng lặp kết thúc.',
        tip: 'Ngoài chính sách hoặc không chắc chắn → escalate, đừng cố tự giải quyết.',
        log: ['response', '#34D399', 'stop_reason=end_turn · ticket=ESC-2291'],
      },
    ],
  },
  domains: [
    {
      title: 'Kiến trúc agent & điều phối',
      sub: '≈27% · agent loop, subagent, escalation',
      points: [
        'Agent loop: gọi Claude → nếu stop_reason = "tool_use" thì chạy tool, gửi tool_result, gọi tiếp; dừng khi end_turn.',
        'Coordinator chia việc cho subagent; mỗi subagent có context riêng, chỉ biết những gì được truyền vào.',
        'Biết khi nào escalate sang người: ngoài chính sách, thiếu dữ liệu, khách yêu cầu, rủi ro cao.',
      ],
      remember: 'Lỗi do cấu trúc → sửa bằng cấu trúc (tool, chốt chặn, subagent kiểm tra), không phải sửa prompt.',
    },
    {
      title: 'Claude Code: cấu hình & quy trình',
      sub: '≈20% · CLAUDE.md, skills, hooks, CI',
      points: [
        'CLAUDE.md theo tầng: tổ chức (managed), dự án (commit vào repo), cá nhân (~/.claude); thư mục con được nạp khi làm việc ở đó.',
        'Trong .claude/: slash commands, skills (SKILL.md), subagents, settings.json với permissions allow/deny và hooks.',
        'Plan mode để khảo sát và đề xuất kế hoạch trước khi sửa; CI dùng claude -p với --output-format json.',
      ],
      remember: 'Muốn cả team dùng chung → commit CLAUDE.md và .claude/ vào repo.',
    },
    {
      title: 'Prompt & structured output',
      sub: '≈20% · tiêu chí rõ, JSON schema, batch',
      points: [
        'Thay chỉ dẫn mơ hồ (“cẩn thận”) bằng tiêu chí cụ thể; dùng few-shot cho các ca dễ hiểu sai.',
        'Lấy JSON đúng schema: định nghĩa tool có input_schema và ép gọi bằng tool_choice; trường có thể thiếu thì cho phép null.',
        'Validate kết quả, sai thì gửi lại kèm thông báo lỗi và thử lại có giới hạn; việc không cần ngay → Message Batches API.',
      ],
      remember: 'Trường có thể không có trong nguồn → nullable, để Claude không phải bịa.',
    },
    {
      title: 'Thiết kế tool & MCP',
      sub: '≈18% · mô tả tool, lỗi có cấu trúc, MCP',
      points: [
        'Mô tả tool nói khi nào dùng, khi nào không, trả về gì — để Claude chọn đúng giữa các tool giống nhau.',
        'Tách tool chỉ đọc khỏi tool phá huỷ; tool phá huỷ đòi bước xác nhận.',
        'MCP chuẩn hoá cách nối Claude với hệ thống ngoài: tools (hành động), resources (dữ liệu), prompts (mẫu); khai báo dùng chung trong .mcp.json.',
      ],
      remember: 'Mô tả tool để định tuyến, không phải để kể chi tiết triển khai.',
    },
    {
      title: 'Context & độ tin cậy',
      sub: '≈15% · context dài, cache, retry',
      points: [
        'Context dùng hiệu quả nhỏ hơn cửa sổ quảng cáo; hội thoại dài dễ trôi mất sự thật quan trọng.',
        'Ghim sự thật quan trọng (system prompt, file scratchpad), tóm tắt có chủ đích, giao bớt cho subagent; dùng prompt caching cho phần lặp lại.',
        'Retry có giới hạn, timeout, phát hiện vòng lặp; trong multi-agent phải truyền lỗi lên chứ không nuốt lỗi.',
      ],
      remember: 'Context dài không đồng nghĩa nhớ tốt — ghim điều quan trọng ra ngoài.',
    },
  ],
  concepts: [
    { tag: 'API', term: 'stop_reason', def: 'Lý do Claude dừng: "tool_use" (chờ bạn chạy tool), "end_turn" (xong), "max_tokens" (bị cắt)… Agent loop dựa vào giá trị này.' },
    { tag: 'API', term: 'tool_choice', def: 'Điều khiển việc gọi tool: auto (Claude tự chọn), any (phải gọi một tool), tool (ép gọi đúng tool chỉ định), none.' },
    { tag: 'AGENT', term: 'Subagent', def: 'Agent con có context riêng, nhận nhiệm vụ hẹp từ coordinator và chỉ trả về kết quả gọn — giữ context chính sạch.' },
    { tag: 'CLAUDE CODE', term: 'Hook', def: 'Lệnh chạy tự động tại các mốc (PreToolUse, PostToolUse, UserPromptSubmit…) — dùng để chặn, kiểm tra, định dạng bằng code.' },
    { tag: 'MCP', term: 'Tools · Resources · Prompts', def: 'Ba loại năng lực của MCP server: tool để hành động, resource để cung cấp dữ liệu, prompt là mẫu dựng sẵn cho người dùng.' },
    { tag: 'RELIABILITY', term: 'Prompt caching', def: 'Đánh dấu phần đầu prompt lặp lại (system prompt, tài liệu dài) để các lần gọi sau đọc từ cache — nhanh và rẻ hơn.' },
  ],
  code: {
    note: 'Minh hoạ bằng Python SDK `anthropic` và cấu hình Claude Code — MODEL là tên model bạn dùng; kiểm tra lại API theo tài liệu hiện hành.',
    samples: [
      {
        label: 'Agent loop',
        lang: 'python',
        code: `import json, anthropic

client = anthropic.Anthropic()
messages = [{"role": "user", "content": "Hoàn tiền cho đơn #A1023"}]

while True:
    resp = client.messages.create(
        model=MODEL, max_tokens=1024, tools=TOOLS, messages=messages,
    )
    messages.append({"role": "assistant", "content": resp.content})
    if resp.stop_reason != "tool_use":
        break  # end_turn, max_tokens, ...

    results = []
    for block in resp.content:
        if block.type == "tool_use":
            out = run_tool(block.name, block.input)  # code của bạn chạy tool
            results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": json.dumps(out),
                "is_error": "error" in out,
            })
    messages.append({"role": "user", "content": results})`,
      },
      {
        label: 'JSON đúng schema',
        lang: 'python',
        code: `save_invoice = {
    "name": "save_invoice",
    "description": "Lưu dữ liệu hoá đơn đã trích xuất từ tài liệu.",
    "input_schema": {
        "type": "object",
        "properties": {
            "invoice_no": {"type": "string"},
            "due_date": {"type": ["string", "null"],
                         "description": "null nếu tài liệu không ghi"},
            "total": {"type": "number"},
        },
        "required": ["invoice_no", "due_date", "total"],
    },
}

resp = client.messages.create(
    model=MODEL, max_tokens=1024, tools=[save_invoice],
    tool_choice={"type": "tool", "name": "save_invoice"},  # ép gọi tool
    messages=[{"role": "user", "content": document_text}],
)
data = next(b.input for b in resp.content if b.type == "tool_use")
# validate(data): sai schema → gửi lại kèm lỗi, thử lại có giới hạn`,
      },
      {
        label: 'Claude Code cho team',
        lang: 'text',
        code: `// .claude/settings.json — commit vào repo để cả team dùng chung
{
  "permissions": {
    "allow": ["Read", "Grep", "Bash(npm run test:*)"],
    "deny":  ["Read(./.env)", "Bash(rm -rf:*)"]
  },
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{ "type": "command", "command": "./scripts/check-cmd.sh" }]
    }]
  }
}

# CI: chạy không tương tác, lấy kết quả dạng JSON
claude -p "Review diff của PR này, chỉ báo lỗi chắc chắn" --output-format json`,
      },
    ],
  },
  traps: [
    {
      title: 'Sửa prompt hay sửa cấu trúc?',
      body: 'Khi agent làm sai quy tắc quan trọng, đáp án “thêm câu nhắc vào prompt” thường sai. Đáp án đúng đặt luật vào code: hook, permission, tool có bước xác nhận.',
    },
    {
      title: 'Mô tả tool dài nhất không phải tốt nhất',
      body: 'Mô tả tool để Claude chọn đúng tool: khi nào dùng, khi nào không, trả về gì. Kể tên bảng, cột, chi tiết triển khai không giúp gì.',
    },
    {
      title: 'Subagent không tự biết context của cha',
      body: 'Subagent có context riêng. Thông tin nào cần thì coordinator phải truyền vào rõ ràng; kết quả thiếu căn cứ thường do truyền thiếu.',
    },
  ],
  blueprint: {
    caption: 'Kiến trúc một hệ thống agent chạy bằng Claude',
    nodes: [
      { id: 'user', label: 'Người dùng', sub: 'Yêu cầu', icon: 'user', x: 95, y: 220, what: 'Gửi yêu cầu bằng ngôn ngữ tự nhiên: khách hàng, developer hoặc một job CI.', tip: 'Đề hay hỏi: yêu cầu này cần một lần gọi hay cả một agent?' },
      { id: 'loop', label: 'Agent loop', sub: 'Code của bạn', icon: 'refresh', x: 345, y: 220, what: 'Vòng lặp trong ứng dụng (hoặc Claude Agent SDK): gọi Claude, chạy tool khi được yêu cầu, gửi kết quả lại, đến khi Claude kết thúc.', tip: 'Lặp khi stop_reason = "tool_use"; dừng khi "end_turn".' },
      { id: 'claude', label: 'Claude', sub: 'Messages API', icon: 'sparkle', x: 600, y: 220, what: 'Suy luận trên hội thoại, quyết định trả lời luôn hay gọi tool nào với tham số gì.', tip: 'Claude không tự thực thi — nó chỉ trả về khối tool_use.' },
      { id: 'tools', label: 'Tools', sub: 'JSON schema', icon: 'tool', x: 855, y: 110, what: 'Các hàm bạn định nghĩa: tên, mô tả, input_schema. Trả kết quả hoặc lỗi có cấu trúc.', tip: 'Tách tool đọc và tool phá huỷ; tool phá huỷ đòi xác nhận.' },
      { id: 'mcp', label: 'MCP server', sub: 'Tool · Resource · Prompt', icon: 'layers', x: 1100, y: 110, what: 'Chuẩn mở để nối Claude với hệ thống ngoài (Jira, DB, GitHub…) một lần, dùng lại ở nhiều nơi.', tip: 'Hành động → tool. Dữ liệu chỉ đọc → resource. Mẫu dựng sẵn → prompt.' },
      { id: 'sub', label: 'Subagents', sub: 'Context riêng', icon: 'brain', x: 855, y: 330, what: 'Coordinator giao việc hẹp cho subagent (tìm kiếm, phân tích…), nhận về kết quả gọn để context chính không phình to.', tip: 'Subagent chỉ biết những gì được truyền vào.' },
      { id: 'guard', label: 'Hooks · Quyền', sub: 'Luật cứng bằng code', icon: 'shield', x: 345, y: 70, kind: 'side', what: 'Chặn hoặc kiểm tra hành động trước/sau khi chạy tool; allow/deny theo tool và lệnh; validate output theo schema.', tip: 'Phải luôn đúng → code. Thường nên đúng → prompt.' },
      { id: 'ctx', label: 'Context', sub: 'Cache · tóm tắt', icon: 'database', x: 600, y: 70, kind: 'side', what: 'Quản lý những gì Claude “nhìn thấy”: cache phần lặp lại, tóm tắt có chủ đích, ghim sự thật quan trọng ra file.', tip: 'Context hiệu dụng nhỏ hơn cửa sổ quảng cáo.' },
      { id: 'human', label: 'Con người', sub: 'Escalation', icon: 'user', x: 345, y: 380, kind: 'side', what: 'Nhận các ca ngoài chính sách, không chắc chắn hoặc rủi ro cao, kèm bản tóm tắt có cấu trúc.', tip: 'Không chắc hoặc ngoài quyền → escalate, đừng cố tự giải quyết.' },
    ],
    edges: [
      ['user', 'loop', 'yêu cầu'],
      ['loop', 'claude', 'messages'],
      ['loop', 'tools', 'chạy tool_use'],
      ['tools', 'mcp', 'qua MCP'],
      ['loop', 'sub', 'giao việc'],
      ['guard', 'loop', '', true],
      ['ctx', 'claude', '', true],
      ['human', 'loop', '', true],
    ],
  },
  decide: {
    title: 'Mình nên thiết kế thế nào?',
    start: 'start',
    nodes: {
      start: {
        q: 'Bạn đang gặp tình huống nào?',
        opts: [
          ['Claude phải LUÔN tuân theo một quy tắc', 'rule'],
          ['Cần output JSON đúng schema', 'json'],
          ['Xử lý hàng nghìn tài liệu, không cần kết quả ngay', 'batch'],
          ['Tác vụ lớn, context sắp đầy', 'big'],
          ['Tool gọi API bị lỗi', 'err'],
          ['Muốn cả team dùng Claude Code giống nhau', 'team'],
        ],
      },
      big: {
        q: 'Các phần việc có độc lập với nhau không?',
        opts: [
          ['Độc lập, làm song song được', 'subagents'],
          ['Tuần tự, phụ thuộc chặt', 'single'],
        ],
      },
      err: {
        q: 'Lỗi là tạm thời (timeout, quá tải) hay do yêu cầu sai?',
        opts: [
          ['Tạm thời', 'retry'],
          ['Sai input / không có quyền', 'noretry'],
        ],
      },
      team: {
        q: 'Cấu hình dành cho cả repo hay chỉ máy của bạn?',
        opts: [
          ['Cả repo / cả team', 'repo'],
          ['Chỉ cá nhân mình', 'personal'],
        ],
      },
      rule: { answer: 'Đặt luật trong code', why: 'Dùng hook (PreToolUse chặn hành động), permission deny, hoặc tool có bước xác nhận/kiểm tra điều kiện. Prompt chỉ là hướng dẫn, có thể bị bỏ qua.', remember: 'Phải luôn đúng → code. Thường nên đúng → prompt.' },
      json: { answer: 'Tool + JSON schema + tool_choice', why: 'Định nghĩa tool có input_schema, ép Claude gọi tool đó bằng tool_choice rồi đọc input của khối tool_use. Trường có thể thiếu → cho phép null. Validate, sai thì gửi lại kèm lỗi và thử lại có giới hạn.', remember: 'Nullable để Claude không phải bịa.' },
      batch: { answer: 'Message Batches API', why: 'Gửi cả lô yêu cầu để xử lý bất đồng bộ (trong vòng 24 giờ) với chi phí thấp hơn đáng kể so với gọi từng lần.', remember: 'Không cần ngay → Batch.' },
      subagents: { answer: 'Coordinator + subagents', why: 'Mỗi subagent làm một phần với context riêng và chỉ trả về kết quả gọn; coordinator tổng hợp. Context chính không bị phình.', remember: 'Truyền đủ thông tin cho subagent — nó không thấy context của cha.' },
      single: { answer: 'Một agent + scratchpad + tóm tắt', why: 'Giữ một luồng làm việc, ghi các sự thật quan trọng ra file scratchpad và tóm tắt có chủ đích khi context dài.', remember: 'Ghim điều quan trọng ra ngoài context.' },
      retry: { answer: 'Lỗi có cấu trúc, isRetryable: true', why: 'Tool trả về loại lỗi và cờ cho phép thử lại; vòng lặp retry có giới hạn số lần, có backoff và timeout.', remember: 'Retry có giới hạn — không lặp vô tận.' },
      noretry: { answer: 'Lỗi có cấu trúc, isRetryable: false', why: 'Mô tả rõ lỗi (thiếu trường, sai định dạng, không đủ quyền) để Claude sửa tham số, hỏi lại người dùng hoặc escalate.', remember: 'Lỗi phải nói được “nên làm gì tiếp”.' },
      repo: { answer: 'CLAUDE.md + .claude/ trong repo', why: 'Commit CLAUDE.md, .claude/settings.json (permissions, hooks), slash commands, skills, subagents và .mcp.json để mọi người dùng chung.', remember: 'Chung cho team → nằm trong git.' },
      personal: { answer: '~/.claude/ của bạn', why: 'Đặt sở thích cá nhân ở ~/.claude/CLAUDE.md và ~/.claude/settings.json (hoặc .claude/settings.local.json không commit).', remember: 'Cá nhân → không commit vào repo.' },
    },
  },
  compare: [
    {
      a: 'Prompt',
      b: 'Code (hook · permission · schema)',
      rows: [
        ['Mức đảm bảo', 'Thường đúng, có thể bị bỏ qua', 'Luôn đúng'],
        ['Dùng cho', 'Giọng văn, ưu tiên, cách trình bày', 'An toàn, quyền hạn, định dạng bắt buộc'],
        ['Ví dụ', '“Hãy hỏi lại trước khi xoá”', 'Hook chặn lệnh xoá; tool xoá đòi mã xác nhận'],
      ],
      rule: 'Phải luôn đúng → code. Thường nên đúng → prompt.',
    },
    {
      a: 'Một agent',
      b: 'Subagents',
      rows: [
        ['Context', 'Dùng chung một context', 'Mỗi subagent một context riêng'],
        ['Hợp với', 'Việc tuần tự, phụ thuộc chặt', 'Nhiều phần độc lập, tìm kiếm rộng, chạy song song'],
        ['Rủi ro', 'Context phình to, trôi mất sự thật', 'Truyền thiếu thông tin, tổng hợp sai'],
      ],
      rule: 'Độc lập & rộng → subagents. Tuần tự & dính nhau → một agent.',
    },
    {
      a: 'Messages API',
      b: 'Message Batches API',
      rows: [
        ['Khi nào có kết quả', 'Ngay lập tức', 'Bất đồng bộ, trong vòng 24 giờ'],
        ['Chi phí', 'Giá chuẩn', 'Rẻ hơn đáng kể'],
        ['Hợp với', 'Chat, agent tương tác', 'Xử lý hàng loạt, đánh giá offline'],
      ],
      rule: 'Không cần ngay → Batch.',
    },
    {
      a: 'MCP tool',
      b: 'MCP resource',
      rows: [
        ['Ai kích hoạt', 'Claude quyết định gọi', 'Ứng dụng / người dùng chọn đưa vào'],
        ['Bản chất', 'Hành động, có thể thay đổi dữ liệu', 'Dữ liệu để đọc (file, schema, tài liệu)'],
        ['Ví dụ', 'create_ticket', 'Nội dung schema database'],
      ],
      rule: 'Làm việc → tool. Cung cấp dữ liệu → resource. Mẫu dựng sẵn → prompt.',
    },
  ],
  mindmap: [
    {
      title: 'Agent loop',
      hint: 'stop_reason, tool_result',
      leaves: ['stop_reason = tool_use', 'Code chạy tool', 'end_turn → kết thúc'],
      summary: 'Claude không tự thực thi. Ứng dụng của bạn chạy vòng lặp: gọi Claude, chạy tool khi được yêu cầu, gửi kết quả lại.',
      points: [
        'stop_reason = "tool_use" → chạy tool, gửi tool_result, gọi tiếp.',
        'tool_result có thể báo lỗi để Claude xử lý tiếp.',
        'Dừng khi "end_turn"; đặt giới hạn số vòng để tránh lặp vô tận.',
      ],
      remember: 'Lặp theo stop_reason, không theo nội dung câu trả lời.',
    },
    {
      title: 'Điều phối',
      hint: 'Coordinator, subagent, escalation',
      leaves: ['Coordinator – subagent', 'Context truyền rõ ràng', 'Escalate sang người'],
      summary: 'Chia việc lớn cho subagent có context riêng; biết lúc nào phải chuyển cho con người.',
      points: [
        'Subagent nhận nhiệm vụ hẹp, trả về kết quả gọn.',
        'Coordinator phải truyền đủ thông tin — subagent không thấy context cha.',
        'Ngoài chính sách, không chắc, rủi ro cao → escalate kèm tóm tắt.',
      ],
      remember: 'Lỗi cấu trúc → sửa cấu trúc, không sửa prompt.',
    },
    {
      title: 'Claude Code',
      hint: 'CLAUDE.md, skills, hooks',
      leaves: ['CLAUDE.md theo tầng', 'Skills · commands', 'Hooks · permissions'],
      summary: 'Cấu hình Claude Code để cả team làm việc nhất quán và an toàn, kể cả trong CI.',
      points: [
        'CLAUDE.md: tổ chức → dự án → cá nhân; thư mục con nạp khi cần.',
        'Slash commands, skills, subagents đặt trong .claude/.',
        'Hooks và permissions enforce luật; CI dùng claude -p.',
      ],
      remember: 'Chung cho team → commit vào repo.',
    },
    {
      title: 'Prompt & output',
      hint: 'Tiêu chí, schema, retry',
      leaves: ['Tiêu chí rõ ràng', 'Tool + JSON schema', 'Validate → retry'],
      summary: 'Output đáng tin đến từ tiêu chí cụ thể và schema được kiểm tra, không đến từ lời dặn “hãy cẩn thận”.',
      points: [
        'Thay chỉ dẫn mơ hồ bằng tiêu chí cụ thể; few-shot cho ca khó.',
        'Ép output qua tool có input_schema bằng tool_choice.',
        'Validate, sai thì gửi lại kèm lỗi; việc hàng loạt dùng Batches.',
      ],
      remember: 'Trường có thể thiếu → nullable.',
    },
    {
      title: 'Tool & MCP',
      hint: 'Mô tả, lỗi, MCP',
      leaves: ['Mô tả: khi nào dùng', 'Lỗi có isRetryable', 'Tool·Resource·Prompt'],
      summary: 'Tool tốt giúp Claude chọn đúng và xử lý lỗi đúng; MCP giúp nối hệ thống một lần, dùng nhiều nơi.',
      points: [
        'Mô tả tool: khi nào dùng, khi nào không, trả về gì.',
        'Lỗi có cấu trúc: loại lỗi, có nên thử lại, thông điệp rõ ràng.',
        'MCP: tools (hành động), resources (dữ liệu), prompts (mẫu).',
      ],
      remember: 'Tách tool đọc và tool phá huỷ.',
    },
    {
      title: 'Context & tin cậy',
      hint: 'Context dài, cache, retry',
      leaves: ['Ghim sự thật quan trọng', 'Cache · tóm tắt', 'Batch cho việc lớn'],
      summary: 'Hệ thống ổn định khi bạn chủ động quản lý context và xử lý lỗi, thay vì hy vọng model tự nhớ.',
      points: [
        'Context hiệu dụng nhỏ hơn cửa sổ; hội thoại dài dễ trôi.',
        'Prompt caching cho phần lặp lại; scratchpad cho sự thật quan trọng.',
        'Retry có giới hạn, timeout, phát hiện vòng lặp, truyền lỗi lên.',
      ],
      remember: 'Context dài ≠ nhớ tốt.',
    },
  ],
  flashcards: [
    { q: 'stop_reason = "tool_use" nghĩa là gì?', a: 'Claude muốn gọi tool và đang chờ. Ứng dụng phải chạy tool rồi gửi tool_result lại để Claude tiếp tục.' },
    { q: 'Làm sao buộc Claude trả JSON đúng schema?', a: 'Định nghĩa tool có input_schema, ép gọi tool đó bằng tool_choice, validate input của khối tool_use, sai thì thử lại kèm lỗi.' },
    { q: 'Subagent có thấy context của agent cha không?', a: 'Không. Subagent có context riêng; coordinator phải truyền đủ thông tin cần thiết vào nhiệm vụ.' },
    { q: 'Quy tắc nào nên đặt trong code thay vì prompt?', a: 'Quy tắc phải luôn đúng: an toàn, quyền hạn, định dạng bắt buộc — dùng hook, permission, schema, tool có bước xác nhận.' },
    { q: 'MCP tool khác MCP resource thế nào?', a: 'Tool là hành động do Claude quyết định gọi; resource là dữ liệu để đọc do ứng dụng/người dùng đưa vào.' },
  ],
  quiz: [
    {
      q: 'Agent hỗ trợ khách hàng đôi khi hoàn tiền cho đơn quá 30 ngày dù system prompt đã cấm. Cách khắc phục tốt nhất?',
      opts: [
        'Viết hoa và nhắc lại quy tắc nhiều lần trong system prompt',
        'Cho tool refund tự kiểm tra hạn 30 ngày bằng code và từ chối nếu vi phạm',
        'Thêm nhiều ví dụ few-shot về việc từ chối hoàn tiền',
        'Giảm temperature xuống 0',
      ],
      ans: 1,
      why: 'Quy tắc phải luôn đúng cần được enforce bằng code. Prompt và few-shot chỉ làm tăng xác suất tuân thủ, không đảm bảo.',
    },
    {
      q: 'Trích xuất dữ liệu hoá đơn: nhiều hoá đơn không ghi hạn thanh toán và Claude hay tự điền một ngày. Nên làm gì?',
      opts: [
        'Bỏ trường hạn thanh toán khỏi schema',
        'Cho trường hạn thanh toán nhận null và mô tả “null nếu tài liệu không ghi”',
        'Yêu cầu Claude “không được bịa” trong prompt',
        'Chuyển sang Message Batches API',
      ],
      ans: 1,
      why: 'Trường bắt buộc không cho null buộc model phải điền một giá trị. Nullable cho phép trả lời trung thực rằng nguồn không có.',
    },
    {
      q: 'Hệ thống research cần tìm hiểu 12 chủ đề độc lập rồi tổng hợp báo cáo; context của agent chính liên tục bị đầy. Thiết kế phù hợp?',
      opts: [
        'Tăng max_tokens',
        'Coordinator giao mỗi chủ đề cho một subagent, nhận về tóm tắt rồi tổng hợp',
        'Gộp 12 chủ đề vào một prompt dài',
        'Bật temperature cao hơn để đa dạng',
      ],
      ans: 1,
      why: 'Các phần độc lập và rộng hợp với subagent: mỗi subagent có context riêng, chỉ trả kết quả gọn nên context chính không phình.',
    },
  ],
  resources: [
    { label: 'Trang chứng chỉ CCA-F (Anthropic)', url: 'https://clau.de/CCAF' },
    { label: 'Anthropic Academy — khoá học miễn phí', url: 'https://anthropic.skilljar.com' },
    { label: 'Tài liệu Claude Code', url: 'https://docs.claude.com/en/docs/claude-code/overview' },
    { label: 'Model Context Protocol', url: 'https://modelcontextprotocol.io' },
  ],
};
