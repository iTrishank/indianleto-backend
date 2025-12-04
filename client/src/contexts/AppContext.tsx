import { createContext, useContext, useState, useCallback, useMemo, useRef, type ReactNode } from "react";
import textData from "@/data/textData.json";
import { getProductImage } from "@/lib/products";
import type { Product } from "@shared/schema";

type Language = "en" | "es" | "hi" | "ru";

interface Currency {
  code: string;
  symbol: string;
  flag: string;
  rate: number;
}

interface ProductData {
  title: Record<Language, string>;
  description: Record<Language, string>;
  color: Record<Language, string>;
  sku: string;
  minOrder: number;
  sizeMinOrders?: Record<string, number>;
  imagePaths: string[];
  priceTiers: { minQty: number; maxQty: number | null; price: number }[];
  sizes: string[];
  sizeMeasurements: Record<string, { skirtLength: number; bust: number; waist: number; hips: number }>;
}

interface TranslatedProduct extends Omit<Product, 'images' | 'hasPromo'> {
  images: string[];
  hasPromo?: boolean;
  sizeMinOrders?: Record<string, number>;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (currencyCode: string) => void;
  t: (key: string) => string;
  formatPrice: (priceInINR: number) => string;
  currencies: Currency[];
  languages: typeof textData.languages;
  products: TranslatedProduct[];
  ui: typeof textData.ui;
  getColor: (productId: string) => string;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [currencyCode, setCurrencyCode] = useState<string>("INR");
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currencies = useMemo(() => {
    return Object.values(textData.currencies).sort((a, b) => 
      a.code.localeCompare(b.code)
    );
  }, []);

  const currency = useMemo(() => {
    return textData.currencies[currencyCode as keyof typeof textData.currencies] || textData.currencies.INR;
  }, [currencyCode]);

  const setLanguage = useCallback((lang: Language) => {
    setIsLoading(true);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setLanguageState(lang);
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  const setCurrency = useCallback((code: string) => {
    setIsLoading(true);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setCurrencyCode(code);
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split(".");
    let value: unknown = textData.translations[language];
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    
    return typeof value === "string" ? value : key;
  }, [language]);

  const getColor = useCallback((productId: string): string => {
    const productData = textData.products[productId as keyof typeof textData.products] as ProductData | undefined;
    if (productData?.color) {
      return productData.color[language] || productData.color.en;
    }
    return productId;
  }, [language]);

  const formatPrice = useCallback((priceInINR: number): string => {
    const convertedPrice = priceInINR * currency.rate;
    const formatted = convertedPrice.toFixed(2);
    return `${currency.symbol}${formatted}`;
  }, [currency]);

  const products = useMemo((): TranslatedProduct[] => {
    const productIds = Object.keys(textData.products) as Array<keyof typeof textData.products>;
    
    return productIds.map((productId) => {
      const productData = textData.products[productId] as ProductData;
      
      return {
        id: productId,
        title: productData.title[language] || productData.title.en,
        description: productData.description[language] || productData.description.en,
        images: productData.imagePaths.map(img => getProductImage(img)),
        priceTiers: productData.priceTiers,
        attributes: {
          color: productData.color[language] || productData.color.en,
          sizes: productData.sizes,
          measurements: productData.sizeMeasurements
        },
        minOrder: productData.minOrder,
        sizeMinOrders: productData.sizeMinOrders,
        sku: productData.sku,
        hasPromo: true
      };
    });
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    currency,
    setCurrency,
    t,
    formatPrice,
    currencies,
    languages: textData.languages,
    products,
    ui: textData.ui,
    getColor,
    isLoading,
  }), [language, setLanguage, currency, setCurrency, t, formatPrice, currencies, products, getColor, isLoading]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
