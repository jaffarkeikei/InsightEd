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
  currentY: number = 25;

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

Each section should be comprehensive yet concise, approximately 100 words each.

Please use less complex Engligh`;

    try {
        console.log('API Key available:', !!process.env.NEXT_PUBLIC_OPENAI_API_KEY);
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
      
      // Log the response for debugging
      console.log('OpenAI API Response:', data);

      // Check if the response is valid
      if (!response.ok) {
        throw new Error(`API Error: ${data.error?.message || 'Unknown error'}`);
      }

      // Validate the response structure
      if (!data.choices || !data.choices.length || !data.choices[0].message) {
        throw new Error('Invalid response structure from OpenAI API');
      }

      const feedback = data.choices[0].message.content;
      console.log('Raw feedback:', feedback); // Debug log

      // More robust section splitting
      const sections = feedback.split(/(?=STUDENT FEEDBACK|PARENT\/GUARDIAN FEEDBACK|TEACHER NOTES)/i);

      // Validate and clean sections
      return {
        studentFeedback: sections.find(s => s.includes('STUDENT FEEDBACK'))?.replace(/STUDENT FEEDBACK.*?:/i, '').trim() 
          || 'Student feedback unavailable',
        parentFeedback: sections.find(s => s.includes('PARENT/GUARDIAN FEEDBACK'))?.replace(/PARENT\/GUARDIAN FEEDBACK.*?:/i, '').trim() 
          || 'Parent feedback unavailable',
        teacherNotes: sections.find(s => s.includes('TEACHER NOTES'))?.replace(/TEACHER NOTES.*?:/i, '').trim() 
          || 'Teacher notes unavailable'
      };

    } catch (error) {
      console.error('Error in generatePerformanceInsights:', error);
      
      // Provide a more detailed fallback response
      return {
        studentFeedback: `We're currently experiencing technical difficulties generating personalized feedback. 
          Please check your exam results above for performance details.`,
        parentFeedback: `Due to technical limitations, detailed parent feedback is temporarily unavailable. 
          Please refer to the exam results table for current academic standing.`,
        teacherNotes: `System Note: Unable to generate detailed teacher notes at this time. 
          Please consult with the subject teachers directly for specific guidance.`
      };
    }
  }

  addHeader(studentName: string, studentId: string, className: string): PDFFormatter {
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(33, 37, 41);
    this.pdf.text('InsightEd School - Examination Report', 40, this.currentY);

    this.pdf.setFontSize(9);
    this.pdf.setTextColor(100);
    this.pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 400, this.currentY);

    this.currentY += 25;
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(99, 102, 241);
    
    const leftColumn = 40;
    const rightColumn = 300;
    
    this.pdf.text(`Student Name: ${studentName}`, leftColumn, this.currentY);
    this.pdf.text(`Class: ${className}`, rightColumn, this.currentY);
    this.currentY += 15;
    this.pdf.text(`Student ID: ${studentId}`, leftColumn, this.currentY);
    
    this.currentY += 20;
    return this;
  }

  addExamTable(examResults: ExamResult[]): PDFFormatter {
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(33, 37, 41);
    this.pdf.text('Detailed Exam Results', 40, this.currentY);
    this.currentY += 10;

    const tableBody = examResults.map(res => {
      const percentage = ((res.marks / res.totalMarks) * 100).toFixed(1) + '%';
      return [
        res.examName,
        res.date,
        `${res.marks}`,
        `${res.totalMarks}`,
        percentage,
        res.status
      ];
    });

    this.pdf.autoTable({
      startY: this.currentY,
      head: [['Subject', 'Date', 'Marks', 'Total', '%', 'Status']],
      body: tableBody,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 4,
        lineHeight: 1.1
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 60 },
        2: { cellWidth: 45 },
        3: { cellWidth: 45 },
        4: { cellWidth: 45 },
        5: { cellWidth: 45 }
      },
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: [255, 255, 255],
        fontSize: 9
      }
    });

    this.currentY = (this.pdf as any).lastAutoTable.finalY + 15;
    return this;
  }

  addSummary(examResults: ExamResult[]): PDFFormatter {
    const totalMarks = examResults.reduce((acc, r) => acc + r.marks, 0);
    const maxMarks = examResults.reduce((acc, r) => acc + r.totalMarks, 0);
    const overallPct = ((totalMarks / maxMarks) * 100).toFixed(1);
    const passCount = examResults.filter(r => r.status === 'Pass').length;

    this.pdf.setFontSize(12);
    this.pdf.setTextColor(33, 37, 41);
    this.pdf.text('Performance Summary', 40, this.currentY);
    this.currentY += 10;

    const summaryData = [
      [
        ['Total Exams', examResults.length],
        ['Total Marks', `${totalMarks}/${maxMarks}`]
      ],
      [
        ['Passed/Failed', `${passCount}/${examResults.length - passCount}`],
        ['Overall %', `${overallPct}%`]
      ]
    ];

    this.pdf.autoTable({
      startY: this.currentY,
      body: summaryData.flat(),
      theme: 'plain',
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [99, 102, 241], cellWidth: 100 },
        1: { cellWidth: 80 }
      }
    });

    this.currentY = (this.pdf as any).lastAutoTable.finalY + 15;
    return this;
  }

  addFeedback(insights: PerformanceInsight): PDFFormatter {
    this.currentY += 10;
    
    const addFeedbackSection = (title: string, content: string, color: number[]) => {
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(...color);
      this.pdf.text(title, 40, this.currentY);
      this.currentY += 8;

      this.pdf.setFontSize(9);
      this.pdf.setTextColor(60, 60, 60);
      
      const lines = this.pdf.splitTextToSize(content, 520);
      lines.forEach(line => {
        this.pdf.text(line, 40, this.currentY);
        this.currentY += 11;
      });
      
      this.currentY += 10;
    };

    addFeedbackSection(
      'Student Feedback & Development Goals:', 
      insights.studentFeedback,
      [99, 102, 241]
    );

    addFeedbackSection(
      'Parent/Guardian Guidance:', 
      insights.parentFeedback,
      [79, 70, 229]
    );

    addFeedbackSection(
      'Academic Progress Notes:', 
      insights.teacherNotes,
      [67, 56, 202]
    );

    return this;
  }

  addFooter(): PDFFormatter {
    this.pdf.setFontSize(8);
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