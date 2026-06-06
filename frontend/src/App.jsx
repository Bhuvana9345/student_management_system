import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Staff from './pages/Staff';
import Courses from './pages/Courses';
import Attendance from './pages/Attendance';
import Marks from './pages/Marks';
import Fees from './pages/Fees';
import AIGuide from './pages/AIGuide';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login/:role" element={<Login />} />
        <Route path="/login" element={<Navigate to="/login/admin" replace />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="staff" element={<Staff />} />
            <Route path="courses" element={<Courses />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="marks" element={<Marks />} />
            <Route path="fees" element={<Fees />} />
            <Route path="ai-guide" element={<AIGuide />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
