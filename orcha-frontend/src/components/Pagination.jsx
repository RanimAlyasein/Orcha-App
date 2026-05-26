// Renders page navigation buttons based on the total pages returned by the API
export default function Pagination({ meta, page, onPage }) {
  const totalPages = meta?.totalPages ?? meta?.pages ?? 1;
  if (!meta || totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing {((page - 1) * meta.limit) + 1}–{Math.min(page * meta.limit, meta.total)} of {meta.total}
      </span>
      <button className="pg-btn" onClick={() => onPage(page - 1)} disabled={page === 1}>&#8249;</button>
      {visible.map((p, i, arr) => (
        <span key={p} className="pagination-page">
          {i > 0 && arr[i - 1] !== p - 1 && <span className="pg-btn" style={{ border: 'none', pointerEvents: 'none' }}>...</span>}
          <button className={`pg-btn${p === page ? ' active' : ''}`} onClick={() => onPage(p)}>{p}</button>
        </span>
      ))}
      <button className="pg-btn" onClick={() => onPage(page + 1)} disabled={page === totalPages}>&#8250;</button>
    </div>
  );
}
