import { Link } from "wouter";
import { ShoppingCart, Globe, ChevronDown, Palette } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useApp } from "@/contexts/AppContext";
import { Container } from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Header() {
  const { itemCount } = useCart();
  const { language, setLanguage, currency, setCurrency, t, languages, currencies, ui, primaryColor, setPrimaryColor } = useApp();

  const currentLanguage = languages.find((l) => l.code === language);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 md:h-20 items-center justify-between gap-2 md:gap-4">
          <Link href="/" data-testid="link-home">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-primary cursor-pointer">
              {t("header.logo")}
            </span>
          </Link>

          <div className="flex items-center gap-1 md:gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 px-2 md:px-3 sm:min-w-[100px]"
                  data-testid="dropdown-language"
                >
                  <Globe className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline text-sm min-w-[60px] text-left">
                    {currentLanguage?.name || "English"}
                  </span>
                  <ChevronDown className="h-3 w-3 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as "en" | "es" | "hi" | "ru")}
                    className="cursor-pointer"
                    data-testid={`language-${lang.code}`}
                  >
                    <span className={language === lang.code ? "font-semibold" : ""}>
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
                  <img
                    src={`${ui.flagCdnBase}/${currency.flag}.png`}
                    alt={currency.code}
                    className="h-3 w-4 object-cover rounded-sm"
                  />
                  <span className="text-sm">
                    {currency.code}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 max-h-80 overflow-y-auto">
                {currencies.map((curr) => (
                  <DropdownMenuItem
                    key={curr.code}
                    onClick={() => setCurrency(curr.code)}
                    className="cursor-pointer flex items-center justify-between gap-2"
                    data-testid={`currency-${curr.code}`}
                  >
                    <span className={currency.code === curr.code ? "font-semibold" : ""}>
                      {curr.code} {curr.symbol}
                    </span>
                    <img
                      src={`${ui.flagCdnBase}/${curr.flag}.png`}
                      alt={curr.code}
                      className="h-3 w-4 object-cover rounded-sm"
                    />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 px-2 md:px-3"
                  data-testid="dropdown-color"
                >
                  <Palette className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline text-sm">{t("header.color")}</span>
                  <div 
                    className="h-4 w-4 rounded-full border border-border"
                    style={{ backgroundColor: primaryColor }}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48 p-3">
                <div className="space-y-3">
                  <label className="text-sm font-medium">{t("header.themeColor")}</label>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-full cursor-pointer rounded border border-input"
                    data-testid="input-color-picker"
                  />
                </div>
              </PopoverContent>
            </Popover>

            <Link href="/cart" data-testid="link-cart">
              <div className="relative inline-flex">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">{t("header.cart")}</span>
                </Button>
                {itemCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1.5 flex items-center justify-center text-[10px] font-medium pointer-events-none"
                    data-testid="badge-cart-count"
                  >
                    {itemCount}
                  </Badge>
                )}
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
