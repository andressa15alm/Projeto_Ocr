
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import { Heart } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FCE4F1] via-[#FFF0F7] to-[#E9DEFF]">
      <Header />

      <section className="flex min-h-[75vh] flex-col items-center justify-center px-5 py-12">
        <div className="mb-10 max-w-xl text-center">
          <span className="mb-4 inline-block rounded-full bg-purple-100 px-4 py-2 text-xs font-semibold text-purple-500">
            ✨ IMAGE TO TEXT CONVERTER
          </span>

          <h2 className="text-4xl font-extrabold leading-tight text-slate-800 md:text-5xl">
            Turn your images into{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              editable text.
            </span>
          </h2>

          <p className="mt-5 text-sm leading-relaxed text-slate-500 md:text-base">
            Extract text from your images in seconds with our
            simple and intelligent OCR technology.
          </p>
        </div>

        <ImageUploader />

        <footer className="mt-12 flex items-center gap-2 text-xs text-slate-400">
          Made with
          <Heart size={13} className="fill-pink-400 text-pink-400" />
          using OCR technology
        </footer>
      </section>
    </main>
  );
}
