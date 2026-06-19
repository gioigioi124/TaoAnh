import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const RATIOS = [
  { value: "1:1", label: "Square", iconClass: "w-5 h-5" },
  { value: "4:3", label: "Landscape", iconClass: "w-6 h-4.5" },
  { value: "3:4", label: "Portrait", iconClass: "w-4.5 h-6" },
  { value: "16:9", label: "Widescreen", iconClass: "w-7 h-4" },
  { value: "9:16", label: "Story", iconClass: "w-4 h-7" },
];

interface RatioSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function RatioSelector({ value, onChange, disabled }: RatioSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Aspect Ratio</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        className="flex gap-2 flex-wrap"
      >
        {RATIOS.map((ratio) => {
          const isSelected = value === ratio.value;
          return (
            <div key={ratio.value} className="flex-1">
              <RadioGroupItem
                value={ratio.value}
                id={`ratio-${ratio.value}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`ratio-${ratio.value}`}
                className={cn(
                  "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors h-24",
                  isSelected && "border-primary bg-primary/5 text-primary hover:bg-primary/10",
                  disabled && "opacity-50 cursor-not-allowed hover:bg-popover hover:text-foreground"
                )}
              >
                <div className="flex-1 flex items-center justify-center mb-2">
                  <div
                    className={cn(
                      "border-2 rounded-sm bg-muted/50",
                      ratio.iconClass,
                      isSelected ? "border-primary" : "border-muted-foreground/50"
                    )}
                  />
                </div>
                <div className="text-xs font-semibold">{ratio.value}</div>
                <div className="text-[10px] text-muted-foreground">{ratio.label}</div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
