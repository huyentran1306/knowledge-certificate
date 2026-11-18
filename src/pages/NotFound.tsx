import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section className="container notfound">
      <div className="eyebrow">404</div>
      <h1 className="h">Không tìm thấy trang này</h1>
      <p>Có thể đường dẫn đã đổi. Quay về trang tổng quan để chọn chứng chỉ.</p>
      <Link to="/" className="btn btn-primary">Về trang chủ</Link>
    </section>
  );
}
