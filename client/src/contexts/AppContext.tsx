import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect, type ReactNode } from "react";
import textData from "@/data/textData.json";
import productsData from "@/data/products.json";
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
  images: string[];
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
  setIsLoading: (loading: boolean) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  currencyLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_PRIMARY_COLOR = "#000000";
const CACHE_DURATION = 10 * 60 * 1000;
const BASE_CURRENCY = "inr";

const CURRENCY_META: Record<string, { symbol: string; flag: string }> = {
  AED: { symbol: "AED", flag: "ae" },
  AUD: { symbol: "A$", flag: "au" },
  BGN: { symbol: "BGN", flag: "bg" },
  BHD: { symbol: "BHD", flag: "bh" },
  BRL: { symbol: "R$", flag: "br" },
  BSD: { symbol: "BSD", flag: "bs" },
  CAD: { symbol: "CA$", flag: "ca" },
  CHF: { symbol: "CHF", flag: "ch" },
  CLP: { symbol: "CLP", flag: "cl" },
  CNY: { symbol: "CN¥", flag: "cn" },
  COP: { symbol: "COP", flag: "co" },
  CRC: { symbol: "CRC", flag: "cr" },
  CZK: { symbol: "CZK", flag: "cz" },
  DKK: { symbol: "DKK", flag: "dk" },
  EUR: { symbol: "€", flag: "eu" },
  GBP: { symbol: "£", flag: "gb" },
  GHS: { symbol: "GHS", flag: "gh" },
  HKD: { symbol: "HK$", flag: "hk" },
  ILS: { symbol: "₪", flag: "il" },
  INR: { symbol: "₹", flag: "in" },
  ISK: { symbol: "ISK", flag: "is" },
  JPY: { symbol: "¥", flag: "jp" },
  KRW: { symbol: "₩", flag: "kr" },
  KWD: { symbol: "KWD", flag: "kw" },
  LKR: { symbol: "LKR", flag: "lk" },
  MAD: { symbol: "MAD", flag: "ma" },
  MKD: { symbol: "MKD", flag: "mk" },
  MVR: { symbol: "MVR", flag: "mv" },
  MXN: { symbol: "MX$", flag: "mx" },
  NGN: { symbol: "NGN", flag: "ng" },
  NOK: { symbol: "NOK", flag: "no" },
  NZD: { symbol: "NZ$", flag: "nz" },
  PHP: { symbol: "₱", flag: "ph" },
  PLN: { symbol: "PLN", flag: "pl" },
  RON: { symbol: "RON", flag: "ro" },
  RUB: { symbol: "₽", flag: "ru" },
  SAR: { symbol: "SAR", flag: "sa" },
  SCR: { symbol: "SCR", flag: "sc" },
  SEK: { symbol: "SEK", flag: "se" },
  SGD: { symbol: "SGD", flag: "sg" },
  THB: { symbol: "THB", flag: "th" },
  TTD: { symbol: "TTD", flag: "tt" },
  USD: { symbol: "$", flag: "us" },
  XCD: { symbol: "EC$", flag: "ag" },
  ZAR: { symbol: "ZAR", flag: "za" },
};

interface CacheEntry {
  rates: Record<string, number>;
  timestamp: number;
}

let ratesCache: CacheEntry | null = null;

async function fetchCurrencyRates(): Promise<Record<string, number>> {
  if (ratesCache && Date.now() - ratesCache.timestamp < CACHE_DURATION) {
    return ratesCache.rates;
  }

  const primaryUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${BASE_CURRENCY}.json`;
  const fallbackUrl = `https://latest.currency-api.pages.dev/v1/currencies/${BASE_CURRENCY}.json`;

  try {
    const response = await fetch(primaryUrl);
    if (!response.ok) throw new Error("Primary API failed");
    const data = await response.json();
    const rates = data[BASE_CURRENCY] || {};
    ratesCache = { rates, timestamp: Date.now() };
    return rates;
  } catch {
    try {
      const response = await fetch(fallbackUrl);
      if (!response.ok) throw new Error("Fallback API failed");
      const data = await response.json();
      const rates = data[BASE_CURRENCY] || {};
      ratesCache = { rates, timestamp: Date.now() };
      return rates;
    } catch {
      if (ratesCache) {
        return ratesCache.rates;
      }
      return { inr: 1 };
    }
  }
}

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
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const [primaryColor, setPrimaryColorState] = useState<string>(DEFAULT_PRIMARY_COLOR);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ inr: 1 });
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCurrencyLoading(true);
    fetchCurrencyRates()
      .then(rates => {
        setExchangeRates(rates);
      })
      .finally(() => {
        setCurrencyLoading(false);
      });
  }, []);

  const setPrimaryColor = useCallback((color: string) => {
    setPrimaryColorState(color);
    const hsl = hexToHSL(color);
    document.documentElement.style.setProperty('--primary', hsl);
  }, []);

  useEffect(() => {
    const hsl = hexToHSL(primaryColor);
    document.documentElement.style.setProperty('--primary', hsl);
  }, []);

  const currencies = useMemo((): Currency[] => {
    return Object.entries(CURRENCY_META)
      .map(([code, meta]) => ({
        code,
        symbol: meta.symbol,
        flag: meta.flag,
        rate: exchangeRates[code.toLowerCase()] || 1,
      }))
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [exchangeRates]);

  const currency = useMemo((): Currency => {
    const meta = CURRENCY_META[currencyCode] || CURRENCY_META.INR;
    return {
      code: currencyCode,
      symbol: meta.symbol,
      flag: meta.flag,
      rate: exchangeRates[currencyCode.toLowerCase()] || 1,
    };
  }, [currencyCode, exchangeRates]);

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
    const productData = productsData.products[productId as keyof typeof productsData.products] as ProductData | undefined;
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
    const productIds = Object.keys(productsData.products) as Array<keyof typeof productsData.products>;
    
    return productIds.map((productId) => {
      const productData = productsData.products[productId] as ProductData;
      
      return {
        id: productId,
        title: productData.title[language] || productData.title.en,
        description: productData.description[language] || productData.description.en,
        images: productData.images.map(img => getProductImage(img)),
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
    setIsLoading,
    primaryColor,
    setPrimaryColor,
    currencyLoading,
  }), [language, setLanguage, currency, setCurrency, t, formatPrice, currencies, products, getColor, isLoading, primaryColor, setPrimaryColor, currencyLoading]);

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
