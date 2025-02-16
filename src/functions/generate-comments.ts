
// Supabase Edge Function
export const config = {
  runtime: 'edge',
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { student } = await req.json();
    const openAIApiKey = process.env.OPENAI_API_KEY;

    console.log('Processing request for student:', student.name);
    console.log('API Key exists:', !!openAIApiKey);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const systemPrompt = `You are an experienced teacher writing concise academic reports. 
    Generate brief, focused comments based on the student's performance. 
    Limit each section to approximately 50 words. Keep the tone professional and constructive.`;

    const userPrompt = `Generate brief academic comments for:
    Name: ${student.name}
    Grade: ${student.grade}
    Performance: ${student.performance}
    Exams: ${JSON.stringify(student.exams)}
    
    Format the response as JSON with these sections, each around 50 words:
    {
      "academic": "overall academic progress",
      "strengths": "key strengths",
      "challenges": "main areas for improvement",
      "recommendations": "specific, actionable recommendations"
    }`;

    console.log('Making request to OpenAI API...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI API response received:', data);
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from OpenAI');
    }

    const aiComments = JSON.parse(data.choices[0].message.content);
    console.log('Generated comments:', aiComments);

    return new Response(JSON.stringify(aiComments), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-comments function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
