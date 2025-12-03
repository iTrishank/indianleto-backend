import { useState } from "react";
import { Link } from "wouter";
import { ShoppingCart, Globe, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languages, currencies } from "@/lib/constants";

export function Header() {
  const { itemCount } = useCart();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedCurrency, setSelectedCurrency] = useState("INR");

  const currentLanguage = languages.find((l) => l.code === selectedLanguage);
  const currentCurrency = currencies.find((c) => c.code === selectedCurrency);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between gap-2 md:gap-4">
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

          <div className="flex items-center gap-1 md:gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 px-2 md:px-3"
                  data-testid="dropdown-language"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">
                    {currentLanguage?.name || "English"}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className="cursor-pointer"
                    data-testid={`language-${lang.code}`}
                  >
                    <span className={selectedLanguage === lang.code ? "font-semibold" : ""}>
                      {lang.name}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 px-2 md:px-3"
                  data-testid="dropdown-currency"
                >
                  {currentCurrency && (
                    <img
                      src={`https://flagcdn.com/16x12/${currentCurrency.flag}.png`}
                      alt={currentCurrency.code}
                      className="h-3 w-4 object-cover rounded-sm"
                    />
                  )}
                  <span className="text-sm">
                    {currentCurrency?.code || "INR"}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 max-h-80 overflow-y-auto">
                {currencies.map((currency) => (
                  <DropdownMenuItem
                    key={currency.code}
                    onClick={() => setSelectedCurrency(currency.code)}
                    className="cursor-pointer flex items-center justify-between gap-2"
                    data-testid={`currency-${currency.code}`}
                  >
                    <span className={selectedCurrency === currency.code ? "font-semibold" : ""}>
                      {currency.code} {currency.symbol}
                    </span>
                    <img
                      src={`https://flagcdn.com/16x12/${currency.flag}.png`}
                      alt={currency.code}
                      className="h-3 w-4 object-cover rounded-sm"
                    />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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
      </div>
    </header>
  );
}
