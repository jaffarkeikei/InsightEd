
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Student } from "@/types/student";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface StudentsListProps {
  students: Student[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddStudent: (student: Omit<Student, "id" | "performance" | "exams">) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onViewResults: (student: Student) => void;
  onAddExam: (student: Student) => void;
  sortConfig: {
    key: string;
    direction: 'ascending' | 'descending' | null;
  };
  onSort: (key: string) => void;
  getAverageScore: (exams?: Student["exams"]) => number;
  getPerformanceClass: (performance: Student["performance"]) => string;
}

const StudentsList = ({
  students,
  searchQuery,
  onSearchChange,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onViewResults,
  onAddExam,
  sortConfig,
  onSort,
  getAverageScore,
  getPerformanceClass,
}: StudentsListProps) => {
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    parentName: "",
    parentEmail: "",
    grade: "",
    dateOfBirth: "",
  });

  const SortIndicator = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'ascending' ? 
      <ChevronUp className="w-4 h-4 inline-block ml-1" /> : 
      <ChevronDown className="w-4 h-4 inline-block ml-1" />;
  };

  const handleAddStudent = () => {
    onAddStudent(newStudent);
    setNewStudent({
      name: "",
      email: "",
      parentName: "",
      parentEmail: "",
      grade: "",
      dateOfBirth: "",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Students Information</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 w-[300px]"
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the student's information below
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label>Full Name</label>
                  <Input
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label>Email</label>
                  <Input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label>Parent Name</label>
                  <Input
                    value={newStudent.parentName}
                    onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label>Parent Email</label>
                  <Input
                    type="email"
                    value={newStudent.parentEmail}
                    onChange={(e) => setNewStudent({ ...newStudent, parentEmail: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label>Grade</label>
                  <Input
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label>Date of Birth</label>
                  <Input
                    type="date"
                    value={newStudent.dateOfBirth}
                    onChange={(e) => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddStudent}>Add Student</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => onSort('id')} className="cursor-pointer">
                STUDENT ID <SortIndicator column="id" />
              </TableHead>
              <TableHead onClick={() => onSort('name')} className="cursor-pointer">
                NAME & EMAIL <SortIndicator column="name" />
              </TableHead>
              <TableHead onClick={() => onSort('parentName')} className="cursor-pointer">
                PARENT NAME & EMAIL <SortIndicator column="parentName" />
              </TableHead>
              <TableHead onClick={() => onSort('grade')} className="cursor-pointer">
                GRADE <SortIndicator column="grade" />
              </TableHead>
              <TableHead onClick={() => onSort('performance')} className="cursor-pointer">
                PERFORMANCE <SortIndicator column="performance" />
              </TableHead>
              <TableHead onClick={() => onSort('averageScore')} className="cursor-pointer">
                AVERAGE SCORE <SortIndicator column="averageScore" />
              </TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{student.parentName}</p>
                    <p className="text-sm text-gray-500">{student.parentEmail}</p>
                  </div>
                </TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell>
                  <span className={getPerformanceClass(student.performance)}>
                    {student.performance}
                  </span>
                </TableCell>
                <TableCell>{getAverageScore(student.exams)}%</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => onViewResults(student)}
                    >
                      View Results
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-green-600 hover:text-green-800"
                      onClick={() => onAddExam(student)}
                    >
                      Add Exam
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() => onEditStudent(student)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => onDeleteStudent(student.id)}
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

export default StudentsList;
