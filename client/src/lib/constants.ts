export interface Language {
  code: string;
  name: string;
}

export interface Currency {
  code: string;
  symbol: string;
  flag: string;
}

export const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Espanish" },
  { code: "hi", name: "Hindi" },
  { code: "ru", name: "Russian" },
];

export const currencies: Currency[] = [
  { code: "AED", symbol: "AED", flag: "ae" },
  { code: "AUD", symbol: "A$", flag: "au" },
  { code: "BGN", symbol: "BGN", flag: "bg" },
  { code: "BHD", symbol: "BHD", flag: "bh" },
  { code: "BRL", symbol: "R$", flag: "br" },
  { code: "BSD", symbol: "BSD", flag: "bs" },
  { code: "CAD", symbol: "CA$", flag: "ca" },
  { code: "CHF", symbol: "CHF", flag: "ch" },
  { code: "CLP", symbol: "CLP", flag: "cl" },
  { code: "CNY", symbol: "CN¥", flag: "cn" },
  { code: "COP", symbol: "COP", flag: "co" },
  { code: "CRC", symbol: "CRC", flag: "cr" },
  { code: "CZK", symbol: "CZK", flag: "cz" },
  { code: "DKK", symbol: "DKK", flag: "dk" },
  { code: "EUR", symbol: "€", flag: "eu" },
  { code: "GBP", symbol: "£", flag: "gb" },
  { code: "GHS", symbol: "GHS", flag: "gh" },
  { code: "HKD", symbol: "HK$", flag: "hk" },
  { code: "ILS", symbol: "₪", flag: "il" },
  { code: "INR", symbol: "₹", flag: "in" },
  { code: "ISK", symbol: "ISK", flag: "is" },
  { code: "JPY", symbol: "¥", flag: "jp" },
  { code: "KRW", symbol: "₩", flag: "kr" },
  { code: "KWD", symbol: "KWD", flag: "kw" },
  { code: "LKR", symbol: "LKR", flag: "lk" },
  { code: "MAD", symbol: "MAD", flag: "ma" },
  { code: "MKD", symbol: "MKD", flag: "mk" },
  { code: "MVR", symbol: "MVR", flag: "mv" },
  { code: "MXN", symbol: "MX$", flag: "mx" },
  { code: "NGN", symbol: "NGN", flag: "ng" },
  { code: "NOK", symbol: "NOK", flag: "no" },
  { code: "NZD", symbol: "NZ$", flag: "nz" },
  { code: "PHP", symbol: "₱", flag: "ph" },
  { code: "PLN", symbol: "PLN", flag: "pl" },
  { code: "RON", symbol: "RON", flag: "ro" },
  { code: "RUB", symbol: "Rubles", flag: "ru" },
  { code: "SAR", symbol: "SAR", flag: "sa" },
  { code: "SCR", symbol: "SCR", flag: "sc" },
  { code: "SEK", symbol: "SEK", flag: "se" },
  { code: "SGD", symbol: "SGD", flag: "sg" },
  { code: "THB", symbol: "THB", flag: "th" },
  { code: "TTD", symbol: "TTD", flag: "tt" },
  { code: "USD", symbol: "$", flag: "us" },
  { code: "XCD", symbol: "EC$", flag: "ag" },
  { code: "ZAR", symbol: "ZAR", flag: "za" },
];

export const ITEMS_PER_PAGE = 25;
export const GRID_COLUMNS = 5;
export const ITEM_SIZE = 280;
export const ITEM_SIZE_TABLET = 220;
export const ITEM_SIZE_MOBILE = 160;
export const CONTAINER_MAX_WIDTH = "1440px";
export const CONTAINER_PADDING = {
  mobile: "1rem",
  tablet: "1.5rem", 
  desktop: "2rem"
};
