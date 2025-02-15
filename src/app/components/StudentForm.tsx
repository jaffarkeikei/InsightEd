'use client';

import { useState, useEffect } from 'react';
import Toast from './Toast';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: Partial<Student>) => void;
  student?: Student;
}

interface Student {
  id: string;
  name: string;
  grade: string;
  email: string;
  performance: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
  lastFeedback: string;
  studentId: string;
  dateOfBirth: string;
  parentName: string;
  parentEmail: string;
}

export default function StudentForm({ isOpen, onClose, onSubmit, student }: StudentFormProps) {
  const emptyFormData = {
    studentId: '',
    name: '',
    email: '',
    grade: '',
    performance: 'Good',
    dateOfBirth: '',
    parentName: '',
    parentEmail: ''
  };

  const [formData, setFormData] = useState<Partial<Student>>(emptyFormData);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'error' | 'success';
  }>({
    show: false,
    message: '',
    type: 'error'
  });

  // Reset form data when student prop changes or form opens/closes
  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData(emptyFormData);
    }
  }, [student, isOpen]);

  const validateField = (name: keyof Student, value: string): string | null => {
    switch (name) {
      case 'studentId':
        return value.match(/^STU\d{3}$/) 
          ? null 
          : 'Student ID must be in format STU followed by 3 digits';
      case 'email':
        return value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
          ? null
          : 'Please enter a valid email address';
      case 'parentEmail':
        return value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
          ? null
          : 'Please enter a valid parent email address';
      case 'name':
      case 'parentName':
        return value.trim().length >= 2
          ? null
          : `${name === 'name' ? 'Student' : 'Parent'} name must be at least 2 characters`;
      case 'grade':
        return value.match(/^(1[0-2]|[1-9])th$/)
          ? null
          : 'Grade must be in format "nth" where n is 1-12';
      default:
        return null;
    }
  };

  const handleInputChange = (name: keyof Student, value: string) => {
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
      const error = validateField(key as keyof Student, value as string);
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
            {student ? 'Edit Student' : 'Add New Student'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Student ID</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                placeholder="STU001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Grade</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.grade}
                onChange={(e) => handleInputChange('grade', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Parent Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.parentName}
                onChange={(e) => handleInputChange('parentName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Parent Email</label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.parentEmail}
                onChange={(e) => handleInputChange('parentEmail', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Performance</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.performance}
                onChange={(e) => handleInputChange('performance', e.target.value as Student['performance'])}
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Needs Improvement">Needs Improvement</option>
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
                {student ? 'Update' : 'Add'} Student
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