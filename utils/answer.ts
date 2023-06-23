import { OpenAIModel } from "@/types";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

export const OpenAIStream = async (prompt: string, apiKey: string) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/chat/completions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    method: "POST",
    body: JSON.stringify({
      model: OpenAIModel.DAVINCI_TURBO,
      messages: [
        { role: "system", content: "You are a helpful assistant that accurately answers the user's queries based on the given text." },
        { role: "user", content: prompt }
      ],
      max_tokens: 120,
      temperature: 0.0,
      stream: false
    })
  });

  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error");
  }

  const json = await res.json();
  const [choice] = json.choices;
  return choice.message.content;
};
