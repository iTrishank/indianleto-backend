import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Catalog() {
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [priceSort, setPriceSort] = useState<string>("default");

  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach((p) => p.attributes.sizes.forEach((s) => sizes.add(s)));
    return Array.from(sizes).sort();
  }, []);

  const allColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((p) => colors.add(p.attributes.color));
    return Array.from(colors).sort();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (sizeFilter !== "all") {
      result = result.filter((p) => p.attributes.sizes.includes(sizeFilter));
    }

    if (colorFilter !== "all") {
      result = result.filter((p) => p.attributes.color === colorFilter);
    }

    if (priceSort === "low-high") {
      result.sort((a, b) => {
        const aMin = Math.min(...a.priceTiers.map((t) => t.price));
        const bMin = Math.min(...b.priceTiers.map((t) => t.price));
        return aMin - bMin;
      });
    } else if (priceSort === "high-low") {
      result.sort((a, b) => {
        const aMax = Math.max(...a.priceTiers.map((t) => t.price));
        const bMax = Math.max(...b.priceTiers.map((t) => t.price));
        return bMax - aMax;
      });
    }

    return result;
  }, [sizeFilter, colorFilter, priceSort]);

  const clearFilters = () => {
    setSizeFilter("all");
    setColorFilter("all");
    setPriceSort("default");
  };

  const hasActiveFilters =
    sizeFilter !== "all" || colorFilter !== "all" || priceSort !== "default";

  const FilterControls = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Size
        </label>
        <Select value={sizeFilter} onValueChange={setSizeFilter}>
          <SelectTrigger data-testid="select-size-filter">
            <SelectValue placeholder="All Sizes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            {allSizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Color
        </label>
        <Select value={colorFilter} onValueChange={setColorFilter}>
          <SelectTrigger data-testid="select-color-filter">
            <SelectValue placeholder="All Colors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colors</SelectItem>
            {allColors.map((color) => (
              <SelectItem key={color} value={color}>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Price
        </label>
        <Select value={priceSort} onValueChange={setPriceSort}>
          <SelectTrigger data-testid="select-price-sort">
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="low-high">Price: Low to High</SelectItem>
            <SelectItem value="high-low">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={clearFilters}
          data-testid="button-clear-filters"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Wholesale Print Dresses
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium quality fashion at competitive wholesale prices. 
              Minimum order from 1 piece.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <p className="text-muted-foreground" data-testid="text-product-count">
            Showing {filteredProducts.length} of {products.length} products
          </p>

          <div className="hidden md:flex items-center gap-4 flex-wrap">
            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger className="w-[120px]" data-testid="desktop-size-filter">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                {allSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={colorFilter} onValueChange={setColorFilter}>
              <SelectTrigger className="w-[140px]" data-testid="desktop-color-filter">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colors</SelectItem>
                {allColors.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceSort} onValueChange={setPriceSort}>
              <SelectTrigger className="w-[160px]" data-testid="desktop-price-sort">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="low-high">Price: Low to High</SelectItem>
                <SelectItem value="high-low">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                data-testid="desktop-clear-filters"
              >
                Clear Filters
              </Button>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden" data-testid="button-mobile-filters">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2">
                    Active
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterControls />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {filteredProducts.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-testid="product-grid"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground">
                No products found
              </h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters to see more results
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
