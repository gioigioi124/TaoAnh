import { GenerateResult } from "@/types";
import { Download, Copy, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageCardProps {
  image: GenerateResult;
  onDownload: () => void;
  onCopyPrompt: () => void;
  onViewFullscreen: () => void;
  prompt: string;
}

export function ImageCard({ image, onDownload, onCopyPrompt, onViewFullscreen, prompt }: ImageCardProps) {
  const imageUrl = `data:${image.mimeType};base64,${image.base64}`;

  return (
    <div className="group relative rounded-xl overflow-hidden border bg-muted aspect-square">
      <img
        src={imageUrl}
        alt={prompt}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      
      {/* Overlay Actions */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
        <div className="flex justify-end gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="w-8 h-8 rounded-full bg-background/80 hover:bg-background"
            onClick={onCopyPrompt}
            title="Copy Prompt"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="w-8 h-8 rounded-full bg-background/80 hover:bg-background"
            onClick={onDownload}
            title="Download Image"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex justify-between items-end">
          <p className="text-xs text-white line-clamp-2 max-w-[80%] drop-shadow-md">
            {prompt}
          </p>
          <Button
            size="icon"
            variant="secondary"
            className="w-8 h-8 rounded-full bg-background/80 hover:bg-background"
            onClick={onViewFullscreen}
            title="View Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
