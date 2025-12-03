# IndianLeto B2B Fashion Catalog

## Overview

IndianLeto is a B2B wholesale fashion catalog platform built as a single-page React application. The system enables wholesale buyers to browse fashion products, select items with size/color variants, add them to a cart, and submit quotation requests without requiring user authentication. Cart data persists in localStorage, and quotation submissions are sent to Google Sheets for business processing.

The application serves as a streamlined quotation request system rather than a traditional e-commerce checkout flow, optimized for B2B wholesale interactions where pricing varies by quantity tiers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript via Vite build system

**UI Component Library**: Radix UI primitives with shadcn/ui styling patterns
- Uses "new-york" style variant from shadcn/ui
- Extensive use of Radix primitives (Dialog, Popover, Select, Toast, etc.)
- Custom-themed components following design guidelines

**Styling Strategy**: Tailwind CSS with CSS custom properties for theming
- Design system based on HSL color values with CSS variables
- Responsive-first approach (mobile → tablet → desktop)
- Typography system using Inter font family from Google Fonts
- Spacing primitives following 4px base unit rhythm

**State Management**:
- React Context API for cart state (`CartContext`)
- TanStack Query (React Query) for server state management
- LocalStorage for cart persistence across sessions
- React Hook Form with Zod validation for form handling

**Routing**: Wouter (lightweight client-side routing)
- Main routes: Catalog (`/`), Product (`/product/:id`), Cart (`/cart`), Thanks (`/thanks`)
- No authentication guards required

**UI Features**:
- **Product Grid**: 5 items per row with 200px × 200px product boxes and pagination (25 items per page)
- **Swipable Images**: Product cards use Embla Carousel for touch/drag swipe support on images
- **Language Dropdown**: English, Espanish, Hindi, Russian (sorted alphabetically)
- **Currency Dropdown**: 44+ currencies with flag icons from flagcdn.com
- **Filters**: Color and Price sorting (Size filter removed)

**Key Architectural Decisions**:
- **No authentication system**: Designed for anonymous B2B browsing and quotation submission
- **LocalStorage cart**: Cart data stored client-side to avoid server session complexity
- **Static product catalog**: Products defined in `client/src/lib/products.ts` rather than fetched from database
- **Component composition**: Heavy use of compound components pattern (e.g., Card, Form, Dialog)

### Backend Architecture

**Runtime**: Node.js with Express framework

**Build System**: 
- esbuild for server bundling (production)
- tsx for development with hot reload
- Vite for client bundling

**API Design**: RESTful JSON endpoints
- `POST /api/quote`: Submit quotation request
- `GET /api/quote/:quoteId`: Retrieve quotation details
- No authentication middleware

**Data Flow**:
1. Client submits quotation form with cart items + customer details
2. Server validates using Zod schemas from `shared/schema.ts`
3. Server generates unique quote ID (format: `IL-{timestamp}-{uuid}`)
4. Data written to Google Sheets via Google Sheets API
5. Response sent back with quote ID for customer reference

**Key Architectural Decisions**:
- **Shared schema validation**: Zod schemas in `shared/` directory used by both client and server
- **Memory storage with sheet sync**: In-memory Map for quotations with async Google Sheets integration
- **No database dependency**: Quotations stored directly in Google Sheets, avoiding database setup complexity
- **Stateless API**: No session management, each request is independent

### Data Schema

**Product Model** (TypeScript + Zod):
- Tiered pricing structure (min/max quantity → price)
- Size measurements per variant
- Multi-image support
- SKU tracking

**Cart Model**:
- Product ID + variant (size/color) as composite key
- Dynamic unit price calculation based on quantity tier
- Cart stored as JSON array in localStorage

**Quotation Model**:
- Customer information (name, phone, email)
- Cart snapshot with calculated prices
- Optional notes field
- Generated quote ID and timestamp

### External Dependencies

**Google Sheets Integration**:
- Authentication via Replit Connectors system (OAuth 2.0)
- API: Google Sheets API v4 via `googleapis` npm package
- Purpose: Quotation storage and business workflow management
- Access token management with automatic refresh

**Replit-Specific Services**:
- Replit Connectors for Google Sheets OAuth
- Environment variables: `REPL_IDENTITY`, `WEB_REPL_RENEWAL`, `REPLIT_CONNECTORS_HOSTNAME`
- Development tools: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`

**CDN Services**:
- Google Fonts CDN for Inter typography
- Static assets served from `attached_assets/` directory

**Database**: 
- Drizzle ORM configured with PostgreSQL dialect
- Schema defined in `shared/schema.ts`
- Connection via `@neondatabase/serverless` (Neon serverless Postgres)
- Note: Database appears configured but not actively used for quotations (Google Sheets used instead)

**Form Validation**:
- Zod schemas for runtime validation
- `@hookform/resolvers` for React Hook Form integration
- `zod-validation-error` for user-friendly error messages

**Image Assets**:
- Static images stored in `attached_assets/` directory
- Vite alias `@assets` for asset imports
- Lazy loading implemented for product images