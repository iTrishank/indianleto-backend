import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { z } from "zod";
import { useCart } from "@/contexts/CartContext";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, productsSummary, clearCart, total } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

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
        title: "Cart is empty",
        description: "Please add items to your cart before submitting a quotation.",
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
          title: "Error",
          description: response.message || "Failed to submit quotation. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quotation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="sticky top-24" data-testid="quotation-form">
      <CardHeader>
        <CardTitle className="text-xl">Request Quotation</CardTitle>
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
                    Full Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
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
                    Phone Number *
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
                    Email Address *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
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
                Products Summary
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
                    Additional Notes (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requirements, packaging preferences, etc."
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
                <span className="text-muted-foreground">Items:</span>
                <span className="font-medium" data-testid="text-item-count">
                  {items.length} product(s)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Estimated Total:</span>
                <span className="font-bold text-xl text-primary" data-testid="text-total">
                  INR{total.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting || items.length === 0}
              data-testid="button-send-quotation"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Quotation Request
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
