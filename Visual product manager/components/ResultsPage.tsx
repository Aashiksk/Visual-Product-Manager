import { useState } from 'react';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ProductCard } from './ProductCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Mock product data
const mockProducts = [
  {
    id: 1,
    image: 'modern sneaker shoes',
    name: 'Classic Running Shoes',
    category: 'Footwear',
    similarity: 95,
  },
  {
    id: 2,
    image: 'athletic sneakers',
    name: 'Sport Performance Trainers',
    category: 'Footwear',
    similarity: 92,
  },
  {
    id: 3,
    image: 'casual shoes',
    name: 'Urban Walking Shoes',
    category: 'Footwear',
    similarity: 88,
  },
  {
    id: 4,
    image: 'lifestyle sneakers',
    name: 'Lifestyle Comfort Sneakers',
    category: 'Footwear',
    similarity: 85,
  },
  {
    id: 5,
    image: 'running shoes',
    name: 'Marathon Running Shoes',
    category: 'Footwear',
    similarity: 82,
  },
  {
    id: 6,
    image: 'fashion sneakers',
    name: 'Designer Fashion Sneakers',
    category: 'Footwear',
    similarity: 78,
  },
  {
    id: 7,
    image: 'athletic footwear',
    name: 'Cross Training Shoes',
    category: 'Footwear',
    similarity: 75,
  },
  {
    id: 8,
    image: 'tennis shoes',
    name: 'Tennis Court Shoes',
    category: 'Footwear',
    similarity: 72,
  },
  {
    id: 9,
    image: 'casual sneakers',
    name: 'Everyday Casual Sneakers',
    category: 'Footwear',
    similarity: 68,
  },
];

interface ResultsPageProps {
  uploadedImage?: string;
  onBack?: () => void;
}

export function ResultsPage({ uploadedImage, onBack }: ResultsPageProps) {
  const [similarityThreshold, setSimilarityThreshold] = useState([60]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter products based on similarity threshold and category
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSimilarity = product.similarity >= similarityThreshold[0];
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSimilarity && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 py-4 sm:py-6 md:px-12 border-b border-[#e5e7eb] sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3 sm:gap-4">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-[8px] h-10 w-10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-[#1a1a1a]">Visual Matcher</h1>
          <span className="text-[#6b7280] ml-2 hidden sm:inline">— Results</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6 md:p-12">
        {/* Desktop Left Panel - Filters */}
        <aside className="hidden lg:block w-full lg:w-[30%] space-y-6">
          {/* Uploaded Image */}
          <div className="bg-[#f8f9fa] rounded-[16px] p-6 shadow-sm">
            <h2 className="mb-4 text-[#1a1a1a]">Your Image</h2>
            <div className="aspect-square rounded-[12px] overflow-hidden bg-white">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageWithFallback
                  src="/placeholder-image.jpg"
                  alt="Uploaded product"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[#f8f9fa] rounded-[16px] p-6 shadow-sm space-y-6">
            <h2 className="text-[#1a1a1a]">Filters</h2>

            {/* Similarity Score Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[#1a1a1a] text-sm">Similarity Score</label>
                <span className="text-[#2563eb] text-sm">{similarityThreshold[0]}%</span>
              </div>
              <Slider
                value={similarityThreshold}
                onValueChange={setSimilarityThreshold}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-3">
              <label className="text-[#1a1a1a] text-sm">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full rounded-[12px] border-[#d1d5db]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Footwear">Footwear</SelectItem>
                  <SelectItem value="Apparel">Apparel</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="pt-4 border-t border-[#e5e7eb]">
              <p className="text-[#6b7280] text-sm">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} found
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Filters - Collapsible Accordion */}
        <div className="lg:hidden">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="filters" className="bg-[#f8f9fa] rounded-[16px] shadow-sm border-none px-5 py-1">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#2563eb]" />
                  <span className="text-[#1a1a1a]">Filters & Your Image</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-5 pb-5">
                {/* Uploaded Image - Mobile */}
                <div>
                  <h3 className="mb-3 text-[#1a1a1a] text-sm">Your Image</h3>
                  <div className="aspect-square max-w-[200px] rounded-[12px] overflow-hidden bg-white">
                    {uploadedImage ? (
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageWithFallback
                        src="/placeholder-image.jpg"
                        alt="Uploaded product"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Similarity Score Slider - Mobile */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[#1a1a1a] text-sm">Similarity Score</label>
                    <span className="text-[#2563eb] text-sm">{similarityThreshold[0]}%</span>
                  </div>
                  <Slider
                    value={similarityThreshold}
                    onValueChange={setSimilarityThreshold}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Category Dropdown - Mobile */}
                <div className="space-y-3">
                  <label className="text-[#1a1a1a] text-sm">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full rounded-[12px] border-[#d1d5db] h-12">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Footwear">Footwear</SelectItem>
                      <SelectItem value="Apparel">Apparel</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Results Count - Mobile */}
                <div className="pt-3 border-t border-[#e5e7eb]">
                  <p className="text-[#6b7280] text-sm">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} found
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Right Panel - Product Grid */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <p className="text-[#6b7280]">
                No products match your filters. Try adjusting the similarity score.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}