import { useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { saveAs } from 'file-saver';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import Pagination from '../components/Pagination';
import Toast from '../components/Toast';
import { reportsApi, studentsApi } from '../api/services';
import { useCrud } from '../utils/useCrud';
import { departments } from '../utils/departments';

const emptyStudent = { name: '', registerNumber: '', department: '', email: '', phoneNumber: '', gender: 'Male', address: '', year: 1, dob: '' };
const photoUrl = (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/students/${id}/photo?token=${localStorage.getItem('sms_token') || ''}`;

export default function Students() {
  const crud = useCrud(studentsApi);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');
  const [photo, setPhoto] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    await crud.save(editing);
    if (photo && editing.id) await studentsApi.uploadPhoto(editing.id, photo);
    setEditing(null);
    setPhoto(null);
    setToast('Student saved successfully');
  };

  const exportExcel = async () => {
    const { data } = await reportsApi.excel('students');
    saveAs(data, 'students.xlsx');
  };

  return (
    <div className="page">
      <Toast message={toast} onClose={() => setToast('')} />
      <div className="toolbar">
        <div>
          <h2>Student Management</h2>
          <p>Search, filter, create, update, and manage student profiles.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success" onClick={exportExcel}><Download size={18} /> Excel</button>
          <button className="btn btn-primary" onClick={() => setEditing(emptyStudent)}><Plus size={18} /> Add Student</button>
        </div>
      </div>
      <div className="filters">
        <input className="form-control" placeholder="Search by name, register number, or email" onChange={(e) => crud.setParams({ ...crud.params, search: e.target.value })} />
        <select className="form-select" onChange={(e) => crud.setParams({ ...crud.params, department: e.target.value })}>
          <option value="">All Departments</option>
          {departments.map((department) => <option key={department} value={department}>{department}</option>)}
        </select>
        <button className="btn btn-outline-primary" onClick={() => crud.load({ page: 0 })}>Apply</button>
      </div>
      <div className="panel">
        <DataTable loading={crud.loading} rows={crud.items} columns={[
          { key: 'profilePhotoPath', label: 'Photo', render: (row) => row.profilePhotoPath ? <img className="avatar" src={photoUrl(row.id)} alt={row.name} /> : <span className="avatar empty">NA</span> },
          { key: 'name', label: 'Name' }, { key: 'registerNumber', label: 'Register No' }, { key: 'department', label: 'Department' },
          { key: 'email', label: 'Email' }, { key: 'year', label: 'Year' }
        ]} onView={setEditing} onEdit={setEditing} onDelete={async (id) => { await crud.remove(id); setToast('Student deleted'); }} />
        <Pagination page={crud.page} onChange={(page) => crud.load({ page })} />
      </div>
      <ModalForm title={editing?.id ? 'Edit Student' : 'Add Student'} show={Boolean(editing)} onClose={() => setEditing(null)} onSubmit={submit}>
        {editing && <div className="row g-3">
          {['name', 'registerNumber', 'email', 'phoneNumber', 'address'].map((field) => (
            <div className={field === 'address' ? 'col-12' : 'col-md-6'} key={field}>
              <label className="form-label text-capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input required={field !== 'address'} className="form-control" value={editing[field] || ''} onChange={(e) => setEditing({ ...editing, [field]: e.target.value })} />
            </div>
          ))}
          <div className="col-md-6">
            <label className="form-label">Department</label>
            <select required className="form-select" value={editing.department || ''} onChange={(e) => setEditing({ ...editing, department: e.target.value })}>
              <option value="">Select Department</option>
              {departments.map((department) => <option key={department} value={department}>{department}</option>)}
            </select>
          </div>
          <div className="col-md-4"><label className="form-label">Gender</label><select className="form-select" value={editing.gender} onChange={(e) => setEditing({ ...editing, gender: e.target.value })}><option>Male</option><option>Female</option><option>Other</option></select></div>
          <div className="col-md-4"><label className="form-label">Year</label><input type="number" min="1" max="5" className="form-control" value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} /></div>
          <div className="col-md-4"><label className="form-label">DOB</label><input type="date" className="form-control" value={editing.dob || ''} onChange={(e) => setEditing({ ...editing, dob: e.target.value })} /></div>
          <div className="col-12"><label className="form-label">Profile Photo</label><input type="file" accept="image/*" className="form-control" onChange={(e) => setPhoto(e.target.files[0])} /></div>
          {editing.profilePhotoPath && <div className="col-12">
            <label className="form-label">Uploaded Photo Preview</label>
            <div><img className="profile-preview" src={photoUrl(editing.id)} alt={editing.name} /></div>
          </div>}
        </div>}
      </ModalForm>
    </div>
  );
}
