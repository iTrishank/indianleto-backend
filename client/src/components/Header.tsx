import { Link } from "wouter";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-primary cursor-pointer">
              IndianLeto
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" data-testid="link-catalog">
              <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Catalog
              </span>
            </Link>
          </nav>

          <Link href="/cart" data-testid="link-cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1.5 flex items-center justify-center text-xs"
                  data-testid="badge-cart-count"
                >
                  {itemCount}
                </Badge>
              )}
              <span className="sr-only">Shopping cart</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
