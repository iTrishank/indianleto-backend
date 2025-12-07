import { Link, useLocation } from "wouter";
import { ShoppingCart, Globe, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useApp } from "@/contexts/AppContext";
import { Container } from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/logoUse_1765112823302.jpg";
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
  const { language, setLanguage, currency, setCurrency, t, languages, currencies, ui } = useApp();
  const [location] = useLocation();

  const currentLanguage = languages.find((l) => l.code === language);
  const isProductPage = location.startsWith("/product/");

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <Container>
          <div className="flex h-14 md:h-16 items-center justify-between gap-2 md:gap-4">
            <Link href="/" data-testid="link-home">
              <div className="flex items-center gap-2 cursor-pointer">
                <img 
                  src={logoImage} 
                  alt="IndianLeto" 
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </div>
            </Link>

            <nav className="hidden sm:flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
              <Link href="/" data-testid="link-catalog">
                <span className="text-sm font-bold text-foreground cursor-pointer hover:opacity-70 transition-opacity">
                  {t("header.catalog")}
                </span>
              </Link>
              <span className="text-muted-foreground">|</span>
              <Link href="/about" data-testid="link-about">
                <span className="text-sm font-bold text-foreground cursor-pointer hover:opacity-70 transition-opacity">
                  {t("header.aboutUs")}
                </span>
              </Link>
            </nav>

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

              <Popover>
                <PopoverTrigger asChild>
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
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto p-3 max-h-80 overflow-y-auto">
                  <div className="grid grid-cols-5 gap-1">
                    {currencies.map((curr) => (
                      <Button
                        key={curr.code}
                        variant={currency.code === curr.code ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCurrency(curr.code)}
                        className="flex flex-col items-center gap-1 h-auto py-2 px-2 min-w-[56px]"
                        data-testid={`currency-${curr.code}`}
                      >
                        <img
                          src={`${ui.flagCdnBase}/${curr.flag}.png`}
                          alt={curr.code}
                          className="h-3 w-5 object-cover rounded-sm"
                        />
                        <span className="text-xs font-medium">{curr.code}</span>
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Link href="/cart" data-testid="link-cart">
                <div className="relative inline-flex pr-2">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="sr-only">{t("header.cart")}</span>
                  </Button>
                  <Badge 
                    className={`absolute -top-1 -right-0 h-5 min-w-[20px] px-1.5 flex items-center justify-center text-[10px] font-medium pointer-events-none transition-opacity ${itemCount > 0 ? 'opacity-100' : 'opacity-0'}`}
                    data-testid="badge-cart-count"
                  >
                    {itemCount || 0}
                  </Badge>
                </div>
              </Link>
            </div>
          </div>
        </Container>
      </header>

      {!isProductPage && (
        <nav className="sm:hidden sticky top-14 z-40 flex items-center justify-center py-3 mx-auto">
          <div className="inline-flex items-center gap-6 px-6 py-2 rounded-full border border-border bg-background">
            <Link href="/" data-testid="link-catalog-mobile">
              <span className="text-sm font-medium text-foreground cursor-pointer hover:opacity-70 transition-opacity">
                {t("header.catalog")}
              </span>
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/about" data-testid="link-about-mobile">
              <span className="text-sm font-medium text-foreground cursor-pointer hover:opacity-70 transition-opacity">
                {t("header.aboutUs")}
              </span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
