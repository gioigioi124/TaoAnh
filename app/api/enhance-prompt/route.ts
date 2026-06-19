import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { prompt, style, aspectRatio } = await req.json();

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are an expert AI image prompt engineer. 
Enhance this image generation prompt to be more detailed and visually rich.
Keep it under 800 characters. Return ONLY the enhanced prompt, no explanation.

Original prompt: "${prompt}"
Target style: ${style || "photorealistic"}
Aspect ratio: ${aspectRatio || "1:1"}`,
    });

    const enhanced = result.text;
    return NextResponse.json({ enhanced });
  } catch (error: any) {
    console.error("Enhance Prompt Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
