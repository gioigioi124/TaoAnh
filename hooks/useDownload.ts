import { GenerateResult } from "@/types";
import { saveAs } from "file-saver";
import JSZip from "jszip";

export function useDownload() {
  const downloadImage = (image: GenerateResult, prompt: string) => {
    // Create a safe filename from the prompt
    const safePrompt = prompt.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().getTime();
    const extension = image.mimeType.split("/")[1] || "jpeg";
    const filename = `gemini_${safePrompt}_${timestamp}.${extension}`;

    // Convert base64 to blob
    const byteCharacters = atob(image.base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: image.mimeType });

    saveAs(blob, filename);
  };

  const downloadAllAsZip = async (images: GenerateResult[], prompt: string) => {
    const zip = new JSZip();
    const safePrompt = prompt.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().getTime();

    images.forEach((image, index) => {
      const extension = image.mimeType.split("/")[1] || "jpeg";
      const filename = `image_${index + 1}.${extension}`;
      zip.file(filename, image.base64, { base64: true });
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `gemini_batch_${safePrompt}_${timestamp}.zip`);
  };

  return { downloadImage, downloadAllAsZip };
}
