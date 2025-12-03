import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

export function SizeSelector({ sizes, selectedSize, onSelectSize }: SizeSelectorProps) {
  const { t } = useApp();
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {t("product.selectSize")}
      </label>
      <div className="flex flex-wrap gap-2" data-testid="size-selector">
        {sizes.map((size) => {
          const isSelected = size === selectedSize;
          return (
            <Button
              key={size}
              type="button"
              variant={isSelected ? "default" : "outline"}
              className={`min-w-[3rem] px-4 py-2 ${
                isSelected ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
              onClick={() => onSelectSize(size)}
              data-testid={`button-size-${size}`}
            >
              {size}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
