import { useState } from 'react';
import { UploadCard } from './components/UploadCard';
import { ResultsPage } from './components/ResultsPage';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorScreen } from './components/ErrorScreen';

export default function App() {
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleFindProducts = (image: string | null) => {
    setUploadedImage(image);
    setIsLoading(true);
    setShowError(false);
    
    // Simulate loading time with random error for demo
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate 20% chance of error for demonstration
      const hasError = Math.random() < 0.2;
      
      if (hasError) {
        setShowError(true);
      } else {
        setShowResults(true);
      }
    }, 2000);
  };

  const handleBack = () => {
    setShowResults(false);
    setShowError(false);
  };

  const handleRetry = () => {
    setShowError(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (showError) {
    return <ErrorScreen onRetry={handleRetry} />;
  }

  if (showResults) {
    return <ResultsPage uploadedImage={uploadedImage || undefined} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 py-6 sm:py-8 md:px-12">
        <h1 className="text-[#1a1a1a]">Visual Matcher</h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 md:py-20">
        <div className="w-full max-w-[600px]">
          <UploadCard onFindProducts={handleFindProducts} />
        </div>
      </main>
    </div>
  );
}