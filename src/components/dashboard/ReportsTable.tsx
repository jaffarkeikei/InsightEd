
import { Student } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Eye } from "lucide-react";
import { getAverageScore } from "@/utils/reportUtils";

interface ReportsTableProps {
  students: Student[];
  onGenerateReport: (student: Student) => void;
  onPreviewReport: (student: Student) => void;
}

const ReportsTable = ({ students, onGenerateReport, onPreviewReport }: ReportsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Performance</TableHead>
          <TableHead>Average Score</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>{student.id}</TableCell>
            <TableCell className="font-medium">{student.name}</TableCell>
            <TableCell>{student.grade}</TableCell>
            <TableCell>{student.performance}</TableCell>
            <TableCell>{getAverageScore(student.exams)}%</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onGenerateReport(student)}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Generate Report
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPreviewReport(student)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReportsTable;
