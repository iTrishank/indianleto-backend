import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ITEM_SIZE } from "@/lib/constants";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    images: string[];
    priceTiers: { minQty: number; maxQty: number | null; price: number }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { formatPrice } = useApp();
  const [, setLocation] = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = product.images.length > 1;

  const minPrice = Math.min(...product.priceTiers.map((t) => t.price));
  const maxPrice = Math.max(...product.priceTiers.map((t) => t.price));
  const priceRange = minPrice === maxPrice 
    ? formatPrice(minPrice) 
    : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;

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
      className="flex flex-col cursor-pointer"
      style={{ width: `${ITEM_SIZE}px` }}
      data-testid={`card-product-${product.id}`}
      onClick={handleCardClick}
    >
      <Card className="overflow-visible border hover-elevate transition-all duration-200">
        <CardContent className="p-0">
          <div
            className="relative overflow-hidden rounded-t-md"
            style={{ width: `${ITEM_SIZE}px`, height: `${ITEM_SIZE}px` }}
          >
            <img
              src={product.images[currentImageIndex]}
              alt={`${product.title} - Image ${currentImageIndex + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
              data-testid={`img-product-${product.id}`}
            />

            {hasMultipleImages && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-1 top-1/2 -translate-y-1/2 h-6 w-6 bg-background/80 hover:bg-background shadow-sm"
                  onClick={scrollPrev}
                  data-testid={`btn-prev-image-${product.id}`}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 bg-background/80 hover:bg-background shadow-sm"
                  onClick={scrollNext}
                  data-testid={`btn-next-image-${product.id}`}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {product.images.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "w-4 bg-primary"
                          : "w-1.5 bg-background/60"
                      }`}
                      data-testid={`dot-image-${product.id}-${index}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-2 space-y-1" data-testid={`link-product-${product.id}`}>
            <h3
              className="text-xs font-medium leading-tight line-clamp-2 text-foreground hover:text-primary transition-colors"
              data-testid={`text-title-${product.id}`}
            >
              {product.title}
            </h3>
            <p
              className="text-sm font-bold text-foreground"
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
