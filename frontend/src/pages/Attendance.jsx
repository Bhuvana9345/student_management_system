import { useEffect, useCallback, useState } from 'react';
import { attendanceApi, studentsApi } from '../api/services';
import Toast from '../components/Toast';

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState([]);
  const [toast, setToast] = useState('');
  const loadRecords = useCallback(() => {
    attendanceApi.list({ date, size: 200 }).then((r) => setRecords(r.data.content || r.data));
  }, [date]);

  useEffect(() => {
    studentsApi.list({ size: 200 }).then((r) => setStudents(r.data.content || r.data));
  }, []);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  const mark = async (studentId, status) => {
    await attendanceApi.mark({ studentId, date, status });
    loadRecords();
    setToast('Attendance updated');
  };
  const statusOf = (studentId) => records.find((r) => r.student?.id === studentId)?.status || 'NOT_MARKED';

  return (
    <div className="page">
      <Toast message={toast} onClose={() => setToast('')} />
      <div className="toolbar"><div><h2>Attendance</h2><p>Mark daily attendance and review calculated percentages.</p></div><input className="form-control date-control" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div className="panel">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr><th>Register No</th><th>Student</th><th>Department</th><th>Status</th><th className="text-end">Mark</th></tr>
            </thead>
            <tbody>
              {students.length === 0 && <tr><td colSpan="5" className="text-center py-5 text-muted">Add students first, then mark attendance.</td></tr>}
              {students.map((student) => {
                const status = statusOf(student.id);
                return (
                  <tr key={student.id}>
                    <td>{student.registerNumber}</td>
                    <td>{student.name}</td>
                    <td>{student.department}</td>
                    <td><span className={`badge text-bg-${status === 'PRESENT' ? 'success' : status === 'ABSENT' ? 'danger' : 'secondary'}`}>{status}</span></td>
                    <td className="text-end">
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-success" type="button" onClick={() => mark(student.id, 'PRESENT')}>Present</button>
                        <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => mark(student.id, 'ABSENT')}>Absent</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
