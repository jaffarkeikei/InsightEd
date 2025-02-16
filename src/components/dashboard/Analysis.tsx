
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Student, SubjectAnalysis } from "@/types/student";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalysisProps {
  students: Student[];
  getAverageScore: (exams?: Student["exams"]) => number;
}

const Analysis = ({ students, getAverageScore }: AnalysisProps) => {
  const calculateSubjectAnalysis = (subject: string): SubjectAnalysis => {
    const subjectScores = students
      .flatMap(student => 
        student.exams?.filter(exam => exam.subject === subject)
          .map(exam => (exam.score / exam.maxScore) * 100) || []
      );

    if (subjectScores.length === 0) {
      return {
        subject,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        aboveAverage: 0,
        belowAverage: 0,
        performance: {
          excellent: 0,
          good: 0,
          average: 0,
          needsImprovement: 0
        }
      };
    }

    const average = subjectScores.reduce((a, b) => a + b, 0) / subjectScores.length;

    return {
      subject,
      averageScore: Number(average.toFixed(1)),
      highestScore: Math.max(...subjectScores),
      lowestScore: Math.min(...subjectScores),
      aboveAverage: subjectScores.filter(score => score > average).length,
      belowAverage: subjectScores.filter(score => score < average).length,
      performance: {
        excellent: subjectScores.filter(score => score >= 90).length,
        good: subjectScores.filter(score => score >= 75 && score < 90).length,
        average: subjectScores.filter(score => score >= 60 && score < 75).length,
        needsImprovement: subjectScores.filter(score => score < 60).length
      }
    };
  };

  const subjects = ["Mathematics", "English", "Swahili", "Science", "Social Studies"];
  const subjectAnalyses = subjects.map(calculateSubjectAnalysis);
  const classAverage = students.reduce((sum, student) => sum + getAverageScore(student.exams), 0) / students.length;

  const performanceData = subjectAnalyses.map(analysis => ({
    subject: analysis.subject,
    excellent: analysis.performance.excellent,
    good: analysis.performance.good,
    average: analysis.performance.average,
    needsImprovement: analysis.performance.needsImprovement,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classAverage.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...students.map(student => getAverageScore(student.exams)))}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.reduce((sum, student) => sum + (student.exams?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Distribution by Subject</CardTitle>
          <CardDescription>
            Number of students in each performance category per subject
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="excellent" stackId="a" fill="#22c55e" name="Excellent" />
                <Bar dataKey="good" stackId="a" fill="#3b82f6" name="Good" />
                <Bar dataKey="average" stackId="a" fill="#eab308" name="Average" />
                <Bar dataKey="needsImprovement" stackId="a" fill="#ef4444" name="Needs Improvement" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjectAnalyses.map((analysis) => (
          <Card key={analysis.subject}>
            <CardHeader>
              <CardTitle>{analysis.subject}</CardTitle>
              <CardDescription>Subject Performance Analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Average Score:</span>
                  <span className="font-medium">{analysis.averageScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Highest Score:</span>
                  <span className="font-medium">{analysis.highestScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Lowest Score:</span>
                  <span className="font-medium">{analysis.lowestScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Above Average:</span>
                  <span className="font-medium">{analysis.aboveAverage} students</span>
                </div>
                <div className="flex justify-between">
                  <span>Below Average:</span>
                  <span className="font-medium">{analysis.belowAverage} students</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Analysis;
