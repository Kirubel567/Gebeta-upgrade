# Gebeta Full-Stack Upgrade Plan

> **Document Version:** 1.0  
> **Created:** January 1, 2026  
> **Project:** Gebeta Review – Campus Food Discovery Platform  
> **Current Stack:** Static HTML + CSS  
> **Target Stack:** JavaScript → React → Node.js → Database

---

## 1. Current Codebase Audit

### 1.1 HTML Files Inventory

| File | Purpose | Lines | Key Sections |
|------|---------|-------|--------------|
| `index.html` | **Home/Landing Page** | 204 | Hero section, Features grid, Featured businesses showcase |
| `reviews.html` | **Reviews Listing Page** | 209 | Filter bar, Trending sections (On-Campus, Delivery, Off-Campus) |
| `delivery.html` | **Delivery Services Page** | 358 | Filter bar, Hero section, Top 5 deliveries, Reviews section |
| `about.html` | **About & Business Listing** | 144 | About section, Image gallery, Business submission form |
| `submitReviews.html` | **Review Submission Page** | 165 | Place info, Rating selector, Review form, Recent reviews sidebar |
| `customerReview.html` | **Business Detail Page** | 421 | Business details, Menu grid, Customer reviews list |

### 1.2 Reusable UI Blocks Identified

#### **Global Components (Duplicated Across All Pages)**

| Component | Location | Duplication Count | Notes |
|-----------|----------|-------------------|-------|
| **Navbar** | All 6 HTML files | 6 times | Identical structure with only `active` class changing |
| **Footer** | All 6 HTML files | 6 times | Completely identical across all pages |
| **Hamburger Menu** | All navbars | 6 times | No JavaScript functionality currently |

#### **Page-Specific Components**

| Component | Used In | Description |
|-----------|---------|-------------|
| **Hero Section** | `index.html`, `delivery.html` | Large image + content + CTA buttons |
| **Feature Card** | `index.html` | Pill-shaped cards with icon, title, description |
| **Business Card** | `index.html`, `customerReview.html` | Image wrapper + overlay title + review snippet + button |
| **Filter Bar** | `reviews.html`, `delivery.html` | Pill-shaped toggle buttons with search icon |
| **Rating Stars** | Multiple pages | Star icons (solid/half/empty) + review count |
| **Review Item** | `delivery.html`, `submitReviews.html`, `customerReview.html` | Reviewer image + info + rating + body text |
| **Menu Item Card** | `customerReview.html` | Food image + price tag + name + rating |
| **Form Card** | `about.html`, `submitReviews.html` | Styled form container with labeled inputs |
| **Main Card + Peek Card** | `reviews.html`, `customerReview.html` | Trending item showcase with slide preview |
| **Gallery Item** | `about.html` | Background image divs with labels |
| **Delivery Card** | `delivery.html` | Service card with rating, location, features |
| **Section Title** | All pages | Unified `h2.section-title` styling |
| **Divider** | All pages | Horizontal line separator |

### 1.3 CSS Architecture Analysis

```
assets/css/
├── main.css           # Entry point with @imports + responsive overrides
├── base/
│   ├── reset.css      # CSS reset + base element styles
│   └── variables.css  # CSS custom properties (colors, fonts, spacing)
├── layout/
│   ├── header.css     # Navbar + hamburger + mobile nav
│   ├── footer.css     # Footer columns + social icons
│   └── layout.css     # Container + utilities (.text-green, .script-font)
├── components/
│   └── button.css     # .btn, .btn-primary, .btn-outline
└── pages/
    ├── home.css       # Hero, features grid, business cards
    ├── reviewsDelivery.css  # Filter bar, hero grid, reviews list
    ├── submitReview.css     # Submit form layout, rating selector
    └── about.css      # About section, gallery, form section
```

#### **CSS Design Token Summary**

```css
/* Colors */
--primary-bg: #050A30       /* Deep navy background */
--secondary-bg: #252953     /* Card/section background */
--accent-green: #39FF14     /* Neon green accent */
--text-white: #ffffff
--text-grey: #cccccc

/* Fonts */
--font-main: 'Poppins'      /* Body text */
--font-heading: 'Poppins'   /* Headings (bold weights) */
--font-script: 'Pacifico'   /* Logo/accent font */
--font-desc: 'Roboto'       /* Description text */

/* Sizing */
--border-radius-btn: 54px
--border-radius-card: 12px
--container-width: 1200px
```

### 1.4 Duplicated CSS Patterns

| Pattern | Files | Issue |
|---------|-------|-------|
| `.rating-stars` styling | `reviewsDelivery.css` | Also used inline with `style` attributes |
| Inline `style` attributes | All 6 HTML files | ~50+ inline styles breaking DRY principle |
| Card hover effects | `home.css`, `reviewsDelivery.css` | Similar patterns could be unified |
| Form input styling | `about.css` | Should be a reusable component |

### 1.5 Missing Interactivity (JavaScript Needed)

