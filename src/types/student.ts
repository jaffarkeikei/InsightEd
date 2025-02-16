
export interface Student {
  id: string;
  name: string;
  email: string;
  parentName: string;
  parentEmail: string;
  grade: string;
  performance: "Excellent" | "Good" | "Average" | "Needs Improvement";
  dateOfBirth: string;
  exams?: Exam[];
}

export interface Exam {
  id: string;
  subject: "Mathematics" | "English" | "Swahili" | "Science" | "Social Studies";
  score: number;
  maxScore: number;
  date: string;
}

export interface SubjectAnalysis {
  subject: string;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  aboveAverage: number;
  belowAverage: number;
  performance: {
    excellent: number;
    good: number;
    average: number;
    needsImprovement: number;
  };
}

export interface ClassAnalysis {
  overallAverage: number;
  topPerformers: Student[];
  needsSupport: Student[];
  subjectAnalysis: SubjectAnalysis[];
}
