import { GenerateRequest } from "@/types";
import { PromptInput } from "./PromptInput";
import { NegativePrompt } from "./NegativePrompt";
import { TemplateSelector } from "./TemplateSelector";
import { StyleModifier } from "./StyleModifier";
import { ModelSelector } from "./ModelSelector";
import { RatioSelector } from "./RatioSelector";
import { CountSelector } from "./CountSelector";
import { BatchSelector } from "./BatchSelector";
import { SizeSelector } from "./SizeSelector";
import { SeedInput } from "./SeedInput";
import { WatermarkToggle } from "./WatermarkToggle";
import { GenerateButton } from "./GenerateButton";
import { Separator } from "@/components/ui/separator";

interface PromptPanelProps {
  request: GenerateRequest;
  updateRequest: (updates: Partial<GenerateRequest>) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onEnhancePrompt?: () => void;
  isEnhancing?: boolean;
}

export function PromptPanel({
  request,
  updateRequest,
  onGenerate,
  isLoading,
  onEnhancePrompt,
  isEnhancing,
}: PromptPanelProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto w-full md:w-[400px] lg:w-[450px] border-r bg-card shrink-0">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gemini ImgGen</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Generate multiple images locally with Imagen 4.
          </p>
        </div>

        {/* Prompt Section */}
        <div className="space-y-4">
          <TemplateSelector
            onSelect={(prompt) => updateRequest({ prompt })}
            disabled={isLoading}
          />
          <PromptInput
            value={request.prompt}
            onChange={(prompt) => updateRequest({ prompt })}
            disabled={isLoading}
            onEnhance={onEnhancePrompt}
            isEnhancing={isEnhancing}
          />
          <NegativePrompt
            value={request.negativePrompt || ""}
            onChange={(negativePrompt) => updateRequest({ negativePrompt })}
            disabled={isLoading}
          />
        </div>

        <Separator />

        {/* Model & Style */}
        <div className="space-y-4">
          <ModelSelector
            value={request.model}
            onChange={(model) => updateRequest({ model })}
            disabled={isLoading}
          />
          <StyleModifier
            value={request.style || "none"} // Need to add style to GenerateRequest type if used directly, or append it to prompt before generating
            onChange={(style) => updateRequest({ style } as any)} // Hack for now, better handled at generate level
            disabled={isLoading}
          />
        </div>

        <Separator />

        {/* Output Settings */}
        <div className="space-y-6">
          <RatioSelector
            value={request.aspectRatio}
            onChange={(aspectRatio) => updateRequest({ aspectRatio })}
            disabled={isLoading}
          />
          <SizeSelector
            value={request.imageSize}
            onChange={(imageSize) => updateRequest({ imageSize })}
            model={request.model}
            disabled={isLoading}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <CountSelector
              value={request.numberOfImages}
              onChange={(numberOfImages) => updateRequest({ numberOfImages })}
              disabled={isLoading}
            />
            <BatchSelector
              value={request.batchCount}
              onChange={(batchCount) => updateRequest({ batchCount })}
              disabled={isLoading}
            />
          </div>
        </div>

        <Separator />

        {/* Advanced Settings */}
        <div className="space-y-4">
          <SeedInput
            value={request.seed?.toString() || ""}
            onChange={(val) => updateRequest({ seed: val ? parseInt(val) : undefined })}
            disabled={isLoading}
          />
          <WatermarkToggle
            checked={request.addWatermark}
            onCheckedChange={(addWatermark) => updateRequest({ addWatermark })}
            disabled={isLoading}
          />
        </div>

      </div>

      {/* Sticky Bottom Actions */}
      <div className="p-4 md:p-6 border-t mt-auto bg-card sticky bottom-0 z-10">
        <GenerateButton
          onClick={onGenerate}
          isLoading={isLoading}
          imagesCount={request.numberOfImages}
          batchCount={request.batchCount}
          disabled={!request.prompt.trim()}
        />
      </div>
    </div>
  );
}
