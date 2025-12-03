import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import type { Product } from "@shared/schema";
import { getPriceRange } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ITEM_SIZE } from "@/lib/constants";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const priceRange = getPriceRange(product.priceTiers);
  const [, setLocation] = useLocation();
  const hasMultipleImages = product.images.length > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useState(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  });

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      emblaApi?.scrollPrev();
    },
    [emblaApi]
  );

  const scrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      emblaApi?.scrollNext();
    },
    [emblaApi]
  );

  const scrollTo = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
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
      <Card className="group overflow-visible border hover-elevate transition-all duration-200">
        <CardContent className="p-0">
          <div
            className="relative overflow-hidden rounded-t-md"
            style={{ width: `${ITEM_SIZE}px`, height: `${ITEM_SIZE}px` }}
          >
            {hasMultipleImages ? (
              <div className="h-full w-full" ref={emblaRef}>
                <div className="flex h-full">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex-[0_0_100%] min-w-0 h-full"
                    >
                      <img
                        src={image}
                        alt={`${product.title} - Image ${index + 1}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        data-testid={`img-product-${product.id}-${index}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <img
                src={product.images[0]}
                alt={product.title}
                className="h-full w-full object-cover"
                loading="lazy"
                data-testid={`img-product-${product.id}`}
              />
            )}

            {hasMultipleImages && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={scrollPrev}
                  data-testid={`btn-prev-image-${product.id}`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={scrollNext}
                  data-testid={`btn-next-image-${product.id}`}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === selectedIndex
                          ? "w-4 bg-primary"
                          : "w-1.5 bg-background/60 hover:bg-background/80"
                      }`}
                      onClick={(e) => scrollTo(e, index)}
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
