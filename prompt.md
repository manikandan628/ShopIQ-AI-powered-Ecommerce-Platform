You are an expert full-stack developer, UI/UX designer, and AI engineer 
specializing in premium ecommerce platforms. Build a complete, 
production-ready ecommerce web application.

## Tech Stack
- Frontend: React (Vite), Redux Toolkit, Axios, Framer Motion, Tailwind CSS
- Backend: Spring Boot (Java), Spring Security, JPA, MySQL, JWT
- AI: Groq is already there API for shopping assistant
- Cache: Redis (for product and session caching)
- Storage: Cloudinary (for product image uploads)
- Email: JavaMailSender (order confirmations)

## New Features to Add (Beyond Basics)

### 🔍 Smart Search
- Debounced live search (300ms delay)
- Search suggestions dropdown as user types
- Recent searches saved in localStorage
- Search by name, category, brand, tags

### 🎨 Theme System
- Light and dark mode toggle
- Persisted in localStorage
- Smooth theme transition (300ms)
- All components fully themed

### 📊 Product Intelligence
- "Frequently Bought Together" section
- "You May Also Like" AI-powered section
- Recently Viewed Products (stored in Redux)
- Stock indicator (In Stock / Low Stock / Out of Stock)
- Price drop badge (Show % discount vs original price)

### ⭐ Reviews System
- Star rating input component
- Submit review form (rating + comment)
- Display reviews with avatar, date, verified badge
- Average rating breakdown (5★ 4★ 3★ bar chart)
- AI review summary (1 paragraph, extracted from all reviews)

### 🏷️ Promotions
- Coupon code input at checkout
- Flash sale countdown timer on product cards
- "Limited Offer" badge with expiry
- Free shipping threshold indicator in cart

### 👤 User Profile Page
- Edit name, email, avatar
- Change password section
- Address book (save multiple addresses)
- Order history with re-order button

### 📦 Order Tracking
- Order status timeline UI
  (Placed → Confirmed → Shipped → Out for Delivery → Delivered)
- Estimated delivery date display
- Cancel order option (if status is PLACED)

### 🛡️ Admin Dashboard (Basic)
- Product CRUD (add, edit, delete)
- Order management (update status)
- Basic sales stats (total orders, revenue, top products)
- Protected by ROLE_ADMIN JWT claim

### 📱 PWA Support
- manifest.json
- Service worker for offline product browsing
- Install to home screen prompt

### 🔔 Notifications
- Toast notifications (success, error, info)
- "Added to cart" micro-animation on button
- "Item saved to wishlist" toast
- Order placed confirmation screen with animation

## Pages to Build
1. Homepage — hero, scroll storytelling, featured products, 
   flash sale banner
2. Product Listing — grid, search, filters, sort, pagination
3. Product Detail — zoom, AI rec, reviews, frequently bought together
4. AI Chat — ChatGPT-style, structured card responses, 
   chat history saved
5. Cart Drawer — slide-in, quantity, coupon, free shipping bar
6. Checkout — 3 steps: Address → Payment → Confirmation
7. Auth — Login/Register, glassmorphism, social login UI (Google)
8. Wishlist — heart toggle, shareable wishlist page
9. Orders — timeline, status, re-order, cancel
10. Profile — edit info, address book, avatar upload
11. Admin Dashboard — product/order management, stats

## Design Rules
- Minimalist luxury (Apple + Asphalte inspired)
- Dark neutral base: #0A0A0A, #111, #1A1A1A
- Accent color: single brand color (default: warm white #F5F0E8)
- Smooth animations: 300–500ms Framer Motion only
- Skeleton loaders on every data-fetching component
- Product card hover: scale(1.03) + soft shadow
- Page transitions: fade + slide up
- Sticky navbar with blur backdrop
- Section reveals on scroll (Framer Motion viewport trigger)
- Mobile-first, fully responsive
- Custom scrollbar styling
- Inter or Plus Jakarta Sans font

## Backend Requirements

### Security
- JWT access token (15 min) + refresh token (7 days)
- Role-based access: ROLE_USER, ROLE_ADMIN
- Rate limiting on auth endpoints
- Password strength validation
- CORS configured per environment

### APIs
- Auth: register, login, refresh, logout
- Products: CRUD, search, filter, paginate, by category
- Cart: add, remove, update quantity, clear
- Orders: place, list, get by id, cancel, update status (admin)
- Wishlist: add, remove, list
- Reviews: submit, list by product, average rating
- AI: chat endpoint with product context injection
- Coupons: validate, apply
- Admin: dashboard stats, product management, order management
- Profile: get, update, change password, upload avatar

### Data & Performance
- DTOs for all responses (never expose JPA entities)
- Global exception handler → structured JSON errors
- Input validation with @Valid and custom messages
- Redis caching on product listing and detail
- Pagination on all list endpoints (page, size, sort)
- Soft delete on products and orders
- Audit fields: createdAt, updatedAt on all entities

### Email
- Order confirmation email (HTML template)
- Password reset email with token link
- Shipping update notification

## AI Assistant Rules
- Respond ONLY in structured JSON
- Response types: recommendations, comparison, 
  filter, summary, message
- Each product card: id, name, price, rating, 
  image, tag, reason, stockStatus
- Maintain conversation history in context 
  (last 6 messages)
- Inject current product catalog summary into 
  every AI system prompt
- Tone: premium, concise, personal stylist
- Fallback gracefully if API fails

## AI Response Schema
{
  "type": "recommendations|comparison|filter|summary|message",
  "message": "Max 20 words intro",
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 149,
      "originalPrice": 199,
      "rating": 4.7,
      "image": "url",
      "tag": "Best Value|Premium Pick|Most Popular|On Sale",
      "reason": "One sentence why",
      "stockStatus": "in_stock|low_stock|out_of_stock"
    }
  ],
  "verdict": "Only for comparison type",
  "followUp": ["Suggested next question 1", "Suggested next question 2"]
}

## Database Schema (MySQL)
Tables to include:
- users (id, name, email, password, role, avatar, createdAt)
- addresses (id, userId, label, street, city, state, zip, isDefault)
- products (id, name, description, price, originalPrice, 
  category, brand, stock, images JSON, tags JSON, 
  isActive, createdAt)
- reviews (id, productId, userId, rating, comment, 
  isVerified, createdAt)
- orders (id, userId, status, total, addressId, 
  couponCode, discount, createdAt)
- order_items (id, orderId, productId, quantity, price)
- cart_items (id, userId, productId, quantity)
- wishlist (id, userId, productId)
- coupons (id, code, discount, type, minOrder, 
  expiresAt, isActive)
- refresh_tokens (id, userId, token, expiresAt)

## Code Rules
- Every file includes full path as first comment
- No TODOs, no placeholders, working code only
- All imports included
- Redux slices: cart, wishlist, auth, ui (theme, notifications)
- Axios interceptor: attach JWT, handle 401 refresh
- All routes lazy loaded with Suspense + skeleton fallback
- useMemo and useCallback where appropriate
- Custom hooks: useDebounce, useIntersection, useLocalStorage
- Error boundaries on page level
- PropTypes or TypeScript interfaces on all components

## Output Order
1. Full project structure tree (frontend + backend)
2. MySQL schema SQL
3. Backend: entities → DTOs → repositories → 
   services → controllers → security config
4. Frontend: store → slices → axios → 
   hooks → components → pages
5. AI integration: service + chat component
6. PWA files: manifest.json + service worker
7. Environment variable templates (.env.example)
8. README with setup instructions