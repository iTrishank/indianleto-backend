import { Link, useSearch } from "wouter";
import { CheckCircle, ArrowLeft, Mail, Phone } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Thanks() {
  const { t, ui } = useApp();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const quoteId = params.get("quoteId") || "N/A";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-lg w-full">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("thanks.thankYou")}
            </h1>
            <p className="text-muted-foreground">
              {t("thanks.quotationSubmitted")}
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">{t("thanks.yourQuoteId")}</p>
            <p
              className="text-xl font-mono font-bold text-primary"
              data-testid="text-quote-id"
            >
              {quoteId}
            </p>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              {t("thanks.responseTime")}
            </p>
            <p className="font-medium text-foreground">
              {t("thanks.saveQuoteId")}
            </p>
          </div>

          <div className="border-t pt-6 space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t("thanks.needAssistance")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{ui.contactEmail}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{ui.contactPhone}</span>
              </div>
            </div>
          </div>

          <Link href="/" data-testid="link-back-to-catalog">
            <Button size="lg" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("thanks.continueShopping")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
