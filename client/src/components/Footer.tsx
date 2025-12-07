import { MapPin, Phone, Mail } from "lucide-react";
import { SiFacebook, SiInstagram } from "react-icons/si";
import { Container } from "@/components/Container";
import logoImage from "@assets/logoUse_1765068131996.jpg";

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
              <span className="text-lg font-bold tracking-tight">IndianLeto</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              IndianLeto is a B2B apparel supplier offering high-quality Indian dresses in bulk. Fast delivery, premium fabrics, and reliable wholesale service.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">India</p>
                  <p className="text-sm text-muted-foreground">
                    431 Vivek Vihar, Shyam Nagar, Jaipur, Rajasthan, India, 302019
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Russia</p>
                  <p className="text-sm text-muted-foreground">
                    5 Izmailovski Prospekt, Moscow, Russia
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide">Stay Connected</h3>
            
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">+7 915 277 4869</p>
                <p className="text-sm text-muted-foreground">+91 96808 96969</p>
                <p className="text-sm text-muted-foreground">+91 98283 72435</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <a 
                href="mailto:connect@indianleto.com" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-email"
              >
                connect@indianleto.com
              </a>
            </div>

            <div className="flex items-center gap-4 pt-2">
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
