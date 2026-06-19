import { GenerateResult } from "@/types";
import { ImageCard } from "./ImageCard";
import { EmptyState } from "./EmptyState";
import { Loader2 } from "lucide-react";

interface ImageGalleryProps {
  images: GenerateResult[];
  isLoading: boolean;
  prompt: string;
  onDownload: (image: GenerateResult) => void;
  onCopyPrompt: (prompt: string) => void;
  onViewFullscreen: (image: GenerateResult) => void;
}

export function ImageGallery({
  images,
  isLoading,
  prompt,
  onDownload,
  onCopyPrompt,
  onViewFullscreen,
}: ImageGalleryProps) {
  if (images.length === 0 && !isLoading) {
    return <EmptyState />;
  }

  return (
    <div className="p-4 md:p-6 w-full h-full overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {images.map((img, idx) => (
          <ImageCard
            key={idx}
            image={img}
            prompt={prompt}
            onDownload={() => onDownload(img)}
            onCopyPrompt={() => onCopyPrompt(prompt)}
            onViewFullscreen={() => onViewFullscreen(img)}
          />
        ))}

        {/* Loading Skeletons */}
        {isLoading &&
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={`skeleton-${idx}`}
              className="rounded-xl overflow-hidden border bg-muted aspect-square flex items-center justify-center animate-pulse"
            >
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin opacity-50" />
            </div>
          ))}
      </div>
    </div>
  );
}
