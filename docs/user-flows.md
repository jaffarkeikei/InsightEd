# User Flows

This document outlines the different user flows in the InsightEd application.

## Authentication Flow

```mermaid
graph TD
    A[User] --> B{Has Account?}
    B -->|Yes| C[Sign In]
    B -->|No| D[Sign Up]
    C --> E{Valid Credentials?}
    E -->|Yes| F[Dashboard]
    E -->|No| G[Error Message]
    G --> C
    D --> H[Create Account]
    H --> C
```

## Student Management Flow

```mermaid
flowchart TD
    Start([Teacher]) --> Dashboard[Dashboard]
    Dashboard --> StudentTab[Students Tab]
    
    StudentTab --> ViewStudents[View Students List]
    
    ViewStudents --> AddNewStudent[Add New Student]
    AddNewStudent --> FillStudentForm[Fill Student Information]
    FillStudentForm --> SaveStudent[Save Student]
    SaveStudent --> ViewStudents
    
    ViewStudents --> SelectStudent[Select Existing Student]
    SelectStudent --> |Option 1| ViewExams[View Student Exams]
    SelectStudent --> |Option 2| EditStudent[Edit Student Details]
    SelectStudent --> |Option 3| DeleteStudent[Delete Student]
    
    ViewExams --> AddExam[Add New Exam]
    AddExam --> FillExamForm[Fill Exam Information]
    FillExamForm --> SaveExam[Save Exam]
    SaveExam --> ViewExams
    
    EditStudent --> UpdateStudentForm[Update Student Information]
    UpdateStudentForm --> SaveUpdatedStudent[Save Changes]
    SaveUpdatedStudent --> ViewStudents
    
    DeleteStudent --> ConfirmDelete{Confirm Delete?}
    ConfirmDelete -->|Yes| RemoveStudent[Remove Student]
    ConfirmDelete -->|No| ViewStudents
    RemoveStudent --> ViewStudents
    
    classDef primary fill:#3b82f6,stroke:#2563eb,color:white;
    classDef secondary fill:#22c55e,stroke:#16a34a,color:white;
    classDef action fill:#f59e0b,stroke:#d97706,color:white;
    classDef decision fill:#ef4444,stroke:#dc2626,color:white;
    
    class Start,Dashboard,StudentTab primary
    class ViewStudents,ViewExams,FillStudentForm,FillExamForm,UpdateStudentForm secondary
    class AddNewStudent,SelectStudent,AddExam,EditStudent,DeleteStudent,SaveStudent,SaveExam,SaveUpdatedStudent,RemoveStudent action
    class ConfirmDelete decision
```

## Report Generation Flow

```mermaid
sequenceDiagram
    actor Teacher
    participant Dashboard
    participant ReportsTab
    participant PreviewDialog
    participant PDFGenerator
    
    Teacher->>Dashboard: Navigate to Dashboard
    activate Dashboard
    
    Teacher->>Dashboard: Select Reports Tab
    Dashboard->>ReportsTab: Show Reports Interface
    activate ReportsTab
    
    Teacher->>ReportsTab: Select Student for Report
    ReportsTab->>Teacher: Show Report Options
    
    Teacher->>ReportsTab: Click Generate Report
    ReportsTab->>PreviewDialog: Open Report Preview
    activate PreviewDialog
    
    PreviewDialog->>Teacher: Display Report Preview
    
    Teacher->>PreviewDialog: Click Download PDF
    PreviewDialog->>PDFGenerator: Generate PDF Document
    activate PDFGenerator
    
    PDFGenerator->>Teacher: Download PDF File
    deactivate PDFGenerator
    
    Teacher->>PreviewDialog: Close Preview
    deactivate PreviewDialog
    
    Teacher->>ReportsTab: Back to Reports List
    deactivate ReportsTab
    
    Teacher->>Dashboard: Continue with other tasks
    deactivate Dashboard
```

## Class Analysis Flow

```mermaid
stateDiagram-v2
    [*] --> Dashboard
    
    Dashboard --> AnalysisTab: Click Analysis Tab
    
    state AnalysisTab {
        [*] --> OverallMetrics
        OverallMetrics --> PerformanceCharts: Scroll Down
        PerformanceCharts --> SubjectCards: Scroll Down
    }
    
    state OverallMetrics {
        [*] --> ViewClassAverage
        [*] --> ViewStudentCount
        [*] --> ViewHighestAverage
        [*] --> ViewExamCount
    }
    
    state PerformanceCharts {
        [*] --> ViewDistributionChart
        ViewDistributionChart --> AnalyzePerformance: Interpret Data
    }
    
    state SubjectCards {
        [*] --> ViewMathAnalysis
        [*] --> ViewEnglishAnalysis
        [*] --> ViewScienceAnalysis
        [*] --> ViewSwahiliAnalysis
        [*] --> ViewSocialStudiesAnalysis
    }
    
    AnalysisTab --> Dashboard: Click Back to Dashboard
``` 