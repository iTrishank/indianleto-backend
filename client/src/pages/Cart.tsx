import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getProductById } from "@/lib/products";
import { CartList } from "@/components/CartList";
import { QuotationForm } from "@/components/QuotationForm";
import { Button } from "@/components/ui/button";

export default function Cart() {
  const { items, updateQuantity, removeItem } = useCart();

  const getProductPriceTiers = (productId: string) => {
    const product = getProductById(productId);
    return product?.priceTiers || [];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <nav className="mb-6">
        <Link href="/" data-testid="link-continue-shopping">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Your Cart
        </h1>
        <p className="text-muted-foreground mt-2">
          Review your items and submit a quotation request
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartList
            items={items}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            getProductPriceTiers={getProductPriceTiers}
          />
        </div>

        <div className="lg:col-span-1">
          <QuotationForm />
        </div>
      </div>
    </div>
  );
}
