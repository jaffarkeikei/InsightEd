'use client';

import { useState, useMemo } from 'react';
import Toast from './Toast';
import ExamForm from './ExamForm';
import ExamProfile from './ExamProfile';

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

const mockExams: Exam[] = [
  {
    id: '1',
    examId: 'EXM001',
    subject: 'Mathematics',
    class: '10th',
    date: '2024-03-25',
    duration: '2 hours',
    totalMarks: 100,
    status: 'Upcoming'
  },
  {
    id: '2',
    examId: 'EXM002',
    subject: 'Physics',
    class: '12th',
    date: '2024-03-20',
    duration: '3 hours',
    totalMarks: 100,
    status: 'Completed'
  },
  {
    id: '3',
    examId: 'EXM003',
    subject: 'Chemistry',
    class: '11th',
    date: '2024-03-22',
    duration: '2.5 hours',
    totalMarks: 100,
    status: 'In Progress'
  }
];

type SortField = keyof Exam;
type SortDirection = 'asc' | 'desc';

export default function ExamsList() {
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'examId',
    direction: 'asc'
  });
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'error' | 'success';
  }>({
    show: false,
    message: '',
    type: 'error'
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | undefined>(undefined);
  const [isViewMode, setIsViewMode] = useState(false);

  const sortExams = (a: Exam, b: Exam, field: SortField, direction: SortDirection) => {
    if (field === 'examId') {
      const numA = parseInt(a.examId.replace('EXM', ''));
      const numB = parseInt(b.examId.replace('EXM', ''));
      return direction === 'asc' ? numA - numB : numB - numA;
    }

    if (field === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    }

    if (field === 'totalMarks') {
      return direction === 'asc' ? a.totalMarks - b.totalMarks : b.totalMarks - a.totalMarks;
    }

    const valueA = String(a[field]).toLowerCase();
    const valueB = String(b[field]).toLowerCase();
    return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  };

  const filteredExams = useMemo(() => {
    let result = [...exams];
    
    if (searchTerm) {
      result = result.filter(exam => 
        exam.examId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.class.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    result.sort((a, b) => sortExams(a, b, sortConfig.field, sortConfig.direction));
    
    return result;
  }, [exams, searchTerm, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig({
      field,
      direction: sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

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

  const handleAdd = () => {
    setSelectedExam(undefined);
    setIsFormOpen(true);
    setIsViewMode(false);
  };

  const handleEdit = (exam: Exam) => {
    setSelectedExam(exam);
    setIsFormOpen(true);
    setIsViewMode(false);
  };

  const handleView = (exam: Exam) => {
    setSelectedExam(exam);
    setIsProfileOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      setExams(exams.filter(exam => exam.id !== id));
      setToast({
        show: true,
        message: 'Exam deleted successfully',
        type: 'success'
      });
    }
  };

  const handleSubmit = (examData: Partial<Exam>) => {
    try {
      if (selectedExam) {
        // Check if any data actually changed
        const hasChanges = Object.keys(examData).some(
          key => examData[key as keyof Exam] !== selectedExam[key as keyof Exam]
        );

        if (!hasChanges) {
          setIsFormOpen(false);
          setSelectedExam(undefined);
          return; // Exit without showing success message if no changes
        }

        // Update existing exam
        setExams(exams.map(e => 
          e.id === selectedExam.id ? { ...e, ...examData } : e
        ));
        setToast({
          show: true,
          message: 'Exam updated successfully!',
          type: 'success'
        });
      } else {
        // Only show success for new exam after form submission
        const newExam = {
          ...examData,
          id: Date.now().toString(),
        } as Exam;
        setExams([...exams, newExam]);
        setToast({
          show: true,
          message: 'Exam added successfully!',
          type: 'success'
        });
      }
      setIsFormOpen(false);
      setSelectedExam(undefined);
    } catch (error) {
      setToast({
        show: true,
        message: 'An error occurred while saving the exam.',
        type: 'error'
      });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Exams</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search exams..."
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Exam
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { label: 'Exam ID', field: 'examId' },
                  { label: 'Subject', field: 'subject' },
                  { label: 'Class', field: 'class' },
                  { label: 'Date', field: 'date' },
                  { label: 'Duration', field: 'duration' },
                  { label: 'Total Marks', field: 'totalMarks' },
                  { label: 'Status', field: 'status' }
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
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.examId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exam.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(exam.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exam.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exam.totalMarks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(exam.status)}`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleView(exam)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(exam)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exam.id)}
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

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <ExamForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedExam(undefined);
        }}
        onSubmit={handleSubmit}
        exam={selectedExam}
      />

      {selectedExam && (
        <ExamProfile
          isOpen={isProfileOpen}
          onClose={() => {
            setIsProfileOpen(false);
            setSelectedExam(undefined);
          }}
          exam={selectedExam}
        />
      )}
    </div>
  );
} 