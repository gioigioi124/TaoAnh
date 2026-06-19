import { Button } from "@/components/ui/button";
import { Loader2, ImageIcon } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
  imagesCount: number;
  batchCount: number;
}

export function GenerateButton({ onClick, isLoading, disabled, imagesCount, batchCount }: GenerateButtonProps) {
  const totalImages = imagesCount * batchCount;

  return (
    <Button
      className="w-full h-12 text-lg font-semibold relative overflow-hidden"
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <ImageIcon className="w-5 h-5 mr-2" />
          Generate
        </>
      )}
      
      {!isLoading && (
        <span className="absolute right-4 text-xs font-normal opacity-70">
          {totalImages} {totalImages === 1 ? "image" : "images"}
        </span>
      )}
    </Button>
  );
}
