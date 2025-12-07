import { SiFacebook, SiInstagram } from "react-icons/si";
import { Container } from "@/components/Container";
import logoImage from "@assets/logoUse_1765112823302.jpg";

export function Footer() {
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
              IndianLeto is a B2B apparel supplier offering high-quality Indian dresses in bulk. Fast delivery, premium fabrics, and reliable wholesale service.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide">Address</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">India</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  431 Vivek Vihar, Shyam Nagar,<br />
                  Jaipur, Rajasthan, India, 302019
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Russia</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  5 Izmailovski Prospekt,<br />
                  Moscow, Russia, 105203
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide">Stay Connected</h3>
            
            <div className="flex flex-col gap-2">
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
            &copy; 2025 IndianLeto. All rights reserved. B2B Wholesale Only.
          </p>
        </Container>
      </div>
    </footer>
  );
}
