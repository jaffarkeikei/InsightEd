import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExamResult } from '@/app/components/ExamResults';

export class PDFFormatter {
  pdf: jsPDF;
  currentY = 40;

  constructor() {
    this.pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'A4' });
    this.pdf.setFont('helvetica', 'normal');
  }

  addHeader(studentName: string, studentId: string, className: string): PDFFormatter {
    this.pdf.setFontSize(18);
    this.pdf.setTextColor(33, 37, 41);
    this.pdf.text('InsightEd School - Examination Report', 40, this.currentY);

    this.currentY += 30;
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(99, 102, 241);
    this.pdf.text(`Student Name: ${studentName}`, 40, this.currentY);
    this.currentY += 15;
    this.pdf.text(`Student ID: ${studentId}`, 40, this.currentY);
    this.currentY += 15;
    this.pdf.text(`Class: ${className}`, 40, this.currentY);
    this.currentY += 20;

    // Date
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(100);
    this.pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 400, 50);

    return this; // <-- vital for chaining
  }

  addExamTable(examResults: ExamResult[]): PDFFormatter {
    this.pdf.setFontSize(14);
    this.pdf.setTextColor(33, 37, 41);
    this.pdf.text('Detailed Exam Results', 40, this.currentY);
    this.currentY += 10;

    const tableBody = examResults.map(res => {
      const pct = ((res.marks / res.totalMarks) * 100).toFixed(1) + '%';
      return [res.examName, res.date, res.marks.toString(), res.totalMarks.toString(), pct, res.status];
    });

    this.pdf.autoTable({
      startY: this.currentY,
      head: [
        ['Subject', 'Date', 'Marks', 'Total Marks', 'Percentage', 'Status']
      ],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: [255, 255, 255],
        fontSize: 10
      },
      bodyStyles: { fontSize: 9 },
      didParseCell: data => {
        if (data.section === 'body' && data.column.index === 5) {
          const val = data.cell.raw as string;
          if (val === 'Fail') {
            data.cell.styles.textColor = [220, 38, 38]; // Red
            data.cell.styles.fontStyle = 'bold';
          } else if (val === 'Pass') {
            data.cell.styles.textColor = [34, 197, 94]; // Green
            data.cell.styles.fontStyle = 'bold';
          }
        }
      }
    });

    // Update currentY after the table
    this.currentY = (this.pdf as any).lastAutoTable.finalY + 20;
    return this; // <-- vital for chaining
  }

  addSummary(examResults: ExamResult[]): PDFFormatter {
    const totalMarks = examResults.reduce((acc, r) => acc + r.marks, 0);
    const maxMarks = examResults.reduce((acc, r) => acc + r.totalMarks, 0);
    const overallPct = ((totalMarks / maxMarks) * 100).toFixed(1);
    const passCount = examResults.filter(r => r.status === 'Pass').length;
    const failCount = examResults.length - passCount;

    this.pdf.setFontSize(14);
    this.pdf.setTextColor(33, 37, 41);
    this.pdf.text('Performance Summary', 40, this.currentY);
    this.currentY += 10;

    const summaryRows = [
      ['Total Exams', examResults.length],
      ['Exams Passed', passCount],
      ['Exams Failed', failCount],
      ['Total Marks Obtained', `${totalMarks}/${maxMarks}`],
      ['Overall Percentage', `${overallPct}%`]
    ];

    this.pdf.autoTable({
      startY: this.currentY,
      body: summaryRows,
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [99, 102, 241], cellWidth: 150 },
        1: { cellWidth: 100 }
      }
    });

    this.currentY = (this.pdf as any).lastAutoTable.finalY + 20;
    return this;
  }

  addFooter(): PDFFormatter {
    this.pdf.setFontSize(9);
    this.pdf.setTextColor(100);
    this.pdf.text(
      'Note: This is a confidential record and is computer-generated.',
      40,
      780
    );
    return this;
  }

  save(fileName: string) {
    this.pdf.save(fileName);
  }
} 