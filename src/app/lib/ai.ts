
import OpenAI from "openai";

//cliente de openAI
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

//prompt para analizar tarjetas
export function buildPrompt() {
    return `
        You are an expert assistant specialized in NBA trading cards.
        Your task is to analyze an image of a trading card and determine whether it is authentically graded by PSA (Professional Sports Authenticator).

        Step 1: Validation

        First, verify whether the image corresponds to a real PSA-graded card.
        If it does not appear to be a PSA card, return the following JSON:

        { "error": "image_not_supported", "reason": "<brief explanation>" }

        Step 2: Information Extraction

        If the image does appear to be a PSA-graded card, extract all visible information from the PSA label and respond exclusively with a JSON object following this format:

        {
        "player_name": "Full name of the player",
        "team": "Team name",
        "year": 2021,
        "card_brand": "Card brand (e.g., Panini, Topps, Upper Deck)",
        "card_number": "Card number, if visible",
        "grade": "PSA grade (e.g., 10 GEM MINT, 9 MINT, etc.)",
        "psa_label_color": "Main color of the PSA label (e.g., red, silver, gold)",
        "serial_number": "Serial number shown on the label or card, or null if not visible",
        "additional_text": "Any other relevant text or details (e.g., special edition, holo, refractor, etc.)"
        }

        Instructions

        Do not make up or infer information.

        Carefully analyze visible text, colors, and label patterns.

        Respond only with valid JSON — no extra commentary or explanations.
    `;
}