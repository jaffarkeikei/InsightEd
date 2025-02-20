import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users, FileText, BarChart, FileSpreadsheet, LogOut } from "lucide-react";
import StudentsList from "@/components/dashboard/StudentsList";
import ExamForm from "@/components/dashboard/ExamForm";
import ResultsDialog from "@/components/dashboard/ResultsDialog";
import ExamsList from "@/components/dashboard/ExamsList";
import Analysis from "@/components/dashboard/Analysis";
import Reports from "@/components/dashboard/Reports";
import { Student, Exam } from "@/types/student";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showExamForm, setShowExamForm] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeSection, setActiveSection] = useState<'students' | 'exams' | 'reports' | 'analysis'>('students');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending' | null;
  }>({ key: '', direction: null });
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([
    {
      id: "STU001",
      name: "Emily Brown",
      email: "emily.b@school.com",
      parentName: "Sarah Brown",
      parentEmail: "sarah.b@email.com",
      grade: "12th",
      performance: "Excellent",
      dateOfBirth: "2006-11-27",
      exams: [
        { id: "EX001", subject: "Mathematics", score: 85, maxScore: 100, date: "2024-03-15" },
        { id: "EX002", subject: "English", score: 92, maxScore: 100, date: "2024-03-15" },
        { id: "EX003", subject: "Science", score: 88, maxScore: 100, date: "2024-03-15" },
        { id: "EX004", subject: "Swahili", score: 90, maxScore: 100, date: "2024-03-15" },
        { id: "EX005", subject: "Social Studies", score: 87, maxScore: 100, date: "2024-03-15" },
      ],
    },
    {
      id: "STU002",
      name: "John Smith",
      email: "john.s@school.com",
      parentName: "Michael Smith",
      parentEmail: "michael.s@email.com",
      grade: "12th",
      performance: "Good",
      dateOfBirth: "2006-05-15",
      exams: [
        { id: "EX006", subject: "Mathematics", score: 78, maxScore: 100, date: "2024-03-15" },
        { id: "EX007", subject: "English", score: 85, maxScore: 100, date: "2024-03-15" },
        { id: "EX008", subject: "Swahili", score: 92, maxScore: 100, date: "2024-03-15" },
        { id: "EX009", subject: "Science", score: 76, maxScore: 100, date: "2024-03-15" },
        { id: "EX010", subject: "Social Studies", score: 88, maxScore: 100, date: "2024-03-15" },
      ],
    },
    {
      id: "STU003",
      name: "Alice Wong",
      email: "alice.w@school.com",
      parentName: "David Wong",
      parentEmail: "david.w@email.com",
      grade: "12th",
      performance: "Average",
      dateOfBirth: "2006-08-22",
      exams: [
        { id: "EX011", subject: "Mathematics", score: 68, maxScore: 100, date: "2024-03-15" },
        { id: "EX012", subject: "English", score: 75, maxScore: 100, date: "2024-03-15" },
        { id: "EX013", subject: "Science", score: 72, maxScore: 100, date: "2024-03-15" },
        { id: "EX014", subject: "Swahili", score: 70, maxScore: 100, date: "2024-03-15" },
        { id: "EX015", subject: "Social Studies", score: 73, maxScore: 100, date: "2024-03-15" },
      ],
    },
    {
      id: "STU004",
      name: "Mohammed Ahmed",
      email: "mohammed.a@school.com",
      parentName: "Fatima Ahmed",
      parentEmail: "fatima.a@email.com",
      grade: "12th",
      performance: "Needs Improvement",
      dateOfBirth: "2006-03-10",
      exams: [
        { id: "EX016", subject: "Mathematics", score: 55, maxScore: 100, date: "2024-03-15" },
        { id: "EX017", subject: "English", score: 62, maxScore: 100, date: "2024-03-15" },
        { id: "EX018", subject: "Science", score: 58, maxScore: 100, date: "2024-03-15" },
        { id: "EX019", subject: "Swahili", score: 60, maxScore: 100, date: "2024-03-15" },
        { id: "EX020", subject: "Social Studies", score: 60, maxScore: 100, date: "2024-03-15" },
      ],
    },
    {
      id: "STU005",
      name: "Sofia Rodriguez",
      email: "sofia.r@school.com",
      parentName: "Carlos Rodriguez",
      parentEmail: "carlos.r@email.com",
      grade: "12th",
      performance: "Excellent",
      dateOfBirth: "2006-12-05",
      exams: [
        { id: "EX021", subject: "Mathematics", score: 95, maxScore: 100, date: "2024-03-15" },
        { id: "EX022", subject: "English", score: 88, maxScore: 100, date: "2024-03-15" },
        { id: "EX023", subject: "Swahili", score: 90, maxScore: 100, date: "2024-03-15" },
        { id: "EX024", subject: "Science", score: 93, maxScore: 100, date: "2024-03-15" },
        { id: "EX025", subject: "Social Studies", score: 91, maxScore: 100, date: "2024-03-15" },
      ],
    },
    {
      id: "STU006",
      name: "Daniel Kim",
      email: "daniel.k@school.com",
      parentName: "Jane Kim",
      parentEmail: "jane.k@email.com",
      grade: "12th",
      performance: "Good",
      dateOfBirth: "2006-09-18",
      exams: [
        { id: "EX026", subject: "Mathematics", score: 82, maxScore: 100, date: "2024-03-15" },
        { id: "EX027", subject: "English", score: 80, maxScore: 100, date: "2024-03-15" },
        { id: "EX028", subject: "Social Studies", score: 85, maxScore: 100, date: "2024-03-15" },
        { id: "EX029", subject: "Science", score: 83, maxScore: 100, date: "2024-03-15" },
        { id: "EX030", subject: "Swahili", score: 81, maxScore: 100, date: "2024-03-15" },
      ],
    }
  ]);

  const subjects = [
    "Mathematics",
    "English",
    "Swahili",
    "Science",
    "Social Studies"
  ] as const;

  const [newExam, setNewExam] = useState({
    subject: "Mathematics" as Exam["subject"],
    score: "",
    maxScore: "100",
    date: new Date().toISOString().split('T')[0],
  });

  const sortData = (data: any[], key: string) => {
    if (!key) return data;

    const sortedData = [...data].sort((a, b) => {
      let aValue = key.includes('.') ? 
        key.split('.').reduce((obj, key) => obj[key], a) : 
        a[key];
      let bValue = key.includes('.') ? 
        key.split('.').reduce((obj, key) => obj[key], b) : 
        b[key];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      }

      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });

    return sortConfig.direction === 'descending' ? sortedData.reverse() : sortedData;
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

  const getPerformanceClass = (performance: Student["performance"]) => {
    const classes = {
      Excellent: "bg-green-100 text-green-800",
      Good: "bg-blue-100 text-blue-800",
      Average: "bg-yellow-100 text-yellow-800",
      "Needs Improvement": "bg-red-100 text-red-800",
    };
    return `inline-block px-2 py-1 rounded-full text-xs font-medium ${classes[performance]}`;
  };

  const getAverageScore = (exams: Exam[] = []) => {
    if (exams.length === 0) return 0;
    const total = exams.reduce((sum, exam) => sum + (exam.score / exam.maxScore) * 100, 0);
    return Math.round(total / exams.length);
  };

  const getClassAverageBySubject = (subject: string) => {
    const allScores = students
      .filter(student => student.exams)
      .flatMap(student => 
        student.exams?.filter(exam => exam.subject === subject)
          .map(exam => (exam.score / exam.maxScore) * 100) || []
      );
    
    return allScores.length > 0 
      ? Number((allScores.reduce((sum, score) => sum + score, 0) / allScores.length).toFixed(1))
      : 0;
  };

  const getChartData = (exams: Exam[] = []) => {
    return exams.map(exam => ({
      subject: exam.subject,
      score: (exam.score / exam.maxScore) * 100,
      classAverage: getClassAverageBySubject(exam.subject)
    }));
  };

  const handleAddStudent = (newStudentData: Omit<Student, "id" | "performance" | "exams">) => {
    const studentId = `STU${String(students.length + 1).padStart(3, '0')}`;
    const student: Student = {
      ...newStudentData,
      id: studentId,
      performance: "Good",
      exams: [],
    };
    
    setStudents([...students, student]);
    toast({
      title: "Success",
      description: "Student added successfully",
    });
  };

  const handleAddExam = () => {
    if (!selectedStudent) return;
    
    const examId = `EX${String(selectedStudent.exams?.length || 0 + 1).padStart(3, '0')}`;
    const exam: Exam = {
      id: examId,
      subject: newExam.subject,
      score: Number(newExam.score),
      maxScore: Number(newExam.maxScore),
      date: newExam.date,
    };
    
    const updatedStudents = students.map(student => 
      student.id === selectedStudent.id
        ? { ...student, exams: [...(student.exams || []), exam] }
        : student
    );
    
    setStudents(updatedStudents);
    setNewExam({
      subject: "Mathematics" as Exam["subject"],
      score: "",
      maxScore: "100",
      date: new Date().toISOString().split('T')[0],
    });
    setShowExamForm(false);
    toast({
      title: "Success",
      description: "Exam added successfully",
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    const updatedStudents = students.filter(student => student.id !== studentId);
    setStudents(updatedStudents);
    toast({
      title: "Success",
      description: "Student deleted successfully",
    });
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    toast({
      title: "Edit Student",
      description: `Editing ${student.name}'s information.`
    });
  };

  const generatePDF = (student: Student) => {
    toast({
      title: "Coming Soon",
      description: "PDF generation will be implemented soon",
    });
  };

  const handleLogout = () => {
    // Add your logout logic here (e.g., clear tokens, reset state)
    navigate('/auth/signin');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'students':
        return (
          <StudentsList
            students={sortData(students.map(student => ({
              ...student,
              averageScore: getAverageScore(student.exams)
            })), sortConfig.key)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onViewResults={(student) => {
              setSelectedStudent(student);
              setShowResults(true);
            }}
            onAddExam={(student) => {
              setSelectedStudent(student);
              setShowExamForm(true);
            }}
            sortConfig={sortConfig}
            onSort={handleSort}
            getAverageScore={getAverageScore}
            getPerformanceClass={getPerformanceClass}
          />
        );
      case 'exams':
        return (
          <ExamsList
            students={students}
            onViewResults={(student) => {
              setSelectedStudent(student);
              setShowResults(true);
            }}
            onAddExam={(student) => {
              setSelectedStudent(student);
              setShowExamForm(true);
            }}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            getAverageScore={getAverageScore}
          />
        );
      case 'analysis':
        return (
          <Analysis
            students={students}
            getAverageScore={getAverageScore}
          />
        );
      case 'reports':
        return (
          <Reports
            students={students}
            getAverageScore={getAverageScore}
            getChartData={getChartData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">InsightEd</h1>
            <p className="text-gray-500 text-base italic flex-1 text-center mx-8">
              "Education is not preparation for life; education is life itself." - John Dewey
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">jaffarkeikei@gmail.com</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeSection === 'students' ? 'default' : 'outline'}
            onClick={() => setActiveSection('students')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Students
          </Button>
          <Button
            variant={activeSection === 'exams' ? 'default' : 'outline'}
            onClick={() => setActiveSection('exams')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Exams
          </Button>
          <Button
            variant={activeSection === 'analysis' ? 'default' : 'outline'}
            onClick={() => setActiveSection('analysis')}
            className="flex items-center gap-2"
          >
            <BarChart className="h-4 w-4" />
            Analysis
          </Button>
          <Button
            variant={activeSection === 'reports' ? 'default' : 'outline'}
            onClick={() => setActiveSection('reports')}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Reports
          </Button>
        </div>
        {renderContent()}
      </main>

      <ExamForm
        showExamForm={showExamForm}
        onCloseExamForm={() => setShowExamForm(false)}
        selectedStudent={selectedStudent}
        newExam={newExam}
        onExamChange={setNewExam}
        onAddExam={handleAddExam}
        subjects={subjects}
      />

      <ResultsDialog
        showResults={showResults}
        onCloseResults={() => setShowResults(false)}
        selectedStudent={selectedStudent}
        getAverageScore={getAverageScore}
        generatePDF={generatePDF}
        getChartData={getChartData}
      />
    </div>
  );
};

export default Dashboard;
