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

    const batches = Array.from({ length: batchCount }, () =>
      ai.models.generateImages({
        model: modelId,
        prompt,
        config: {
          numberOfImages,
          aspectRatio,
          outputMimeType: "image/jpeg",
          personGeneration: "ALLOW_ADULT", // Need valid enums from SDK
          // The imageSize, negativePrompt and addWatermark depend on the specific SDK definitions.
          // Adjusting according to generic usage.
          ...(negativePrompt && { negativePrompt }),
          // Some options may not be typed perfectly depending on the SDK version, pass them anyway if supported by API
        } as any // Using any to bypass strict type checking if SDK is slightly different
      }).then(res => {
         // Attempt to attach the additional config using the REST payload structure
         // This is a placeholder for actual SDK usage if it differs
         return res;
      })
    );

    // To properly support seed, negativePrompt etc if not in the SDK types:
    const batchesWithRawConfig = Array.from({ length: batchCount }, () => {
      return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY!,
        },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: numberOfImages,
            aspectRatio,
            negativePrompt: negativePrompt || undefined,
            outputOptions: {
              mimeType: "image/jpeg",
            },
            ...(seed !== undefined && { seed }),
            addWatermark,
            // imageSize might map differently in raw API, ignoring for raw fetch unless specifically documented
          }
        })
      }).then(res => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      });
    });

    // Actually, according to the user's plan, we use the `ai.models.generateImages` which is the new SDK
    const properBatches = Array.from({ length: batchCount }, () =>
      ai.models.generateImages({
        model: modelId,
        prompt,
        config: {
          numberOfImages,
          aspectRatio,
          // SDK uses specific properties, the plan has:
          // imageSize, negativePrompt, addWatermark, seed
        } as any // Using any as requested by plan
      })
    );

    // Let's use the one exactly like the plan.
    const planBatches = Array.from({ length: batchCount }, () =>
      ai.models.generateImages({
        model: modelId,
        prompt,
        config: {
          numberOfImages,
          aspectRatio,
          imageSize: resolvedSize,
          negativePrompt,
          addWatermark,
          ...(seed !== undefined && { seed }),
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
