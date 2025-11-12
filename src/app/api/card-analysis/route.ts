import { NextResponse } from "next/server";
import { validateFile } from "../utils/helpers";
import { analyzeCardService } from "../../services/cardAnalysis.service";
export async function POST(req: Request) {
    try {
        const form = await req.formData();
        const fileEntry = form.get("file");
        
        // Validar archivo
        const validation = validateFile(fileEntry);
        if (!validation.valid) {
            return validation.response;
        }
    
        const file = validation.file!;

        //llamo al service de procesamiento del file 
        const result = await analyzeCardService(file);
    
        if (result.success) {
            return NextResponse.json(result.data, { status: 200 });
        } else {
            return NextResponse.json(result.error, { status: 400 });
        }
        
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: "internal_error", message: error.message },
            { status: 500 }
        );
    }
}
