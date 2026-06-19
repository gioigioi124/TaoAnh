import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const SIZE_SUPPORT: Record<string, string[]> = {
  "imagen-4-fast": ["1K", "2K"],
  "imagen-4": ["1K", "2K"],
  "imagen-4-ultra": ["1K", "2K", "4K"],
  "gemini-flash-img": ["512", "1K", "2K", "4K"],
  "gemini-pro-img": ["1K", "2K", "4K"],
};

interface SizeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  model: string;
  disabled?: boolean;
}

export function SizeSelector({ value, onChange, model, disabled }: SizeSelectorProps) {
  const supportedSizes = SIZE_SUPPORT[model] || ["1K"];

  // Ensure selected value is supported, otherwise fallback to 1K
  if (!supportedSizes.includes(value) && !disabled) {
    // We shouldn't update state during render, so it will be handled by the parent component or just display a valid one here temporarily.
    // Parent should validate on model change.
  }

  return (
    <div className="space-y-3">
      <Label>Image Size</Label>
      <Select
        value={supportedSizes.includes(value) ? value : supportedSizes[0]}
        onValueChange={(v) => { if (v) onChange(v); }}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select size" />
        </SelectTrigger>
        <SelectContent>
          {supportedSizes.map((size) => (
            <SelectItem key={size} value={size}>
              {size === "512" ? "512x512" : size === "1K" ? "1024x1024" : size === "2K" ? "2048x2048" : "4096x4096"} ({size})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value === "4K" && (
        <p className="text-xs text-orange-500">
          4K generation may take significantly longer.
        </p>
      )}
    </div>
  );
}