| Feature | File(s) | Current State | Required Functionality |
|---------|---------|---------------|------------------------|
| **Hamburger Menu** | All pages | Static, non-functional | Toggle mobile nav visibility |
| **Filter Bar Tabs** | `reviews.html`, `delivery.html` | Static `.active` class | Tab switching, content filtering |
| **Rating Selector** | `submitReviews.html` | Empty star icons | Click-to-rate interaction |
| **Form Submission** | `about.html`, `submitReviews.html` | No action handler | Validation + API submission |
| **Search Functionality** | `reviews.html`, `delivery.html` | Search icon only, no input | Search modal/input expansion |
| **"See More" / "Read More"** | Multiple pages | Static buttons | Expand truncated content or navigate |
| **Peek Card Navigation** | `reviews.html` | Arrow icon only | Carousel/slide to next item |
| **Menu Price Display** | `customerReview.html` | Inline styled | Dynamic from data |
| **Business Card Actions** | `index.html` | "See More" buttons | Navigate to business detail page |

---

## 2. Phase 1 – Vanilla JavaScript Integration

### 2.1 Global Scripts (All Pages)

#### **Hamburger Menu Toggle** (`js/navbar.js`)

```
DOM Manipulation Targets:
├── .hamburger (button element)
├── .menu-div (nav links container)
├── .hamburger-top, .hamburger-middle, .hamburger-bottom (spans)

Event Listeners:
├── click → .hamburger
├── click → document (close on outside click)
├── resize → window (reset on desktop breakpoint)

Implementation Tasks:
☐ Toggle .active class on .menu-div
☐ Animate hamburger → X transformation
☐ Prevent body scroll when menu open
☐ Close menu when nav link clicked
```

---

### 2.2 Page-Specific Scripts

#### **index.html** – Home Page

| Feature | DOM Targets | Events | Logic |
|---------|-------------|--------|-------|
| Business card "See More" | `.business-card .btn-outline` | click | Navigate to `/customerReview.html?id={business_id}` |
| Hero button scroll | `.btn-primary` (Explore) | click | Smooth scroll to featured section |

```
Checklist:
☐ Add data-id attributes to business cards
☐ Event delegation on .businesses-grid
☐ Smooth scroll polyfill for older browsers
```

---

#### **reviews.html** – Reviews Page

| Feature | DOM Targets | Events | Logic |
|---------|-------------|--------|-------|
| Filter tabs | `.filter-btn` (3 buttons) | click | Toggle active state, filter content |
| Search expansion | `.search-icon-btn` | click | Show search input or modal |
| Peek card navigation | `.peek-card`, `.peek-arrow` | click | Navigate or trigger carousel |

```
Checklist:
☐ Filter content by category (On-Campus/Delivery/Off-Campus)
☐ Active tab state management
☐ Animate content transitions
☐ Search input with debounced filtering
```

---

#### **delivery.html** – Delivery Page

| Feature | DOM Targets | Events | Logic |
|---------|-------------|--------|-------|
| Filter tabs | `.filter-btn` (3 buttons) | click | Filter by Fast/Low Fee/Top Rated |
| Delivery card "Explore" | `.business-card .btn-outline` | click | Navigate to delivery detail |
| Order button | `.btn-primary` (Order) | click | Redirect to ordering flow |

```
Checklist:
☐ Sorting algorithm for delivery cards
☐ Animate card reordering
☐ Load more pagination (if content grows)
```

---

#### **about.html** – About Page

| Feature | DOM Targets | Events | Logic |
|---------|-------------|--------|-------|
| Form validation | `form`, `input[required]`, `textarea` | submit, input | Client-side validation |
| Form submission | `form` | submit | Prevent default, collect data, POST to API |

```
Checklist:
☐ Required field validation
☐ Business name format validation
☐ Location format validation  
☐ Description length limits
☐ Success/error feedback UI
☐ Loading state on submit button
```

---

#### **submitReviews.html** – Submit Review Page

| Feature | DOM Targets | Events | Logic |
|---------|-------------|--------|-------|
| Star rating selector | `.rating-select i` (5 star icons) | click, hover | Visual feedback + store value |
| Character counter | `textarea#experience` | input | Show remaining/used characters |
| Form submission | `.btn-primary` (Post) | click | Validate + submit review |
| "Read More" expansion | `.btn-outline` (Read More) | click | Expand truncated review text |

```
Checklist:
☐ Hover preview on stars
☐ Click to set rating (1-5)
☐ Store rating value in hidden input or state
☐ Textarea character limit (e.g., 500 chars)
☐ Expand/collapse review bodies
☐ Optimistic UI for new review
```

---

#### **customerReview.html** – Business Detail Page

| Feature | DOM Targets | Events | Logic |
|---------|-------------|--------|-------|
| Review button | `.btn-primary` (Review) | click | Navigate to submit review |
| Full menu button | `.btn-outline` (Full Menu) | click | Expand or navigate to full menu |
| Image gallery | `.peek-card > div` (mini images) | click | Lightbox or image zoom |

