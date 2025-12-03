import { useState } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { getProductById } from "@/lib/products";
import { getPriceForQuantity } from "@shared/schema";
import { useCart } from "@/contexts/CartContext";
import { ProductGallery } from "@/components/ProductGallery";
import { PriceTiers } from "@/components/PriceTiers";
import { SizeSelector } from "@/components/SizeSelector";
import { QuantityInput } from "@/components/QuantityInput";
import { MeasurementsTable } from "@/components/MeasurementsTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
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
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <p className="text-muted-foreground">
            The product you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button data-testid="button-back-to-catalog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Catalog
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
        title: "Please select a size",
        description: "Choose a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    addItem(product, selectedSize, quantity);
    setJustAdded(true);
    toast({
      title: "Added to cart",
      description: `${product.title} (Size: ${selectedSize}) x ${quantity} added to your cart.`,
    });

    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <nav className="mb-6">
        <Link href="/" data-testid="link-breadcrumb-catalog">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Button>
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <div className="relative">
          {product.hasPromo && (
            <Badge
              className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-sm font-semibold px-4 py-1.5"
              data-testid="badge-product-promo"
            >
              Buy 10 Get 1 Free
            </Badge>
          )}
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
              <span data-testid="text-product-sku">SKU: {product.sku}</span>
              <span>Min. Order: {product.minOrder}</span>
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
              Wholesale Pricing
            </h3>
            <PriceTiers priceTiers={product.priceTiers} currentQuantity={quantity} />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Color:</span>
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
              measurements={product.attributes.measurements}
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
              <span className="text-muted-foreground">Unit Price:</span>
              <span
                className="text-xl font-bold text-primary"
                data-testid="text-unit-price"
              >
                INR{currentPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal ({quantity} pcs):</span>
              <span className="text-lg font-semibold" data-testid="text-subtotal">
                INR{subtotal.toFixed(2)}
              </span>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!selectedSize}
              data-testid="button-add-to-cart"
            >
              {justAdded ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
