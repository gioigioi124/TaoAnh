import { ImageIcon } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <ImageIcon className="w-8 h-8 opacity-50" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">No images generated yet</h3>
      <p className="max-w-sm mt-2 text-sm">
        Enter a prompt and adjust the settings on the left panel to start generating images with Gemini.
      </p>
    </div>
  );
}
