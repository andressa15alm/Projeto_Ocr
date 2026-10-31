
import { createWorker } from "tesseract.js";

export async function extractText(
  image: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const worker = await createWorker("por+eng", undefined, {
    logger: (message) => {
      if (message.status === "recognizing text") {
        const progress = Math.round(message.progress * 100);
        onProgress?.(progress);
      }
    },
  });

  try {
    const result = await worker.recognize(image);

    return result.data.text.trim();
  } finally {
    await worker.terminate();
  }
}
