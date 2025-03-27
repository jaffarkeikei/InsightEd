# Data Model

This document outlines the data structures used in InsightEd.

## Data Structures

```mermaid
classDiagram
    class Student {
        +string id
        +string name
        +string email
        +string parentName
        +string parentEmail
        +string grade
        +string performance
        +string dateOfBirth
        +Exam[] exams
    }
    
    class Exam {
        +string id
        +string subject
        +number score
        +number maxScore
        +string date
    }
    
    class SubjectAnalysis {
        +string subject
        +number averageScore
        +number highestScore
        +number lowestScore
        +number aboveAverage
        +number belowAverage
        +PerformanceDistribution performance
    }
    
    class PerformanceDistribution {
        +number excellent
        +number good
        +number average
        +number needsImprovement
    }
    
    class ClassAnalysis {
        +number overallAverage
        +Student[] topPerformers
        +Student[] needsSupport
        +SubjectAnalysis[] subjectAnalysis
    }
    
    Student "1" --o "*" Exam : has
    SubjectAnalysis "1" --* "1" PerformanceDistribution : contains
    ClassAnalysis "1" --o "*" SubjectAnalysis : contains
    ClassAnalysis "1" --o "*" Student : references
```

## Data Flow

```mermaid
graph LR
    subgraph Input
        StudentData[Student Data Entry]
        ExamData[Exam Score Entry]
        Upload[CSV Upload]
    end
    
    subgraph Processing
        Calculate[Calculate Statistics]
        Analyze[Analyze Performance]
    end
    
    subgraph Output
        Charts[Performance Charts]
        Tables[Data Tables]
        PDF[PDF Reports]
    end
    
    StudentData --> Calculate
    ExamData --> Calculate
    Upload --> Calculate
    
    Calculate --> Analyze
    Analyze --> Charts
    Analyze --> Tables
    Analyze --> PDF
    
    classDef input fill:#3b82f6,stroke:#2563eb,color:white;
    classDef process fill:#22c55e,stroke:#16a34a,color:white;
    classDef output fill:#f59e0b,stroke:#d97706,color:white;
    
    class StudentData,ExamData,Upload input
    class Calculate,Analyze process
    class Charts,Tables,PDF output
```

## Data Relationships

```mermaid
erDiagram
    STUDENT ||--o{ EXAM : has
    STUDENT {
        string id PK
        string name
        string email
        string parentName
        string parentEmail
        string grade
        string performance
        string dateOfBirth
    }
    
    EXAM {
        string id PK
        string subject
        number score
        number maxScore
        string date
        string studentId FK
    }
    
    ANALYSIS }|--|| CLASS : analyzesPerformanceOf
    ANALYSIS {
        string subject
        number averageScore
        number highestScore
        number lowestScore
    }
    
    CLASS {
        number overallAverage
        array topPerformers
        array needsSupport
    }
``` 