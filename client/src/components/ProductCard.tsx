import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useCartNotification } from "@/contexts/CartNotificationContext";
import { Card, CardContent } from "@/components/ui/card";

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
  const { getNotificationQuantity } = useCartNotification();
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
  
  const notificationQuantity = getNotificationQuantity(product.id);

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

            {notificationQuantity !== null && (
              <div 
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-none"
                data-testid={`notification-added-${product.id}`}
              >
                <Check className="h-3 w-3" />
                <span>+{notificationQuantity}</span>
              </div>
            )}

            {hasMultipleImages && (
              <>
                <button
                  className="hidden sm:flex absolute left-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-background/90 hover:bg-background shadow-md items-center justify-center border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={scrollPrev}
                  aria-label="Previous image"
                  data-testid={`btn-prev-image-${product.id}`}
                >
                  <ChevronLeft className="h-4 w-4 text-foreground" />
                </button>
                <button
                  className="hidden sm:flex absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-background/90 hover:bg-background shadow-md items-center justify-center border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={scrollNext}
                  aria-label="Next image"
                  data-testid={`btn-next-image-${product.id}`}
                >
                  <ChevronRight className="h-4 w-4 text-foreground" />
                </button>
              </>
            )}
          </div>

          <div className="p-2 sm:p-2.5 space-y-1" data-testid={`link-product-${product.id}`}>
            <h3
              className="text-xs sm:text-sm font-medium leading-tight line-clamp-2 text-foreground hover:text-primary transition-colors"
              data-testid={`text-title-${product.id}`}
            >
              {product.title}
            </h3>
            <p
              className="text-sm sm:text-base font-bold text-foreground"
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
