
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Student } from "@/types/student";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface PreviewReportDialogProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  getAverageScore: (exams?: Student["exams"]) => number;
  generatePDF: (student: Student) => void;
  getPerformanceComment: (student: Student) => any;
}

const getScoreComment = (score: number, maxScore: number, subject: string): string => {
  const percentage = (score / maxScore) * 100;
  
  if (subject === "Swahili") {
    if (percentage >= 90) return "Bora";      // Excellent
    if (percentage >= 80) return "Safi";      // Very Good
    if (percentage >= 70) return "Nzuri";     // Good
    if (percentage >= 60) return "Wastani";   // Average
    if (percentage >= 50) return "Inafaa";    // Fair
    return "Hafifu";                          // Poor
  } else {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Very Good";
    if (percentage >= 70) return "Good";
    if (percentage >= 60) return "Average";
    if (percentage >= 50) return "Fair";
    return "Poor";
  }
};

const PreviewReportDialog = ({
  student,
  isOpen,
  onClose,
  getAverageScore,
  generatePDF,
  getPerformanceComment,
}: PreviewReportDialogProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending' | null;
  }>({ key: '', direction: null });

  if (!student) return null;

  const comments = getPerformanceComment(student);
  const chartData = student.exams?.map(exam => ({
    subject: exam.subject,
    score: Math.round((exam.score / exam.maxScore) * 100),
  })) || [];

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' | null = 'ascending';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = 'ascending';
      }
    }
    
    setSortConfig({ key, direction });
  };

  const sortedExams = [...(student.exams || [])].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;

    let aValue: any = a[sortConfig.key as keyof typeof a];
    let bValue: any = b[sortConfig.key as keyof typeof b];

    // Handle percentage calculation for 'score' sorting
    if (sortConfig.key === 'score') {
      aValue = (a.score / a.maxScore) * 100;
      bValue = (b.score / b.maxScore) * 100;
    }

    // Handle comment sorting
    if (sortConfig.key === 'comment') {
      aValue = getScoreComment(a.score, a.maxScore, a.subject);
      bValue = getScoreComment(b.score, b.maxScore, b.subject);
    }

    if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const SortIndicator = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'ascending' ? 
      <ChevronUp className="w-4 h-4 inline-block ml-1" /> : 
      <ChevronDown className="w-4 h-4 inline-block ml-1" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Academic Report Preview</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-130px)] pr-4">
          <div className="space-y-6 pb-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold">Student Academic Report</h2>
            </div>

            {/* Student Information */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><span className="font-semibold">Student Name:</span> {student.name}</p>
                  <p><span className="font-semibold">Student ID:</span> {student.id}</p>
                  <p><span className="font-semibold">Grade:</span> {student.grade}</p>
                </div>
                <div>
                  <p><span className="font-semibold">Overall Performance:</span> {student.performance}</p>
                  <p><span className="font-semibold">Average Score:</span> {getAverageScore(student.exams)}%</p>
                </div>
              </div>
            </div>

            {/* Exam Results and Graph */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Exam Results</h3>
              
              {/* Performance Graph */}
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#4f46e5" name="Score %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Results Table */}
              <div className="border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('subject')}
                      >
                        Subject <SortIndicator column="subject" />
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('score')}
                      >
                        Score <SortIndicator column="score" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Score</th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('score')}
                      >
                        Percentage <SortIndicator column="score" />
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('date')}
                      >
                        Date <SortIndicator column="date" />
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('comment')}
                      >
                        Comment <SortIndicator column="comment" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedExams.map((exam) => (
                      <tr key={exam.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{exam.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{exam.score}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{exam.maxScore}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {Math.round((exam.score / exam.maxScore) * 100)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{exam.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-indigo-600">
                          {getScoreComment(exam.score, exam.maxScore, exam.subject)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Academic Progress */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Academic Progress</h3>
              <p className="text-gray-700">{comments.academic}</p>
            </div>

            {/* Areas of Strength */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Areas of Strength</h3>
              <p className="text-gray-700">{comments.strengths}</p>
            </div>

            {/* Areas for Improvement */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Areas for Improvement</h3>
              <p className="text-gray-700">{comments.challenges}</p>
              <p className="text-gray-700">{comments.improvement}</p>
            </div>

            {/* Recommendations */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Recommendations</h3>
              <div className="text-gray-700 whitespace-pre-line">
                {comments.recommendations}
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => generatePDF(student)}>
            Generate PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewReportDialog;