```
Checklist:
☐ Dynamic business data loading (from URL params)
☐ Menu item grid pagination or infinite scroll
☐ Review sorting (newest, highest rated)
☐ Lightbox for gallery images
```

---

### 2.3 Shared Utility Functions (`js/utils.js`)

```javascript
// Proposed utilities:
☐ formatDate(date) - Format review dates
☐ truncateText(text, length) - Truncate long reviews
☐ debounce(fn, delay) - Search input optimization
☐ fetchData(endpoint) - Wrapper for fetch API
☐ showToast(message, type) - Notification system
☐ validateEmail(email) - Email validation
☐ generateStars(rating) - Render star icons from number
```

---

## 3. Phase 2 – React Migration Plan

### 3.1 Component Hierarchy

```
src/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Button.jsx
│   │   ├── Divider.jsx
│   │   ├── SectionTitle.jsx
│   │   ├── RatingStars.jsx
│   │   ├── FilterBar.jsx
│   │   ├── SearchInput.jsx
│   │   └── LoadingSpinner.jsx
│   │
│   ├── cards/
│   │   ├── BusinessCard.jsx
│   │   ├── FeatureCard.jsx
│   │   ├── ReviewCard.jsx
│   │   ├── MenuItem Card.jsx
│   │   ├── DeliveryCard.jsx
│   │   └── MainPeekCard.jsx
│   │
│   ├── forms/
│   │   ├── BusinessForm.jsx
│   │   ├── ReviewForm.jsx
│   │   ├── StarRatingInput.jsx
│   │   └── TextInput.jsx
│   │
│   └── sections/
│       ├── HeroSection.jsx
│       ├── FeaturesGrid.jsx
│       ├── BusinessesGrid.jsx
│       ├── ReviewsList.jsx
│       ├── MenuGrid.jsx
│       ├── AboutSection.jsx
│       └── GalleryGrid.jsx
│
├── pages/
│   ├── HomePage.jsx
│   ├── ReviewsPage.jsx
│   ├── DeliveryPage.jsx
│   ├── AboutPage.jsx
│   ├── SubmitReviewPage.jsx
│   ├── BusinessDetailPage.jsx
│   └── NotFoundPage.jsx
│
├── layouts/
│   └── MainLayout.jsx       # Wraps pages with Navbar + Footer
│
├── hooks/
│   ├── useBusinesses.js
│   ├── useReviews.js
│   ├── useDeliveries.js
│   └── useForm.js
│
├── context/
│   ├── AuthContext.jsx
│   └── FilterContext.jsx
│
├── services/
│   ├── api.js              # Axios instance + interceptors
│   ├── businessService.js
│   ├── reviewService.js
│   └── deliveryService.js
│
├── utils/
│   ├── formatters.js
│   └── validators.js
│
├── styles/
│   ├── variables.css       # CSS custom properties
│   ├── globals.css         # Reset + base styles
│   └── components/         # Component-specific CSS modules
│
├── App.jsx
└── main.jsx
```

### 3.2 Page-by-Page Component Breakdown

#### **HomePage.jsx**

```jsx
Components Required:
├── HeroSection
│   ├── Props: title, description, image, buttons[]
│   └── State: none
├── FeaturesGrid
│   └── FeatureCard × 3
│       └── Props: icon, title, description, isHighlight
├── BusinessesGrid
│   └── BusinessCard × N (from API)
│       └── Props: id, image, name, review, author, onViewMore

State Management:
├── featuredBusinesses: Business[] (from API)
└── isLoading: boolean
```

---

#### **ReviewsPage.jsx**

```jsx
Components Required:
├── FilterBar
│   ├── Props: filters[], activeFilter, onFilterChange
│   └── State: (lifted to page)
├── MainPeekCard (for each category)
│   ├── Props: mainItem, peekItem, category
│   └── State: none

State Management:
├── activeCategory: 'on-campus' | 'delivery' | 'off-campus'
├── trendingItems: { onCampus: [], delivery: [], offCampus: [] }
└── isLoading: boolean
```

---

#### **DeliveryPage.jsx**

```jsx
Components Required:
├── FilterBar
│   └── Props: filters (Fast/Low Fee/Top Rated)
├── HeroSection
│   └── Delivery-specific content
├── DeliveryCard × 5
│   └── Props: id, name, rating, reviewCount, locations[], features[], orderTime
├── ReviewsList
│   └── ReviewCard × N

State Management:
├── sortBy: 'fast' | 'low-fee' | 'top-rated'
├── deliveries: Delivery[]
├── reviews: Review[]
└── isLoading: boolean
```

---

#### **AboutPage.jsx**

```jsx
Components Required:
├── AboutSection
│   ├── Props: none (static content)
│   └── Children: GalleryGrid
├── GalleryGrid
│   └── Props: images[] with labels
├── BusinessForm
│   ├── Props: onSubmit
│   └── State: formData, errors, isSubmitting

State Management:
├── formData: { businessName, location, description }
├── errors: { field: message }
└── isSubmitting: boolean
```

