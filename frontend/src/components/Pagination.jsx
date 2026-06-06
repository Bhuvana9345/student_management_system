export default function Pagination({ page, onChange }) {
  if (page.totalPages <= 1) return null;
  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <small className="text-muted">{page.totalElements} records</small>
      <div className="btn-group">
        <button className="btn btn-outline-secondary" disabled={page.number === 0} onClick={() => onChange(page.number - 1)}>Previous</button>
        <button className="btn btn-outline-secondary disabled">Page {page.number + 1} / {page.totalPages}</button>
        <button className="btn btn-outline-secondary" disabled={page.number + 1 >= page.totalPages} onClick={() => onChange(page.number + 1)}>Next</button>
      </div>
    </div>
  );
}
