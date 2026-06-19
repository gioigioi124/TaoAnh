import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export const MODELS = [
  { id: "imagen-4", label: "Imagen 4", speed: "Medium", quality: "High", badge: "Default" },
  { id: "imagen-4-fast", label: "Imagen 4 Fast", speed: "Fast", quality: "Good", badge: "Fast" },
  { id: "imagen-4-ultra", label: "Imagen 4 Ultra", speed: "Slow", quality: "Highest", badge: "Pro" },
  { id: "gemini-flash-img", label: "Gemini Flash Image", speed: "Fast", quality: "High", badge: "Edit" },
  { id: "gemini-pro-img", label: "Gemini Pro Image", speed: "Slow", quality: "Highest", badge: "Thinking" },
];

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ModelSelector({ value, onChange, disabled }: ModelSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>AI Model</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-[200px] text-xs">
                Different models have different speed, quality, and capabilities. Default is Imagen 4.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select value={value} onValueChange={(v) => { if (v) onChange(v); }} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          {MODELS.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex items-center justify-between w-full pr-2 gap-4">
                <span>{model.label}</span>
                <Badge variant="secondary" className="text-[10px] ml-auto">
                  {model.badge}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
