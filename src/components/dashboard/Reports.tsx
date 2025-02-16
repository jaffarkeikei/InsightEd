import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import PreviewReportDialog from "./PreviewReportDialog";
import ReportsTable from "./ReportsTable";
import ReportsSearch from "./ReportsSearch";
import { getPerformanceComment, getScoreComment } from "@/utils/reportUtils";
import { createClient } from '@supabase/supabase-js';

interface ReportsProps {
  students: Student[];
  getAverageScore: (exams?: Student["exams"]) => number;
  getChartData: (exams?: Student["exams"]) => any[];
}

const Reports = ({ students, getAverageScore, getChartData }: ReportsProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);

  const generatePDF = async (student: Student) => {
    let comments;
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase.functions.invoke('generate-comments', {
          body: { student },
        });
        
        if (error) throw error;
        comments = data;
        
        toast({
          title: "AI Comments Generated",
          description: "Generated concise, personalized comments for the report.",
        });
      } else {
        throw new Error('Supabase configuration missing');
      }
    } catch (error) {
      console.error('Error generating AI comments:', error);
      comments = getPerformanceComment(student);
      
      toast({
        title: "Using Default Comments",
        description: "Using template-based comments for the report.",
        variant: "destructive",
      });
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Student Academic Report", 105, 10, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(`Student Name: ${student.name}`, 20, 20);
    doc.text(`Student ID: ${student.id}`, 20, 25);
    doc.text(`Grade: ${student.grade}`, 20, 30);
    doc.text(`Overall Performance: ${student.performance}`, 120, 20);
    doc.text(`Average Score: ${getAverageScore(student.exams)}%`, 120, 25);

    doc.setFontSize(12);
    doc.text("Exam Results", 20, 40);
    
    const examData = student.exams?.map(exam => [
      exam.subject,
      exam.score.toString(),
      exam.maxScore.toString(),
      `${Math.round((exam.score / exam.maxScore) * 100)}%`,
      exam.date,
      getScoreComment(exam.score, exam.maxScore, exam.subject)
    ]) || [];

    (doc as any).autoTable({
      startY: 45,
      head: [["Subject", "Score", "Max", "%", "Date", "Comment"]],
      body: examData,
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 8 },
      margin: { top: 45 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25 },
        5: { cellWidth: 30 }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 45;
    
    const canvas = document.createElement('canvas');
    canvas.width = 750;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const data = student.exams || [];
      const barWidth = 30;
      const spacing = 15;
      const startX = 50;
      const maxHeight = 200;

      data.forEach((exam, index) => {
        const percentage = (exam.score / exam.maxScore) * 100;
        const barHeight = (percentage / 100) * maxHeight;
        const x = startX + (barWidth + spacing) * index;
        const y = 250 - barHeight;

        ctx.fillStyle = '#4f46e5';
        ctx.fillRect(x, y, barWidth, barHeight);

        ctx.fillStyle = 'black';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(exam.subject, x + barWidth/2, 270);
        ctx.fillText(`${Math.round(percentage)}%`, x + barWidth/2, y - 5);
      });
    }

    doc.addImage(canvas.toDataURL(), 'PNG', 10, finalY + 5, 190, 70);

    const commentsY = finalY + 80;
    doc.setFontSize(10);
    
    doc.setFontSize(11);
    doc.text("Academic Progress:", 20, commentsY);
    doc.setFontSize(8);
    const splitAcademic = doc.splitTextToSize(comments.academic, 170);
    doc.text(splitAcademic, 20, commentsY + 5);

    doc.setFontSize(11);
    doc.text("Areas of Strength:", 20, commentsY + 20);
    doc.setFontSize(8);
    const splitStrengths = doc.splitTextToSize(comments.strengths, 170);
    doc.text(splitStrengths, 20, commentsY + 25);

    doc.setFontSize(11);
    doc.text("Areas for Improvement:", 20, commentsY + 40);
    doc.setFontSize(8);
    const splitChallenges = doc.splitTextToSize(comments.challenges, 170);
    doc.text(splitChallenges, 20, commentsY + 45);

    doc.setFontSize(11);
    doc.text("Recommendations:", 20, commentsY + 60);
    doc.setFontSize(8);
    const splitRecommendations = doc.splitTextToSize(comments.recommendations, 170);
    doc.text(splitRecommendations, 20, commentsY + 65);

    doc.save(`${student.name.replace(/\s+/g, "_")}_Academic_Report.pdf`);
    
    toast({
      title: "Report Generated",
      description: `Academic report for ${student.name} has been generated.`
    });
  };

  const generateAllPDFs = async () => {
    toast({
      title: "Generating Reports",
      description: "Starting to generate reports for all students...",
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    filteredStudents.forEach((student, index) => {
      setTimeout(() => {
        generatePDF(student);
      }, index * 500);
    });

    toast({
      title: "Reports Generated",
      description: `Generated reports for ${filteredStudents.length} students.`,
    });
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Academic Reports</CardTitle>
              <CardDescription>Generate comprehensive academic reports for students</CardDescription>
            </div>
            <ReportsSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onGenerateAllReports={generateAllPDFs}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ReportsTable
            students={filteredStudents}
            onGenerateReport={generatePDF}
            onPreviewReport={setPreviewStudent}
          />
        </CardContent>
      </Card>

      <PreviewReportDialog
        student={previewStudent}
        isOpen={!!previewStudent}
        onClose={() => setPreviewStudent(null)}
        getAverageScore={getAverageScore}
        generatePDF={generatePDF}
        getPerformanceComment={getPerformanceComment}
      />
    </div>
  );
};

export default Reports;
