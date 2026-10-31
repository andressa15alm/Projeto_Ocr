
"use client";

import { useRef, useState, useEffect } from "react";
import {
  ImagePlus,
  UploadCloud,
  Sparkles,
  X,
  FileImage,
  CheckCircle2,
  ScanText,
  Copy,
  Download,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import { extractText } from "@/lib/ocr";

export default function ImageUploader() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Libera a memória da pré-visualização
  useEffect(() => {
    if (!preview) return;

    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  // Validação e seleção da imagem
  function handleImage(file: File) {
    setError("");

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Formato inválido. Utilize PNG, JPG ou WEBP.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 10 MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setExtractedText(null);
    setProgress(0);
    setCopied(false);
  }

  // Seleção pelo computador
  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (file) {
      handleImage(file);
    }

    event.target.value = "";
  }

  // Arrastar e soltar
  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleImage(file);
    }
  }

  // Executar OCR
  async function handleOCR() {
    if (!image || isProcessing) return;

    setIsProcessing(true);
    setError("");
    setProgress(0);
    setExtractedText(null);

    try {
      const text = await extractText(image, setProgress);
      setExtractedText(text);
    } catch (err) {
      console.error("Erro no OCR:", err);
      setError(
        "Não foi possível reconhecer o texto. Tente outra imagem."
      );
    } finally {
      setIsProcessing(false);
    }
  }

  // Copiar resultado
  async function copyText() {
    if (!extractedText) return;

    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
    } catch {
      setError("Não foi possível copiar o texto.");
    }
  }

  // Baixar resultado
  function downloadText() {
    if (!extractedText) return;

    const blob = new Blob([extractedText], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "ocr-studio-resultado.txt";
    link.click();

    URL.revokeObjectURL(url);
  }

  // Remover imagem
  function removeImage() {
    if (isProcessing) return;

    setImage(null);
    setPreview(null);
    setExtractedText(null);
    setProgress(0);
    setError("");
    setCopied(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="w-full max-w-2xl">

      {/* Área de upload */}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          if (
            !event.currentTarget.contains(
              event.relatedTarget as Node
            )
          ) {
            setIsDragging(false);
          }
        }}
        onDrop={handleDrop}
        className={`rounded-3xl border-2 border-dashed p-6 text-center shadow-sm transition-all duration-300 md:p-10 ${
          isDragging
            ? "border-purple-400 bg-purple-100/80 scale-[1.02]"
            : "border-pink-200 bg-white/80 hover:border-pink-300"
        }`}
      >
        {!preview ? (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-100 to-purple-100 text-pink-500">
              <ImagePlus size={36} />
            </div>

            <h2 className="text-2xl font-bold text-slate-800">
              Let's extract some text!
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              Upload your image and let the magic happen.
            </p>

            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 px-7 py-3 font-semibold text-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <UploadCloud size={19} />
              Select an image
            </button>

            <p className="mt-5 text-xs text-slate-400">
              PNG, JPG, JPEG or WEBP · Maximum 10 MB
            </p>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-purple-400">
              <Sparkles size={14} />
              Your images are processed locally.
            </div>
          </>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-center gap-2 text-sm font-semibold text-green-600">
              <CheckCircle2 size={18} />
              Image uploaded successfully!
            </div>

            <div className="relative mx-auto max-h-80 overflow-hidden rounded-2xl bg-pink-50">
              <img
                src={preview}
                alt="Image selected for OCR"
                className="mx-auto max-h-80 w-full object-contain"
              />

              <button
                type="button"
                onClick={removeImage}
                disabled={isProcessing}
                aria-label="Remove image"
                className="absolute right-3 top-3 rounded-full bg-white p-2 text-pink-500 shadow-md transition hover:bg-pink-100 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-600">
              <FileImage size={17} className="text-purple-400" />
              <span className="max-w-xs truncate">{image?.name}</span>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              {((image?.size ?? 0) / (1024 * 1024)).toFixed(2)} MB
            </p>

            {!extractedText && !isProcessing && (
              <button
                type="button"
                onClick={handleOCR}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 px-8 py-3 font-semibold text-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                <ScanText size={19} />
                Extract text
              </button>
            )}

            {isProcessing && (
              <div className="mt-8">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-purple-500">
                  <LoaderCircle size={18} className="animate-spin" />
                  Recognizing text...
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-purple-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  {progress}% completed
                </p>
              </div>
            )}

            {extractedText !== null && (
              <div className="mt-7">
                {extractedText ? (
                  <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-4 text-left">
                    <div className="mb-3 flex items-center gap-2 font-semibold text-purple-600">
                      <CheckCircle2 size={18} />
                      Text extracted successfully!
                    </div>

                    <div className="max-h-64 overflow-y-auto whitespace-pre-wrap break-words rounded-xl bg-white p-4 text-sm leading-relaxed text-slate-700">
                      {extractedText}
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                      <button
                        type="button"
                        onClick={copyText}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-pink-500 shadow-sm transition hover:bg-pink-100"
                      >
                        <Copy size={16} />
                        {copied ? "Copied!" : "Copy text"}
                      </button>

                      <button
                        type="button"
                        onClick={downloadText}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-purple-500 shadow-sm transition hover:bg-purple-100"
                      >
                        <Download size={16} />
                        Download TXT
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-purple-50 p-4 text-sm text-purple-600">
                    No text was detected in this image. Try a clearer image.
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleOCR}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-pink-500"
                >
                  <RefreshCw size={15} />
                  Try again
                </button>
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {!isProcessing && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-6 block w-full text-sm text-pink-500 transition hover:text-purple-500"
              >
                Choose another image
              </button>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-500">
          {error}
        </div>
      )}

      <p className="mt-4 text-center text-xs text-slate-400">
        Drag and drop your image here, or browse your files.
      </p>
    </div>
  );
}
