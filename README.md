# Cert Atlas — sổ tay kiến thức chứng chỉ

Portal cá nhân ghi lại những gì đã học sau mỗi chứng chỉ: tóm tắt, sơ đồ kiến trúc, cây quyết định “khi nào dùng gì”, demo tương tác, bản đồ tư duy, khái niệm cốt lõi, code mẫu, bẫy đề thi và chế độ ôn tập.

| Màn hình | Đường dẫn | Có gì |
|---|---|---|
| Trang chủ | `#/` | Bộ sưu tập chứng chỉ (vòng tròn ngày hiệu lực còn lại), bản đồ tổng 5 chứng chỉ, hành trình, chủ đề xuyên suốt |
| Sổ tay | `#/cert/:id` | Tóm tắt 30 giây, demo từng bước, nhóm kiến thức, thẻ khái niệm lật, code mẫu, bẫy đề thi, ghi chú cá nhân |
| Bản đồ tư duy | `#/cert/:id/map` | 6 nhánh × 3 ý, bấm nhánh để xem tóm tắt, kéo/phóng to, xuất PNG |
| Ôn tập | `#/review` | Flashcard có lịch ôn lặp lại, quiz tình huống, sổ lỗi sai |

Phím tắt: <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> mở tìm kiếm (gõ không dấu cũng được).

## Chạy local

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # kiểm tra kiểu + build ra dist/
```

## Deploy (Cloudflare)

- **URL site**: `https://knowledge-certificate.trannth1306.workers.dev`
- **Deploy**: Chạy lệnh `npm run deploy` (tự động build và deploy thẳng lên Cloudflare Workers; lần đầu cần `npx wrangler login`).

## Dữ liệu nằm ở đâu

- **Nội dung kiến thức** viết trong code, mỗi chứng chỉ một file: `src/data/certs/*.ts`. Kiểu dữ liệu ở `src/data/types.ts` — thiếu trường là `npm run build` báo lỗi ngay.
- **Dữ liệu cá nhân** (ghi chú, lịch ôn flashcard, sổ lỗi sai) lưu ở `localStorage` của trình duyệt, đi qua một chỗ duy nhất: `src/lib/storage.ts`. Muốn đồng bộ nhiều máy (ví dụ Cloudflare Worker + D1) chỉ cần thay phần đọc/ghi trong file đó.

## Thêm hoặc sửa chứng chỉ

1. Sao chép một file trong `src/data/certs/` (ví dụ `agents.ts`), đổi `id`, ngày `earned` / `expires`, màu `theme` và nội dung.
2. Thêm `id` mới vào kiểu `CertId` trong `src/data/types.ts`.
3. Import và thêm vào mảng `CERTS` trong `src/data/index.ts`.
4. Nếu chứng chỉ thuộc chủ đề chung, thêm `id` vào `TOPICS` trong cùng file.

Lưu ý khi viết nội dung:

- `mindmap` cần đúng **6 nhánh**, mỗi nhánh **3 ý** (3 nhánh đầu nằm bên trái). Ý con nên ≤ 24 ký tự để nằm trên một dòng.
- `demo.steps` hiển thị đẹp nhất với 4–6 bước.
- `code.samples[].lang`: `python`, `sql`, `yaml`, `markdown` hoặc `text`.
- Phần học trực quan (tuỳ chọn, xem mẫu ở `agents.ts`, `ccaf.ts`): `blueprint` (sơ đồ kiến trúc — toạ độ tâm khối trong khung 1200 × 450), `decide` (cây quyết định “khi nào dùng gì”) và `compare` (bảng A vs B). Khi có `compare`, mục “Bẫy đề thi” được thay bằng “Đừng nhầm”; khi có bất kỳ phần nào, cuối trang có thêm “Nhớ trong 5 câu”.

> Nội dung hiện có là bản tóm tắt cá nhân, nên đối chiếu thêm với study guide chính thức trên Microsoft Learn / GitHub.

## Cấu trúc

```
src/
  data/            nội dung (mỗi chứng chỉ một file) + kiểu dữ liệu
  lib/             ngày tháng, lưu trữ, lịch ôn, tìm kiếm
  components/      Header, CommandPalette, CertCard, AtlasMap, MindMap, CertSections…
  pages/           HomePage, CertPage, MindmapPage, ReviewPage
  styles/app.css   toàn bộ giao diện (light mode, hiệu ứng, responsive)
```

Stack: Vite + React + TypeScript + React Router (HashRouter, deploy dạng static assets trên Cloudflare Workers). Không dùng thư viện UI — hiệu ứng viết bằng CSS và SVG.
