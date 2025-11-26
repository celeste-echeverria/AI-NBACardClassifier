import { index } from "@/app/lib/pinecone";

export async function upsertCard(cardId: string, textEmbedding: number[], imageEmbedding: number[], rawCardJSON: any) {

  await index.upsert([
    {
      id: cardId,
      values: textEmbedding,
      metadata: {
        ...rawCardJSON,
        type: "text-embedding"
      }
    },
    {
      id: `${cardId}-img`,
      values: imageEmbedding,
      metadata: {
        ...rawCardJSON,
        type: "image-embedding"
      }
    }
  ]);
}
