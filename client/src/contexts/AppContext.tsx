import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import textData from "@/data/textData.json";

type Language = "en" | "es" | "hi" | "ru";

interface Currency {
  code: string;
  symbol: string;
  flag: string;
  rate: number;
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
  products: typeof textData.products;
  ui: typeof textData.ui;
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

  const formatPrice = useCallback((priceInINR: number): string => {
    const convertedPrice = priceInINR * currency.rate;
    const formatted = convertedPrice.toFixed(2);
    return `${currency.symbol}${formatted}`;
  }, [currency]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    currency,
    setCurrency,
    t,
    formatPrice,
    currencies,
    languages: textData.languages,
    products: textData.products,
    ui: textData.ui,
  }), [language, setLanguage, currency, setCurrency, t, formatPrice, currencies]);

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