---

#### **SubmitReviewPage.jsx**

```jsx
Components Required:
├── PlaceInfo
│   └── Props: image, name, location (from URL params/API)
├── ReviewForm
│   ├── StarRatingInput
│   │   └── Props: value, onChange
│   │   └── State: hoverValue
│   └── TextInput (textarea)
├── RecentReviews (sidebar)
│   └── ReviewCard × N
│       └── Props: reviewer, rating, body, hasReadMore

State Management:
├── selectedPlace: Place (from route params)
├── rating: number (1-5)
├── reviewText: string
├── recentReviews: Review[]
└── isSubmitting: boolean
```

---

#### **BusinessDetailPage.jsx (customerReview)**

```jsx
Route: /business/:id

Components Required:
├── MainPeekCard (business gallery)
├── MenuGrid
│   └── MenuItemCard × N
│       └── Props: id, image, name, price, rating, reviewCount
├── ReviewsList
│   └── ReviewCard × N

State Management:
├── business: Business (from API by ID)
├── menuItems: MenuItem[]
├── reviews: Review[]
├── activeTab: 'menu' | 'reviews' (optional)
└── isLoading: boolean
```

---

### 3.3 Props & State Summary Table

| Component | Props | Local State | Context/API |
|-----------|-------|-------------|-------------|
| `Navbar` | currentPage | mobileMenuOpen | - |
| `FilterBar` | filters, active, onChange | - | FilterContext |
| `RatingStars` | rating, size, showCount | - | - |
| `StarRatingInput` | value, onChange | hoverValue | - |
| `BusinessCard` | businessData, onAction | - | - |
| `ReviewCard` | reviewData, truncated | isExpanded | - |
| `ReviewForm` | placeId, onSuccess | rating, text, errors | AuthContext |
| `BusinessForm` | onSuccess | formData, errors | - |

---

## 4. Phase 3 – Backend Node.js Design

### 4.1 Technology Stack

```
Runtime:      Node.js (v20 LTS)
Framework:    Native Node.js HTTP module (no external framework)
Database:     MongoDB (Mongoose ODM) OR PostgreSQL (Prisma ORM)
Auth:         JWT (jsonwebtoken) + bcrypt
Environment:  dotenv
Logging:      Custom logger or Pino
CORS:         Custom middleware
```

> **Why Native Node.js HTTP?**
> - No external framework dependencies
> - Full control over request/response handling
> - Lightweight and minimal overhead
> - Better understanding of how HTTP works
> - Built-in `http` and `https` modules
> - Easy to add custom routing logic

### 4.2 REST API Endpoint Design

#### **Businesses API**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/businesses` | List all businesses (paginated) | No |
| GET | `/api/businesses/:id` | Get business by ID with menu + reviews | No |
| GET | `/api/businesses/featured` | Get featured/top businesses | No |
| GET | `/api/businesses/category/:category` | Filter by on-campus/delivery/off-campus | No |
| POST | `/api/businesses` | Create new business listing | Yes (Admin) |
| PUT | `/api/businesses/:id` | Update business | Yes (Admin) |
| DELETE | `/api/businesses/:id` | Delete business | Yes (Admin) |

```
Query Parameters:
├── page (default: 1)
├── limit (default: 10)
├── category (on-campus, delivery, off-campus)
├── sort (rating, newest, name)
└── search (fuzzy name search)
```

---

#### **Reviews API**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/reviews` | List all reviews (paginated) | No |
| GET | `/api/reviews/business/:businessId` | Get reviews for a business | No |
| GET | `/api/reviews/recent` | Get most recent reviews | No |
| POST | `/api/reviews` | Create new review | Yes (User) |
| PUT | `/api/reviews/:id` | Update own review | Yes (Owner) |
| DELETE | `/api/reviews/:id` | Delete own review | Yes (Owner/Admin) |

```
Request Body (POST):
{
  "businessId": "ObjectId",
  "rating": 1-5,
  "body": "string (max 500 chars)"
}
```

---

#### **Deliveries API**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/deliveries` | List delivery services | No |
| GET | `/api/deliveries/top` | Get top 5 rated deliveries | No |
| GET | `/api/deliveries/:id` | Get delivery details | No |
| POST | `/api/deliveries` | Add delivery service | Yes (Admin) |

```
Query Parameters:
├── sort (fast, low-fee, top-rated)
├── location (5k, 6k, 4k)
└── available (boolean)
```

---

#### **Menu Items API**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/menu/:businessId` | Get menu for business | No |
| GET | `/api/menu/:businessId/top` | Get top-rated menu items | No |
| POST | `/api/menu` | Add menu item | Yes (Admin) |
| PUT | `/api/menu/:id` | Update menu item | Yes (Admin) |
| DELETE | `/api/menu/:id` | Delete menu item | Yes (Admin) |

---

