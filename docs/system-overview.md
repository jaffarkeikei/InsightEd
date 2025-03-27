# InsightEd System Overview

InsightEd is an AI-powered feedback system designed to help teachers generate personalized learning insights for students in underprivileged educational environments. This document provides a high-level overview of the system architecture and components.

## System Architecture

```mermaid
flowchart TD
    subgraph Frontend
        UI[User Interface]
        components[React Components]
        state[Application State]
    end
    
    subgraph Backend[Potential Backend Services]
        auth[Authentication]
        api[API Services]
        storage[Data Storage]
        ai[AI Feedback Engine]
    end
    
    subgraph DataFlow
        input[Student Data Input]
        process[Data Processing]
        generate[Report Generation]
        export[PDF Export]
    end
    
    UI --> components
    components --> state
    state --> components
    
    input --> UI
    UI --> process
    process --> generate
    generate --> export
    
    components --> api
    api --> auth
    api --> storage
    api --> ai
    
    classDef primary fill:#3b82f6,stroke:#2563eb,color:white;
    classDef secondary fill:#22c55e,stroke:#16a34a,color:white;
    classDef tertiary fill:#f59e0b,stroke:#d97706,color:white;
    
    class UI,components,state primary
    class auth,api,storage,ai secondary
    class input,process,generate,export tertiary
```

## Key Components

- **User Interface**: React-based frontend with shadcn/ui components
- **State Management**: Client-side state using React hooks
- **Data Input**: Manual entry and CSV upload for student scores
- **Analysis Engine**: Score processing and visualization tools
- **Feedback Generation**: AI-powered personalized feedback for students
- **Export Functionality**: PDF report generation for sharing with students and parents

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI primitives
- **Charts**: Recharts for data visualization
- **PDF Generation**: jsPDF
- **Authentication**: Local authentication mechanism
- **Data Storage**: Client-side storage (demo data) 