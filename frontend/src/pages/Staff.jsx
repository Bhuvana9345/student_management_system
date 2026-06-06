import { useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import Pagination from '../components/Pagination';
import Toast from '../components/Toast';
import { staffApi } from '../api/services';
import { useCrud } from '../utils/useCrud';
import { departments } from '../utils/departments';

const empty = { staffId: '', name: '', email: '', department: '', phoneNumber: '', designation: '' };

export default function Staff() {
  const crud = useCrud(staffApi);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    await crud.save(editing);
    setEditing(null);
    setToast('Staff details saved');
  };

  return (
    <div className="page">
      <Toast message={toast} onClose={() => setToast('')} />
      <div className="toolbar">
        <div>
          <h2>Staff Management</h2>
          <p>Add staff details used for staff login and faculty records.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing(empty)}><Plus size={18} /> Add Staff</button>
      </div>
      <div className="panel">
        <DataTable loading={crud.loading} rows={crud.items} columns={[
          { key: 'staffId', label: 'Staff ID' },
          { key: 'name', label: 'Name' },
          { key: 'designation', label: 'Designation' },
          { key: 'department', label: 'Department' },
          { key: 'phoneNumber', label: 'Phone' }
        ]} onEdit={setEditing} onDelete={async (id) => { await crud.remove(id); setToast('Staff deleted'); }} />
        <Pagination page={crud.page} onChange={(page) => crud.load({ page })} />
      </div>
      <ModalForm title={editing?.id ? 'Edit Staff' : 'Add Staff'} show={Boolean(editing)} onClose={() => setEditing(null)} onSubmit={submit}>
        {editing && <div className="row g-3">
          <div className="col-md-6"><label className="form-label">Staff ID Number</label><input required className="form-control" value={editing.staffId || ''} onChange={(e) => setEditing({ ...editing, staffId: e.target.value })} /></div>
          <div className="col-md-6"><label className="form-label">Staff Name</label><input required className="form-control" value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
          <div className="col-md-6"><label className="form-label">Email</label><input type="email" className="form-control" value={editing.email || ''} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
          <div className="col-md-6"><label className="form-label">Phone Number</label><input className="form-control" value={editing.phoneNumber || ''} onChange={(e) => setEditing({ ...editing, phoneNumber: e.target.value })} /></div>
          <div className="col-md-6"><label className="form-label">Designation</label><input required className="form-control" value={editing.designation || ''} onChange={(e) => setEditing({ ...editing, designation: e.target.value })} /></div>
          <div className="col-md-6">
            <label className="form-label">Department</label>
            <select required className="form-select" value={editing.department || ''} onChange={(e) => setEditing({ ...editing, department: e.target.value })}>
              <option value="">Select Department</option>
              {departments.map((department) => <option key={department} value={department}>{department}</option>)}
            </select>
          </div>
        </div>}
      </ModalForm>
    </div>
  );
}
