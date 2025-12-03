import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";

interface PriceTier {
  minQty: number;
  maxQty: number | null;
  price: number;
}

interface PriceTiersProps {
  priceTiers: PriceTier[];
  currentQuantity: number;
}

export function PriceTiers({ priceTiers, currentQuantity }: PriceTiersProps) {
  const { t, formatPrice } = useApp();
  
  const getActiveTierIndex = () => {
    for (let i = 0; i < priceTiers.length; i++) {
      const tier = priceTiers[i];
      if (currentQuantity >= tier.minQty && (tier.maxQty === null || currentQuantity <= tier.maxQty)) {
        return i;
      }
    }
    return priceTiers.length - 1;
  };

  const activeTierIndex = getActiveTierIndex();

  const formatTierRange = (tier: PriceTier) => {
    if (tier.maxQty === null) {
      return `${tier.minQty}+ ${t("product.pieces")}`;
    }
    return `${tier.minQty}-${tier.maxQty} ${t("product.pieces")}`;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3" data-testid="price-tiers">
      {priceTiers.map((tier, index) => {
        const isActive = index === activeTierIndex;
        return (
          <Card
            key={index}
            className={`flex-1 p-4 text-center pointer-events-none select-none ${
              isActive
                ? "ring-2 ring-primary border-primary bg-primary/5"
                : "border-muted bg-muted/20"
            }`}
            data-testid={`price-tier-${index}`}
          >
            <div className={`text-xl md:text-2xl font-bold ${isActive ? "text-primary" : "text-foreground"}`}>
              {formatPrice(tier.price)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {formatTierRange(tier)}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
