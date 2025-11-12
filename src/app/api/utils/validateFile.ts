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
