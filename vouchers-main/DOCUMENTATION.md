# VoucherTrade - Technical Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Core Features](#core-features)
6. [State Management](#state-management)
7. [API Endpoints](#api-endpoints)
8. [Database Models](#database-models)
9. [Development Guide](#development-guide)
10. [Key Components](#key-components)

---

## Project Overview

**VoucherTrade** is a full-stack Next.js application for a South African digital voucher and gift card trading platform. It enables:
- **Buyers** to purchase unwanted vouchers at 10% discount
- **Sellers** to upload vouchers and receive 70% of face value
- **Admins** to verify and approve vouchers

### Key Metrics
- **Minimum Voucher Value**: R500
- **Buyer Discount**: 10% (pay 90% of face value)
- **Seller Payout**: 70% of face value
- **Platform Fee**: 20% (difference between buyer payment and seller payout)

---

## Architecture

### Frontend Architecture
```
User Interface (TSX Components)
         ↓
    Context (State)
    ├── AuthContext (User auth state)
    └── CartContext (Shopping cart)
         ↓
    API Routes (Next.js)
         ↓
    Prisma ORM
         ↓
    Database
```

### Data Flow

1. **Authentication Flow**
   - User registers/logs in via Auth components
   - Credentials sent to `/api/auth/login` or `/api/auth/register`
   - AuthContext stores user state and email
   - Protected pages check authentication status

2. **Purchase Flow**
   - User browses vouchers (hydrated from `/api/vouchers`)
   - Adds items to cart (CartContext with localStorage persistence)
   - Proceeds to checkout
   - Creates order via `/api/orders`
   - Redirected to payment processing

3. **Seller Upload Flow**
   - Seller navigates to `/upload`
   - Fills form with voucher details
   - Automatic price calculations displayed
   - Submits to `/api/vouchers/upload` 
   - Awaits admin verification

---

## Technology Stack

### Frontend
- **Next.js 15+** - React framework with server/client components
- **React 19** - UI library with hooks
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Unstyled, accessible component library
- **React Hook Form** - Form state management
- **date-fns** - Date utilities

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma** - ORM for database operations
- **bcryptjs** - Password hashing
- **NextAuth** (optional) - Advanced auth if needed

### Database
- **PostgreSQL** (recommended) or compatible DB
- **Prisma Client** - ORM

### Development
- **pnpm** - Package manager
- **ESLint** - Code linting
- **TypeScript** - Type checking

---

## Project Structure

```
vouchers-main/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout wrapper
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   │
│   ├── api/                     # API routes
│   │   ├── auth/
│   │   │   ├── login/route.ts   # User login endpoint
│   │   │   └── register/route.ts # User registration
│   │   ├── vouchers/
│   │   │   ├── route.ts         # Get all approved vouchers
│   │   │   ├── [id]/route.ts    # Get single voucher
│   │   │   ├── upload/route.ts  # Upload new voucher
│   │   │   └── retailer/[name]/ # Retailer-specific endpoint
│   │   ├── orders/route.ts      # Create/manage orders
│   │   ├── user/
│   │   │   ├── vouchers/route.ts # User's vouchers
│   │   │   ├── sales/route.ts    # User's sales stats
│   │   │   ├── payouts/route.ts  # User's payout info
│   │   │   └── stats/route.ts    # User dashboard stats
│   │   └── admin/
│   │       └── vouchers/route.ts # Admin verification
│   │
│   ├── auth/                    # Auth pages
│   │   ├── login/page.tsx       # Login form page
│   │   └── register/page.tsx    # Registration form page
│   │
│   ├── vouchers/                # Voucher browsing
│   │   ├── page.tsx             # Voucher listing page
│   │   └── retailer/[name]/     # Filter by retailer
│   │
│   ├── voucher/[id]/page.tsx    # Single voucher detail page
│   ├── upload/page.tsx          # Seller upload form
│   ├── dashboard/page.tsx       # User dashboard
│   ├── admin/page.tsx           # Admin verification dashboard
│   ├── cart/page.tsx            # Shopping cart page
│   ├── checkout/                # Checkout flow
│   │   ├── [voucherId]/page.tsx # Single checkout
│   │   └── cart/page.tsx        # Cart checkout
│   └── payment/                 # Payment result pages
│       ├── success/page.tsx
│       ├── failed/page.tsx
│       └── process/page.tsx
│
├── components/                  # Reusable React components
│   ├── navbar.tsx              # Navigation bar
│   ├── footer.tsx              # Footer component
│   ├── voucher-card.tsx        # Voucher display card
│   ├── price-breakdown.tsx     # Pricing display
│   ├── verified-badge.tsx      # Verification badge
│   ├── stats-grid.tsx          # Dashboard stats grid
│   ├── form-field.tsx          # Form field wrapper
│   ├── filter-sidebar.tsx      # Filtering UI
│   ├── toast.tsx               # Toast notifications
│   └── theme-provider.tsx      # Theme configuration
│
├── context/                    # React Context (State)
│   ├── auth-context.tsx       # Authentication state
│   └── cart-context.tsx       # Shopping cart state
│
├── lib/                       # Utility functions and config
│   ├── prisma.ts             # Prisma client singleton
│   ├── utils.ts              # Common utilities (cn function)
│   └── payshap.ts            # Payment gateway integration
│
├── data/                      # Static data
│   ├── vouchers.json         # Sample voucher data
│   └── categories.json       # Voucher categories
│
├── public/                    # Static assets
│   └── logos/                # Brand logos
│
├── styles/                    # CSS (if needed)
│   └── globals.css           # Already in app/
│
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── next.config.mjs          # Next.js configuration
├── prisma/
│   └── schema.prisma        # Database schema (see parent)
└── README.md                # Project overview
```

---

## Core Features

### 1. **User Authentication**
- Location: `app/api/auth/*`, `context/auth-context.tsx`
- Role-based: Buyer or Seller
- State: Managed in AuthContext
- Storage: Session-based (can be extended to JWT/NextAuth)

### 2. **Voucher Browsing**
- Location: `app/vouchers/page.tsx`
- Displays grid of approved vouchers
- Filter by retailer/category
- Shows pricing breakdown (10% discount for buyers)

### 3. **Shopping Cart**
- Location: `context/cart-context.tsx`
- Persistent storage via localStorage
- Add/remove/update quantities
- Calculates totals

### 4. **Seller Upload**
- Location: `app/upload/page.tsx`
- Form with automatic pricing calculations
- Submits to `/api/vouchers/upload`
- Awaits admin approval

### 5. **User Dashboard**
- Location: `app/dashboard/page.tsx`
- Shows user's vouchers (buyers) or uploaded vouchers (sellers)
- Sales/payout information for sellers
- Statistics and transaction history

### 6. **Admin Panel**
- Location: `app/admin/page.tsx`
- Verification queue for new vouchers
- Approve/reject functionality
- Batched operations

### 7. **Payment Integration**
- Location: `lib/payshap.ts`
- PayShap payment gateway integration
- Success/failure/processing pages
- Order creation and management

---

## State Management

### AuthContext
```typescript
interface AuthContextType {
  isSignedIn: boolean           // Authentication status
  userType: "buyer" | "seller"  // User role
  userEmail: string | null      // User email
  signIn(email, type): void     // Login
  signOut(): void               // Logout
}
```

**Usage**:
```typescript
const { isSignedIn, userType, userEmail, signIn, signOut } = useAuth()
```

### CartContext
```typescript
interface CartItem {
  id: number              // Voucher ID
  brand: string          // Brand name
  logo: string           // Logo URL
  category: string       // Category
  faceValue: number      // Original value
  buyerPrice: number     // 90% of face value
  expiryDate: string     // ISO date
  quantity: number       // Cart quantity
}

interface CartContextType {
  cart: CartItem[]
  addToCart(item): void
  removeFromCart(id): void
  updateQuantity(id, qty): void
  clearCart(): void
  getCartTotal(): number
  getCartCount(): number
}
```

**Usage**:
```typescript
const { cart, addToCart, removeFromCart } = useCart()
```

**Persistence**: Uses `localStorage` key `vouchertrade_cart`

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/register` | Register new user |

### Vouchers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vouchers` | List all approved vouchers |
| GET | `/api/vouchers/[id]` | Get single voucher details |
| POST | `/api/vouchers/upload` | Upload new voucher (sellers) |
| GET | `/api/vouchers/retailer/[name]` | Filter by retailer |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/vouchers` | Get user's vouchers |
| GET | `/api/user/sales` | Get sales statistics |
| GET | `/api/user/payouts` | Get payout information |
| GET | `/api/user/stats` | Get dashboard statistics |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/vouchers` | List pending vouchers |
| POST | `/api/admin/vouchers/[id]` | Approve/reject voucher |

---

## Database Models

### User
```prisma
model User {
  id          Int     @id @default(autoincrement())
  email       String  @unique
  password    String  // bcrypt hash
  role        String  // "buyer" | "seller" | "admin"
  createdAt   DateTime @default(now())
  
  // Relations
  vouchers    Voucher[]
  orders      Order[]
  payouts     Payout[]
}
```

### Voucher
```prisma
model Voucher {
  id          Int     @id @default(autoincrement())
  brand       String
  logo        String
  category    String
  faceValue   Int
  status      String  // "PENDING" | "APPROVED" | "REJECTED"
  expiryDate  DateTime
  createdAt   DateTime @default(now())
  
  // Relations
  sellerId    Int
  seller      User @relation(fields: [sellerId], references: [id])
  orders      Order[]
}
```

### Order
```prisma
model Order {
  id          Int     @id @default(autoincrement())
  totalAmount Int
  status      String  // "PENDING" | "COMPLETE" | "FAILED"
  createdAt   DateTime @default(now())
  
  // Relations
  buyerId     Int
  buyer       User @relation(fields: [buyerId], references: [id])
  voucherId   Int
  voucher     Voucher @relation(fields: [voucherId], references: [id])
}
```

### Payout
```prisma
model Payout {
  id          Int     @id @default(autoincrement())
  amount      Int
  status      String  // "PENDING" | "PROCESSED"
  createdAt   DateTime @default(now())
  
  // Relations
  sellerId    Int
  seller      User @relation(fields: [sellerId], references: [id])
}
```

---

## Development Guide

### Setup
```bash
# Install dependencies
pnpm install

# Setup database
pnpm prisma migrate dev
pnpm db:push

# Run development server
pnpm dev
```

### Key NPM Scripts
```json
{
  "dev": "next dev",                    // Start dev server
  "build": "next build",                // Build for production
  "start": "next start",                // Start production server
  "lint": "eslint .",                   // Run linter
  "db:push": "prisma db push"           // Sync database schema
}
```

### Code Style
- **TypeScript**: Strict mode enabled
- **Formatting**: Follow existing patterns
- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS with custom utilities in `lib/utils.ts`

### Adding New Features

#### 1. New API Endpoint
```typescript
// app/api/feature/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Implementation
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Error message' }, { status: 500 })
  }
}
```

#### 2. New Component
```typescript
// components/feature.tsx
/**
 * FeatureName Component
 * 
 * Description of what this component does.
 * 
 * @component
 * @param {FeatureProps} props - Component props
 * @returns {JSX.Element} Description of return
 */

interface FeatureProps {
  /** Prop description */
  prop1: string
  /** Optional prop */
  prop2?: boolean
}

export function Feature({ prop1, prop2 = false }: FeatureProps) {
  return <div>{/* JSX */}</div>
}
```

#### 3. New Page
```typescript
// app/feature/page.tsx
/**
 * Feature Page
 * 
 * Page description
 */

export const metadata = {
  title: 'Feature | VoucherTrade',
  description: 'Page description'
}

export default function FeaturePage() {
  return <div>{/* Page content */}</div>
}
```

---

## Key Components

### Navigation (`components/navbar.tsx`)
- Sticky navigation bar with VoucherTrade branding
- Authentication-aware: Shows different UI for logged-in/out users
- Cart icon with item count badge (buyers only)
- Responsive design (hidden on mobile)

### Voucher Card (`components/voucher-card.tsx`)
- Displays voucher with brand, pricing, and expiry
- Two layouts: Compact (for grids) and Full (for featured)
- Shows 10% discount savings
- Links to detail page

### Price Breakdown (`components/price-breakdown.tsx`)
- Shows the three-tier pricing:
  - Face Value: Original voucher value
  - Buyer Price: 90% of face value
  - Seller Payout: 70% of face value
- Educational component to explain economics

### Form Field (`components/form-field.tsx`)
- Wrapper for consistent form styling
- Built-in support for labels, errors, hints
- Shows required field indicator
- Used throughout the app for forms

### Stats Grid (`components/stats-grid.tsx`)
- Displays key metrics in a responsive grid
- Supports 2, 3, or 4 columns
- Color-coded values (primary, success, warning, danger)
- Used in dashboards

### Theme Provider (`components/theme-provider.tsx`)
- Sets up light/dark theme support
- Uses Tailwind CSS variables
- Applies to entire application

### Toast (`components/toast.tsx`)
- Non-intrusive notification system
- Used for success/error/info messages
- Auto-dismisses after timeout

### Verified Badge (`components/verified-badge.tsx`)
- Shows checkmark with "Verified" text
- Three sizes: sm, md, lg
- Optional text label
- Builds trust with users

---

## Performance Optimizations

1. **Lazy Loading**: Images use Next.js Image component
2. **Code Splitting**: Pages are code-split automatically
3. **LocalStorage**: Cart persists without database writes
4. **Static Data**: Categories and sample vouchers from JSON
5. **Caching**: Voucher listings can be cached (consider SWR)

---

## Security Considerations

1. **Password Hashing**: Uses bcryptjs for secure password storage
2. **API Routes**: Use server-side validation
3. **CORS**: Check environment-specific CORS policies
4. **SQL Injection**: Protected via Prisma ORM
5. **XSS Protection**: React escapes JSX by default
6. **CSRF**: Add CSRF tokens for state-changing operations

---

## Deployment

### Environment Variables
```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=http://localhost:3000
PAYSHAP_API_KEY=...
PAYSHAP_SECRET=...
```

### Vercel Deployment
```bash
# One-click deployment to Vercel
pnpm install
pnpm build
# Push to GitHub, connect to Vercel
```

---

## Troubleshooting

### Issue: Prisma Connection Errors
- Check `DATABASE_URL` is correct
- Run `pnpm prisma db push`
- Clear `.next` cache

### Issue: Cart Not Persisting
- Check localStorage is enabled
- Verify `vouchertrade_cart` key in DevTools
- Check CartProvider wraps app

### Issue: Images Not Loading
- Verify logo URLs are accessible
- Check Next.js Image domain config
- Use proper Image component

### Issue: Styles Not Applied
- Ensure Tailwind CSS is configured
- Check `globals.css` imports
- Verify class name syntax

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)

---

## Contributing

When contributing to this project:
1. Follow the existing code style
2. Add JSDoc comments to new functions
3. Update this documentation
4. Test thoroughly before submitting
5. Keep components focused and reusable

---

*Last updated: February 10, 2026*
