'use client';

import { useState, useMemo } from 'react';
import Toast from './Toast';
import ResultForm from './ResultForm';
import ResultProfile from './ResultProfile';

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

const mockResults: ExamResult[] = [
  // John Doe's Results (STU001)
  {
    id: '1',
    examId: 'EX001',
    examName: 'Mathematics',
    studentId: 'STU001',
    studentName: 'John Doe',
    class: '10th',
    marks: 92,
    totalMarks: 100,
    status: 'Pass',
    date: '2024-03-25'
  },
  {
    id: '2',
    examId: 'EX002',
    examName: 'Physics',
    studentId: 'STU001',
    studentName: 'John Doe',
    class: '10th',
    marks: 88,
    totalMarks: 100,
    status: 'Pass',
    date: '2024-03-20'
  },
  {
    id: '3',
    examId: 'EX003',
    examName: 'Chemistry',
    studentId: 'STU001',
    studentName: 'John Doe',
    class: '10th',
    marks: 85,
    totalMarks: 100,
    status: 'Pass',
    date: '2024-03-22'
  },
  {
    id: '4',
    examId: 'EX004',
    examName: 'Biology',
    studentId: 'STU001',
    studentName: 'John Doe',
    class: '10th',
    marks: 68,
    totalMarks: 75,
    status: 'Pass',
    date: '2024-03-28'
  },
  {
    id: '5',
    examId: 'EX005',
    examName: 'English',
    studentId: 'STU001',
    studentName: 'John Doe',
    class: '10th',
    marks: 45,
    totalMarks: 50,
    status: 'Pass',
    date: '2024-03-18'
  },
  // Jane Smith's Results (STU002)
  {
    id: '6',
    examId: 'EX001',
    examName: 'Mathematics',
    studentId: 'STU002',
    studentName: 'Jane Smith',
    class: '10th',
    marks: 95,
    totalMarks: 100,
    status: 'Pass',
    date: '2024-03-25'
  },
  {
    id: '7',
    examId: 'EX002',
    examName: 'Physics',
    studentId: 'STU002',
    studentName: 'Jane Smith',
    class: '10th',
    marks: 82,
    totalMarks: 100,
    status: 'Pass',
    date: '2024-03-20'
  },
  {
    id: '8',
    examId: 'EX003',
    examName: 'Chemistry',
    studentId: 'STU002',
    studentName: 'Jane Smith',
    class: '10th',
    marks: 88,
    totalMarks: 100,
    status: 'Pass',
    date: '2024-03-22'
  },
  {
    id: '9',
    examId: 'EX004',
    examName: 'Biology',
    studentId: 'STU002',
    studentName: 'Jane Smith',
    class: '10th',
    marks: 71,
    totalMarks: 75,
    status: 'Pass',
    date: '2024-03-28'
  },
  {
    id: '10',
    examId: 'EX005',
    examName: 'English',
    studentId: 'STU002',
    studentName: 'Jane Smith',
    class: '10th',
    marks: 47,
    totalMarks: 50,
    status: 'Pass',
    date: '2024-03-18'
  },
  // Michael Johnson's Results (STU003)
  {
    id: '11',
    examId: 'EX001',
    examName: 'Mathematics',
    studentId: 'STU003',
    studentName: 'Michael Johnson',
    class: '11th',
    marks: 78,
    totalMarks: 100,
    status: 'Pass',
    date: '2024-03-25'
  },
  {
    id: '12',
    examId: 'EX002',
    examName: 'Physics',
    studentId: 'STU003',
    studentName: 'Michael Johnson',
    class: '11th',
    marks: 72,
    totalMarks: 100,
    status: 'Pass',
    date: '2024-03-20'
  },
  {
    id: '13',
    examId: 'EX003',
    examName: 'Chemistry',
    studentId: 'STU003',
    studentName: 'Michael Johnson',
    class: '11th',
    marks: 65,
    totalMarks: 100,
    status: 'Pass',
    date: '2024-03-22'
  },
  {
    id: '14',
    examId: 'EX004',
    examName: 'Biology',
    studentId: 'STU003',
    studentName: 'Michael Johnson',
    class: '11th',
    marks: 55,
    totalMarks: 75,
    status: 'Pass',
    date: '2024-03-28'
  },
  {
    id: '15',
    examId: 'EX005',
    examName: 'English',
    studentId: 'STU003',
    studentName: 'Michael Johnson',
    class: '11th',
    marks: 35,
    totalMarks: 50,
    status: 'Pass',
    date: '2024-03-18'
  },
  // Emily Brown's Results (STU004)
  {
    id: '16',
    examId: 'EX001',
    examName: 'Mathematics',
    studentId: 'STU004',
    studentName: 'Emily Brown',
    class: '12th',
    marks: 98,
    totalMarks: 100,
    status: 'Pass',
    date: '2024-03-25'
  },
  {
    id: '17',
    examId: 'EX002',
    examName: 'Physics',
    studentId: 'STU004',
    studentName: 'Emily Brown',
    class: '12th',
    marks: 95,
    totalMarks: 100,
    status: 'Pass',
    date: '2024-03-20'
  },
  {
    id: '18',
    examId: 'EX003',
    examName: 'Chemistry',
    studentId: 'STU004',
    studentName: 'Emily Brown',
    class: '12th',
    marks: 92,
    totalMarks: 100,
    status: 'Pass',
    date: '2024-03-22'
  },
  {
    id: '19',
    examId: 'EX004',
    examName: 'Biology',
    studentId: 'STU004',
    studentName: 'Emily Brown',
    class: '12th',
    marks: 70,
    totalMarks: 75,
    status: 'Pass',
    date: '2024-03-28'
  },
  {
    id: '20',
    examId: 'EX005',
    examName: 'English',
    studentId: 'STU004',
    studentName: 'Emily Brown',
    class: '12th',
    marks: 48,
    totalMarks: 50,
    status: 'Pass',
    date: '2024-03-18'
  },
  // William Davis's Results (STU005)
  {
    id: '21',
    examId: 'EX001',
    examName: 'Mathematics',
    studentId: 'STU005',
    studentName: 'William Davis',
    class: '11th',
    marks: 65,
    totalMarks: 100,
    status: 'Pass',
    date: '2024-03-25'
  },
  {
    id: '22',
    examId: 'EX002',
    examName: 'Physics',
    studentId: 'STU005',
    studentName: 'William Davis',
    class: '11th',
    marks: 58,
    totalMarks: 100,
    status: 'Fail',
    date: '2024-03-20'
  },
  {
    id: '23',
    examId: 'EX003',
    examName: 'Chemistry',
    studentId: 'STU005',
    studentName: 'William Davis',
    class: '11th',
    marks: 62,
    totalMarks: 100,
    status: 'Pass',
    date: '2024-03-22'
  },
  {
    id: '24',
    examId: 'EX004',
    examName: 'Biology',
    studentId: 'STU005',
    studentName: 'William Davis',
    class: '11th',
    marks: 45,
    totalMarks: 75,
    status: 'Pass',
    date: '2024-03-28'
  },
  {
    id: '25',
    examId: 'EX005',
    examName: 'English',
    studentId: 'STU005',
    studentName: 'William Davis',
    class: '11th',
    marks: 32,
    totalMarks: 50,
    status: 'Pass',
    date: '2024-03-18'
  }
];

