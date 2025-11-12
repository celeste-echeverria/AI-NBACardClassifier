import { NextResponse } from "next/server";

const VALID_FILE_TYPES = ["image/png", "image/jpeg", "application/pdf"];

function isFile(value: FormDataEntryValue | null): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as any).type === "string"
  );
}

export function validateFile(fileEntry: FormDataEntryValue | null) {
  // Validar que existe un archivo
  if (!fileEntry) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: "no_file", reason: "No se recibió ningún archivo" },
        { status: 400 }
      ),
    };
  }

  // Validar que sea un tipo File
  if (!isFile(fileEntry)) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: "invalid_file", reason: "El archivo no es válido" },
        { status: 400 }
      ),
    };
  }

  // Validar el tipo MIME
  if (!VALID_FILE_TYPES.includes(fileEntry.type)) {
    return {
      valid: false,
      response: NextResponse.json(
        {
          error: "image_not_supported",
          reason: `Tipo no permitido: ${fileEntry.type}. Tipos aceptados: ${VALID_FILE_TYPES.join(", ")}`,
        },
        { status: 400 }
      ),
    };
  }

  return {
    valid: true,
    file: fileEntry,
  };
}

export function buildPrompt() {
    return `
        You are an expert assistant specialized in NBA trading cards and PSA (Professional Sports Authenticator) standards.
        Your role is to analyze images of trading cards to identify whether they are authentically PSA-graded and to extract visible information from the PSA label for cataloging purposes.

        Step 1: Validation
        Input images are not pre-validated — they may include raw (ungraded) cards or cards graded by other companies (e.g., BGS, SGC).
        Your first task is to determine whether the image shows a genuine PSA-graded card.
        If it does not appear to be a PSA card, respond only with this JSON:

        { "error": "image_not_supported", "reason": "<brief explanation>" }

        Step 2: Information Extraction
        If the image does appear to be a PSA-graded card, extract all visible details from the PSA label and respond exclusively with a JSON object using the following structure:

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
        Do not make up, fabricate or infer information.
        Analyze visible text, colors, and layout patterns carefully.
        Respond only with valid JSON, with no extra commentary or explanations outside the JSON object.
    `;
}
