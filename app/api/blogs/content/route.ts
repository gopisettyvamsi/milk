import { NextRequest, NextResponse } from 'next/server';
import { ChatGroq } from "@langchain/groq";

export async function POST(request: NextRequest) {
  try {
    const { blogtitle } = await request.json();

    if (!blogtitle) {
      return NextResponse.json({ error: "Blog title is required." }, { status: 400 });
    }

    const chat = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY!,
      model: "llama-3.3-70b-versatile",
    });

    const prompt = `Write a blog post on the topic "${blogtitle}" targeted at business owners.
Avoid repeating the blog title in the beginning.
Use a professional tone and include actionable insights over a minimum of 5 paragraphs.

At the end, include a final paragraph clearly marked as:
"Conclusion: <your conclusion here>"`;

    const result = await chat.invoke(prompt);
    const fullContent = result.content;

    // Extract conclusion if marked
   // const [contentPart, conclusionPart] = fullContent.split(/Conclusion:\s*/i);

    return NextResponse.json({
      content: fullContent
      //conclusion: conclusionPart?.trim() || "",
    });

  } catch (error) {
    console.error('Error generating blog content:', error);
    return NextResponse.json({ error: 'Failed to generate blog content' }, { status: 500 });
  }
}
