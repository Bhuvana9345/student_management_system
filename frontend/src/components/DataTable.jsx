import { Edit, Eye, Trash2 } from 'lucide-react';

export default function DataTable({ columns, rows, loading, onEdit, onDelete, onView }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>{columns.map((col) => <th key={col.key}>{col.label}</th>)}<th className="text-end">Actions</th></tr>
        </thead>
        <tbody>
          {loading && <tr><td colSpan={columns.length + 1} className="text-center py-5">Loading...</td></tr>}
          {!loading && rows.length === 0 && <tr><td colSpan={columns.length + 1} className="text-center py-5 text-muted">No records found</td></tr>}
          {!loading && rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>)}
              <td className="text-end table-actions">
                {onView && <button className="btn btn-sm btn-outline-secondary" onClick={() => onView(row)} title="View"><Eye size={16} /></button>}
                {onEdit && <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(row)} title="Edit"><Edit size={16} /></button>}
                {onDelete && <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(row.id)} title="Delete"><Trash2 size={16} /></button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
