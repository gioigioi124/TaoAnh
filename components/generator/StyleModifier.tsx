import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STYLES } from "@/lib/styles";

interface StyleModifierProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function StyleModifier({ value, onChange, disabled }: StyleModifierProps) {
  return (
    <div className="space-y-3">
      <Label>Art Style</Label>
      <Select value={value} onValueChange={(v) => { if (v) onChange(v); }} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Select art style" />
        </SelectTrigger>
        <SelectContent>
          {STYLES.map((style) => (
            <SelectItem key={style.id} value={style.id}>
              {style.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
