import { Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import type { CartItem, PriceTier } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface CartListProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, size: string, quantity: number, priceTiers: PriceTier[]) => void;
  onRemoveItem: (productId: string, size: string) => void;
  getProductPriceTiers: (productId: string) => PriceTier[];
}

export function CartList({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem,
  getProductPriceTiers 
}: CartListProps) {
  const { t, formatPrice } = useApp();
  
  if (items.length === 0) {
    return (
      <Card className="min-h-[300px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-5xl text-muted-foreground/30">
            <ShoppingCart className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-muted-foreground">
            {t("cart.emptyCart")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("cart.reviewItems")}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-testid="cart-list">
      {items.map((item, index) => {
        const priceTiers = getProductPriceTiers(item.productId);
        
        const handleDecrement = () => {
          if (item.quantity > 1) {
            onUpdateQuantity(item.productId, item.variant.size, item.quantity - 1, priceTiers);
          }
        };

        const handleIncrement = () => {
          onUpdateQuantity(item.productId, item.variant.size, item.quantity + 1, priceTiers);
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = parseInt(e.target.value, 10);
          if (!isNaN(value) && value >= 1) {
            onUpdateQuantity(item.productId, item.variant.size, value, priceTiers);
          }
        };

        return (
          <Card 
            key={`${item.productId}-${item.variant.size}`} 
            className="p-4"
            data-testid={`cart-item-${index}`}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                <img
                  src={item.productImage}
                  alt={item.productTitle}
                  className="w-full h-full object-cover"
                  data-testid={`img-cart-item-${index}`}
                />
              </div>

              <div className="flex-1 space-y-2">
                <h3 
                  className="font-medium text-sm line-clamp-2"
                  data-testid={`text-cart-title-${index}`}
                >
                  {item.productTitle}
                </h3>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span data-testid={`text-cart-size-${index}`}>{t("product.size")}: {item.variant.size}</span>
                  <span data-testid={`text-cart-color-${index}`}>{t("product.color")}: {item.variant.color}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleDecrement}
                    disabled={item.quantity <= 1}
                    data-testid={`button-cart-decrease-${index}`}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={handleInputChange}
                    className="w-16 h-8 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    data-testid={`input-cart-quantity-${index}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleIncrement}
                    data-testid={`button-cart-increase-${index}`}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <div className="text-right min-w-[100px]">
                  <div 
                    className="font-bold text-foreground"
                    data-testid={`text-cart-unit-price-${index}`}
                  >
                    {formatPrice(item.unitPrice)}
                  </div>
                  <div 
                    className="text-xs text-muted-foreground"
                    data-testid={`text-cart-subtotal-${index}`}
                  >
                    Total: {formatPrice(item.unitPrice * item.quantity)}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onRemoveItem(item.productId, item.variant.size)}
                  data-testid={`button-cart-remove-${index}`}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">{t("cart.remove")}</span>
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
