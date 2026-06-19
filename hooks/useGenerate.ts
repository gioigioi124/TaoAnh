import { useState } from "react";
import { GenerateRequest, GenerateResult } from "@/types";
import { toast } from "sonner";

export function useGenerate() {
  const [images, setImages] = useState<GenerateResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const generateImages = async (request: GenerateRequest) => {
    setIsLoading(true);
    setImages([]); // Clear previous images
    
    // Check for negativePrompt, append style
    const finalPrompt = request.style && request.style !== "none" 
      ? `${request.prompt}, ${request.style}`
      : request.prompt;
      
    const payload = {
      ...request,
      prompt: finalPrompt
    };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to generate images");
      }

      const data = await res.json();
      
      if (data.images && data.images.length > 0) {
        setImages(data.images);
        if (data.failed > 0) {
          toast.warning(`Generated ${data.count} images, but ${data.failed} batches failed.`);
        } else {
          toast.success(`Successfully generated ${data.count} images.`);
        }
      } else {
        toast.error("No images were generated. Please try again.");
      }
    } catch (error) {
      console.error("Generate error:", error);
      toast.error("An error occurred while generating images.");
    } finally {
      setIsLoading(false);
    }
  };

  const enhancePrompt = async (prompt: string, style?: string, aspectRatio?: string): Promise<string> => {
    setIsEnhancing(true);
    try {
      const res = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, aspectRatio }),
      });

      if (!res.ok) {
        throw new Error("Failed to enhance prompt");
      }

      const data = await res.json();
      return data.enhanced;
    } finally {
      setIsEnhancing(false);
    }
  };

  return {
    images,
    isLoading,
    generateImages,
    enhancePrompt,
    isEnhancing
  };
}
