# Prompt: deploy Cert Atlas lên Cloudflare

> Dán toàn bộ nội dung dưới đây cho agent (Antigravity). Agent làm việc trong thư mục gốc của repo `knowledge-certificate`.

---

## Vai trò & mục tiêu

Bạn là agent triển khai cho repo `knowledge-certificate` (Cert Atlas). Hãy đưa site lên **Cloudflare Workers dạng static assets** và thiết lập **tự deploy mỗi khi push lên `main`**, thay cho workflow GitHub Pages hiện có.

Kết quả cần có:

1. Site chạy ở `https://knowledge-certificate.<subdomain>.workers.dev`.
2. Push lên `main` → GitHub Actions tự build và deploy lên Cloudflare.
3. README có hướng dẫn deploy mới.

## Bối cảnh repo (đọc trước khi sửa)

- Site tĩnh: Vite 8 + React 19 + TypeScript 7 + React Router 7. Không có backend, không có biến môi trường.
- Router dùng **`HashRouter`** (URL dạng `/#/cert/agents`), `vite.config.ts` có `base: './'`. **Giữ nguyên cả hai.**
- `npm run build` = `tsc --noEmit && vite build` → output ở **`dist/`**.
- Nội dung nằm trong `src/data/certs/*.ts`; dữ liệu cá nhân lưu ở `localStorage` qua `src/lib/storage.ts`. Việc deploy **không** cần đụng tới `src/`.
- `.github/workflows/deploy.yml` hiện đang deploy lên GitHub Pages và **đang fail** vì repo chưa bật Pages. Workflow này sẽ bị thay thế.
- **Lưu ý CI:** `package-lock.json` được tạo trên macOS. Trên Linux, `npm ci` báo lỗi `Missing: @emnapi/core … from lock file` (bug optional deps khác nền tảng). **Trong CI phải dùng `npm install --no-audit --no-fund`, không dùng `npm ci`.** Node trong CI: 24.

## Các bước

### 1. Cài wrangler

```bash
npm install -D wrangler@latest
npx wrangler --version   # cần v4.x
```

### 2. Tạo `wrangler.jsonc` ở thư mục gốc

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "knowledge-certificate",
  // Dùng ngày hôm nay (YYYY-MM-DD). Nếu wrangler báo ngày quá mới thì lùi lại theo gợi ý của nó.
  "compatibility_date": "2026-11-18",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
}
```

Không thêm `main`: đây là Worker chỉ có static assets, không có code server.

### 3. Thêm script vào `package.json`

```json
"deploy": "npm run build && wrangler deploy",
"cf:dev": "npm run build && wrangler dev"
```

Giữ nguyên các script đang có.

### 4. Bỏ qua thư mục tạm của wrangler

Thêm dòng `.wrangler` vào `.gitignore`.

### 5. Kiểm tra trước khi deploy (không cần đăng nhập)

```bash
npm run build
npx wrangler deploy --dry-run
```

Kết quả đúng có các dòng `Read N files from the assets directory …/dist` và `No bindings found.`

### 6. Deploy lần đầu từ máy

```bash
npx wrangler whoami
```

- Nếu **chưa đăng nhập**: dừng lại và nhờ người dùng tự chạy `npx wrangler login` (mở trình duyệt để xác thực). **Không** tự tạo, hỏi xin hay in ra API token.
- Khi đã đăng nhập:

```bash
npm run deploy
```

Ghi lại URL `*.workers.dev` mà wrangler in ra.

### 7. Thay workflow GitHub Actions

Ghi đè `.github/workflows/deploy.yml` bằng nội dung sau (đổi tên hiển thị, bỏ các bước GitHub Pages):

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: cloudflare-deploy
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      # npm ci lỗi với optional deps khác nền tảng (lock tạo trên macOS) → dùng npm install
      - run: npm install --no-audit --no-fund
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy
```

Workflow cần 2 secret mà **người dùng phải tự thêm** (agent không tự tạo token). Hãy hướng dẫn người dùng:

1. Cloudflare Dashboard → **My Profile → API Tokens → Create Token** → chọn template **Edit Cloudflare Workers** → tạo và copy token.
2. Account ID: xem ở trang tổng quan Workers & Pages trên Cloudflare Dashboard, hoặc qua `npx wrangler whoami`.
3. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**: thêm `CLOUDFLARE_API_TOKEN` và `CLOUDFLARE_ACCOUNT_ID`.

Khi chưa có secret, job deploy sẽ fail ở bước wrangler — đó là điều bình thường, hãy nói rõ với người dùng.

### 8. Cập nhật README

Trong `README.md`, thay câu “Push lên `main` sẽ tự deploy lên GitHub Pages…” bằng một mục **Deploy (Cloudflare)** ngắn gồm:

- Deploy từ máy: `npm run deploy` (lần đầu cần `npx wrangler login`).
- Tự deploy: push lên `main`, cần 2 secret `CLOUDFLARE_API_TOKEN` và `CLOUDFLARE_ACCOUNT_ID`.
- URL site.

Ngoài ra, sửa dòng Stack cuối README: bỏ cụm “để chạy được trên GitHub Pages”, thay bằng “deploy dạng static assets trên Cloudflare Workers”.

### 9. Commit & push

Một commit gồm `wrangler.jsonc`, `package.json`, `package-lock.json`, `.gitignore`, `.github/workflows/deploy.yml`, `README.md`:

```
chore(deploy): chuyển sang Cloudflare Workers static assets
```

Push lên `main`, sau đó theo dõi lần chạy Actions (`gh run watch` hoặc tab Actions).

## Kiểm tra sau khi deploy

Mở URL `*.workers.dev` và xác nhận các trang dưới đây tải được, không có lỗi trong console:

- `/` (trang chủ, bản đồ tổng có hiệu ứng)
- `/#/cert/agents` (sổ tay — bấm “Chạy demo” chạy được)
- `/#/cert/agents/map` (bản đồ tư duy — bấm một nhánh, “Xuất PNG” tải được file)
- `/#/review` (lật flashcard, trả lời quiz)
- Tải lại trang ngay tại `/#/cert/sql` vẫn mở đúng trang.
- Fonts (Inter, Space Grotesk, JetBrains Mono) tải được từ Google Fonts.

## Không được làm

- Không sửa gì trong `src/` (nội dung và giao diện đã chốt).
- Không đổi `HashRouter` sang `BrowserRouter`, không đổi `base: './'`.
- Không thêm D1, KV, Pages Functions hay code server — site là tĩnh hoàn toàn.
- Không commit token, account ID hay file `.dev.vars`.
- Không bật lại GitHub Pages.

## Báo cáo lại cho người dùng

- URL site trên Cloudflare.
- Hash các commit đã push.
- Trạng thái lần chạy Actions gần nhất (xanh/đỏ, và lý do nếu đỏ — ví dụ chưa có secret).
- Những việc người dùng còn phải tự làm (đăng nhập wrangler, thêm 2 secret).
