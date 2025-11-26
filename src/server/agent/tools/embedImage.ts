import { pipeline } from "@xenova/transformers";

let model: any = null;

export async function embedImageCLIP(base64Image: string) {
  if (!model) {
    model = await pipeline("feature-extraction", "Xenova/clip-vit-base-patch32");
  }

  const img = `data:image/jpeg;base64,${base64Image}`;

  const embedding = await model(img, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(embedding.data);
}
