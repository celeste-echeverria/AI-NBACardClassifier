import { NextResponse } from "next/server";
import { validateFile } from "../utils/validateFile";

export async function POST(req: Request) {
    const form = await req.formData();
    const fileEntry = form.get("file");
    
    // Validar archivo
    const validation = validateFile(fileEntry);
    if (!validation.valid) {
        return validation.response;
    }

    const file = validation.file!;
    //procesamiento de la imagen 
    

    return NextResponse.json({ message: "Archivo recibido" });
}
