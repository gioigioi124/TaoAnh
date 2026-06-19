import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onEnhance?: () => void;
  isEnhancing?: boolean;
}

export function PromptInput({ value, onChange, disabled, onEnhance, isEnhancing }: PromptInputProps) {
  const maxLength = 1000;
  const length = value.length;
  const isNearLimit = length > 900;
  const isOverLimit = length > maxLength;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Prompt</Label>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={onEnhance}
          disabled={disabled || isEnhancing || value.length < 5}
        >
          <Wand2 className={cn("w-3 h-3 mr-2", isEnhancing && "animate-spin")} />
          Enhance with AI
        </Button>
      </div>
      <div className="relative">
        <Textarea
          placeholder="Describe the image you want to generate..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            "min-h-[120px] resize-none pr-3 pb-8",
            isOverLimit && "border-destructive focus-visible:ring-destructive"
          )}
        />
        <div
          className={cn(
            "absolute bottom-2 right-2 text-xs",
            isOverLimit ? "text-destructive font-semibold" : isNearLimit ? "text-orange-500" : "text-muted-foreground"
          )}
        >
          {length}/{maxLength}
        </div>
      </div>
    </div>
  );
}