#### **Users API (Future)**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/logout` | User logout | Yes |
| GET | `/api/users/me` | Get current user profile | Yes |
| PUT | `/api/users/me` | Update profile | Yes |
| GET | `/api/users/:id/reviews` | Get user's reviews | No |

---

#### **Business Applications API**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/applications` | Submit business application | No |
| GET | `/api/applications` | List all applications | Yes (Admin) |
| PUT | `/api/applications/:id/approve` | Approve application | Yes (Admin) |
| PUT | `/api/applications/:id/reject` | Reject application | Yes (Admin) |

---

### 4.3 Native Node.js HTTP Server Setup

```javascript
// server.js - Native Node.js HTTP setup
import http from 'http';
import { URL } from 'url';
import { config } from 'dotenv';

config(); // Load environment variables

// Custom Router
class Router {
  constructor() {
    this.routes = { GET: {}, POST: {}, PUT: {}, DELETE: {} };
  }

  get(path, handler) { this.routes.GET[path] = handler; }
  post(path, handler) { this.routes.POST[path] = handler; }
  put(path, handler) { this.routes.PUT[path] = handler; }
  delete(path, handler) { this.routes.DELETE[path] = handler; }

  async handle(req, res) {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const method = req.method;
    const handler = this.routes[method]?.[pathname];
    
    if (handler) {
      await handler(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  }
}

// Middleware helpers
const cors = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
};

const parseBody = (req) => new Promise((resolve, reject) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      resolve(body ? JSON.parse(body) : {});
    } catch (e) {
      reject(new Error('Invalid JSON'));
    }
  });
});

const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

// Authentication middleware
const authenticate = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  const token = authHeader.split(' ')[1];
  // Verify JWT token here
  return { userId: 'decoded-user-id' };
};

// Create server
const router = new Router();
const server = http.createServer(async (req, res) => {
  cors(req, res);
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }
  
  try {
    await router.handle(req, res);
  } catch (error) {
    sendJSON(res, 500, { error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

### 4.4 Backend Folder Structure (Native Node.js)

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js           # MongoDB/PostgreSQL connection
│   │   ├── cloudinary.js         # File upload config
│   │   └── env.js                # Environment variables
│   │
│   ├── lib/
│   │   ├── Router.js             # Custom router class
│   │   ├── middleware.js         # CORS, auth, body parser
│   │   └── response.js           # JSON response helpers
│   │
│   ├── modules/                  # Feature-based structure
│   │   ├── business/
│   │   │   ├── business.controller.js
│   │   │   ├── business.service.js
│   │   │   └── business.routes.js
│   │   │
│   │   ├── review/
│   │   │   ├── review.controller.js
│   │   │   ├── review.service.js
│   │   │   └── review.routes.js
│   │   │
│   │   ├── delivery/
│   │   │   └── ...
│   │   │
│   │   ├── menu/
│   │   │   └── ...
│   │   │
│   │   ├── user/
│   │   │   └── ...
│   │   │
│   │   └── application/
│   │       └── ...
│   │
│   ├── models/
│   │   ├── index.js
│   │   ├── Business.js
│   │   ├── Review.js
│   │   ├── Delivery.js
│   │   ├── MenuItem.js
│   │   ├── User.js
│   │   └── Application.js
│   │
│   ├── utils/
│   │   ├── ApiError.js           # Custom error class
│   │   ├── ApiResponse.js        # Standard response format
│   │   ├── logger.js             # Console/file logging
│   │   └── helpers.js            # General utilities
│   │
│   └── app.js                    # Main application setup
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── .env.example
├── .gitignore
├── package.json
└── server.js                     # Entry point (http.createServer)
```

---

## 5. Phase 4 – Database Schema Design

### 5.1 MongoDB Schema Definitions

#### **Users Collection**

```javascript
const UserSchema = new Schema({
  // Identity
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String, default: null },
  
  // University Info
  university: { type: String, default: 'AAU' },
  dormitory: { type: String },  // 4K, 5K, 6K
  yearOfStudy: { type: String }, // Freshman, 2nd Year, etc.
  
  // Roles & Status
  role: { 
    type: String, 
    enum: ['user', 'admin', 'business_owner'],
    default: 'user'
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual for review count
UserSchema.virtual('reviewCount', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'user',
  count: true
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ university: 1, dormitory: 1 });
```

---

#### **Businesses Collection**

