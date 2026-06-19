import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface NegativePromptProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function NegativePrompt({ value, onChange, disabled }: NegativePromptProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-between h-8 text-xs text-muted-foreground hover:text-foreground"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span>Negative Prompt (Optional)</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>
      
      {isOpen && (
        <Textarea
          placeholder="blurry, low quality, watermark, text, deformed, ugly"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="min-h-[80px] resize-none text-sm"
        />
      )}
    </div>
  );
}
