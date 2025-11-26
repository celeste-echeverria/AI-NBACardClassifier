import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

export async function embedCardMetadata(card: any) {
  const text = `
    player: ${card.player_name}
    team: ${card.team}
    year: ${card.year}
    brand: ${card.card_brand}
    card_number: ${card.card_number}
    grade: ${card.grade}
    psa_label_color: ${card.psa_label_color}
    serial_number: ${card.serial_number}
    parallel: ${card.parallel}
  `;

  const { embedding } = await embed({
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    value: text,
  });

  return embedding;
}

