import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { index } from "@/app/lib/pinecone";

export async function POST(req: Request) {
  const { query } = await req.json();

  // 1. text embedding
  const { embedding: textVector } = await embed({
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    value: query,
  });

  // 2. CLIP text → image embedding
  // (CLIPTextEncoder)
  const { embedding: imageVector } = await embed({
    model: openai.textEmbeddingModel("clip-text-embedding-base"),
    value: query,
  });

  // 3. Search both
  const resultsText = await index.query({
    vector: textVector,
    topK: 5,
    filter: { type: "text-embedding" },
    includeMetadata: true,
  });

  const resultsImage = await index.query({
    vector: imageVector,
    topK: 5,
    filter: { type: "image-embedding" },
    includeMetadata: true,
  });

  // 4. Merge scores
  function mergeResults(a: any, b: any) {
    const map = new Map();

    [...a.matches, ...b.matches].forEach((item) => {
      const id = item.id.replace("-img", "");
      const prev = map.get(id) || { score: 0, data: item.metadata };
      map.set(id, {
        score: prev.score + item.score,
        data: item.metadata,
      });
    });

    return [...map.values()].sort((x, y) => y.score - x.score);
  }

  return Response.json({
    results: mergeResults(resultsText, resultsImage),
  });
}
