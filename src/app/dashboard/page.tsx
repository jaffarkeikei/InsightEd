'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StudentList from '../components/StudentList';
import ExamsList from '../components/ExamsList';
import ExamResults from '../components/ExamResults';
import Reports from '../components/Reports';

interface UserData {
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeSection, setActiveSection] = useState<'students' | 'exams' | 'results' | 'reports'>('students');

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    setUserData(JSON.parse(user));
  }, [router]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('user');
    
    // Clear the cookie
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
    // Redirect to login
    router.push('/login');
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">InsightEd</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{userData.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div 
              className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all ${
                activeSection === 'students' ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setActiveSection('students')}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Students Information
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        View Details
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all ${
                activeSection === 'exams' ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setActiveSection('exams')}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Exams Analysis
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        View Details
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all ${
                activeSection === 'results' ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setActiveSection('results')}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Exam Results
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        View Details
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all ${
                activeSection === 'reports' ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setActiveSection('reports')}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Report Generation
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Generate Reports
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="mt-6">
            {activeSection === 'students' && <StudentList />}
            {activeSection === 'exams' && <ExamsList />}
            {activeSection === 'results' && <ExamResults />}
            {activeSection === 'reports' && <Reports />}
          </div>
        </div>
      </main>
    </div>
  );
} 