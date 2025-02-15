'use client';

import { useState } from 'react';

interface StudentProfileProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

interface Student {
  id: string;
  studentId: string;
  name: string;
  grade: string;
  email: string;
  performance: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
  dateOfBirth: string;
  parentName: string;
  parentEmail: string;
}

interface FeedbackEntry {
  id: string;
  date: string;
  comment: string;
  type: 'academic' | 'behavioral' | 'general';
}

const mockFeedback: FeedbackEntry[] = [
  {
    id: '1',
    date: '2024-03-20',
    comment: 'Excellent progress in mathematics, showing strong analytical skills.',
    type: 'academic'
  },
  {
    id: '2',
    date: '2024-03-15',
    comment: 'Active participation in class discussions.',
    type: 'behavioral'
  },
  // Add more mock feedback as needed
];

export default function StudentProfile({ isOpen, onClose, student }: StudentProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'feedback' | 'performance'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-3/4 max-w-4xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'feedback', 'performance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Student ID</h3>
                  <p className="mt-1 text-sm text-gray-900">{student.studentId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1 text-sm text-gray-900">{student.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-sm text-gray-900">{student.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Grade</h3>
                  <p className="mt-1 text-sm text-gray-900">{student.grade}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Parent Name</h3>
                  <p className="mt-1 text-sm text-gray-900">{student.parentName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Parent Email</h3>
                  <p className="mt-1 text-sm text-gray-900">{student.parentEmail}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(student.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Performance</h3>
                  <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${student.performance === 'Excellent' ? 'bg-green-100 text-green-800' : 
                      student.performance === 'Good' ? 'bg-blue-100 text-blue-800' :
                      student.performance === 'Average' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {student.performance}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-4">
              {mockFeedback.map((entry) => (
                <div key={entry.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${entry.type === 'academic' ? 'bg-blue-100 text-blue-800' :
                          entry.type === 'behavioral' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {entry.type}
                      </span>
                      <p className="mt-2 text-sm text-gray-900">{entry.comment}</p>
                    </div>
                    <span className="text-sm text-gray-500">{entry.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
                {/* Add performance charts or metrics here */}
                <p className="text-sm text-gray-500">Performance tracking features coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 