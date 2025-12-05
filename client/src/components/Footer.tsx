import { useApp } from "@/contexts/AppContext";
import { Container } from "@/components/Container";

export function Footer() {
  const { t } = useApp();
  
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <Container className="py-2">
        <p className="text-xs text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} {t("footer.copyright")}
        </p>
      </Container>
    </footer>
  );
}
