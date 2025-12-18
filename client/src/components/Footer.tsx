import { SiFacebook, SiInstagram } from "react-icons/si";
import { Container } from "@/components/Container";
import logoImage from "@assets/logoUse_1765112823302.jpg";
import { useApp } from "@/contexts/AppContext";

export function Footer() {
  const { t } = useApp();
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <Container className="py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src={logoImage} 
                alt="IndianLeto" 
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("footer.description")}
              </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide">Address</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">{t("footer.country1")}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("footer.address1.one")}<br /> 
                   {t("footer.address1.two")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">{t("footer.country2")}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                {t("footer.address2.one")}<br />
                {t("footer.address2.two")}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide">Stay Connected</h3>
            
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">+7 915 277 4869</p>
              <p className="text-sm text-muted-foreground">+91 96808 96969</p>
              <p className="text-sm text-muted-foreground">+91 98283 72435</p>
            </div>

            <a 
              href="mailto:connect@indianleto.com" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
              data-testid="link-email"
            >
              connect@indianleto.com
            </a>

            <div className="flex items-center gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
                data-testid="link-facebook"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
                data-testid="link-instagram"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t">
        <Container className="py-4">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {t("footer.copyright")}
          </p>
        </Container>
      </div>
    </footer>
  );
}
