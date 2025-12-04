import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { ITEM_SIZE } from "@/lib/constants";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    images: string[];
    priceTiers: { minQty: number; maxQty: number | null; price: number }[];
    sizeMinOrders?: Record<string, number>;
    minOrder?: number;
    attributes?: {
      sizes?: string[];
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { formatPrice, t } = useApp();
  const [, setLocation] = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = product.images.length > 1;

  const minPrice = Math.min(...product.priceTiers.map((t) => t.price));
  const maxPrice = Math.max(...product.priceTiers.map((t) => t.price));
  const priceRange = minPrice === maxPrice 
    ? formatPrice(minPrice) 
    : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;

  const firstSize = product.attributes?.sizes?.[0] || "S";
  const minOrderForSmallSize = product.sizeMinOrders?.[firstSize] || product.minOrder || 1;

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    },
    [product.images.length]
  );

  const scrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    },
    [product.images.length]
  );

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest('[role="button"]')) {
      return;
    }
    setLocation(`/product/${product.id}`);
  };

  return (
    <div
      className="flex flex-col cursor-pointer w-full"
      style={{ maxWidth: `${ITEM_SIZE}px` }}
      data-testid={`card-product-${product.id}`}
      onClick={handleCardClick}
    >
      <Card className="overflow-visible border hover-elevate transition-all duration-200">
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-md aspect-square">
            <img
              src={product.images[currentImageIndex]}
              alt={`${product.title} - Image ${currentImageIndex + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
              data-testid={`img-product-${product.id}`}
            />

            <span 
              className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-background/90 text-foreground text-[10px] font-medium rounded pointer-events-none"
              data-testid={`tag-min-order-${product.id}`}
            >
              Min: {minOrderForSmallSize}
            </span>

            {hasMultipleImages && (
              <>
                <button
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-background/90 hover:bg-background shadow-md flex items-center justify-center border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={scrollPrev}
                  aria-label="Previous image"
                  data-testid={`btn-prev-image-${product.id}`}
                >
                  <ChevronLeft className="h-4 w-4 text-foreground" />
                </button>
                <button
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-background/90 hover:bg-background shadow-md flex items-center justify-center border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={scrollNext}
                  aria-label="Next image"
                  data-testid={`btn-next-image-${product.id}`}
                >
                  <ChevronRight className="h-4 w-4 text-foreground" />
                </button>
              </>
            )}
          </div>

          <div className="p-2.5 space-y-1" data-testid={`link-product-${product.id}`}>
            <h3
              className="text-sm font-medium leading-tight line-clamp-2 text-foreground hover:text-primary transition-colors"
              data-testid={`text-title-${product.id}`}
            >
              {product.title}
            </h3>
            <p
              className="text-base font-bold text-foreground"
              data-testid={`text-price-${product.id}`}
            >
              {priceRange}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
