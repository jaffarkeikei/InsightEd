'use client';

import { useState, useMemo } from 'react';
import StudentForm from './StudentForm';
import StudentProfile from './StudentProfile';
import Toast from './Toast';

interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  grade: string;
  performance: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
  dateOfBirth: string;
  parentName: string;
  parentEmail: string;
}

const mockStudents: Student[] = [
  {
    id: '1',
    studentId: 'STU001',
    name: 'John Doe',
    email: 'john.doe@school.com',
    grade: '10th',
    performance: 'Excellent',
    dateOfBirth: '2008-05-14',
    parentName: 'Robert Doe',
    parentEmail: 'robert.doe@email.com'
  },
  {
    id: '2',
    studentId: 'STU002',
    name: 'Jane Smith',
    email: 'jane.smith@school.com',
    grade: '10th',
    performance: 'Good',
    dateOfBirth: '2008-03-20',
    parentName: 'Robert Doe',
    parentEmail: 'robert.doe@email.com'
  },
  // Add more mock data as needed
];

type SortField = keyof Student;
type SortDirection = 'asc' | 'desc';

// Update the sorting helper function
const sortStudents = (a: Student, b: Student, field: SortField, direction: SortDirection) => {
  // Special handling for studentId
  if (field === 'studentId') {
    // Extract numbers from STU001 format and compare them
    const numA = parseInt(a.studentId.replace('STU', ''), 10);
    const numB = parseInt(b.studentId.replace('STU', ''), 10);
    // Flip the comparison for proper ascending/descending order
    return direction === 'asc' ? numA - numB : numB - numA;
  }

  // Handle date of birth (age)
  if (field === 'dateOfBirth') {
    // Convert strings to Date objects for proper comparison
    const dateA = new Date(a.dateOfBirth);
    const dateB = new Date(b.dateOfBirth);
    // For age, older (earlier date) should come first in ascending order
    return direction === 'asc' 
      ? dateA.getTime() - dateB.getTime() 
      : dateB.getTime() - dateA.getTime();
  }

  // Handle other string fields
  const valueA = String(a[field]).toLowerCase();
  const valueB = String(b[field]).toLowerCase();
  return direction === 'asc' 
    ? valueA.localeCompare(valueB)
    : valueB.localeCompare(valueA);
};

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'name',
    direction: 'asc'
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(undefined);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProfileStudent, setSelectedProfileStudent] = useState<Student | undefined>(undefined);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'error' | 'success';
  }>({
    show: false,
    message: '',
    type: 'error'
  });

  // Sorting function
  const handleSort = (field: SortField) => {
    setSortConfig({
      field,
      direction: sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Update the useMemo sorting logic
  const filteredStudents = useMemo(() => {
    let result = [...students];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(student => 
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.grade.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting using the updated helper function
    result.sort((a, b) => sortStudents(a, b, sortConfig.field, sortConfig.direction));
    
    return result;
  }, [students, searchTerm, sortConfig]);

  const handleSubmit = (studentData: Partial<Student>) => {
    try {
      if (selectedStudent) {
        // Check if any data actually changed
        const hasChanges = Object.keys(studentData).some(
          key => studentData[key as keyof Student] !== selectedStudent[key as keyof Student]
        );

        if (!hasChanges) {
          setIsFormOpen(false);
          setSelectedStudent(undefined);
          return; // Exit without showing success message if no changes
        }

        // Update existing student
        setStudents(students.map(s => 
          s.id === selectedStudent.id ? { ...s, ...studentData } : s
        ));
        setToast({
          show: true,
          message: 'Student updated successfully!',
          type: 'success'
        });
      } else {
        // Only show success for new student after form submission
        const newStudent = {
          ...studentData,
          id: Date.now().toString(),
        } as Student;
        setStudents([...students, newStudent]);
        setToast({
          show: true,
          message: 'Student added successfully!',
          type: 'success'
        });
      }
      setIsFormOpen(false);
      setSelectedStudent(undefined);
    } catch (error) {
      setToast({
        show: true,
        message: 'An error occurred while saving the student.',
        type: 'error'
      });
    }
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent({
      id: student.id,
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      grade: student.grade,
      performance: student.performance,
      dateOfBirth: student.dateOfBirth,
      parentName: student.parentName,
      parentEmail: student.parentEmail
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleViewProfile = (student: Student) => {
    setSelectedProfileStudent(student);
    setIsProfileOpen(true);
  };

  // Add validation helper
  const validateStudent = (student: Partial<Student>): string[] => {
    const errors: string[] = [];
    
    // Student ID validation
    if (!student.studentId?.match(/^STU\d{3}$/)) {
      errors.push('Student ID must be in format STU followed by 3 digits (e.g., STU001)');
    }

    // Email validation
    if (!student.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push('Please enter a valid email address');
    }

    // Name validation
    if (!student.name?.trim() || student.name.length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Grade validation
    if (!student.grade?.match(/^(1[0-2]|[1-9])th$/)) {
      errors.push('Grade must be in format "nth" where n is 1-12 (e.g., 10th)');
    }

    // Date of Birth validation
    if (student.dateOfBirth) {
      const dob = new Date(student.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 5 || age > 20) {
        errors.push('Student must be between 5 and 20 years old');
      }
    }

    return errors;
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Students</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search students..."
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Student
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { label: 'Student ID', field: 'studentId' },
                  { label: 'Name & Email', field: 'name' },
                  { label: 'Parent Name & Email', field: 'parentName' },
                  { label: 'Grade', field: 'grade' },
                  { label: 'Performance', field: 'performance' },
                  { label: 'Date of Birth', field: 'dateOfBirth' }
                ].map(({ label, field }) => (
                  <th
                    key={field}
                    onClick={() => handleSort(field as SortField)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    {label}
                    {sortConfig.field === field && (
                      <span className="ml-2">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{student.parentName}</div>
                      <div className="text-sm text-gray-500">{student.parentEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${student.performance === 'Excellent' ? 'bg-green-100 text-green-800' : 
                        student.performance === 'Good' ? 'bg-blue-100 text-blue-800' :
                        student.performance === 'Average' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                      {student.performance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(student.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleViewProfile(student)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <StudentForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedStudent(undefined);
        }}
        onSubmit={handleSubmit}
        student={selectedStudent}
      />

      {selectedProfileStudent && (
        <StudentProfile
          isOpen={isProfileOpen}
          onClose={() => {
            setIsProfileOpen(false);
            setSelectedProfileStudent(undefined);
          }}
          student={selectedProfileStudent}
        />
      )}

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