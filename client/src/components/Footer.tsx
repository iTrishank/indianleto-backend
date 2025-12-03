import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">IndianLeto</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted B2B wholesale partner for fashion and apparel. 
              Quality products at competitive wholesale prices.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" data-testid="footer-link-catalog">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Browse Catalog
                </span>
              </Link>
              <Link href="/cart" data-testid="footer-link-cart">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  View Cart
                </span>
              </Link>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>For inquiries and support</p>
              <p className="font-medium text-foreground">info@indianleto.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} IndianLeto. All rights reserved. B2B Wholesale Only.
          </p>
        </div>
      </div>
    </footer>
  );
}
