import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { getPriceRange } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const priceRange = getPriceRange(product.priceTiers);

  return (
    <Link href={`/product/${product.id}`} data-testid={`link-product-${product.id}`}>
      <Card className="group overflow-visible cursor-pointer border hover-elevate transition-all duration-200">
        <CardContent className="p-0">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-md">
            {product.hasPromo && (
              <Badge 
                className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1"
                data-testid={`badge-promo-${product.id}`}
              >
                Buy 10 Get 1 Free
              </Badge>
            )}
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              data-testid={`img-product-${product.id}`}
            />
          </div>
          <div className="p-4 space-y-2">
            <h3 
              className="text-sm font-medium leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors"
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
    </Link>
  );
}
