# VoucherTrade Developer Guide

## Quick Start

Welcome to the VoucherTrade development team! This guide will help you get started quickly.

### 1. Project Setup

```bash
# Clone and navigate to the project
cd vouchers-main

# Install dependencies
pnpm install

# Setup database
pnpm prisma migrate dev

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

---

## Key Documentation Files

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Project overview and features |
| [DOCUMENTATION.md](./DOCUMENTATION.md) | **Complete technical documentation** (architecture, setup, components) |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | **API reference guide** (endpoints, request/response formats) |
| [PAYSHAP_INTEGRATION.md](./PAYSHAP_INTEGRATION.md) | Payment gateway setup instructions |
| [SECURITY_AUDIT_REPORT.md](./SECURITY_AUDIT_REPORT.md) | Security considerations and audit findings |

**Start here**: Read [DOCUMENTATION.md](./DOCUMENTATION.md) for a complete understanding of the project.

---

## Project Structure Quick Reference

```
src/
├── app/                    # Next.js pages and API routes
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout with context providers
│   ├── api/               # API endpoints
│   └── [feature]/         # Feature pages
├── components/            # Reusable React components
├── context/               # Global state (Auth, Cart)
└── lib/                   # Utilities and config

Key files:
- context/auth-context.tsx       ← User authentication
- context/cart-context.tsx       ← Shopping cart
- lib/prisma.ts                  ← Database client
- lib/utils.ts                   ← Common utilities
```

---

## Development Workflow

### 1. Adding a New Feature

```
1. Choose an appropriate folder (pages, components, api, etc.)
2. Follow existing patterns and naming conventions
3. Add JSDoc comments to functions and components
4. Test thoroughly
5. Create a pull request with description
```

### 2. Code Style

**File Naming**
- Components: PascalCase (e.g., `VoucherCard.tsx`)
- Utilities: camelCase (e.g., `priceCalculator.ts`)
- Pages: kebab-case (e.g., `voucher-card.tsx`)

**Component Structure**
```typescript
/**
 * ComponentName Component
 * Brief description of what this component does.
 * 
 * @component
 * @param {ComponentProps} props
 * @returns {JSX.Element}
 */
interface ComponentProps {
  /** Prop description */
  propName: string
}

export function ComponentName({ propName }: ComponentProps) {
  return <div>{propName}</div>
}
```

**API Route Structure**
```typescript
/**
 * API Route Description
 * 
 * POST /api/endpoint
 * Description of what this endpoint does.
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Implementation
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Message' }, { status: 500 })
  }
}
```

### 3. Database Changes

```bash
# Create a migration
pnpm prisma migrate dev --name add_feature

# Sync schema without migration (development)
pnpm db:push

# View database
pnpm prisma studio
```

### 4. Testing

```bash
# Run linter
pnpm lint

# Build for production
pnpm build

# Start production server
pnpm start
```

---

## Common Tasks

### Adding a New Component

1. Create file in `components/`
2. Export as named export
3. Add JSDoc comments
4. Use in pages

```typescript
// components/my-component.tsx
export function MyComponent({ prop }: Props) {
  return <div>{prop}</div>
}

// In a page use it
import { MyComponent } from "@/components/my-component"
```

### Adding a New Page

1. Create folder in `app/`
2. Add `page.tsx` inside
3. Include metadata for SEO

```typescript
// app/my-feature/page.tsx
export const metadata = {
  title: 'Feature | VoucherTrade',
  description: 'Page description'
}

export default function FeaturePage() {
  return <div>{/* Content */}</div>
}
```

### Adding an API Endpoint

1. Create folder structure in `app/api/`
2. Add `route.ts` file
3. Implement GET/POST/PUT/DELETE handlers

```typescript
// app/api/feature/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    // Process data
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
```

### Using Authentication in a Component

```typescript
"use client"
import { useAuth } from "@/context/auth-context"

export default function MyComponent() {
  const { isSignedIn, userType, userEmail } = useAuth()
  
  if (!isSignedIn) {
    return <div>Please log in</div>
  }
  
  return <div>Welcome, {userEmail}!</div>
}
```

### Using Cart in a Component

```typescript
"use client"
import { useCart } from "@/context/cart-context"

export default function CartComponent() {
  const { cart, addToCart, getCartTotal } = useCart()
  
  return (
    <div>
      {cart.length} items
      Total: R{getCartTotal()}
    </div>
  )
}
```

### Connecting to Database

```typescript
import { prisma } from '@/lib/prisma'

