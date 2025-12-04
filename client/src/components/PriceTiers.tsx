import { useApp } from "@/contexts/AppContext";

interface PriceTier {
  minQty: number;
  maxQty: number | null;
  price: number;
}

interface PriceTiersProps {
  priceTiers: PriceTier[];
  currentQuantity?: number;
}

export function PriceTiers({ priceTiers }: PriceTiersProps) {
  const { t, formatPrice } = useApp();

  const formatTierRange = (tier: PriceTier) => {
    if (tier.maxQty === null) {
      return `${tier.minQty}+ ${t("product.pieces")}`;
    }
    return `${tier.minQty}-${tier.maxQty} ${t("product.pieces")}`;
  };

  return (
    <div className="flex flex-row flex-wrap gap-2 sm:gap-3" data-testid="price-tiers">
      {priceTiers.map((tier, index) => (
        <div
          key={index}
          className="flex-1 min-w-[100px] p-2 sm:p-4 text-center border border-border bg-muted/30 rounded-lg pointer-events-none select-none"
          data-testid={`price-tier-${index}`}
        >
          <div className="text-base sm:text-xl md:text-2xl font-bold text-foreground">
            {formatPrice(tier.price)}
          </div>
          <div className="text-[10px] sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
            {formatTierRange(tier)}
          </div>
        </div>
      ))}
    </div>
  );
}
