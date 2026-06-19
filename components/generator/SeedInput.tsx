import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dice5 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SeedInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SeedInput({ value, onChange, disabled }: SeedInputProps) {
  const handleRandom = () => {
    // Generate a random 32-bit integer
    const randomSeed = Math.floor(Math.random() * 4294967295);
    onChange(randomSeed.toString());
  };

  return (
    <div className="space-y-3">
      <Label>Seed</Label>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Random (Leave empty)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleRandom}
          disabled={disabled}
          title="Random Seed"
        >
          <Dice5 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
