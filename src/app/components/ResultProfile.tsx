'use client';

import { useState } from 'react';

interface ResultProfileProps {
  isOpen: boolean;
  onClose: () => void;
  result: ExamResult;
}

interface ExamResult {
  id: string;
  examId: string;
  examName: string;
  studentId: string;
  studentName: string;
  class: string;
  marks: number;
  totalMarks: number;
  status: 'Pass' | 'Fail';
  date: string;
}

export default function ResultProfile({ isOpen, onClose, result }: ResultProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance'>('overview');

  if (!isOpen) return null;

  const percentage = ((result.marks / result.totalMarks) * 100).toFixed(1);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Result Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'performance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Performance Analysis
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Exam ID</h3>
                <p className="mt-1 text-sm text-gray-900">{result.examId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Exam Name</h3>
                <p className="mt-1 text-sm text-gray-900">{result.examName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Student ID</h3>
                <p className="mt-1 text-sm text-gray-900">{result.studentId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Student Name</h3>
                <p className="mt-1 text-sm text-gray-900">{result.studentName}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Class</h3>
                <p className="mt-1 text-sm text-gray-900">{result.class}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(result.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Marks</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {result.marks} / {result.totalMarks} ({percentage}%)
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  result.status === 'Pass' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {result.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Analysis</h3>
              <div className="space-y-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        Score Percentage
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div
                      style={{ width: `${percentage}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Pass Mark</div>
                    <div className="text-xl font-semibold text-gray-900">40%</div>
                  </div>
                  <div className={`bg-white p-4 rounded-lg shadow-sm ${
                    result.status === 'Pass' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <div className="text-sm">Status</div>
                    <div className="text-xl font-semibold">{result.status}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 