```javascript
const BusinessSchema = new Schema({
  // Basic Info
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String, maxLength: 1000 },
  
  // Categorization
  category: {
    type: String,
    enum: ['on-campus', 'off-campus', 'delivery'],
    required: true
  },
  tags: [{ type: String }], // e.g., 'fast-food', 'cafe', 'ethiopian'
  
  // Location
  location: {
    address: { type: String },
    dormitories: [{ type: String }], // ['5K', '6K', '4K']
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Media
  images: [{
    url: { type: String, required: true },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false }
  }],
  
  // Business Hours
  hours: {
    openTime: { type: String }, // "08:00"
    closeTime: { type: String }, // "18:00"
    closedDays: [{ type: String }] // ['Sunday']
  },
  
  // Contact
  contact: {
    phone: String,
    telegram: String,
    instagram: String
  },
  
  // Features (for filtering)
  features: {
    hasDelivery: { type: Boolean, default: false },
    isGroupFriendly: { type: Boolean, default: false },
    priceRange: { 
      type: String, 
      enum: ['$', '$$', '$$$'],
      default: '$$'
    }
  },
  
  // Ratings (denormalized for performance)
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  
  // Status
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  
  // Ownership
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes
BusinessSchema.index({ category: 1, 'rating.average': -1 });
BusinessSchema.index({ name: 'text', description: 'text' });
BusinessSchema.index({ slug: 1 });
BusinessSchema.index({ isFeatured: 1, 'rating.average': -1 });
```

---

#### **Reviews Collection**

```javascript
const ReviewSchema = new Schema({
  // References
  business: { 
    type: Schema.Types.ObjectId, 
    ref: 'Business',
    required: true,
    index: true
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  
  // Content
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  body: { 
    type: String, 
    required: true,
    maxLength: 500
  },
  
  // Optional media
  images: [{ 
    url: String,
    caption: String 
  }],
  
  // Engagement
  helpfulCount: { type: Number, default: 0 },
  
  // Moderation
  isApproved: { type: Boolean, default: true },
  isEdited: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Compound index for unique constraint
ReviewSchema.index({ business: 1, user: 1 }, { unique: true });
ReviewSchema.index({ createdAt: -1 });
```

---

#### **Deliveries Collection**

```javascript
const DeliverySchema = new Schema({
  // Basic Info
  name: { type: String, required: true },
  description: { type: String },
  
  // Service Area
  servicedAreas: [{
    type: String // '5K', '6K', '4K', etc.
  }],
  
  // Service Features
  deliverySpeed: {
    type: String,
    enum: ['fast', 'standard', 'slow'],
    default: 'standard'
  },
  averageDeliveryTime: { type: Number }, // in minutes
  deliveryFee: {
    min: { type: Number },
    max: { type: Number }
  },
  
  // Operating Hours
  hours: {
    openTime: String,
    closeTime: String,
    orderCutoff: String // "18:00" - Order until this time
  },
  
  // Contact
  contact: {
    phone: String,
    telegram: String
  },
  
  // Media
  logo: { type: String },
  
  // Ratings
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  
  // Status
  isActive: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now }
});

// Indexes
DeliverySchema.index({ 'rating.average': -1 });
DeliverySchema.index({ deliverySpeed: 1 });
DeliverySchema.index({ 'deliveryFee.min': 1 });
```

---

#### **Menu Items Collection**

```javascript
const MenuItemSchema = new Schema({
  // Reference
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    index: true
  },
  
  // Item Details
  name: { type: String, required: true },
  description: { type: String },
  price: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    default: 'ETB' 
  },
  
  // Categorization
  category: { type: String }, // 'breakfast', 'main', 'drinks'
  
  // Media
  image: { type: String },
  
  // Ratings (item-level)
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  
  // Availability
  isAvailable: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now }
});

// Indexes
MenuItemSchema.index({ business: 1, category: 1 });
MenuItemSchema.index({ business: 1, isPopular: -1 });
```

---

#### **Applications Collection**

```javascript
const ApplicationSchema = new Schema({
  // Applicant Info
  businessName: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  
  // Contact
  applicantEmail: { type: String },
  applicantPhone: { type: String },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Admin Notes
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewNotes: { type: String },
  reviewedAt: { type: Date },
  
  // If approved, link to created business
  businessId: { type: Schema.Types.ObjectId, ref: 'Business' },
  
  createdAt: { type: Date, default: Date.now }
});

// Index
ApplicationSchema.index({ status: 1, createdAt: -1 });
```

---

### 5.2 PostgreSQL Alternative (Prisma Schema)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String
  name         String
  avatar       String?
  university   String    @default("AAU")
  dormitory    String?
  yearOfStudy  String?
  role         Role      @default(USER)
  isVerified   Boolean   @default(false)
  isActive     Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  lastLogin    DateTime?
  
  reviews      Review[]
  businesses   Business[] @relation("BusinessOwner")
}

enum Role {
  USER
  ADMIN
  BUSINESS_OWNER
}

model Business {
  id          String      @id @default(uuid())
  name        String
  slug        String      @unique
  description String?
  category    Category
  tags        String[]
  address     String?
  dormitories String[]
  latitude    Float?
  longitude   Float?
  openTime    String?
  closeTime   String?
  phone       String?
  telegram    String?
  avgRating   Float       @default(0)
  reviewCount Int         @default(0)
  isActive    Boolean     @default(true)
  isFeatured  Boolean     @default(false)
  ownerId     String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  owner       User?       @relation("BusinessOwner", fields: [ownerId], references: [id])
  images      BusinessImage[]
  reviews     Review[]
  menuItems   MenuItem[]
}

