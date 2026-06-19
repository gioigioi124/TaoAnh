import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BatchSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function BatchSelector({ value, onChange, disabled }: BatchSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Batch requests (Parallel)</Label>
      <Select
        value={value.toString()}
        onValueChange={(v) => { if (v) onChange(parseInt(v, 10)) }}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select batch count" />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5].map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num} {num === 1 ? "request" : "requests"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        API will be called {value} {value === 1 ? "time" : "times"} in parallel.
      </p>
    </div>
  );
}
