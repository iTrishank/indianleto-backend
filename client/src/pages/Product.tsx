import { useState } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { getPriceForQuantity } from "@shared/schema";
import { useCart } from "@/contexts/CartContext";
import { ProductGallery } from "@/components/ProductGallery";
import { PriceTiers } from "@/components/PriceTiers";
import { SizeSelector } from "@/components/SizeSelector";
import { QuantityInput } from "@/components/QuantityInput";
import { MeasurementsTable } from "@/components/MeasurementsTable";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { t, products, formatPrice } = useApp();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();
  const { toast } = useToast();

  const [selectedSize, setSelectedSize] = useState<string>(
    product?.attributes.sizes[0] || ""
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);

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

  const currentPrice = getPriceForQuantity(product.priceTiers, quantity);
  const subtotal = currentPrice * quantity;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: t("product.pleaseSelectSize"),
        description: t("product.chooseSizeBeforeAdding"),
        variant: "destructive",
      });
      return;
    }

    addItem(product as any, selectedSize, quantity);
    setJustAdded(true);
    toast({
      title: t("product.addedToCartTitle"),
      description: `${product.title} (${t("product.size")}: ${selectedSize}) x ${quantity} ${t("product.addedToCartDesc")}.`,
    });

    setQuantity(product.minOrder);

    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <nav className="mb-6">
        <Link href="/" data-testid="link-breadcrumb-catalog">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("product.backToCatalog")}
          </Button>
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <div className="relative">
          <ProductGallery images={product.images} productTitle={product.title} />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h1
              className="text-2xl md:text-3xl font-bold tracking-tight"
              data-testid="text-product-title"
            >
              {product.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span data-testid="text-product-sku">{t("product.sku")}: {product.sku}</span>
              <span>{t("product.minOrder")}: {product.minOrder}</span>
            </div>
          </div>

          <p
            className="text-muted-foreground leading-relaxed"
            data-testid="text-product-description"
          >
            {product.description}
          </p>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t("product.wholesalePricing")}
            </h3>
            <PriceTiers priceTiers={product.priceTiers} currentQuantity={quantity} />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t("product.color")}:</span>
            <span className="font-medium text-foreground" data-testid="text-product-color">
              {product.attributes.color}
            </span>
          </div>

          <SizeSelector
            sizes={product.attributes.sizes}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
          />

          {product.attributes.measurements && (
            <MeasurementsTable
              measurements={product.attributes.measurements as Record<string, { skirtLength?: number; bust?: number; waist?: number; hips?: number }>}
              selectedSize={selectedSize}
            />
          )}

          <QuantityInput
            quantity={quantity}
            minQuantity={product.minOrder}
            onQuantityChange={setQuantity}
          />

          <div className="border-t pt-6 space-y-4">
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
              <span className="text-muted-foreground">{t("product.subtotal")} ({quantity} {t("product.pcs")}):</span>
              <span className="text-lg font-semibold" data-testid="text-subtotal">
                {formatPrice(subtotal)}
              </span>
            </div>

            <Button
              size="lg"
              className="w-full min-h-[48px]"
              onClick={handleAddToCart}
              disabled={!selectedSize}
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
    </div>
  );
}
