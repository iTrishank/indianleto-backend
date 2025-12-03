import type { PriceTier } from "@shared/schema";
import { Card } from "@/components/ui/card";

interface PriceTiersProps {
  priceTiers: PriceTier[];
  currentQuantity: number;
}

export function PriceTiers({ priceTiers, currentQuantity }: PriceTiersProps) {
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
      return `${tier.minQty}+ pieces`;
    }
    return `${tier.minQty}-${tier.maxQty} pieces`;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3" data-testid="price-tiers">
      {priceTiers.map((tier, index) => {
        const isActive = index === activeTierIndex;
        return (
          <Card
            key={index}
            className={`flex-1 p-4 text-center transition-all ${
              isActive
                ? "ring-2 ring-primary border-primary bg-primary/5"
                : "border-muted hover-elevate"
            }`}
            data-testid={`price-tier-${index}`}
          >
            <div className={`text-xl md:text-2xl font-bold ${isActive ? "text-primary" : "text-foreground"}`}>
              INR{tier.price.toFixed(2)}
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
