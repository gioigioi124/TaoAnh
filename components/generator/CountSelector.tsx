import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CountSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function CountSelector({ value, onChange, disabled }: CountSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Images per request</Label>
        <span className="text-sm font-medium text-muted-foreground">{value}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(vals) => {
          const valArray = Array.isArray(vals) ? vals : [vals];
          onChange(valArray[0] as number);
        }}
        min={1}
        max={4}
        step={1}
        disabled={disabled}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
      </div>
    </div>
  );
}
