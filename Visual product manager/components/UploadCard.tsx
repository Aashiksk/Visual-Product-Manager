import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface UploadCardProps {
  onFindProducts?: (image: string | null) => void;
}

export function UploadCard({ onFindProducts }: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFindProducts = () => {
    // Mock action - would normally trigger search
    if (onFindProducts) {
      onFindProducts(uploadedImage);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Upload Card */}
      <div className="bg-[#f8f9fa] rounded-[16px] p-5 sm:p-8 md:p-12 shadow-sm">
        {/* Drag and Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center gap-4 p-8 sm:p-12 md:p-16 border-2 border-dashed rounded-[12px] transition-colors ${
            isDragging
              ? 'border-[#2563eb] bg-[#eff6ff]'
              : 'border-[#d1d5db] bg-white'
          }`}
        >
          {uploadedImage ? (
            <div className="flex flex-col items-center gap-4">
              <img
                src={uploadedImage}
                alt="Uploaded preview"
                className="max-w-full max-h-[200px] rounded-lg object-contain"
              />
              <p className="text-[#6b7280] text-sm">Image uploaded successfully</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#eff6ff]">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-[#2563eb]" />
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-[#1a1a1a]">Drag and drop your image here</p>
                <p className="text-[#6b7280] text-sm">or</p>
              </div>
            </>
          )}
        </div>

        {/* Upload Button */}
        <div className="mt-5 sm:mt-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <Button
            onClick={handleUploadClick}
            variant="outline"
            className="w-full rounded-[12px] border-[#d1d5db] hover:bg-[#f8f9fa] h-12 sm:h-auto"
          >
            Upload Image
          </Button>
        </div>

        {/* URL Input */}
        <div className="mt-5 sm:mt-6">
          <Input
            type="text"
            placeholder="Paste Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="rounded-[12px] border-[#d1d5db] h-12 sm:h-auto"
          />
        </div>

        {/* Support Note */}
        <p className="mt-4 text-[#6b7280] text-sm text-center">
          Supported formats: JPG, PNG
        </p>
      </div>

      {/* CTA Button */}
      <Button
        onClick={handleFindProducts}
        className="w-full rounded-[12px] bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-6 h-12 sm:h-auto sm:py-6"
      >
        Find Similar Products
      </Button>
    </div>
  );
}