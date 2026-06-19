export interface Template {
  id: string;
  label: string;
  category: string;
  prompt: string;
  variables: string[];
}

export interface GenerateRequest {
  prompt: string;
  negativePrompt?: string;
  style?: string;
  model: string;
  numberOfImages: number;
  aspectRatio: string;
  imageSize: string;
  seed?: number;
  addWatermark: boolean;
  batchCount: number;
}

export interface GenerateResult {
  base64: string;
  mimeType: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  request: GenerateRequest;
  results: GenerateResult[];
  failed: number;
}
