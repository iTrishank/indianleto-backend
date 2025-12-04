import { useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { getPriceForQuantity } from "@shared/schema";
import { useCart } from "@/contexts/CartContext";
import { useCartNotification } from "@/contexts/CartNotificationContext";
import { Container } from "@/components/Container";
import { ProductGallery } from "@/components/ProductGallery";
import { PriceTiers } from "@/components/PriceTiers";
import { SizeQuantitySelector } from "@/components/SizeQuantitySelector";
import { MeasurementsTable } from "@/components/MeasurementsTable";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { t, products, formatPrice } = useApp();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();
  const { notifyAddedToCart } = useCartNotification();
  const { toast } = useToast();

  const getMinOrderForSize = (size: string): number => {
    if (product?.sizeMinOrders && product.sizeMinOrders[size]) {
      return product.sizeMinOrders[size];
    }
    return product?.minOrder || 1;
  };

  const initializeSizeQuantities = () => {
    if (!product) return {};
    const quantities: Record<string, number> = {};
    product.attributes.sizes.forEach((size) => {
      quantities[size] = getMinOrderForSize(size);
    });
    return quantities;
  };

  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>(initializeSizeQuantities);
  const [justAdded, setJustAdded] = useState(false);

  const handleQuantityChange = (size: string, quantity: number) => {
    setSizeQuantities((prev) => ({
      ...prev,
      [size]: quantity,
    }));
  };

  const totalQuantity = useMemo(() => {
    return Object.entries(sizeQuantities).reduce((sum, [size, qty]) => {
      const min = getMinOrderForSize(size);
      return sum + (qty >= min ? qty : 0);
    }, 0);
  }, [sizeQuantities]);

  const sizesWithQuantity = useMemo(() => {
    return Object.entries(sizeQuantities).filter(([size, qty]) => {
      const min = getMinOrderForSize(size);
      return qty >= min;
    });
  }, [sizeQuantities]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">{t("product.productNotFound")}</h1>
          <p className="text-muted-foreground">
            {t("product.productNotFoundDesc")}
          </p>
          <Link href="/">
            <Button data-testid="button-back-to-catalog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("product.backToCatalog")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = getPriceForQuantity(product.priceTiers, totalQuantity || 1);
  const subtotal = useMemo(() => {
    return sizesWithQuantity.reduce((sum, [, qty]) => {
      const price = getPriceForQuantity(product.priceTiers, totalQuantity || 1);
      return sum + price * qty;
    }, 0);
  }, [sizesWithQuantity, totalQuantity, product.priceTiers]);

  const handleAddToCart = () => {
    if (sizesWithQuantity.length === 0) {
      toast({
        title: t("product.pleaseSelectSize"),
        description: t("product.chooseSizeBeforeAdding"),
        variant: "destructive",
      });
      return;
    }

    let totalAdded = 0;
    sizesWithQuantity.forEach(([size, qty]) => {
      addItem(product as any, size, qty);
      totalAdded += qty;
    });

    notifyAddedToCart(product.id, totalAdded);
    setJustAdded(true);

    const sizesSummary = sizesWithQuantity.map(([size, qty]) => `${size}: ${qty}`).join(", ");
    toast({
      title: t("product.addedToCartTitle"),
      description: `${product.title} (${sizesSummary}) ${t("product.addedToCartDesc")}.`,
    });

    setSizeQuantities(initializeSizeQuantities());

    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <Container className="py-6 md:py-8">
      <nav className="mb-6">
        <Link href="/" data-testid="link-breadcrumb-catalog">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("product.backToCatalog")}
          </Button>
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative">
          <ProductGallery images={product.images} productTitle={product.title} />
        </div>

        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <h1
              className="text-2xl md:text-3xl font-bold tracking-tight"
              data-testid="text-product-title"
            >
              {product.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span data-testid="text-product-sku">{t("product.sku")}: {product.sku}</span>
              <span>{t("product.minOrder")}: {product.minOrder || 1}</span>
            </div>
          </div>

          <p
            className="text-muted-foreground leading-relaxed"
            data-testid="text-product-description"
          >
            {product.description}
          </p>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t("product.wholesalePricing")}
            </h3>
            <PriceTiers priceTiers={product.priceTiers} currentQuantity={totalQuantity || 1} />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t("product.color")}:</span>
            <span className="font-medium text-foreground" data-testid="text-product-color">
              {product.attributes.color}
            </span>
          </div>

          {product.attributes.measurements && (
            <MeasurementsTable
              measurements={product.attributes.measurements as Record<string, { skirtLength?: number; bust?: number; waist?: number; hips?: number }>}
            />
          )}

          <SizeQuantitySelector
            sizes={product.attributes.sizes}
            sizeQuantities={sizeQuantities}
            sizeMinOrders={product.sizeMinOrders}
            defaultMinOrder={product.minOrder || 1}
            onQuantityChange={handleQuantityChange}
          />

          <div className="border-t pt-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t("product.unitPrice")}:</span>
              <span
                className="text-xl font-bold text-primary"
                data-testid="text-unit-price"
              >
                {formatPrice(currentPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t("product.subtotal")} ({totalQuantity} {t("product.pcs")}):</span>
              <span className="text-lg font-semibold" data-testid="text-subtotal">
                {formatPrice(subtotal)}
              </span>
            </div>

            <Button
              size="lg"
              className="w-full min-h-[48px] mt-2"
              onClick={handleAddToCart}
              disabled={sizesWithQuantity.length === 0}
              data-testid="button-add-to-cart"
            >
              <span className="flex items-center justify-center min-w-[180px]">
                {justAdded ? (
                  <>
                    <Check className="mr-2 h-5 w-5 flex-shrink-0" />
                    <span>{t("product.addedToCart")}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5 flex-shrink-0" />
                    <span>{t("product.addToCart")}</span>
                  </>
                )}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
