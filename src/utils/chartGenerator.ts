import { jsPDF } from 'jspdf';

interface ChartDataPoint {
  label: string;
  value: number;
}

export class ChartGenerator {
  static generateBarChart(pdf: jsPDF, data: ChartDataPoint[], startY: number): number {
    try {
      const margin = 20;
      const width = 170;
      const height = 50;
      const barWidth = width / Math.max(data.length, 1);
      const maxValue = Math.max(...data.map(d => d.value), 1);

      // Draw axes
      pdf.setDrawColor(75, 85, 99);
      pdf.setLineWidth(0.5);
      pdf.moveTo(margin, startY);
      pdf.lineTo(margin, startY + height);
      pdf.moveTo(margin, startY + height);
      pdf.lineTo(margin + width, startY + height);
      pdf.stroke();

      // Draw bars
      data.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * height;
        const x = margin + (index * barWidth);
        const y = startY + height - barHeight;

        pdf.setFillColor(41, 98, 255);
        pdf.rect(x + 2, y, barWidth - 4, barHeight, 'F');

        // Labels - rotated for better space usage
        pdf.setFontSize(7);
        pdf.setTextColor(75, 85, 99);
        
        // Value on top of bar
        pdf.text(
          item.value.toString(),
          x + (barWidth / 2),
          y - 1,
          { align: 'center' }
        );
        
        // Label below axis, slightly rotated
        pdf.text(
          item.label,
          x + (barWidth / 2),
          startY + height + 8,
          { align: 'center', angle: 45 }
        );
      });

      return startY + height + 15;
    } catch (error) {
      console.error('Error in bar chart:', error);
      return startY;
    }
  }

  static generateLineChart(pdf: jsPDF, data: ChartDataPoint[], startY: number): number {
    try {
      const margin = 20;
      const width = 170;
      const height = 40;
      const maxValue = Math.max(...data.map(d => d.value), 1);

      // Draw axes
      pdf.setDrawColor(75, 85, 99);
      pdf.setLineWidth(0.5);
      pdf.moveTo(margin, startY);
      pdf.lineTo(margin, startY + height);
      pdf.moveTo(margin, startY + height);
      pdf.lineTo(margin + width, startY + height);
      pdf.stroke();

      // Draw line
      if (data.length > 1) {
        pdf.setDrawColor(41, 98, 255);
        pdf.setLineWidth(0.5);

        data.forEach((item, i) => {
          const x = margin + (i * (width / (data.length - 1)));
          const y = startY + height - ((item.value / maxValue) * height);

          if (i === 0) {
            pdf.moveTo(x, y);
          } else {
            pdf.lineTo(x, y);
          }

          // Draw point
          pdf.setFillColor(41, 98, 255);
          pdf.rect(x - 1, y - 1, 2, 2, 'F');

          // Compact labels
          pdf.setFontSize(7);
          pdf.setTextColor(75, 85, 99);
          pdf.text(
            item.label,
            x,
            startY + height + 8,
            { align: 'center', angle: 45 }
          );
          pdf.text(
            `${item.value}%`,
            x,
            y - 3,
            { align: 'center' }
          );
        });
        pdf.stroke();
      }

      return startY + height + 12;
    } catch (error) {
      console.error('Error in line chart:', error);
      return startY;
    }
  }

  static generateSimpleRadar(pdf: jsPDF, data: ChartDataPoint[], startY: number): number {
    try {
      const centerX = 105;
      const centerY = startY + 35;
      const radius = 30;

      // Draw axes
      data.forEach((item, i) => {
        const angle = (i * 2 * Math.PI / data.length) - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Draw axis line
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.5);
        pdf.moveTo(centerX, centerY);
        pdf.lineTo(x, y);
        pdf.stroke();

        // Add label
        pdf.setFontSize(7);
        pdf.setTextColor(75, 85, 99);
        const labelX = centerX + (radius + 8) * Math.cos(angle);
        const labelY = centerY + (radius + 8) * Math.sin(angle);
        pdf.text(item.label, labelX, labelY, {
          align: angle > Math.PI / 2 && angle < 3 * Math.PI / 2 ? 'right' : 'left'
        });
      });

      // Draw data shape
      pdf.setDrawColor(41, 98, 255);
      pdf.setFillColor(41, 98, 255);
      
      data.forEach((item, i) => {
        const angle = (i * 2 * Math.PI / data.length) - Math.PI / 2;
        const value = (item.value / 100) * radius;
        const x = centerX + value * Math.cos(angle);
        const y = centerY + value * Math.sin(angle);

        if (i === 0) {
          pdf.moveTo(x, y);
        } else {
          pdf.lineTo(x, y);
        }

        // Draw point
        pdf.rect(x - 1, y - 1, 2, 2, 'F');
      });

      // Close the shape
      const firstAngle = -Math.PI / 2;
      const firstValue = (data[0].value / 100) * radius;
      const firstX = centerX + firstValue * Math.cos(firstAngle);
      const firstY = centerY + firstValue * Math.sin(firstAngle);
      pdf.lineTo(firstX, firstY);
      pdf.stroke();

      return startY + 70;
    } catch (error) {
      console.error('Error in radar chart:', error);
      return startY;
    }
  }
} 