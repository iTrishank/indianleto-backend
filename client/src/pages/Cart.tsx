import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useCart } from "@/contexts/CartContext";
import { Container } from "@/components/Container";
import { CartList } from "@/components/CartList";
import { QuotationForm } from "@/components/QuotationForm";
import { Button } from "@/components/ui/button";

export default function Cart() {
  const { t, products } = useApp();
  const { items, updateQuantity, removeItem } = useCart();

  const getProductPriceTiers = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product?.priceTiers || [];
  };

  return (
    <Container className="py-8">
      <nav className="mb-6">
        <Link href="/" data-testid="link-continue-shopping">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("cart.continueShoppingBtn")}
          </Button>
        </Link>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {t("cart.yourCart")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("cart.reviewItems")}
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
    </Container>
  );
}