enum Category {
  ON_CAMPUS
  OFF_CAMPUS
  DELIVERY
}

model BusinessImage {
  id         String   @id @default(uuid())
  businessId String
  url        String
  alt        String?
  isPrimary  Boolean  @default(false)
  
  business   Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
}

model Review {
  id           String   @id @default(uuid())
  businessId   String
  userId       String
  rating       Int
  body         String
  helpfulCount Int      @default(0)
  isApproved   Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  business     Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
  user         User     @relation(fields: [userId], references: [id])
  
  @@unique([businessId, userId])
}

model MenuItem {
  id          String   @id @default(uuid())
  businessId  String
  name        String
  description String?
  price       Float
  category    String?
  image       String?
  avgRating   Float    @default(0)
  reviewCount Int      @default(0)
  isAvailable Boolean  @default(true)
  isPopular   Boolean  @default(false)
  createdAt   DateTime @default(now())
  
  business    Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
}

model Delivery {
  id              String   @id @default(uuid())
  name            String
  description     String?
  servicedAreas   String[]
  deliverySpeed   String   @default("standard")
  avgDeliveryTime Int?
  minFee          Float?
  maxFee          Float?
  openTime        String?
  closeTime       String?
  orderCutoff     String?
  phone           String?
  telegram        String?
  logo            String?
  avgRating       Float    @default(0)
  reviewCount     Int      @default(0)
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
}

model Application {
  id             String            @id @default(uuid())
  businessName   String
  location       String
  description    String?
  applicantEmail String?
  applicantPhone String?
  status         ApplicationStatus @default(PENDING)
  reviewedById   String?
  reviewNotes    String?
  reviewedAt     DateTime?
  businessId     String?
  createdAt      DateTime          @default(now())
}

