
import { CardAnalysisError, CardAnalysisResult } from "@/types/cardResult";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { ResponseInputItem } from "openai/resources/responses/responses.mjs";

//cliente de openAI
export const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY!,
});

export const aiClient = {
  async generateJSON({
    prompt,
    imageBase64,
    file
  }: {
    prompt: string;
    imageBase64: string;
    file: File;
  }): Promise<CardAnalysisResult | CardAnalysisError> {
    try {

      const message = [
        {
          role: "user",
          content: [
            { 
              type: "input_text", 
              text: prompt 
            },
            {
              type: "input_image",
              image_url: `data:${file.type};base64,${imageBase64}`,
            },
          ],
        },
      ] as ResponseInputItem[]

      const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: message,
      });

      if(!response.output_text) throw new Error("No content returned from model");
      return JSON.parse(response.output_text) as CardAnalysisResult | CardAnalysisError;

    } catch (err) {
      console.error("AI Client error:", err);
      return {
        error: "ai_client_failed",
        reason: "Failed to get a valid response from the AI model",
      };
    }
  },
};