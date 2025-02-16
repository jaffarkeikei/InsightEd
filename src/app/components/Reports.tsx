'use client';

import { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Toast from './Toast';
// import { PDFFormatter } from '@/utils/pdfStyles';
import { PDFFormatter } from '@/utils/PDFFormatter';
import { ChartGenerator } from '@/utils/chartGenerator';
import { mockResults, ExamResult } from './ExamResults';

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
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');

  // Helper to group results by student ID
  function groupResultsByStudent(resultsArray: ExamResult[]): Record<string, ExamResult[]> {
    return resultsArray.reduce((acc, item) => {
      if (!acc[item.studentId]) {
        acc[item.studentId] = [];
      }
      acc[item.studentId].push(item);
      return acc;
    }, {} as Record<string, ExamResult[]>);
  }

  const handleGenerate = () => {
    setError('');

    // Trim and normalize the search input
    const query = searchInput.trim();
    if (!query) {
      setError('Please enter a Student ID or Class (e.g. "STU001" or "10th").');
      return;
    }

    // Detect if query is a Student ID pattern or a Class
    // For simplicity, let's assume if it starts with "STU" => student
    const isStudentId = /^STU\d+$/i.test(query);

    if (isStudentId) {
      // Generate report for one student
      const resultsForStudent = mockResults.filter(r => r.studentId.toLowerCase() === query.toLowerCase());
      if (resultsForStudent.length === 0) {
        setError(`No exam results found for Student ID: ${query}`);
        return;
      }
      generateSingleStudentPDF(resultsForStudent);
    } else {
      // Otherwise, treat it as a class
      const resultsForClass = mockResults.filter(r => r.class.toLowerCase() === query.toLowerCase());
      if (resultsForClass.length === 0) {
        setError(`No exam results found for Class: ${query}`);
        return;
      }
      generateClassPDF(resultsForClass, query);
    }
  };

  /**
   * generateSingleStudentPDF
   * Creates one PDF for a specific student's results.
   */
  const generateSingleStudentPDF = (results: ExamResult[]) => {
    const { studentId, studentName, class: className } = results[0];
    const formatter = new PDFFormatter();

    formatter
      .addHeader(studentName, studentId, className)
      .addExamTable(results)
      .addSummary(results)
      .addFooter()
      .save(`Report_${studentName.replaceAll(' ', '_')}.pdf`);
  };

  /**
   * generateClassPDF
   * Creates a single PDF containing the exam results for EVERY student in the class.
   * Each student gets their own header/table/summary in the same PDF document.
   */
  const generateClassPDF = (results: ExamResult[], className: string) => {
    // Group results by student
    const grouped = groupResultsByStudent(results);

    const formatter = new PDFFormatter();
    formatter.pdf.setProperties({
      title: `Class ${className} - Multi-Student Report`
    });

    // Keep track of page breaks between students
    let isFirst = true;

    Object.keys(grouped).forEach(studentId => {
      // For each student in the class
      const studentResults = grouped[studentId];
      const { studentName, class: cls } = studentResults[0];

      // If not the first student, add a page break before new student
      if (!isFirst) {
        formatter.pdf.addPage();
      }
      isFirst = false;

      formatter
        .addHeader(studentName, studentId, cls)
        .addExamTable(studentResults)
        .addSummary(studentResults);
    });

    // Add a general footer at the very end of the PDF
    formatter.addFooter().save(`Class_${className}_Report.pdf`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Enter Student ID (e.g. STU001) or Class (e.g. 10th)"
          className="border rounded px-3 py-2 w-full md:w-1/2"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            if (error) setError('');
          }}
        />
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Example inputs: "STU001" for a single student, or "10th" for an entire class.
      </p>
    </div>
  );
} 