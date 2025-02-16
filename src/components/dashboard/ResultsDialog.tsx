
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileSpreadsheet } from "lucide-react";
import { Student } from "@/types/student";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';

interface ResultsDialogProps {
  showResults: boolean;
  onCloseResults: () => void;
  selectedStudent: Student | null;
  getAverageScore: (exams?: Student["exams"]) => number;
  generatePDF: (student: Student) => void;
  getChartData: (exams?: Student["exams"]) => any[];
}

const ResultsDialog = ({
  showResults,
  onCloseResults,
  selectedStudent,
  getAverageScore,
  generatePDF,
  getChartData,
}: ResultsDialogProps) => {
  return (
    <Dialog open={showResults} onOpenChange={onCloseResults}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {selectedStudent?.name}'s Exam Results
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex justify-between mb-6">
            <div>
              <p><strong>Grade:</strong> {selectedStudent?.grade}</p>
              <p><strong>Average Score:</strong> {selectedStudent?.exams ? getAverageScore(selectedStudent.exams) : 0}%</p>
            </div>
            <Button onClick={() => generatePDF(selectedStudent!)}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </div>

          <div className="space-y-6">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={selectedStudent?.exams ? getChartData(selectedStudent.exams) : []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#4f46e5" name="Student Score" />
                  <Line 
                    type="monotone" 
                    dataKey="classAverage"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="Class Average"
                    dot={{ fill: '#ef4444', r: 4 }}
                    activeDot={{ r: 6, fill: '#ef4444' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Max Score</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedStudent?.exams?.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.subject}</TableCell>
                    <TableCell>{exam.score}</TableCell>
                    <TableCell>{exam.maxScore}</TableCell>
                    <TableCell>{Math.round((exam.score / exam.maxScore) * 100)}%</TableCell>
                    <TableCell>{exam.date}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => generatePDF(selectedStudent)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;
