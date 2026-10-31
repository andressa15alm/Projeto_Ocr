
import { Sparkles, ScanText } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-5 md:px-12">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-500">
          <ScanText size={23} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            OCR Studio
          </h1>
          <p className="text-xs text-slate-400">
            Text extraction made lovely
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-pink-100 bg-white/70 px-4 py-2 text-sm text-pink-500 sm:flex">
        <Sparkles size={15} />
        <span>Simple. Smart. Lovely.</span>
      </div>
    </header>
  );
}
