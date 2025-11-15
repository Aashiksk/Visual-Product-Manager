import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative">
          <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-[#2563eb] animate-spin" />
        </div>

        {/* Loading Text */}
        <p className="text-[#6b7280] text-center">Finding similar products…</p>
      </div>
    </div>
  );
}