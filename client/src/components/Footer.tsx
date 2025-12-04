import { Link } from "wouter";
import { useApp } from "@/contexts/AppContext";
import { Container } from "@/components/Container";

export function Footer() {
  const { t } = useApp();
  
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h3 className="text-lg font-bold text-primary">{t("header.logo")}</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t("footer.description")}
            </p>
          </div>
          
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h3 className="text-sm font-semibold uppercase tracking-wide">{t("footer.quickLinks")}</h3>
            <nav className="flex flex-col gap-2 items-center md:items-start">
              <Link href="/" data-testid="footer-link-catalog">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  {t("footer.browseCatalog")}
                </span>
              </Link>
              <Link href="/cart" data-testid="footer-link-cart">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  {t("footer.viewCart")}
                </span>
              </Link>
            </nav>
          </div>
          
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h3 className="text-sm font-semibold uppercase tracking-wide">{t("footer.contact")}</h3>
            <div className="space-y-2 text-sm text-muted-foreground text-center md:text-left">
              <p>{t("footer.forInquiries")}</p>
              <p className="font-medium text-foreground">info@indianleto.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
