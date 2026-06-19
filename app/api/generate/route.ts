import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const IMAGE_MODELS = {
  "imagen-4-fast":    "imagen-4.0-fast-generate-001",
  "imagen-4":         "imagen-4.0-generate-001",
  "imagen-4-ultra":   "imagen-4.0-ultra-generate-001",
  "gemini-flash-img": "gemini-3.1-flash-image",
  "gemini-pro-img":   "gemini-3-pro-image",
} as const;

const SIZE_SUPPORT: Record<string, string[]> = {
  "imagen-4-fast":    ["1K", "2K"],
  "imagen-4":         ["1K", "2K"],
  "imagen-4-ultra":   ["1K", "2K", "4K"],
  "gemini-flash-img": ["512", "1K", "2K", "4K"],
  "gemini-pro-img":   ["1K", "2K", "4K"],
};

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      negativePrompt,
      model = "imagen-4",
      numberOfImages = 4,
      aspectRatio = "1:1",
      imageSize = "1K",
      seed,
      addWatermark = true,
      batchCount = 1,
    } = await req.json();

    const modelId = IMAGE_MODELS[model as keyof typeof IMAGE_MODELS] ?? IMAGE_MODELS["imagen-4"];

    // Validate imageSize
    const validSizes = SIZE_SUPPORT[model] ?? ["1K"];
    const resolvedSize = validSizes.includes(imageSize) ? imageSize : "1K";

    // Only execute the intended planBatches
    const planBatches = Array.from({ length: batchCount }, () =>
      ai.models.generateImages({
        model: modelId,
        prompt,
        config: {
          numberOfImages,
          aspectRatio,
          // Gemini image SDK currently maps size differently or uses imageSize, etc.
          // In the new @google/genai SDK, properties might be passed directly
          outputMimeType: "image/jpeg",
          personGeneration: "ALLOW_ADULT",
          ...(negativePrompt && { negativePrompt }),
        } as any
      })
    );

    const results = await Promise.allSettled(planBatches);

    const images = results.flatMap((r) => {
      if (r.status === "rejected") return [];
      return r.value.generatedImages?.map((img: any) => ({
        base64: img.image?.imageBytes || img.imageBytes, // Fallback depending on SDK payload
        mimeType: (img.image?.mimeType || img.mimeType) ?? "image/jpeg",
      })) ?? [];
    });

    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({ images, count: images.length, failed });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
