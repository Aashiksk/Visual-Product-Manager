import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorScreenProps {
  onRetry?: () => void;
}

export function ErrorScreen({ onRetry }: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-[500px]">
        {/* Error Card */}
        <div className="bg-[#f8f9fa] rounded-[16px] p-8 sm:p-12 shadow-sm">
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Error Icon */}
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#fee2e2]">
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-[#dc2626]" />
            </div>

            {/* Error Messages */}
            <div className="space-y-2">
              <h2 className="text-[#1a1a1a]">Image upload failed</h2>
              <p className="text-[#6b7280]">Please try again.</p>
            </div>

            {/* Retry Button */}
            <Button
              onClick={onRetry}
              className="w-full rounded-[12px] bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-6 h-12 sm:h-auto sm:py-6 mt-2"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}