import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { z } from "zod";
import { useApp } from "@/contexts/AppContext";
import { useCart } from "@/contexts/CartContext";
import { generateProductsSummary } from "@/lib/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const quotationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Valid phone number required (min 10 digits)"),
  email: z.string().email("Valid email address required"),
  notes: z.string().optional(),
});

type QuotationFormData = z.infer<typeof quotationFormSchema>;

export function QuotationForm() {
  const { t, formatPrice } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, clearCart, total } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const emptyCartMessage = t("cart.emptyCart");
  const productsSummary = useMemo(() => 
    generateProductsSummary(items, formatPrice, emptyCartMessage), 
    [items, formatPrice, emptyCartMessage]
  );

  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      notes: "",
    },
  });

  const onSubmit = async (data: QuotationFormData) => {
    if (items.length === 0) {
      toast({
        title: t("cart.emptyCart"),
        description: t("cart.reviewItems"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/quote", {
        customer: {
          name: data.name,
          phone: data.phone,
          email: data.email,
        },
        cart: items,
        notes: data.notes || "",
      });

      const response = await res.json();

      if (response.success) {
        clearCart();
        setLocation(`/thanks?quoteId=${response.quoteId}`);
      } else {
        toast({
          title: t("cart.quotationError"),
          description: response.message || t("cart.quotationErrorDesc"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("cart.quotationError"),
        description: t("cart.quotationErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="sticky top-24" data-testid="quotation-form">
      <CardHeader>
        <CardTitle className="text-xl">{t("cart.requestQuotation")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold uppercase tracking-wide">
                    {t("cart.yourName")} *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("cart.enterName")}
                      {...field}
                      data-testid="input-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold uppercase tracking-wide">
                    {t("cart.phoneNumber")} *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      {...field}
                      data-testid="input-phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold uppercase tracking-wide">
                    {t("cart.emailAddress")} *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("cart.enterEmail")}
                      {...field}
                      data-testid="input-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t("cart.orderSummary")}
              </label>
              <Textarea
                value={productsSummary}
                readOnly
                rows={6}
                className="bg-muted/50 resize-none text-sm"
                data-testid="textarea-products-summary"
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold uppercase tracking-wide">
                    {t("cart.additionalNotes")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("cart.notesPlaceholder")}
                      rows={3}
                      {...field}
                      data-testid="textarea-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4 mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t("cart.totalItems")}:</span>
                <span className="font-medium" data-testid="text-item-count">
                  {items.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">{t("cart.estimatedTotal")}:</span>
                <span className="font-bold text-xl text-primary" data-testid="text-total">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full min-h-[48px]"
              disabled={isSubmitting || items.length === 0}
              data-testid="button-send-quotation"
            >
              <span className="flex items-center justify-center min-w-[200px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin flex-shrink-0" />
                    <span>{t("cart.submitting")}</span>
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span>{t("cart.submitQuotation")}</span>
                  </>
                )}
              </span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
