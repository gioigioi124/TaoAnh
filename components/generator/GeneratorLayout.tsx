"use client";

import { useState } from "react";
import { PromptPanel } from "./PromptPanel";
import { ImageGallery } from "../gallery/ImageGallery";
import { ImageModal } from "../gallery/ImageModal";
import { GenerateRequest, GenerateResult } from "@/types";
import { useGenerate } from "@/hooks/useGenerate";
import { useDownload } from "@/hooks/useDownload";
import { toast } from "sonner";

export function GeneratorLayout() {
  const [request, setRequest] = useState<GenerateRequest>({
    prompt: "",
    model: "imagen-4",
    numberOfImages: 4,
    aspectRatio: "1:1",
    imageSize: "1K",
    addWatermark: true,
    batchCount: 1,
  });

  const { images, isLoading, generateImages, enhancePrompt, isEnhancing } = useGenerate();
  const { downloadImage } = useDownload();
  const [fullscreenImage, setFullscreenImage] = useState<GenerateResult | null>(null);

  const handleGenerate = () => {
    generateImages(request);
  };

  const handleEnhance = async () => {
    try {
      const enhanced = await enhancePrompt(request.prompt, request.style, request.aspectRatio);
      setRequest(prev => ({ ...prev, prompt: enhanced }));
    } catch (error) {
      toast.error("Failed to enhance prompt.");
    }
  };

  const updateRequest = (updates: Partial<GenerateRequest>) => {
    setRequest((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <PromptPanel
        request={request}
        updateRequest={updateRequest}
        onGenerate={handleGenerate}
        isLoading={isLoading}
        onEnhancePrompt={handleEnhance}
        isEnhancing={isEnhancing}
      />
      <div className="flex-1 bg-muted/20 relative">
        <ImageGallery
          images={images}
          isLoading={isLoading}
          prompt={request.prompt}
          onDownload={(img) => downloadImage(img, request.prompt)}
          onCopyPrompt={(prompt) => {
            navigator.clipboard.writeText(prompt);
            toast.success("Prompt copied to clipboard");
          }}
          onViewFullscreen={setFullscreenImage}
        />
      </div>

      <ImageModal image={fullscreenImage} onClose={() => setFullscreenImage(null)} />
    </div>
  );
}
