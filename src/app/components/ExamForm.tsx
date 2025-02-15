'use client';

import { useState, useEffect } from 'react';
import Toast from './Toast';

interface ExamFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (exam: Partial<Exam>) => void;
  exam?: Exam;
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

export default function ExamForm({ isOpen, onClose, onSubmit, exam }: ExamFormProps) {
  const emptyFormData = {
    examId: '',
    subject: '',
    class: '',
    date: '',
    duration: '',
    totalMarks: 100,
    status: 'Upcoming' as const
  };

  const [formData, setFormData] = useState<Partial<Exam>>(emptyFormData);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'error' | 'success' }>({
    show: false,
    message: '',
    type: 'error'
  });

  useEffect(() => {
    if (exam) {
      setFormData(exam);
    } else {
      setFormData(emptyFormData);
    }
  }, [exam, isOpen]);

  const validateField = (name: keyof Exam, value: string): string | null => {
    switch (name) {
      case 'examId':
        return value.match(/^EXM\d{3}$/)
          ? null
          : 'Exam ID must be in format EXM followed by 3 digits';
      case 'subject':
        return value.trim().length >= 2
          ? null
          : 'Subject must be at least 2 characters';
      case 'class':
        return value.match(/^(1[0-2]|[1-9])th$/)
          ? null
          : 'Class must be in format "nth" where n is 1-12';
      case 'date':
        return value ? null : 'Date is required';
      case 'duration':
        return value.trim().length >= 2 ? null : 'Duration must be at least 2 characters';
      case 'totalMarks':
        return value > '0' ? null : 'Total marks must be greater than 0';
      case 'status':
        return value === 'Upcoming' || value === 'In Progress' || value === 'Completed'
          ? null
          : 'Status must be one of: Upcoming, In Progress, Completed';
      default:
        return null;
    }
  };

  const handleInputChange = (name: keyof Exam, value: string) => {
    setFormData({ ...formData, [name]: value });
    
    // Check if the new value fixes the current error
    const error = validateField(name, value);
    if (!error && toast.show) {
      setToast({ ...toast, show: false });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = Object.entries(formData).reduce((acc: string[], [key, value]) => {
      const error = validateField(key as keyof Exam, value as string);
      if (error) acc.push(error);
      return acc;
    }, []);

    if (errors.length > 0) {
      setToast({
        show: true,
        message: errors[0],
        type: 'error'
      });
      return;
    }

    // Only call onSubmit if validation passes
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            {exam ? 'Edit Exam' : 'Add New Exam'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Exam ID</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.examId}
                onChange={(e) => handleInputChange('examId', e.target.value)}
                placeholder="EXM001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Class</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.class}
                onChange={(e) => handleInputChange('class', e.target.value)}
                placeholder="10th"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="2 hours"
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
                onChange={(e) => handleInputChange('totalMarks', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as Exam['status'])}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
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
                {exam ? 'Update' : 'Add'} Exam
              </button>
            </div>
          </form>
        </div>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
} 