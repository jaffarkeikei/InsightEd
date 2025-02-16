
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Student } from "@/types/student";
import { Eye, PlusCircle, Pencil, Trash2, Search, ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExamsListProps {
  students: Student[];
  onViewResults: (student: Student) => void;
  onAddExam: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  getAverageScore: (exams?: Student["exams"]) => number;
}

const ExamsList = ({ 
  students, 
  onViewResults, 
  onAddExam,
  onEditStudent,
  onDeleteStudent,
  getAverageScore 
}: ExamsListProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending' | null;
  }>({ key: '', direction: null });
  
  const subjects = ["Mathematics", "English", "Swahili", "Science", "Social Studies"] as const;

  const getSubjectScore = (student: Student, subject: string) => {
    const exam = student.exams?.find(e => e.subject === subject);
    if (!exam) return 0; // Return 0 for sorting purposes
    return Math.round((exam.score / exam.maxScore) * 100);
  };

  const getSubjectScoreDisplay = (student: Student, subject: string) => {
    const score = getSubjectScore(student, subject);
    return score === 0 ? "-" : `${score}%`;
  };

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' | null = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    
    setSortConfig({ key, direction });
  };

  const sortData = (data: Student[]) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (sortConfig.key === 'averageScore') {
        const aScore = getAverageScore(a.exams);
        const bScore = getAverageScore(b.exams);
        return sortConfig.direction === 'ascending' ? aScore - bScore : bScore - aScore;
      }

      // Handle subject-specific sorting
      if (subjects.includes(sortConfig.key as any)) {
        const aScore = getSubjectScore(a, sortConfig.key);
        const bScore = getSubjectScore(b, sortConfig.key);
        return sortConfig.direction === 'ascending' ? aScore - bScore : bScore - aScore;
      }

      let aValue = a[sortConfig.key as keyof Student];
      let bValue = b[sortConfig.key as keyof Student];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'ascending' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  };

  const filteredStudents = students.filter(student => 
    student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SortIndicator = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'ascending' ? 
      <ChevronUp className="w-4 h-4 inline-block ml-1" /> : 
      <ChevronDown className="w-4 h-4 inline-block ml-1" />;
  };

  const handleDeleteStudent = (student: Student) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}'s records?`)) {
      onDeleteStudent(student.id);
      toast({
        title: "Student Deleted",
        description: `${student.name}'s records have been deleted.`
      });
    }
  };

  const sortedAndFilteredStudents = sortData(filteredStudents);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Student Exam Results</h2>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                onClick={() => handleSort('id')} 
                className="cursor-pointer"
              >
                Student ID <SortIndicator column="id" />
              </TableHead>
              <TableHead 
                onClick={() => handleSort('name')} 
                className="cursor-pointer"
              >
                Student <SortIndicator column="name" />
              </TableHead>
              {subjects.map(subject => (
                <TableHead 
                  key={subject}
                  onClick={() => handleSort(subject)}
                  className="cursor-pointer"
                >
                  {subject} <SortIndicator column={subject} />
                </TableHead>
              ))}
              <TableHead 
                onClick={() => handleSort('averageScore')} 
                className="cursor-pointer"
              >
                Average <SortIndicator column="averageScore" />
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">
                  {student.id}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </TableCell>
                {subjects.map(subject => (
                  <TableCell key={subject}>
                    {getSubjectScoreDisplay(student, subject)}
                  </TableCell>
                ))}
                <TableCell className="font-medium">
                  {getAverageScore(student.exams)}%
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => onViewResults(student)}
                      title="View Results"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-600 hover:text-green-800"
                      onClick={() => onAddExam(student)}
                      title="Add Exam"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() => onEditStudent(student)}
                      title="Edit Student"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteStudent(student)}
                      title="Delete Student"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExamsList;