// In an API route
export async function GET(request: NextRequest) {
  const users = await prisma.user.findMany()
  return NextResponse.json(users)
}

// In a component (server component)
async function getData() {
  const vouchers = await prisma.voucher.findMany()
  return vouchers
}
```

---

## Pricing Model

Always remember the three-tier pricing:

```
Face Value: R1000
↓
Buyer Price: 90% = R900
↓
Platform Takes: 20% = R200
↓
Seller Gets: 70% = R700
```

Calculation helper (already implemented):
```typescript
const faceValue = 1000
const buyerPrice = faceValue * 0.9   // 900
const sellerPayout = faceValue * 0.7 // 700
const platformFee = faceValue * 0.2  // 200
```

---

## Performance Tips

1. **Use Next.js Image Component**: Don't use `<img>` for images
2. **Lazy Load Components**: Use React.lazy() for heavy components
3. **Cache API Calls**: Use SWR or React Query if needed
4. **Optimize Database Queries**: Use Prisma select to only fetch needed fields
5. **Code Splitting**: Pages are automatically code-split

```typescript
// ✅ Good
import Image from 'next/image'
<Image src="..." alt="..." width={100} height={100} />

// ❌ Avoid
<img src="..." alt="..." />
```

---

## Security Checklist

Before deploying:
- [ ] All API routes validate input
- [ ] Sensitive data not logged to console
- [ ] Passwords hashed with bcrypt
- [ ] CORS headers configured
- [ ] Environment variables are not in code
- [ ] SQL injection protected (using Prisma ORM)
- [ ] XSS protection enabled (React default)
- [ ] Rate limiting configured

---

## Debugging Tips

### View Database
```bash
pnpm prisma studio
```

### Check Environment Variables
Create `.env.local`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/db
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Debug API Routes
Use `console.log()` - appears in terminal:
```typescript
export async function POST(req: NextRequest) {
  console.log('Request received:', await req.json())
  // ...
}
```

### React DevTools
- Install React DevTools browser extension
- View component tree and props
- Profile performance

---

## Common Issues and Solutions

### Issue: "useAuth must be used within AuthProvider"
**Solution**: Ensure component is wrapped with `<AuthProvider>` (in layout.tsx)

### Issue: Cart not persisting
**Solution**: Check localStorage is enabled. Chrome DevTools → Application → Local Storage

### Issue: Database connection error
**Solution**: Check DATABASE_URL in .env.local matches your DB

### Issue: Images not loading
**Solution**: Add image domain to next.config.mjs, or use relative URLs

### Issue: Tailwind styles not applied
**Solution**: Ensure class names are in source files (not created dynamically)

---

## Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm lint             # Run linter
pnpm build            # Build for production
pnpm start            # Run production build

# Database
pnpm db:push          # Sync schema without migration
pnpm prisma migrate dev  # Create and run migration
pnpm prisma studio    # Open database UI

# Testing
pnpm dev-webpack      # Use webpack instead of Turbopack
```

---

## External Services

### Payment Gateway (PayShap)
- Docs: See [PAYSHAP_INTEGRATION.md](./PAYSHAP_INTEGRATION.md)
- Implementation: See `lib/payshap.ts`

### Email Service
- Recommended: SendGrid, Mailgun, or AWS SES
- Not yet implemented

### Image Storage
- Recommended: Cloudinary, imgix, or AWS S3
- Currently using relative URLs

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## Getting Help

1. **Check Documentation**: Read relevant docs first
2. **Search Issues**: Look for similar problems on GitHub
3. **Ask Team**: Post in team chat or create discussion
4. **Debug**: Use browser/server dev tools

---

## Contributing Guidelines

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/my-feature`
3. **Make changes** following code style guide
4. **Test thoroughly**
5. **Commit with clear messages**: `git commit -m "Add feature description"`
6. **Push and create pull request**
7. **Address review feedback**

---

## Code Review Checklist

Before submitting PR, ensure:
- [ ] Code follows style guide
- [ ] All functions have JSDoc comments
- [ ] No console.log() left in production code
- [ ] No hardcoded secrets/credentials
- [ ] Tests pass (if applicable)
- [ ] Documentation updated
- [ ] No breaking changes to existing features
- [ ] Performance considerations addressed

---

## Team Contacts

- **Project Lead**: [Email]
- **Tech Lead**: [Email]
- **Database Admin**: [Email]

---

**Last Updated**: February 10, 2026  
**Version**: 1.0.0

*Welcome to the team! Happy coding! 🚀*
