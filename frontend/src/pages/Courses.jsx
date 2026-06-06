import { useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import Pagination from '../components/Pagination';
import Toast from '../components/Toast';
import { coursesApi } from '../api/services';
import { useCrud } from '../utils/useCrud';
import { departments } from '../utils/departments';

const empty = { code: '', name: '', assignedFaculty: '', description: '', duration: '' };

export default function Courses() {
  const crud = useCrud(coursesApi);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');
  const submit = async (e) => { e.preventDefault(); await crud.save(editing); setEditing(null); setToast('Course saved'); };
  return (
    <div className="page">
      <Toast message={toast} onClose={() => setToast('')} />
      <div className="toolbar"><div><h2>Course Management</h2><p>Maintain courses, descriptions, duration, and faculty assignments.</p></div><button className="btn btn-primary" onClick={() => setEditing(empty)}><Plus size={18} /> Add Course</button></div>
      <div className="panel">
        <DataTable loading={crud.loading} rows={crud.items} columns={[{ key: 'name', label: 'Course / Group' }, { key: 'assignedFaculty', label: 'Faculty' }, { key: 'duration', label: 'Duration' }]} onEdit={setEditing} onDelete={async (id) => { await crud.remove(id); setToast('Course deleted'); }} />
        <Pagination page={crud.page} onChange={(page) => crud.load({ page })} />
      </div>
      <ModalForm title="Course" show={Boolean(editing)} onClose={() => setEditing(null)} onSubmit={submit}>
        {editing && <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Course / Group Name</label>
            <select required className="form-select" value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value, code: e.target.value.replace(/\s+/g, '-').replace(/\./g, '').toUpperCase() })}>
              <option value="">Select Course / Group</option>
              {departments.map((department) => <option key={department} value={department}>{department}</option>)}
            </select>
          </div>
          {['assignedFaculty', 'duration'].map((field) => <div className="col-md-6" key={field}><label className="form-label text-capitalize">{field.replace(/([A-Z])/g, ' $1')}</label><input required className="form-control" value={editing[field] || ''} onChange={(e) => setEditing({ ...editing, [field]: e.target.value })} /></div>)}
          <div className="col-12"><label className="form-label">Description</label><textarea className="form-control" rows="4" value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
        </div>}
      </ModalForm>
    </div>
  );
}
