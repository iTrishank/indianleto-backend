import { Minus, Plus } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuantityInputProps {
  quantity: number;
  minQuantity?: number;
  maxQuantity?: number;
  onQuantityChange: (quantity: number) => void;
}

const QUICK_ADD_AMOUNTS = [10, 50, 100, 500, 1000];

export function QuantityInput({ 
  quantity, 
  minQuantity = 1, 
  maxQuantity = 9999,
  onQuantityChange 
}: QuantityInputProps) {
  const { t } = useApp();
  
  const handleDecrement = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      const clampedValue = Math.max(minQuantity, Math.min(maxQuantity, value));
      onQuantityChange(clampedValue);
    }
  };

  const handleQuickAdd = (amount: number) => {
    const newQuantity = Math.min(quantity + amount, maxQuantity);
    onQuantityChange(newQuantity);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {t("product.quantity")}
      </label>
      <div className="flex flex-wrap items-center gap-1" data-testid="quantity-input">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={quantity <= minQuantity}
          data-testid="button-quantity-decrease"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          min={minQuantity}
          max={maxQuantity}
          value={quantity}
          onChange={handleInputChange}
          className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          data-testid="input-quantity"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={quantity >= maxQuantity}
          data-testid="button-quantity-increase"
        >
          <Plus className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-1 ml-2">
          {QUICK_ADD_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 px-2 text-xs font-medium"
              onClick={() => handleQuickAdd(amount)}
              disabled={quantity >= maxQuantity}
              data-testid={`button-quick-add-${amount}`}
            >
              +{amount}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