enum ApplicationStatus {
  PENDING
  APPROVED
  REJECTED
}
```

---

## 6. Project Folder Architecture

```
gebeta/
│
├── frontend/                          # React Application
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── robots.txt
│   │   └── images/                    # Static images
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── icons/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar/
│   │   │   │   │   ├── Navbar.jsx
│   │   │   │   │   ├── Navbar.module.css
│   │   │   │   │   └── index.js
│   │   │   │   ├── Footer/
│   │   │   │   ├── Button/
│   │   │   │   ├── RatingStars/
│   │   │   │   ├── FilterBar/
│   │   │   │   ├── SearchInput/
│   │   │   │   └── LoadingSpinner/
│   │   │   │
│   │   │   ├── cards/
│   │   │   │   ├── BusinessCard/
│   │   │   │   ├── ReviewCard/
│   │   │   │   ├── MenuItemCard/
│   │   │   │   └── DeliveryCard/
│   │   │   │
│   │   │   ├── forms/
│   │   │   │   ├── BusinessForm/
│   │   │   │   ├── ReviewForm/
│   │   │   │   └── StarRatingInput/
│   │   │   │
│   │   │   └── sections/
│   │   │       ├── HeroSection/
│   │   │       ├── FeaturesGrid/
│   │   │       └── ReviewsList/
│   │   │
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   │   ├── HomePage.jsx
│   │   │   │   └── HomePage.module.css
│   │   │   ├── Reviews/
│   │   │   ├── Delivery/
│   │   │   ├── About/
│   │   │   ├── SubmitReview/
│   │   │   ├── BusinessDetail/
│   │   │   └── NotFound/
│   │   │
│   │   ├── layouts/
│   │   │   └── MainLayout/
│   │   │
│   │   ├── hooks/
│   │   │   ├── useBusinesses.js
│   │   │   ├── useReviews.js
│   │   │   ├── useDeliveries.js
│   │   │   ├── useAuth.js
│   │   │   └── useForm.js
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── FilterContext.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── businessService.js
│   │   │   ├── reviewService.js
│   │   │   └── authService.js
│   │   │
│   │   ├── utils/
│   │   │   ├── formatters.js
│   │   │   ├── validators.js
│   │   │   └── constants.js
│   │   │
│   │   ├── styles/
│   │   │   ├── variables.css
│   │   │   ├── globals.css
│   │   │   └── mixins.css
│   │   │
│   │   ├── App.jsx
│   │   ├── Router.jsx
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── backend/                           # Node.js/Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── cloudinary.js
│   │   │   └── env.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── businessController.js
│   │   │   ├── reviewController.js
│   │   │   ├── deliveryController.js
│   │   │   ├── menuController.js
│   │   │   ├── authController.js
│   │   │   └── applicationController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── validate.js
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   └── upload.js
│   │   │
│   │   ├── models/
│   │   │   ├── index.js
│   │   │   ├── User.js
│   │   │   ├── Business.js
│   │   │   ├── Review.js
│   │   │   ├── Delivery.js
│   │   │   ├── MenuItem.js
│   │   │   └── Application.js
│   │   │
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── businessRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   ├── deliveryRoutes.js
│   │   │   ├── menuRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   └── applicationRoutes.js
│   │   │
│   │   ├── services/
│   │   │   ├── businessService.js
│   │   │   ├── reviewService.js
│   │   │   ├── authService.js
│   │   │   └── emailService.js
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   │
│   │   └── app.js
│   │
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── controllers/
│   │   │   └── services/
│   │   └── integration/
│   │       └── api/
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── server.js
│   └── README.md
│
├── database/                          # Database scripts & migrations
│   ├── migrations/
│   │   └── ...
│   ├── seeds/
│   │   ├── businesses.json
│   │   ├── reviews.json
│   │   ├── deliveries.json
│   │   └── menuItems.json
│   └── scripts/
│       ├── seed.js
│       └── backup.js
│
├── docs/                              # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── .github/                           # GitHub workflows
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── docker-compose.yml                 # Local development
├── .gitignore
├── LICENSE
└── README.md                          # Project overview
```



## Appendix A: Migration Checklist Summary

### Phase 1: Vanilla JavaScript
- [ ] Implement hamburger menu toggle (all pages)
- [ ] Add filter tab switching (reviews, delivery pages)
- [ ] Create star rating selector (submit review)
- [ ] Add form validation (about, submit review)
- [ ] Implement search functionality
- [ ] Add "Read More" expansion
- [ ] Create utility functions library

### Phase 2: React Migration
- [ ] Initialize Vite + React project
- [ ] Set up folder structure
- [ ] Migrate CSS to modules/styled components
- [ ] Create reusable components
- [ ] Set up React Router
- [ ] Implement pages with components
- [ ] Add state management (Context API)
- [ ] Connect to mock API (JSON Server initially)

### Phase 3: Backend Development
- [ ] Initialize Native Node.js HTTP project
- [ ] Set up database connection
- [ ] Create models/schemas
- [ ] Implement CRUD controllers
- [ ] Build custom router
- [ ] Implement error handling
- [ ] Add authentication (future)
- [ ] Write API tests

### Phase 4: Database Setup
- [ ] Choose MongoDB or PostgreSQL
- [ ] Design final schema
- [ ] Create migrations
- [ ] Seed initial data
- [ ] Set up indexes
- [ ] Configure backups

### Phase 5: AI Chatbot Integration (Google Gemini API)

#### 5.1 Frontend Implementation
- [ ] Create `ChatWidget` component (floating button + expandable panel)
- [ ] Design chat bubble UI (user vs bot messages)
- [ ] Implement message input with send button
- [ ] Add typing indicator animation
- [ ] Create quick reply suggestion buttons
- [ ] Store conversation history in local state
- [ ] Add minimize/maximize functionality
- [ ] Implement auto-scroll to latest message

#### 5.2 Backend API Setup
- [ ] Install `@google/generative-ai` package
- [ ] Create `/api/chat` endpoint
- [ ] Set up Gemini API key in environment variables
- [ ] Initialize Gemini model (`gemini-pro`)
- [ ] Implement request/response handler
- [ ] Add rate limiting for API calls
- [ ] Handle API errors gracefully

#### 5.3 Gemini Integration
- [ ] Configure Gemini with system prompt:
  - Define chatbot persona (Gebeta food assistant)
  - Inject business data context
  - Set response format guidelines
- [ ] Implement `generateContent()` call
- [ ] Parse and format Gemini responses
- [ ] Handle streaming responses (optional)

#### 5.4 Data Context Integration
- [ ] Fetch relevant business data before prompting
- [ ] Build context string with:
  - List of businesses, categories, locations
  - Menu items and prices
  - Recent reviews and ratings
- [ ] Implement semantic search for relevant data
- [ ] Inject context into Gemini prompt

#### 5.5 Conversation Features
- [ ] Maintain conversation history array
- [ ] Send chat history with each request
- [ ] Implement context window management
- [ ] Add conversation reset functionality
- [ ] Store conversation ID for tracking

#### 5.6 Chatbot Capabilities to Test
- [ ] "Find me a good cafe near 5K dorm"
- [ ] "What's the best-rated delivery service?"
- [ ] "Show me vegetarian options on campus"
- [ ] "What time does Student Center Cafeteria close?"
- [ ] "Summarize reviews for [business name]"
- [ ] "Compare prices between [business A] and [business B]"
- [ ] "What's popular at [restaurant name]?"

#### 5.7 Error Handling & Fallbacks
- [ ] Handle Gemini API rate limits
- [ ] Implement retry logic with exponential backoff
- [ ] Create fallback responses for common queries
- [ ] Add "I don't understand" response handling
- [ ] Log failed queries for improvement

#### 5.8 UI Polish
- [ ] Add chat bubble animations
- [ ] Implement dark/light mode support
- [ ] Make widget responsive for mobile
- [ ] Add sound notification (optional)
- [ ] Create loading skeleton for messages


---

*This document serves as the architectural blueprint for migrating Gebeta from a static HTML/CSS website to a modern full-stack application. Each phase builds upon the previous, ensuring a smooth and maintainable upgrade path.*
