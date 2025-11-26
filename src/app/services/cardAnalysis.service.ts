// src/services/cardAnalysis.service.ts
import { CardAnalysisResult, CardAnalysisError, CardAnalysisResponse,  } from "../../types/cardResult";
import { aiClient } from "../lib/aiClient";
import { buildPrompt } from "../api/utils/helpers";

export async function analyzeCardService(image: File): Promise<CardAnalysisResponse> {
    
    try{
        
        const prompt = buildPrompt();

        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");

        const result = await aiClient.generateJSON({ 
            prompt, 
            imageBase64: base64,
            file: image
        });
        
        if ("error" in result) {
            return { success: false, error: result as CardAnalysisError };
        }
        return { success: true, data: result as CardAnalysisResult };

    } catch(error) {
        
        console.error("CardAnalysisService error:", error);
        return {
            success: false,
            error: { error: "processing_failed", reason: "Unexpected error while analyzing image" },
        };

    }

}
