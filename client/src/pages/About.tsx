import { Container } from "@/components/Container";
import { useApp } from "@/contexts/AppContext";

export default function About() {
  const { t } = useApp();

  return (
    <Container className="py-8 md:py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6" data-testid="heading-about">
          {t("header.aboutUs")}
        </h1>
        <p className="text-muted-foreground" data-testid="text-about-placeholder">
          About Us page content coming soon.
        </p>
      </div>
    </Container>
  );
}
