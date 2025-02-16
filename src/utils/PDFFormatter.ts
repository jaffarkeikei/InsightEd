import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExamResult } from '@/app/components/ExamResults';

interface PerformanceInsight {
  studentFeedback: string;
  parentFeedback: string;
  teacherNotes: string;
}

export class PDFFormatter {
  pdf: jsPDF;
  currentY: number = 40;

  constructor() {
    this.pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'A4' });
    this.pdf.setFont('helvetica', 'normal');
  }

  async generatePerformanceInsights(examResults: ExamResult[]): Promise<PerformanceInsight> {
    const prompt = `
As an AI educational expert, analyze this student's performance data and provide detailed, constructive feedback. 
Context: ${examResults[0].studentName} from class ${examResults[0].class}

Performance Data:
${examResults.map(exam => `- ${exam.examName}: ${exam.marks}/${exam.totalMarks} (${((exam.marks/exam.totalMarks)*100).toFixed(1)}%)`).join('\n')}
Overall Average: ${(examResults.reduce((acc, exam) => acc + (exam.marks/exam.totalMarks)*100, 0) / examResults.length).toFixed(1)}%

Please provide three separate detailed paragraphs:

1. STUDENT FEEDBACK (encouraging, specific, and actionable):
- Acknowledge strengths
- Identify areas for improvement
- Provide specific study strategies
- Set realistic goals
- Maintain a motivational tone

2. PARENT/GUARDIAN FEEDBACK (informative and collaborative):
- Overview of performance
- Specific areas where home support would be beneficial
- Practical suggestions for home learning environment
- Resources and tools recommendations
- Ways to maintain school-home communication

3. TEACHER NOTES (professional and strategic):
- Subject-specific observations
- Learning patterns identified
- Recommended interventions
- Cross-subject connections
- Next steps for differentiated instruction

Focus on being:
- Specific and data-driven
- Constructive and solution-oriented
- Empathetic and encouraging
- Clear and actionable
- Forward-looking and growth-minded

Each section should be comprehensive yet concise, approximately 150 words each.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4-turbo-preview",
          messages: [{
            role: "system",
            content: "You are an experienced educational consultant with expertise in student performance analysis and personalized learning strategies."
          }, {
            role: "user",
            content: prompt
          }],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      const data = await response.json();
      const feedback = data.choices[0].message.content;
      
      // Split the feedback into sections
      const sections = feedback.split(/\d\.\s+/);
      
      return {
        studentFeedback: sections[1]?.trim() || '',
        parentFeedback: sections[2]?.trim() || '',
        teacherNotes: sections[3]?.trim() || ''
      };
    } catch (error) {
      console.error('Error generating insights:', error);
      return {
        studentFeedback: 'Unable to generate feedback at this time.',
        parentFeedback: 'Unable to generate feedback at this time.',
        teacherNotes: 'Unable to generate feedback at this time.'
      };
    }
  }

  addHeader(studentName: string, studentId: string, className: string): PDFFormatter {
    this.pdf.setFontSize(18);
    this.pdf.setTextColor(33, 37, 41);
    this.pdf.text('InsightEd School - Examination Report', 40, this.currentY);

    this.currentY += 40;
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(99, 102, 241);
    this.pdf.text(`Student Name: ${studentName}`, 40, this.currentY);
    this.currentY += 15;
    this.pdf.text(`Student ID: ${studentId}`, 40, this.currentY);
    this.currentY += 15;
    this.pdf.text(`Class: ${className}`, 40, this.currentY);
    this.currentY += 40;

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
    this.currentY += 20;

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
    this.currentY = (this.pdf as any).lastAutoTable.finalY + 40;
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
    this.currentY += 20;

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

    this.currentY = (this.pdf as any).lastAutoTable.finalY + 40;
    return this;
  }

  addFeedback(insights: PerformanceInsight): PDFFormatter {
    this.currentY += 20;
    
    // Student Feedback Section
    this.pdf.setFontSize(14);
    this.pdf.setTextColor(33, 37, 41);
    this.pdf.text('Personal Development Insights', 40, this.currentY);
    this.currentY += 15;

    // Style for feedback sections
    const addFeedbackSection = (title: string, content: string, color: number[]) => {
      this.pdf.setFontSize(11);
      this.pdf.setTextColor(...color);
      this.pdf.text(title, 40, this.currentY);
      this.currentY += 10;

      this.pdf.setFontSize(10);
      this.pdf.setTextColor(60, 60, 60);
      
      // Split content into wrapped lines
      const lines = this.pdf.splitTextToSize(content, 520);
      lines.forEach(line => {
        this.pdf.text(line, 40, this.currentY);
        this.currentY += 12;
      });
      
      this.currentY += 15; // Space between sections
    };

    // Add each feedback section with different colors
    addFeedbackSection(
      'Student Feedback & Development Goals:', 
      insights.studentFeedback,
      [99, 102, 241] // Indigo
    );

    addFeedbackSection(
      'Parent/Guardian Guidance:', 
      insights.parentFeedback,
      [79, 70, 229] // Darker indigo
    );

    addFeedbackSection(
      'Academic Progress Notes:', 
      insights.teacherNotes,
      [67, 56, 202] // Deepest indigo
    );

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