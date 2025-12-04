import { Minus, Plus } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SizeQuantitySelectorProps {
  sizes: string[];
  sizeQuantities: Record<string, number>;
  sizeMinOrders?: Record<string, number>;
  defaultMinOrder: number;
  onQuantityChange: (size: string, quantity: number) => void;
}

const QUICK_ADD_AMOUNTS_DESKTOP = [10, 50, 100, 500, 1000];
const QUICK_ADD_AMOUNTS_MOBILE = [50, 100, 500];
const MAX_QUANTITY = 9999;

export function SizeQuantitySelector({
  sizes,
  sizeQuantities,
  sizeMinOrders,
  defaultMinOrder,
  onQuantityChange,
}: SizeQuantitySelectorProps) {
  const { t } = useApp();

  const getMinOrderForSize = (size: string): number => {
    return sizeMinOrders?.[size] || defaultMinOrder;
  };

  const handleDecrement = (size: string) => {
    const current = sizeQuantities[size] ?? getMinOrderForSize(size);
    if (current > 0) {
      onQuantityChange(size, current - 1);
    }
  };

  const handleIncrement = (size: string) => {
    const current = sizeQuantities[size] || getMinOrderForSize(size);
    if (current < MAX_QUANTITY) {
      onQuantityChange(size, current + 1);
    }
  };

  const handleInputChange = (size: string, value: string) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(0, Math.min(MAX_QUANTITY, parsed));
      onQuantityChange(size, clamped);
    }
  };

  const handleQuickAdd = (size: string, amount: number) => {
    const current = sizeQuantities[size] || getMinOrderForSize(size);
    const newQuantity = Math.min(current + amount, MAX_QUANTITY);
    onQuantityChange(size, newQuantity);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {t("product.selectSizeQuantity")}
      </label>
      <div className="space-y-2" data-testid="size-quantity-selector">
        {sizes.map((size) => {
          const quantity = sizeQuantities[size] ?? 0;

          return (
            <div
              key={size}
              className="flex items-center gap-2 flex-wrap md:flex-nowrap"
              data-testid={`size-row-${size}`}
            >
              <span
                className="min-w-[2.5rem] text-sm font-medium"
                data-testid={`label-size-${size}`}
              >
                {size}
              </span>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDecrement(size)}
                  disabled={quantity <= 0}
                  data-testid={`button-decrease-${size}`}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  min={0}
                  max={MAX_QUANTITY}
                  value={quantity}
                  onChange={(e) => handleInputChange(size, e.target.value)}
                  className="w-14 h-8 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  data-testid={`input-quantity-${size}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleIncrement(size)}
                  disabled={quantity >= MAX_QUANTITY}
                  data-testid={`button-increase-${size}`}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="hidden md:flex items-center gap-1">
                {QUICK_ADD_AMOUNTS_DESKTOP.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 px-2 text-xs font-medium"
                    onClick={() => handleQuickAdd(size, amount)}
                    disabled={quantity >= MAX_QUANTITY}
                    data-testid={`button-quick-add-${size}-${amount}`}
                  >
                    +{amount}
                  </Button>
                ))}
              </div>

              <div className="flex md:hidden items-center gap-1">
                {QUICK_ADD_AMOUNTS_MOBILE.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 px-2 text-xs font-medium"
                    onClick={() => handleQuickAdd(size, amount)}
                    disabled={quantity >= MAX_QUANTITY}
                    data-testid={`button-quick-add-mobile-${size}-${amount}`}
                  >
                    +{amount}
                  </Button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