type SortField = keyof ExamResult;
type SortDirection = 'asc' | 'desc';

export default function ExamResults() {
  const [results, setResults] = useState<ExamResult[]>(mockResults);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'date',
    direction: 'desc'
  });
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });
  const [filterMode, setFilterMode] = useState<'exam' | 'subject' | 'student'>('exam');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ExamResult | undefined>(undefined);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Extract unique values for filters
  const uniqueValues = useMemo(() => ({
    subjects: Array.from(new Set(results.map(r => r.examName))),
    examIds: Array.from(new Set(results.map(r => r.examId))),
    studentIds: Array.from(new Set(results.map(r => r.studentId))),
    classes: Array.from(new Set(results.map(r => r.class))),
  }), [results]);

  // Enhanced filtering logic
  const filteredResults = useMemo(() => {
    return results.filter(result => {
      const matchesSearch = Object.values(result).some(
        value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesSubject = !selectedSubject || result.examName === selectedSubject;
      const matchesExam = !selectedExamId || result.examId === selectedExamId;
      const matchesStudent = !selectedStudentId || result.studentId === selectedStudentId;
      const matchesClass = !selectedClass || result.class === selectedClass;

      return matchesSearch && matchesSubject && matchesExam && matchesStudent && matchesClass;
    });
  }, [results, searchTerm, selectedSubject, selectedExamId, selectedStudentId, selectedClass]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = filteredResults.length;
    const passed = filteredResults.filter(r => r.status === 'Pass').length;
    const avgMarks = filteredResults.reduce((acc, r) => acc + (r.marks / r.totalMarks) * 100, 0) / total;
    
    return {
      total,
      passed,
      failed: total - passed,
      passRate: ((passed / total) * 100).toFixed(1),
      avgMarks: avgMarks.toFixed(1)
    };
  }, [filteredResults]);

  const handleSort = (field: SortField) => {
    setSortConfig({
      field,
      direction:
        sortConfig.field === field && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  const sortedResults = [...filteredResults].sort((a, b) => {
    const aValue = a[sortConfig.field];
    const bValue = b[sortConfig.field];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return sortConfig.direction === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const handleAdd = () => {
    setSelectedResult(undefined);
    setIsFormOpen(true);
    setIsViewMode(false);
  };

  const handleEdit = (result: ExamResult) => {
    setSelectedResult(result);
    setIsFormOpen(true);
    setIsViewMode(false);
  };

  const handleView = (result: ExamResult) => {
    setSelectedResult(result);
    setIsProfileOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      setResults(results.filter(result => result.id !== id));
      setToast({
        show: true,
        message: 'Result deleted successfully',
        type: 'success'
      });
    }
  };

  const handleSubmit = (resultData: Partial<ExamResult>) => {
    try {
      if (selectedResult) {
        // Check if any data actually changed
        const hasChanges = Object.keys(resultData).some(
          key => resultData[key as keyof ExamResult] !== selectedResult[key as keyof ExamResult]
        );

        if (!hasChanges) {
          setIsFormOpen(false);
          setSelectedResult(undefined);
          return;
        }

        // Update existing result
        setResults(results.map(r => 
          r.id === selectedResult.id ? { ...r, ...resultData } : r
        ));
        setToast({
          show: true,
          message: 'Result updated successfully!',
          type: 'success'
        });
      } else {
        // Add new result
        const newResult = {
          ...resultData,
          id: Date.now().toString(),
        } as ExamResult;
        setResults([...results, newResult]);
        setToast({
          show: true,
          message: 'Result added successfully!',
          type: 'success'
        });
      }
      setIsFormOpen(false);
      setSelectedResult(undefined);
    } catch (error) {
      setToast({
        show: true,
        message: 'An error occurred while saving the result.',
        type: 'error'
      });
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Exam Results</h2>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleAdd}
          >
            Add Result
          </button>
        </div>

        {/* New Filter Section */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterMode('exam')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                filterMode === 'exam'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Filter by Exam
            </button>
            <button
              onClick={() => setFilterMode('subject')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                filterMode === 'subject'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Filter by Subject
            </button>
            <button
              onClick={() => setFilterMode('student')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                filterMode === 'student'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Filter by Student
            </button>
          </div>

          <div className="flex space-x-2 flex-1">
            <select
              value={filterMode === 'exam' ? selectedExamId : filterMode === 'subject' ? selectedSubject : selectedStudentId}
              onChange={(e) => {
                if (filterMode === 'exam') setSelectedExamId(e.target.value);
                else if (filterMode === 'subject') setSelectedSubject(e.target.value);
                else setSelectedStudentId(e.target.value);
              }}
              className="w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All {filterMode === 'exam' ? 'Exams' : filterMode === 'subject' ? 'Subjects' : 'Students'}</option>
              {filterMode === 'exam' && uniqueValues.examIds.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
              {filterMode === 'subject' && uniqueValues.subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
              {filterMode === 'student' && uniqueValues.studentIds.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Classes</option>
              {uniqueValues.classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search results..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Results</div>
            <div className="text-xl font-semibold">{statistics.total}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600">Passed</div>
            <div className="text-xl font-semibold text-green-700">{statistics.passed}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-red-600">Failed</div>
            <div className="text-xl font-semibold text-red-700">{statistics.failed}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600">Pass Rate</div>
            <div className="text-xl font-semibold text-blue-700">{statistics.passRate}%</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600">Average Score</div>
            <div className="text-xl font-semibold text-purple-700">{statistics.avgMarks}%</div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Exam Results</h2>
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleAdd}
            >
              Add Result
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { label: 'Exam ID', field: 'examId' },
                  { label: 'Exam', field: 'examName' },
                  { label: 'Student ID', field: 'studentId' },
                  { label: 'Student Name', field: 'studentName' },
                  { label: 'Class', field: 'class' },
                  { label: 'Marks', field: 'marks' },
                  { label: 'Total Marks', field: 'totalMarks' },
                  { label: 'Status', field: 'status' },
                  { label: 'Date', field: 'date' }
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
              {sortedResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.examId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.examName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.marks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.totalMarks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      result.status === 'Pass' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(result.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleView(result)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(result)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(result.id)}
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

      <ResultForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedResult(undefined);
        }}
        onSubmit={handleSubmit}
        result={selectedResult}
        exams={uniqueValues.examIds.map(id => ({
          id,
          name: results.find(r => r.examId === id)?.examName || id
        }))}
        students={uniqueValues.studentIds.map(id => ({
          id,
          name: results.find(r => r.studentId === id)?.studentName || id
        }))}
        classes={uniqueValues.classes}
      />

      {selectedResult && (
        <ResultProfile
          isOpen={isProfileOpen}
          onClose={() => {
            setIsProfileOpen(false);
            setSelectedResult(undefined);
          }}
          result={selectedResult}
        />
      )}
    </div>
  );
} 