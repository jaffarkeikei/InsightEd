
import { Student, Exam } from "@/types/student";

export const getScoreComment = (score: number, maxScore: number, subject: string): string => {
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

export const getPerformanceComment = (student: Student) => {
  const average = getAverageScore(student.exams);
  const comments = {
    academic: "",
    improvement: "",
    strengths: "",
    challenges: "",
    recommendations: ""
  };

  if (average >= 90) {
    comments.academic = "Demonstrates exceptional academic excellence across all subjects. Consistently performs at the highest level with thorough understanding of complex concepts.";
  } else if (average >= 75) {
    comments.academic = "Shows strong academic performance with good grasp of subject matter. Demonstrates consistent effort and understanding in most areas.";
  } else if (average >= 60) {
    comments.academic = "Maintains satisfactory academic progress. Shows basic understanding of core concepts but has room for improvement.";
  } else {
    comments.academic = "Currently facing academic challenges. Requires additional support and focused attention to improve understanding of fundamental concepts.";
  }

  const subjects = student.exams?.reduce((acc, exam) => {
    const score = (exam.score / exam.maxScore) * 100;
    if (score >= 80) {
      acc.strengths.push(exam.subject);
    } else if (score <= 65) {
      acc.challenges.push(exam.subject);
    }
    return acc;
  }, { strengths: [] as string[], challenges: [] as string[] });

  if (subjects?.strengths.length) {
    comments.strengths = `Exhibits particular strength in ${subjects.strengths.join(", ")}. Shows exceptional aptitude and engagement in these subjects.`;
  } else {
    comments.strengths = "Has potential for improvement across all subjects with focused effort and dedication.";
  }

  if (subjects?.challenges.length) {
    comments.challenges = `Areas requiring additional focus include ${subjects.challenges.join(", ")}. `;
    comments.improvement = `Has shown gradual improvement in understanding concepts, particularly in challenging subjects. Regular participation in class activities has contributed to this progress.`;
  } else {
    comments.challenges = "Maintains consistent performance across subjects. ";
    comments.improvement = "Demonstrates steady academic progress and consistent effort in all subjects.";
  }

  comments.recommendations = `
    1. Continue to maintain excellent study habits and classroom participation
    2. Consider participating in additional academic enrichment activities
    3. Focus on developing critical thinking and analytical skills
    4. Engage in peer study groups to enhance collaborative learning
    5. Regular review of challenging topics with teachers
    6. Maintain a balanced approach to academic and extra-curricular activities`;

  return comments;
};

export const getAverageScore = (exams: Exam[] = []) => {
  if (exams.length === 0) return 0;
  const total = exams.reduce((sum, exam) => sum + (exam.score / exam.maxScore) * 100, 0);
  return Math.round(total / exams.length);
};
