import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateVideoScript(
  quote: string,
  description: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a professional video script writer for AI avatar videos. 
        
Create a compelling, natural-sounding script for an AI avatar video based on the following:

QUOTE/MESSAGE: "${quote}"

VIDEO DESCRIPTION: "${description}"

Guidelines:
- Write in a conversational, engaging tone
- Keep it concise (60-120 seconds when spoken)
- Start with a strong hook
- Include the quote naturally
- End with a clear call to action or memorable closing
- Write only the spoken words (no stage directions or formatting)
- Make it sound natural and professional

Return only the script text, nothing else.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  return content.text;
}
