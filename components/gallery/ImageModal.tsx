import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GenerateResult } from "@/types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageModalProps {
  image: GenerateResult | null;
  onClose: () => void;
}

export function ImageModal({ image, onClose }: ImageModalProps) {
  if (!image) return null;
  const imageUrl = `data:${image.mimeType};base64,${image.base64}`;

  return (
    <Dialog open={!!image} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 border-none bg-black/90 flex flex-col items-center justify-center">
        <VisuallyHidden>
          <DialogTitle>Image Preview</DialogTitle>
          <DialogDescription>A fullscreen preview of the generated image.</DialogDescription>
        </VisuallyHidden>
        <img
          src={imageUrl}
          alt="Generated"
          className="max-w-full max-h-full object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
