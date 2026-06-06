import { useEffect, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import { BookOpen, CalendarCheck, CreditCard, UsersRound } from 'lucide-react';
import { dashboardApi } from '../api/services';
import { college } from '../utils/college';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dashboardApi.stats().then((res) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  const stats = data || { totalStudents: 0, totalCourses: 0, attendancePercentage: 0, feeCollectionStatus: 0, recentActivities: [] };
  const cards = [
    { label: 'Total Students', value: stats.totalStudents, icon: UsersRound, tone: 'blue' },
    { label: 'Total Courses', value: stats.totalCourses, icon: BookOpen, tone: 'green' },
    { label: 'Attendance', value: `${stats.attendancePercentage}%`, icon: CalendarCheck, tone: 'amber' },
    { label: 'Fee Collection', value: `${stats.feeCollectionStatus}%`, icon: CreditCard, tone: 'rose' }
  ];

  return (
    <div className="page">
      <div className="college-strip">
        <strong>{college.name}</strong>
        <span>{college.address}</span>
        <span>{college.phone} | {college.website}</span>
      </div>
      <div className="row g-3">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <div className="col-12 col-sm-6 col-xl-3" key={label}>
            <div className={`metric-card ${tone}`}>
              <div><small>{label}</small><strong>{loading ? '...' : value}</strong></div>
              <Icon />
            </div>
          </div>
        ))}
      </div>
      <div className="row g-3 mt-1">
        <div className="col-lg-8">
          <div className="panel">
            <h2>Monthly Attendance</h2>
            <Line data={{ labels: stats.months || [], datasets: [{ label: 'Attendance %', data: stats.attendanceTrend || [], borderColor: '#2563eb', backgroundColor: '#bfdbfe' }] }} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="panel">
            <h2>Fee Status</h2>
            <Doughnut data={{ labels: ['Collected', 'Pending'], datasets: [{ data: [stats.feeCollectionStatus, 100 - stats.feeCollectionStatus], backgroundColor: ['#16a34a', '#f97316'] }] }} />
          </div>
        </div>
        <div className="col-lg-7">
          <div className="panel">
            <h2>Department Strength</h2>
            <Bar data={{ labels: Object.keys(stats.departmentCounts || {}), datasets: [{ label: 'Students', data: Object.values(stats.departmentCounts || {}), backgroundColor: '#0f766e' }] }} />
          </div>
        </div>
        <div className="col-lg-5">
          <div className="panel activity-panel">
            <h2>Recent Activities</h2>
            {(stats.recentActivities || []).map((item) => <div className="activity" key={item.id}><span>{item.action}</span><small>{item.createdAt}</small></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
