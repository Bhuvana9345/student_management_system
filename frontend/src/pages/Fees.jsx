import { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import { feesApi, studentsApi } from '../api/services';
import DataTable from '../components/DataTable';
import Toast from '../components/Toast';

export default function Fees() {
  const [form, setForm] = useState({ studentId: '', amount: 0, status: 'PAID', paymentMode: 'Cash' });
  const [rows, setRows] = useState([]);
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({});
  const [toast, setToast] = useState('');
  const load = async () => {
    const [fees, sum] = await Promise.all([feesApi.list(), feesApi.summary()]);
    setRows(fees.data.content || fees.data);
    setSummary(sum.data);
  };
  useEffect(() => {
    load();
    studentsApi.list({ size: 200 }).then((r) => setStudents(r.data.content || r.data));
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    if (!form.studentId) return setToast('Select student first');
    await feesApi.save(form);
    setToast('Fee entry saved');
    load();
  };
  const receipt = async (row) => { const { data } = await feesApi.receipt(row.id); saveAs(data, `receipt-${row.id}.pdf`); };
  return (
    <div className="page">
      <Toast message={toast} onClose={() => setToast('')} />
      <div className="row g-3 mb-3">
        <div className="col-md-4"><div className="metric-card green"><div><small>Paid</small><strong>{summary.paidCount || 0}</strong></div></div></div>
        <div className="col-md-4"><div className="metric-card rose"><div><small>Unpaid</small><strong>{summary.unpaidCount || 0}</strong></div></div></div>
        <div className="col-md-4"><div className="metric-card blue"><div><small>Collected</small><strong>₹{summary.totalCollected || 0}</strong></div></div></div>
      </div>
      <div className="panel mb-3">
        <h2>Fees Management</h2>
        <form className="row g-3" onSubmit={submit}>
          <div className="col-md">
            <label className="form-label">Student</label>
            <select required className="form-select" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
              <option value="">Select Student</option>
              {students.map((student) => <option key={student.id} value={student.id}>{student.registerNumber} - {student.name}</option>)}
            </select>
          </div>
          <div className="col-md"><label className="form-label">Amount</label><input required type="number" className="form-control" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
          <div className="col-md">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value, paymentMode: e.target.value === 'PAID' ? 'Cash' : 'Not Paid' })}
            >
              <option>PAID</option>
              <option>UNPAID</option>
            </select>
          </div>
          {form.status === 'PAID' && (
            <div className="col-md">
              <label className="form-label">Payment Type</label>
              <select className="form-select" value={form.paymentMode} onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}>
                <option>Cash</option>
                <option>Online Payment</option>
              </select>
            </div>
          )}
          <div className="col-md-auto align-self-end"><button className="btn btn-primary">Save Payment</button></div>
        </form>
        {students.length === 0 && <small className="text-muted d-block mt-3">Fees save panna first Students page-la student add pannanum.</small>}
      </div>
      <div className="panel"><DataTable rows={rows} columns={[{ key: 'studentName', label: 'Student' }, { key: 'amount', label: 'Amount' }, { key: 'status', label: 'Status' }, { key: 'paymentMode', label: 'Payment Type' }, { key: 'paymentDate', label: 'Date' }]} onView={receipt} /></div>
    </div>
  );
}
