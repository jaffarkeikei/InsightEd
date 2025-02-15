'use client';

import { useState } from 'react';

interface ExamProfileProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam;
}

interface Exam {
  id: string;
  examId: string;
  subject: string;
  class: string;
  date: string;
  duration: string;
  totalMarks: number;
  status: 'Upcoming' | 'Completed' | 'In Progress';
}

interface ResultSummary {
  totalStudents: number;
  passedStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}

const mockResultSummary: ResultSummary = {
  totalStudents: 45,
  passedStudents: 42,
  averageScore: 78.5,
  highestScore: 98,
  lowestScore: 45
};

export default function ExamProfile({ isOpen, onClose, exam }: ExamProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'results' | 'analytics'>('overview');

  if (!isOpen) return null;

  const getStatusColor = (status: Exam['status']) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-gray-900">Exam Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'results', 'analytics'].map((tab) => (
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

        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Exam ID</h3>
                <p className="mt-1 text-sm text-gray-900">{exam.examId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Subject</h3>
                <p className="mt-1 text-sm text-gray-900">{exam.subject}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Class</h3>
                <p className="mt-1 text-sm text-gray-900">{exam.class}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(exam.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                <p className="mt-1 text-sm text-gray-900">{exam.duration}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                  {exam.status}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Marks</h3>
                <p className="mt-1 text-sm text-gray-900">{exam.totalMarks}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Result Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-lg font-medium text-gray-900">{mockResultSummary.totalStudents}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Passed Students</p>
                  <p className="text-lg font-medium text-gray-900">{mockResultSummary.passedStudents}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Average Score</p>
                  <p className="text-lg font-medium text-gray-900">{mockResultSummary.averageScore}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Highest Score</p>
                  <p className="text-lg font-medium text-gray-900">{mockResultSummary.highestScore}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lowest Score</p>
                  <p className="text-lg font-medium text-gray-900">{mockResultSummary.lowestScore}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pass Rate</p>
                  <p className="text-lg font-medium text-gray-900">
                    {((mockResultSummary.passedStudents / mockResultSummary.totalStudents) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Analytics</h3>
              <p className="text-sm text-gray-500">Detailed analytics coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 