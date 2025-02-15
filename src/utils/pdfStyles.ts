import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ChartGenerator } from './chartGenerator';

export class PDFFormatter {
  pdf: jsPDF;
  primaryColor = [41, 98, 255];  // Blue
  secondaryColor = [75, 85, 99];  // Gray
  accentColor = [239, 68, 68];    // Red
  successColor = [34, 197, 94];   // Green

  constructor() {
    this.pdf = new jsPDF();
    // Add Roboto font family (or any other preferred font)
    // this.pdf.addFont('path/to/Roboto-Regular.ttf', 'Roboto', 'normal');
  }

  addHeader(title: string, subtitle?: string) {
    // Add decorative header bar
    this.pdf.setFillColor(...this.primaryColor);
    this.pdf.rect(0, 0, 210, 40, 'F');
    
    // Add wave design
    this.pdf.setFillColor(255, 255, 255, 0.1);
    for (let i = 0; i < 3; i++) {
      this.pdf.circle(0 + (i * 40), 20, 30, 'F');
    }

    // Add title
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(24);
    this.pdf.text(title, 20, 25);

    // Add subtitle if provided
    if (subtitle) {
      this.pdf.setFontSize(12);
      this.pdf.text(subtitle, 20, 35);
    }

    // Reset text color
    this.pdf.setTextColor(0, 0, 0);
    return 50; // Return next Y position
  }

  addSection(title: string, startY: number) {
    this.pdf.setFillColor(...this.secondaryColor);
    this.pdf.setDrawColor(...this.secondaryColor);
    
    // Add section title with underline
    this.pdf.setFontSize(14);
    this.pdf.text(title, 20, startY);
    this.pdf.line(20, startY + 1, 190, startY + 1);
    
    return startY + 10;
  }

  addInfoBox(info: { label: string; value: string }[], startY: number) {
    const boxHeight = (info.length * 8) + 10;
    this.pdf.setFillColor(240, 242, 245);
    this.pdf.roundedRect(20, startY, 170, boxHeight, 3, 3, 'F');

    this.pdf.setFontSize(10);
    info.forEach((item, index) => {
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(item.label, 25, startY + 8 + (index * 8));
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(item.value, 80, startY + 8 + (index * 8));
    });

    return startY + boxHeight + 10;
  }

  addPerformanceTable(headers: string[], data: any[][], startY: number) {
    this.pdf.autoTable({
      startY,
      head: [headers],
      body: data,
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [...this.primaryColor],
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 242, 245],
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
      },
      margin: { left: 20, right: 20 },
    });

    return (this.pdf as any).previousAutoTable.finalY + 10;
  }

  addPerformanceMetrics(metrics: { label: string; value: number; total?: number }[], startY: number) {
    const boxWidth = 82;
    const boxHeight = 50;
    const margin = 10;

    metrics.forEach((metric, index) => {
      const x = 20 + (index * (boxWidth + margin));
      
      // Add box
      this.pdf.setFillColor(250, 250, 250);
      this.pdf.roundedRect(x, startY, boxWidth, boxHeight, 3, 3, 'F');
      
      // Add label
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(...this.secondaryColor);
      this.pdf.text(metric.label, x + 5, startY + 15);
      
      // Add value
      this.pdf.setFontSize(20);
      this.pdf.setTextColor(0, 0, 0);
      const valueText = metric.total 
        ? `${metric.value}/${metric.total}`
        : `${metric.value}%`;
      this.pdf.text(valueText, x + 5, startY + 35);
    });

    return startY + boxHeight + 10;
  }

  addFeedbackSection(feedback: string, startY: number) {
    // Add decorative quote marks
    this.pdf.setFontSize(40);
    this.pdf.setTextColor(...this.primaryColor);
    this.pdf.text('"', 20, startY + 10);
    
    // Add feedback text
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(0, 0, 0);
    const splitFeedback = this.pdf.splitTextToSize(feedback, 150);
    this.pdf.text(splitFeedback, 35, startY + 10);

    return startY + (splitFeedback.length * 7) + 20;
  }

  addFooter() {
    const pageHeight = this.pdf.internal.pageSize.height;
    
    // Add line
    this.pdf.setDrawColor(...this.secondaryColor);
    this.pdf.line(20, pageHeight - 25, 190, pageHeight - 25);
    
    // Add footer text
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(...this.secondaryColor);
    this.pdf.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      20,
      pageHeight - 15
    );
    this.pdf.text(
      'Page 1 of 1',
      190,
      pageHeight - 15,
      { align: 'right' }
    );
  }

  save(filename: string) {
    this.addFooter();
    this.pdf.save(filename);
  }

  addPerformanceVisuals(results: any[], startY: number) {
    const performanceData = results.map(r => ({
      label: r.examName,
      value: (r.marks / r.totalMarks) * 100
    }));

    // Add radar chart
    startY = ChartGenerator.generateRadarChart(this.pdf, performanceData, startY);
    
    // Add decorative elements
    this.addDecorationDots(15, startY - 20);
    this.addDecorationDots(195, startY - 20);

    return startY;
  }

  addProgressVisuals(results: any[], startY: number) {
    const progressData = results.map(r => ({
      label: r.examId.split('-')[2],
      value: (r.marks / r.totalMarks) * 100
    }));

    return ChartGenerator.generateProgressLine(this.pdf, progressData, startY);
  }

  addDecorationDots(x: number, y: number) {
    const colors = [this.primaryColor, this.secondaryColor, this.accentColor];
    colors.forEach((color, i) => {
      this.pdf.setFillColor(...color);
      this.pdf.circle(x, y + (i * 5), 1, 'F');
    });
  }

  addPerformanceBadge(score: number, x: number, y: number) {
    const radius = 25;
    const grade = this.calculateGrade(score);
    const gradeColor = this.getGradeColor(grade);
    
    // Add circular badge
    this.pdf.setFillColor(...gradeColor);
    this.pdf.circle(x, y, radius, 'F');
    
    // Add grade text
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(20);
    this.pdf.text(grade, x - 8, y + 8);
    
    // Add decorative ring
    this.pdf.setDrawColor(...gradeColor);
    this.pdf.circle(x, y, radius + 2, 'S');
  }

  private calculateGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }

  private getGradeColor(grade: string): number[] {
    switch (grade) {
      case 'A+': return [34, 197, 94];  // Green
      case 'A': return [41, 98, 255];   // Blue
      case 'B': return [234, 179, 8];   // Yellow
      case 'C': return [249, 115, 22];  // Orange
      default: return [239, 68, 68];    // Red
    }
  }

  addSkillMeter(skills: { name: string; level: number }[], startY: number) {
    this.pdf.setFontSize(10);
    skills.forEach((skill, index) => {
      const y = startY + (index * 15);
      
      // Add skill name
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.text(skill.name, 20, y);
      
      // Add meter background
      this.pdf.setFillColor(240, 242, 245);
      this.pdf.rect(70, y - 5, 100, 7, 'F');
      
      // Add meter fill
      this.pdf.setFillColor(...this.primaryColor);
      this.pdf.rect(70, y - 5, skill.level, 7, 'F');
    });

    return startY + (skills.length * 15) + 10;
  }
} 