import { useEffect, useState } from 'react';
import { coursesApi, marksApi, studentsApi } from '../api/services';
import DataTable from '../components/DataTable';
import Toast from '../components/Toast';
import { departments } from '../utils/departments';

export default function Marks() {
  const [form, setForm] = useState({ studentId: '', courseId: '', semester: 1, internalMarks: 0, externalMarks: 0 });
  const [rows, setRows] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [toast, setToast] = useState('');
  const load = () => marksApi.list().then((r) => setRows(r.data.content || r.data));
  useEffect(() => {
    load();
    studentsApi.list({ size: 200 }).then((r) => setStudents(r.data.content || r.data));
    coursesApi.list({ size: 200 }).then((r) => {
      const courseRows = (r.data.content || r.data).filter((course) => departments.includes(course.name));
      setCourses(courseRows);
    });
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.courseId) return setToast('Select student and course first');
    await marksApi.save(form);
    setToast('Marks saved with GPA and grade calculation');
    load();
  };
  return (
    <div className="page">
      <Toast message={toast} onClose={() => setToast('')} />
      <div className="toolbar"><div><h2>Marks Management</h2><p>Add semester marks, update grades, and calculate GPA.</p></div></div>
      <div className="panel mb-3">
        <form className="row g-3" onSubmit={submit}>
          <div className="col-md">
            <label className="form-label">Student</label>
            <select required className="form-select" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
              <option value="">Select Student</option>
              {students.map((student) => <option key={student.id} value={student.id}>{student.registerNumber} | {student.name} | {student.department}</option>)}
            </select>
          </div>
          <div className="col-md">
            <label className="form-label">Course / Group</label>
            <select required className="form-select" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}>
              <option value="">Select Course / Group</option>
              {courses.map((course) => (
                <option key={`course-${course.id}`} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          {['semester', 'internalMarks', 'externalMarks'].map((field) => <div className="col-md" key={field}><label className="form-label text-capitalize">{field.replace(/([A-Z])/g, ' $1')}</label><input required type="number" className="form-control" value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} /></div>)}
          <div className="col-md-auto align-self-end"><button className="btn btn-primary">Save Marks</button></div>
        </form>
        {students.length === 0 && <small className="text-muted d-block mt-3">Student dropdown-ku first Students page-la student add pannanum.</small>}
        {courses.length === 0 && <small className="text-muted d-block mt-2">Course dropdown-ku first Courses page-la course add pannanum.</small>}
      </div>
      <div className="panel"><DataTable rows={rows} columns={[
        { key: 'registerNumber', label: 'Reg No' },
        { key: 'studentName', label: 'Student Name' },
        { key: 'courseName', label: 'Course / Group' },
        { key: 'semester', label: 'Sem' },
        { key: 'internalMarks', label: 'Internal' },
        { key: 'externalMarks', label: 'External' },
        { key: 'total', label: 'Total' },
        { key: 'grade', label: 'Grade' },
        { key: 'gpa', label: 'GPA' }
      ]} /></div>
    </div>
  );
}
