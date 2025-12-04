import { useState, useMemo, useEffect, useRef } from "react";
import { Filter, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { ProductCard } from "@/components/ProductCard";
import { Container } from "@/components/Container";
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
import { ITEMS_PER_PAGE, ITEM_SIZE } from "@/lib/constants";

export default function Catalog() {
  const { t, products } = useApp();
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [priceSort, setPriceSort] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const allColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((p) => colors.add(p.attributes.color));
    return Array.from(colors).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (colorFilter !== "all") {
      result = result.filter((p) => p.attributes.color === colorFilter);
    }

    if (priceSort === "low-high") {
      result.sort((a, b) => {
        const aMin = Math.min(...a.priceTiers.map((tier) => tier.price));
        const bMin = Math.min(...b.priceTiers.map((tier) => tier.price));
        return aMin - bMin;
      });
    } else if (priceSort === "high-low") {
      result.sort((a, b) => {
        const aMax = Math.max(...a.priceTiers.map((tier) => tier.price));
        const bMax = Math.max(...b.priceTiers.map((tier) => tier.price));
        return bMax - aMax;
      });
    }

    return result;
  }, [products, colorFilter, priceSort]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    handleFilterChange(() => {
      setColorFilter("all");
      setPriceSort("default");
      setCurrentPage(1);
    });
  };

  const hasActiveFilters = colorFilter !== "all" || priceSort !== "default";

  const handleFilterChange = (callback: () => void) => {
    setIsFiltering(true);
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    callback();
    filterTimeoutRef.current = setTimeout(() => {
      setIsFiltering(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, []);

  const handleColorChange = (v: string) => {
    handleFilterChange(() => {
      setColorFilter(v);
      setCurrentPage(1);
    });
  };

  const handlePriceSortChange = (v: string) => {
    handleFilterChange(() => {
      setPriceSort(v);
      setCurrentPage(1);
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const FilterControls = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t("catalog.color")}
        </label>
        <Select value={colorFilter} onValueChange={handleColorChange}>
          <SelectTrigger data-testid="select-color-filter">
            <SelectValue placeholder={t("catalog.allColors")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("catalog.allColors")}</SelectItem>
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
          {t("catalog.price")}
        </label>
        <Select value={priceSort} onValueChange={handlePriceSortChange}>
          <SelectTrigger data-testid="select-price-sort">
            <SelectValue placeholder={t("catalog.default")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">{t("catalog.default")}</SelectItem>
            <SelectItem value="low-high">{t("catalog.priceLowHigh")}</SelectItem>
            <SelectItem value="high-low">{t("catalog.priceHighLow")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={clearFilters}
        disabled={!hasActiveFilters}
        data-testid="button-clear-filters"
      >
        {t("catalog.clearFilters")}
      </Button>
    </div>
  );

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return (
      <div className="flex items-center justify-center gap-1 mt-8" data-testid="pagination">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          data-testid="button-prev-page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((page, index) =>
          typeof page === "number" ? (
            <Button
              key={index}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              data-testid={`button-page-${page}`}
            >
              {page}
            </Button>
          ) : (
            <span key={index} className="px-2 text-muted-foreground">
              {page}
            </span>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          data-testid="button-next-page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const LoadingSpinner = () => (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" data-testid="loading-spinner" />
        <span className="text-sm text-muted-foreground">{t("catalog.loading") || "Loading..."}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-10 md:py-12">
        <Container>
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {t("catalog.title")}
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              {t("catalog.subtitle")}
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
          <p className="text-sm text-muted-foreground" data-testid="text-product-count">
            {t("catalog.showing")} {paginatedProducts.length} {t("catalog.of")} {filteredProducts.length} {t("catalog.products")}
            {totalPages > 1 && ` (${t("catalog.page")} ${currentPage} ${t("catalog.of")} ${totalPages})`}
          </p>

          <div className="hidden md:flex items-center gap-3 flex-wrap">
            <Select value={colorFilter} onValueChange={handleColorChange}>
              <SelectTrigger className="w-[140px]" data-testid="desktop-color-filter">
                <SelectValue placeholder={t("catalog.color")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("catalog.allColors")}</SelectItem>
                {allColors.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceSort} onValueChange={handlePriceSortChange}>
              <SelectTrigger className="w-[160px]" data-testid="desktop-price-sort">
                <SelectValue placeholder={t("catalog.price")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">{t("catalog.default")}</SelectItem>
                <SelectItem value="low-high">{t("catalog.priceLowHigh")}</SelectItem>
                <SelectItem value="high-low">{t("catalog.priceHighLow")}</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              data-testid="desktop-clear-filters"
            >
              {t("catalog.clearFilters")}
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden" data-testid="button-mobile-filters">
                <Filter className="h-4 w-4 mr-2" />
                {t("catalog.filters")}
                {hasActiveFilters && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2">
                    {t("catalog.active")}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>{t("catalog.filterProducts")}</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterControls />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="relative min-h-[400px]">
          {isFiltering && <LoadingSpinner />}
          
          {paginatedProducts.length > 0 ? (
            <>
              <div
                className="grid gap-3 sm:gap-4 lg:gap-5 justify-center"
                style={{
                  gridTemplateColumns: `repeat(auto-fill, minmax(min(${ITEM_SIZE}px, calc(50% - 0.75rem)), ${ITEM_SIZE}px))`,
                }}
                data-testid="product-grid"
              >
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination />
            </>
          ) : (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-muted-foreground">
                  {t("catalog.noProducts")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("catalog.tryAdjustingFilters")}
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  {t("catalog.clearFilters")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
