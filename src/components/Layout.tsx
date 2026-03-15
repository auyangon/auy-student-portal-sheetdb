import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { student, enrollments, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">AUY Student Portal</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Info */}
        {student && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">Welcome, {student.studentName}!</h2>
            <p className="text-gray-600">Student ID: {student.studentId}</p>
            <p className="text-gray-600">Major: {student.major}</p>
          </div>
        )}

        {/* Enrollments */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">My Courses</h2>
          {enrollments.length > 0 ? (
            <div className="grid gap-4">
              {enrollments.map((enrollment) => (
                <div key={enrollment.enrollmentId} className="border rounded-lg p-4">
                  <h3 className="font-medium">{enrollment.courseName}</h3>
                  <p className="text-sm text-gray-600">Grade: {enrollment.grade}</p>
                  <p className="text-sm text-gray-600">Credits: {enrollment.credits}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No courses found</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Layout;
