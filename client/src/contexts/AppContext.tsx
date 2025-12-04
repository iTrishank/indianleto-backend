import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect, type ReactNode } from "react";
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
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_PRIMARY_COLOR = "#ec4899";

function hexToHSL(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [currencyCode, setCurrencyCode] = useState<string>("INR");
  const [isLoading, setIsLoading] = useState(false);
  const [primaryColor, setPrimaryColorState] = useState<string>(DEFAULT_PRIMARY_COLOR);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setPrimaryColor = useCallback((color: string) => {
    setPrimaryColorState(color);
    const hsl = hexToHSL(color);
    document.documentElement.style.setProperty('--primary', hsl);
  }, []);

  useEffect(() => {
    const hsl = hexToHSL(primaryColor);
    document.documentElement.style.setProperty('--primary', hsl);
  }, []);

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
    primaryColor,
    setPrimaryColor,
  }), [language, setLanguage, currency, setCurrency, t, formatPrice, currencies, products, getColor, isLoading, primaryColor, setPrimaryColor]);

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
