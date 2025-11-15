import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: number;
  image: string;
  name: string;
  category: string;
  similarity: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const getSimilarityColor = (score: number) => {
    if (score >= 90) return 'bg-[#10b981] text-white';
    if (score >= 75) return 'bg-[#2563eb] text-white';
    return 'bg-[#6b7280] text-white';
  };

  return (
    <div className="bg-[#f8f9fa] rounded-[16px] overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
      {/* Product Image */}
      <div className="aspect-square relative overflow-hidden bg-white">
        <ImageWithFallback
          src="/placeholder-product.jpg"
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Similarity Badge - Overlay */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <Badge className={`${getSimilarityColor(product.similarity)} rounded-[8px] px-2 py-1 sm:px-3 text-xs sm:text-sm`}>
            {product.similarity}%
          </Badge>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 space-y-2">
        <h3 className="text-[#1a1a1a] line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="rounded-[8px] border-[#d1d5db] text-[#6b7280] text-xs sm:text-sm">
            {product.category}
          </Badge>
        </div>
      </div>
    </div>
  );
}