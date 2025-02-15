'use client';

import { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Toast from './Toast';
import { PDFFormatter } from '@/utils/pdfStyles';
import { ChartGenerator } from '@/utils/chartGenerator';

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

interface Student {
  id: string;
  studentId: string;
  name: string;
  class: string;
}

interface ReportType {
  type: 'student' | 'class' | 'exam';
  label: string;
  description: string;
}

interface GenerateReportParams {
  type: ReportType['type'];
  studentId?: string;
  class?: string;
  examNumber?: string;
}

// Add type for jsPDF with autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export default function Reports() {
  // States for report generation
  const [reportType, setReportType] = useState<ReportType['type']>('student');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedExamNumber, setSelectedExamNumber] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });
  const [feedback, setFeedback] = useState<string>('');
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  // Mock data - replace with actual data from your backend
  const mockResults: ExamResult[] = [
    {
      id: '1',
      examId: '10th-MAT-001',
      examName: 'Mathematics',
      studentId: 'STU001',
      studentName: 'John Doe',
      class: '10th',
      marks: 85,
      totalMarks: 100,
      status: 'Pass',
      date: '2024-03-24'
    },
    // Add more mock results...
  ];

  // Extract unique values
  const uniqueValues = useMemo(() => {
    const results = mockResults;
    return {
      classes: Array.from(new Set(results.map(r => r.class))),
      examNumbers: Array.from(new Set(results.map(r => r.examId.split('-')[2]))),
      students: Array.from(new Set(results.map(r => ({
        id: r.studentId,
        name: r.studentName,
        class: r.class
      })))),
    };
  }, []);

  // Filter students based on selected class
  const filteredStudents = useMemo(() => {
    if (!selectedClass) return [];
    return uniqueValues.students.filter(student => student.class === selectedClass);
  }, [selectedClass, uniqueValues.students]);

  // Report type options
  const reportTypes: ReportType[] = [
    {
      type: 'student',
      label: 'Student Report',
      description: 'Generate a report for a specific student'
    },
    {
      type: 'class',
      label: 'Class Report',
      description: 'Generate a report for an entire class'
    },
    {
      type: 'exam',
      label: 'Exam Report',
      description: 'Generate a report for a specific exam'
    }
  ];

  // Reset form based on report type
  const handleReportTypeChange = (type: ReportType['type']) => {
    setReportType(type);
    setSelectedClass('');
    setSelectedExamNumber('');
    setSelectedStudent('');
    setStudentId('');
  };

  const generateAIFeedback = async (studentResults: ExamResult[]) => {
    setIsGeneratingFeedback(true);
    try {
      const response = await fetch('/api/generate-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName: studentResults[0].studentName,
          results: studentResults
        }),
      });

      if (!response.ok) throw new Error('Failed to generate feedback');
      
      const data = await response.json();
      setFeedback(data.feedback);
      return data.feedback;
    } catch (error) {
      console.error('Error:', error);
      setToast({
        show: true,
        message: 'Failed to generate AI feedback',
        type: 'error'
      });
      return '';
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const generateStudentReport = async (studentId: string) => {
    try {
      const studentResults = mockResults.filter(r => r.studentId === studentId);
      if (studentResults.length === 0) {
        throw new Error('No results found for this student');
      }

      const student = studentResults[0];
      const formatter = new PDFFormatter();

      // Add header
      let currentY = formatter.addHeader(
        'Student Performance Report',
        `Academic Year ${new Date().getFullYear()}`
      );

      // Add student information
      currentY = formatter.addSection('Student Information', currentY);
      currentY = formatter.addInfoBox([
        { label: 'Student Name:', value: student.studentName },
        { label: 'Student ID:', value: student.studentId },
        { label: 'Class:', value: student.class }
      ], currentY);

      // Add performance metrics
      const totalMarks = studentResults.reduce((sum, r) => sum + r.marks, 0);
      const totalMaxMarks = studentResults.reduce((sum, r) => sum + r.totalMarks, 0);
      const averagePercentage = (totalMarks / totalMaxMarks) * 100;
      const passedSubjects = studentResults.filter(r => r.status === 'Pass').length;

      // Add performance overview with radar chart
      currentY = formatter.addSection('Performance Overview', currentY);
      currentY = ChartGenerator.generateSimpleRadar(formatter.pdf, [
        { label: 'Problem Solving', value: 85 },
        { label: 'Critical Thinking', value: 75 },
        { label: 'Analytical Skills', value: 90 },
        { label: 'Time Management', value: 80 }
      ], currentY);

      // Add progress visualization
      currentY = formatter.addSection('Progress Trend', currentY);
      currentY = ChartGenerator.generateLineChart(formatter.pdf, [
        { label: 'Progress', value: averagePercentage },
        { label: 'Total', value: 100 }
      ], currentY);

      // Add detailed results table
      currentY = formatter.addSection('Subject-wise Performance', currentY);
      currentY = formatter.addPerformanceTable(
        ['Subject', 'Marks', 'Total', 'Percentage', 'Status'],
        studentResults.map(result => [
          result.examName,
          result.marks,
          result.totalMarks,
          `${((result.marks / result.totalMarks) * 100).toFixed(1)}%`,
          result.status
        ]),
        currentY
      );

      // Add performance metrics boxes
      currentY = formatter.addPerformanceMetrics([
        { label: 'Overall Score', value: Math.round(averagePercentage) },
        { label: 'Subjects Passed', value: passedSubjects, total: studentResults.length },
        { label: 'Total Marks', value: totalMarks, total: totalMaxMarks }
      ], currentY);

      // Add performance badge
      formatter.addPerformanceBadge(averagePercentage, 180, 50);

      // Add skill analysis
      currentY = formatter.addSection('Skill Analysis', currentY);
      currentY = ChartGenerator.generateBarChart(formatter.pdf, [
        { label: 'Problem Solving', value: 85 },
        { label: 'Critical Thinking', value: 75 },
        { label: 'Analytical Skills', value: 90 },
        { label: 'Time Management', value: 80 }
      ], currentY);

      // Add AI feedback
      const feedbackResponse = await fetch('/api/generate-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.studentName,
          results: studentResults
        })
      });

      const { feedback } = await feedbackResponse.json();
      if (feedback) {
        currentY = formatter.addSection('Performance Analysis', currentY);
        currentY = formatter.addFeedbackSection(feedback, currentY);
      }

      formatter.save(`Student_Report_${student.studentId}.pdf`);
      return true;
    } catch (error) {
      console.error('Error generating student report:', error);
      throw error;
    }
  };

  const generateClassReport = async (className: string, examNumber: string) => {
    try {
      // Get all results for this class and exam
      const classResults = mockResults.filter(r => 
        r.class === className && 
        r.examId.includes(`-${examNumber}`)
      );

      if (classResults.length === 0) {
        throw new Error('No results found for this class');
      }

      const pdf = new jsPDF();

      // Add header
      pdf.setFontSize(18);
      pdf.text(`Class Performance Report - ${className}`, 20, 20);
      pdf.setFontSize(14);
      pdf.text(`Exam ${examNumber}`, 20, 30);

      // Calculate class statistics
      const subjects = Array.from(new Set(classResults.map(r => r.examName)));
      const subjectStats = subjects.map(subject => {
        const subjectResults = classResults.filter(r => r.examName === subject);
        const average = subjectResults.reduce((sum, r) => sum + r.marks, 0) / subjectResults.length;
        const passCount = subjectResults.filter(r => r.status === 'Pass').length;
        const passPercentage = (passCount / subjectResults.length) * 100;

        return {
          subject,
          average: average.toFixed(2),
          passPercentage: passPercentage.toFixed(2)
        };
      });

      // Add subject-wise statistics
      pdf.autoTable({
        startY: 40,
        head: [['Subject', 'Class Average', 'Pass Percentage']],
        body: subjectStats.map(stat => [
          stat.subject,
          stat.average,
          `${stat.passPercentage}%`
        ]),
        theme: 'striped'
      });

      // Add student-wise results
      const studentResults = Array.from(new Set(classResults.map(r => r.studentId))).map(studentId => {
        const studentData = classResults.find(r => r.studentId === studentId)!;
        const studentSubjects = classResults.filter(r => r.studentId === studentId);
        const average = studentSubjects.reduce((sum, r) => sum + r.marks, 0) / studentSubjects.length;

        return {
          name: studentData.studentName,
          id: studentId,
          average: average.toFixed(2),
          subjects: studentSubjects
        };
      });

      pdf.autoTable({
        startY: pdf.previousAutoTable.finalY + 20,
        head: [['Student Name', 'ID', 'Average', ...subjects]],
        body: studentResults.map(student => [
          student.name,
          student.id,
          student.average,
          ...subjects.map(subject => {
            const subjectResult = student.subjects.find(r => r.examName === subject);
            return subjectResult ? `${subjectResult.marks}/${subjectResult.totalMarks}` : 'N/A';
          })
        ]),
        theme: 'striped'
      });

      pdf.save(`Class_Report_${className}_Exam${examNumber}.pdf`);
      return true;
    } catch (error) {
      console.error('Error generating class report:', error);
      throw error;
    }
  };

  const generateExamReport = async (examNumber: string, className?: string) => {
    try {
      // Get all results for this exam
      let examResults = mockResults.filter(r => r.examId.includes(`-${examNumber}`));
      if (className) {
        examResults = examResults.filter(r => r.class === className);
      }

      if (examResults.length === 0) {
        throw new Error('No results found for this exam');
      }

      const pdf = new jsPDF();

      // Add header
      pdf.setFontSize(18);
      pdf.text(`Exam ${examNumber} Performance Report`, 20, 20);
      if (className) {
        pdf.setFontSize(14);
        pdf.text(`Class: ${className}`, 20, 30);
      }

      // Calculate statistics
      const subjects = Array.from(new Set(examResults.map(r => r.examName)));
      const stats = subjects.map(subject => {
        const subjectResults = examResults.filter(r => r.examName === subject);
        return {
          subject,
          average: (subjectResults.reduce((sum, r) => sum + r.marks, 0) / subjectResults.length).toFixed(2),
          highest: Math.max(...subjectResults.map(r => r.marks)),
          lowest: Math.min(...subjectResults.map(r => r.marks)),
          passPercentage: ((subjectResults.filter(r => r.status === 'Pass').length / subjectResults.length) * 100).toFixed(2)
        };
      });

      // Add statistics table
      pdf.autoTable({
        startY: className ? 40 : 30,
        head: [['Subject', 'Average', 'Highest', 'Lowest', 'Pass %']],
        body: stats.map(stat => [
          stat.subject,
          stat.average,
          stat.highest,
          stat.lowest,
          `${stat.passPercentage}%`
        ]),
        theme: 'striped'
      });

      pdf.save(`Exam${examNumber}_Report${className ? `_${className}` : ''}.pdf`);
      return true;
    } catch (error) {
      console.error('Error generating exam report:', error);
      throw error;
    }
  };

  const handleGenerateReport = async () => {
    try {
      let success = false;

      switch (reportType) {
        case 'student':
          if (!studentId) throw new Error('Please enter a student ID');
          success = await generateStudentReport(studentId);
          break;

        case 'class':
          if (!selectedClass || !selectedExamNumber) {
            throw new Error('Please select both class and exam number');
          }
          success = await generateClassReport(selectedClass, selectedExamNumber);
          break;

        case 'exam':
          if (!selectedExamNumber) throw new Error('Please select an exam number');
          success = await generateExamReport(selectedExamNumber, selectedClass);
          break;
      }

      if (success) {
        setToast({
          show: true,
          message: 'Report generated successfully!',
          type: 'success'
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: error instanceof Error ? error.message : 'Error generating report',
        type: 'error'
      });
    }
  };

  // Add preview section
  const selectedStudentResults = useMemo(() => {
    if (!selectedStudent || !selectedExamNumber) return [];
    return mockResults.filter(result => 
      result.studentId === selectedStudent &&
      result.examId.includes(`-${selectedExamNumber}`)
    );
  }, [selectedStudent, selectedExamNumber]);

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Report Generation</h2>
        </div>

        {/* Report Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">Report Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportTypes.map((type) => (
              <button
                key={type.type}
                onClick={() => handleReportTypeChange(type.type)}
                className={`p-4 rounded-lg border ${
                  reportType === type.type
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="text-sm font-medium text-gray-900">{type.label}</h3>
                <p className="mt-1 text-xs text-gray-500">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Filter Controls based on Report Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {reportType === 'student' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter Student ID"
                  className="w-full h-12 px-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              </div>
            </>
          )}

          {reportType === 'class' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full h-12 px-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                  <option value="">Select Class</option>
                  {uniqueValues.classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Number</label>
                <select
                  value={selectedExamNumber}
                  onChange={(e) => setSelectedExamNumber(e.target.value)}
                  className="w-full h-12 px-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                  <option value="">Select Exam Number</option>
                  {uniqueValues.examNumbers.map(num => (
                    <option key={num} value={num}>Exam {num}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {reportType === 'exam' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Number</label>
                <select
                  value={selectedExamNumber}
                  onChange={(e) => setSelectedExamNumber(e.target.value)}
                  className="w-full h-12 px-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                  <option value="">Select Exam Number</option>
                  {uniqueValues.examNumbers.map(num => (
                    <option key={num} value={num}>Exam {num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full h-12 px-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                  <option value="">Select Class</option>
                  {uniqueValues.classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Preview Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Report Preview</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            {selectedStudentResults.length > 0 ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500">
                    <div>Subject</div>
                    <div>Marks</div>
                    <div>Total</div>
                    <div>Status</div>
                  </div>
                  {selectedStudentResults.map(result => (
                    <div key={result.id} className="grid grid-cols-4 gap-4 text-sm">
                      <div>{result.examName}</div>
                      <div>{result.marks}</div>
                      <div>{result.totalMarks}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.status === 'Pass'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Feedback Preview */}
                {feedback && (
                  <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="text-md font-medium text-gray-900 mb-2">
                      Performance Analysis
                    </h4>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {feedback}
                    </p>
                  </div>
                )}

                {isGeneratingFeedback && (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-600">Generating analysis...</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Select the filters above to preview the report</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={handleGenerateReport}
            className="px-6 py-3 text-base font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate Report
          </button>
        </div>

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