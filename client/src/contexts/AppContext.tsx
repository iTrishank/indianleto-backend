import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
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

interface TranslatedProduct extends Omit<Product, 'images' | 'hasPromo'> {
  images: string[];
  hasPromo?: boolean;
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
  getColor: (colorKey: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [currencyCode, setCurrencyCode] = useState<string>("INR");

  const currencies = useMemo(() => {
    return Object.values(textData.currencies).sort((a, b) => 
      a.code.localeCompare(b.code)
    );
  }, []);

  const currency = useMemo(() => {
    return textData.currencies[currencyCode as keyof typeof textData.currencies] || textData.currencies.INR;
  }, [currencyCode]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const setCurrency = useCallback((code: string) => {
    setCurrencyCode(code);
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

  const getColor = useCallback((colorKey: string): string => {
    const colors = textData.colors[language as keyof typeof textData.colors];
    return colors?.[colorKey as keyof typeof colors] || colorKey;
  }, [language]);

  const formatPrice = useCallback((priceInINR: number): string => {
    const convertedPrice = priceInINR * currency.rate;
    const formatted = convertedPrice.toFixed(2);
    return `${currency.symbol}${formatted}`;
  }, [currency]);

  const products = useMemo((): TranslatedProduct[] => {
    const translations = textData.translations[language]?.products || {};
    
    return textData.products.map((rawProduct) => {
      const productTranslation = translations[rawProduct.translationKey as keyof typeof translations] as { title: string; description: string } | undefined;
      const translatedColor = getColor(rawProduct.attributes.colorKey);
      
      return {
        id: rawProduct.id,
        title: productTranslation?.title || rawProduct.translationKey,
        description: productTranslation?.description || "",
        images: rawProduct.images.map(img => getProductImage(img)),
        priceTiers: rawProduct.priceTiers,
        attributes: {
          color: translatedColor,
          sizes: rawProduct.attributes.sizes,
          measurements: rawProduct.attributes.measurements
        },
        minOrder: rawProduct.minOrder,
        sku: rawProduct.sku,
        hasPromo: true
      };
    });
  }, [language, getColor]);

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
  }), [language, setLanguage, currency, setCurrency, t, formatPrice, currencies, products, getColor]);

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
