import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { studentName, results } = await req.json();

    // Calculate overall performance metrics
    const totalMarks = results.reduce((sum: number, r: any) => sum + r.marks, 0);
    const totalMaxMarks = results.reduce((sum: number, r: any) => sum + r.totalMarks, 0);
    const overallPercentage = ((totalMarks / totalMaxMarks) * 100).toFixed(1);

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an experienced teacher providing constructive feedback on student exam results. Keep the feedback specific, encouraging, and actionable."
        },
        {
          role: "user",
          content: `Please analyze this student's exam performance:

Student: ${studentName}
Exam Results:
${results.map(r => `${r.examName}: ${r.marks}/${r.totalMarks} (${((r.marks/r.totalMarks)*100).toFixed(1)}%)`).join('\n')}
Overall Performance: ${overallPercentage}%

Please provide:
1. A brief overall performance assessment
2. Specific strengths shown in the results
3. Areas that need attention
4. Actionable study recommendations

Format the response in clear paragraphs with appropriate spacing.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const feedback = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ feedback });

  } catch (error) {
    console.error('Error generating feedback:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate feedback',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 