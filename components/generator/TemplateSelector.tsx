import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutTemplate } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import { useState } from "react";

interface TemplateSelectorProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function TemplateSelector({ onSelect, disabled }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false);

  // Group templates by category
  const categories = Array.from(new Set(TEMPLATES.map((t) => t.category)));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="w-full" disabled={disabled} />}>
        <LayoutTemplate className="w-4 h-4 mr-2" />
        Prompt Templates
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prompt Templates</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {categories.map((category) => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-lg">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TEMPLATES.filter((t) => t.category === category).map((template) => (
                  <div
                    key={template.id}
                    className="flex flex-col gap-2 p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => {
                      onSelect(template.prompt);
                      setOpen(false);
                    }}
                  >
                    <div className="font-medium">{template.label}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {template.prompt}
                    </div>
                    <div className="flex gap-1 mt-auto pt-2">
                      {template.variables.map((v) => (
                        <Badge key={v} variant="secondary" className="text-[10px]">
                          {v}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
