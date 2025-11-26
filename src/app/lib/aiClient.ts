import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const aiClient = {
  async generateJSON({ prompt, imageBase64, file }: { prompt: string; imageBase64: string; file: File | { type: string } }): Promise<any> {
    try {
      const model = openai("gpt-4.1-mini");

      const { text } = await generateText({
        model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image",
                image: `data:${file.type};base64,${imageBase64}`,
              },
            ],
          },
        ],
      });

      return JSON.parse(text);

    } catch (err) {
      console.error("AI Client error:", err);
      return {
        error: "ai_client_failed",
        reason: "Failed to get a valid response from the AI model",
      };
    }
  },
};
