'use client';

import { useState, useEffect } from 'react';
import Toast from './Toast';

interface ResultFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (result: Partial<ExamResult>) => void;
  result?: ExamResult;
  exams: { id: string; name: string }[];
  students: { id: string; name: string }[];
  classes: string[];
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

export default function ResultForm({ isOpen, onClose, onSubmit, result, exams, students, classes }: ResultFormProps) {
  const emptyFormData = {
    examId: '',
    examName: '',
    studentId: '',
    studentName: '',
    class: '',
    marks: 0,
    totalMarks: 100,
    date: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState<Partial<ExamResult>>(emptyFormData);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'error' | 'success' }>({
    show: false,
    message: '',
    type: 'error'
  });

  useEffect(() => {
    if (result) {
      setFormData(result);
    } else {
      setFormData(emptyFormData);
    }
  }, [result, isOpen]);

  const handleExamChange = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    setFormData({
      ...formData,
      examId,
      examName: exam?.name || ''
    });
  };

  const handleStudentChange = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setFormData({
      ...formData,
      studentId,
      studentName: student?.name || ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.examId || !formData.studentId || !formData.marks) {
      setToast({
        show: true,
        message: 'Please fill in all required fields',
        type: 'error'
      });
      return;
    }

    // Calculate status based on marks (assuming 40% is pass mark)
    const status = (formData.marks! / formData.totalMarks!) >= 0.4 ? 'Pass' : 'Fail';
    onSubmit({ ...formData, status });
  };

  // Update the generateExamId function
  const generateExamId = (classValue: string, subject: string) => {
    // Get first 3 letters of subject, uppercase them, and remove spaces
    const subjectCode = subject
      .replace(/\s+/g, '') // Remove all spaces
      .slice(0, 3) // Take first 3 characters
      .toUpperCase(); // Convert to uppercase
    
    const existingExams = exams.filter(e => 
      e.id.startsWith(`${classValue}-${subjectCode}-`)
    );
    const nextNumber = (existingExams.length + 1).toString().padStart(3, '0');
    return `${classValue}-${subjectCode}-${nextNumber}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {result ? 'Edit Result' : 'Add New Result'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.class}
              onChange={(e) => {
                const newClass = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  class: newClass,
                  examId: prev.examName ? generateExamId(newClass, prev.examName) : ''
                }));
              }}
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.examName}
              onChange={(e) => {
                const subject = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  examName: subject,
                  examId: prev.class ? generateExamId(prev.class, subject) : ''
                }));
              }}
            >
              <option value="">Select Subject</option>
              {Array.from(new Set(exams.map(exam => exam.name))).map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Exam ID</label>
            <input
              type="text"
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
              value={formData.examId}
            />
            <p className="mt-1 text-sm text-gray-500">
              Auto-generated based on class and subject
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Student</label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.studentId}
              onChange={(e) => handleStudentChange(e.target.value)}
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Marks</label>
            <input
              type="number"
              required
              min="0"
              max={formData.totalMarks}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total Marks</label>
            <input
              type="number"
              required
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.totalMarks}
              onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {result ? 'Update' : 'Add'} Result
            </button>
          </div>
        </form>

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </div>
    </div>
  );
} 