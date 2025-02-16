
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student, Exam } from "@/types/student";

interface ExamFormProps {
  showExamForm: boolean;
  onCloseExamForm: () => void;
  selectedStudent: Student | null;
  newExam: {
    subject: Exam["subject"];
    score: string;
    maxScore: string;
    date: string;
  };
  onExamChange: (exam: {
    subject: Exam["subject"];
    score: string;
    maxScore: string;
    date: string;
  }) => void;
  onAddExam: () => void;
  subjects: readonly Exam["subject"][];
}

const ExamForm = ({
  showExamForm,
  onCloseExamForm,
  selectedStudent,
  newExam,
  onExamChange,
  onAddExam,
  subjects,
}: ExamFormProps) => {
  return (
    <Dialog open={showExamForm} onOpenChange={onCloseExamForm}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Exam Result</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label>Subject</label>
            <Select
              value={newExam.subject}
              onValueChange={(value) => onExamChange({ ...newExam, subject: value as Exam["subject"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label>Score</label>
            <Input
              type="number"
              value={newExam.score}
              onChange={(e) => onExamChange({ ...newExam, score: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <label>Max Score</label>
            <Input
              type="number"
              value={newExam.maxScore}
              onChange={(e) => onExamChange({ ...newExam, maxScore: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <label>Date</label>
            <Input
              type="date"
              value={newExam.date}
              onChange={(e) => onExamChange({ ...newExam, date: e.target.value })}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onAddExam}>Add Exam</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamForm;
