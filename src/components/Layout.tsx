import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { student, enrollments, attendance, loading } = useData();

  if (loading) {
    return <div style={styles.loading}>Loading your data...</div>;
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h2>AUY Portal</h2>
        <div>
          <span style={styles.email}>{user?.email}</span>
          <button onClick={logout} style={styles.logout}>Logout</button>
        </div>
      </nav>
      
      <main style={styles.main}>
        {student && (
          <div style={styles.card}>
            <h3>Welcome, {student.studentName}!</h3>
            <p>Student ID: {student.studentId}</p>
            <p>Major: {student.major}</p>
          </div>
        )}

        <div style={styles.card}>
          <h3>My Courses ({enrollments.length})</h3>
          {enrollments.map((e, i) => (
            <div key={i} style={styles.course}>
              {e.courseName} - Grade: {e.grade}
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <h3>Attendance</h3>
          {attendance.map((a, i) => (
            <div key={i}>{a.courseId}: {a.percentage}%</div>
          ))}
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
  },
  nav: {
    background: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  email: {
    marginRight: '20px',
    color: '#666',
  },
  logout: {
    padding: '8px 16px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  main: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  course: {
    padding: '10px',
    borderBottom: '1px solid #eee',
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: '#666',
  },
};

export default Layout;
