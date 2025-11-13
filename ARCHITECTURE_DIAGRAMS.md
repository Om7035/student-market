# Student Market - Architecture Diagrams

## System Overview
Student Market is a full-stack web application built with Next.js 15, React 19, and Supabase, designed as a marketplace for students in Pune, India to offer and find various services.

---

## 🎯 Activity Diagram - User Journey Flow

```mermaid
activityDiagram
    title Student Market - User Activity Flow
    
    start
    :User Visits Platform;
    
    partition Authentication {
        :Browse Services (Guest);
        --> Sign Up/Sign In;
        :User Authentication;
        note right: Supabase Auth
    }
    
    partition Role Selection {
        :Select Role (Student/Client/Officer);
        --> Complete Onboarding;
        :Profile Setup;
        note right: Profile data stored in Supabase
    }
    
    partition Main Flow {
        if (Role is Student?) then (yes)
            :Create Gig/Service;
            note right: 4-step wizard process
            --> Set Pricing & Delivery;
            --> Upload Media;
            --> Publish Service;
            --> Manage Bids;
            --> Communicate with Clients;
            --> Deliver Work;
            --> Receive Payment;
        else (no)
            if (Role is Client?) then (yes)
                :Browse/Search Services;
                --> Filter by Category/Price;
                --> View Service Details;
                --> Place Order/Submit Bid;
                --> Make Payment (Escrow);
                --> Communicate with Student;
                --> Receive Delivery;
                --> Review & Rate Service;
            else (no)
                :Access Analytics Dashboard;
                --> Monitor Platform Metrics;
                --> Manage Users;
                --> View Reports;
            endif
        endif
    }
    
    partition Common Features {
        :Real-time Messaging;
        :Notifications Management;
        :Profile Management;
        :Wallet & Payment History;
        :Reviews & Ratings;
    }
    
    stop
```

---

## 🔄 Sequence Diagram - Service Creation & Order Flow

```mermaid
sequenceDiagram
    title Service Creation to Order Completion Sequence
    
    participant U as User (Student)
    participant F as Frontend (Next.js)
    participant A as API Routes
    participant S as Supabase Backend
    participant P as Payment Gateway
    participant N as Notification System
    
    Note over U,N: Service Creation Flow
    U->>F: Click "Create Gig"
    F->>A: GET /api/categories
    A->>S: Fetch categories
    S-->>A: Categories data
    A-->>F: Categories response
    F-->>U: Show category selection
    
    U->>F: Fill gig details (4 steps)
    U->>F: Submit gig creation
    F->>A: POST /api/services
    A->>S: Validate & Insert gig
    S-->>A: Gig created
    A-->>F: Success response
    F-->>U: Gig published confirmation
    
    Note over U,N: Order Flow
    participant C as Client
    C->>F: Browse services
    F->>A: GET /api/services?filters
    A->>S: Query gigs with filters
    S-->>A: Filtered gigs
    A-->>F: Services list
    F-->>C: Display services
    
    C->>F: Select service & order
    F->>A: POST /api/orders
    A->>S: Create order record
    S-->>A: Order created
    A->>P: Initiate payment
    P-->>A: Payment success
    A->>S: Update order status
    S-->>A: Order confirmed
    A->>N: Send notifications
    N-->>U: New order notification
    A-->>F: Order confirmation
    F-->>C: Payment success
    
    Note over U,N: Communication & Delivery
    U->>F: Send message
    F->>A: POST /api/messages
    A->>S: Store message
    S-->>A: Message saved
    A->>N: Real-time notification
    N-->>C: New message alert
    
    U->>F: Mark order delivered
    F->>A: PUT /api/orders/[id]/status
    A->>S: Update order status
    S-->>A: Status updated
    A->>P: Release escrow payment
    P-->>A: Payment released
    A->>S: Update wallet balance
    S-->>A: Balance updated
    A-->>F: Delivery confirmed
    F-->>U: Payment received
```

---

## 🏗️ Class Diagram - System Architecture

```mermaid
classDiagram
    title Student Market - Class Architecture
    
    namespace Frontend.Components {
        class Navigation {
            +user: User
            +searchQuery: string
            +unreadCount: number
            +handleSignOut()
            +handleSearch()
            +fetchUserProfile()
        }
        
        class GigCard {
            +gig: Gig
            +onViewDetails()
            +onContactSeller()
            +renderRating()
        }
        
        class ChatbotWidget {
            +position: string
            +isOpen: boolean
            +toggleChat()
            +sendMessage()
            +handleResponse()
        }
        
        class MobileNav {
            +user: User
            +unreadCount: number
            +renderNavItems()
        }
    }
    
    namespace Frontend.Pages {
        class HomePage {
            +categories: Category[]
            +featuredGigs: Gig[]
            +testimonials: Testimonial[]
            +renderHeroSection()
            +renderCategories()
            +renderFeaturedServices()
        }
        
        class GigsPage {
            +gigs: Gig[]
            +filters: GigFilters
            +loading: boolean
            +fetchGigs()
            +handleSearch()
            +applyFilters()
        }
        
        class DashboardPage {
            +user: User
            +myGigs: Gig[]
            +orders: Order[]
            +analytics: Analytics
            +loadDashboard()
            +createNewGig()
            +manageOrders()
        }
    }
    
    namespace API.Routes {
        class ServicesAPI {
            +GET(req: Request)
            +POST(req: Request)
            +validateServiceData()
            +handleFilters()
        }
        
        class OrdersAPI {
            +GET(req: Request)
            +POST(req: Request)
            +PUT(req: Request)
            +updateOrderStatus()
            +processPayment()
        }
        
        class MessagesAPI {
            +GET(req: Request)
            +POST(req: Request)
            +markAsRead()
            +getConversation()
        }
        
        class PaymentsAPI {
            +createPayment()
            +handleWebhook()
            +verifyPayment()
            +releaseEscrow()
        }
    }
    
    namespace Database.Models {
        class User {
            +id: UUID
            +email: string
            +full_name: string
            +avatar_url: string
            +college: string
            +major: string
            +year: number
            +bio: string
            +skills: string[]
            +reputation_score: number
            +wallet_balance: number
            +is_verified: boolean
            +role: UserRole
            +onboarding_completed: boolean
            +created_at: Timestamp
            +updated_at: Timestamp
        }
        
        class Gig {
            +id: UUID
            +user_id: UUID
            +title: string
            +description: string
            +category_id: UUID
            +price: number
            +delivery_days: number
            +tags: string[]
            +images: string[]
            +video_url: string
            +is_active: boolean
            +rating: number
            +total_orders: number
            +created_at: Timestamp
            +updated_at: Timestamp
        }
        
        class Order {
            +id: UUID
            +gig_id: UUID
            +buyer_id: UUID
            +seller_id: UUID
            +status: OrderStatus
            +amount: number
            +requirements: string
            +delivery_date: Timestamp
            +completed_at: Timestamp
            +created_at: Timestamp
        }
        
        class Message {
            +id: UUID
            +sender_id: UUID
            +receiver_id: UUID
            +order_id: UUID
            +content: string
            +attachments: string[]
            +is_read: boolean
            +created_at: Timestamp
        }
        
        class Review {
            +id: UUID
            +order_id: UUID
            +reviewer_id: UUID
            +rating: number
            +comment: string
            +created_at: Timestamp
        }
        
        class Category {
            +id: UUID
            +name: string
            +description: string
            +icon: string
            +color: string
            +created_at: Timestamp
        }
    }
    
    namespace Services {
        class DataService {
            +getCurrentUser()
            +getGigs(filters)
            +createGig(data)
            +createOrder(data)
            +sendMessage(data)
            +getMessages(userId)
            +updateProfile(data)
            +processPayment(data)
        }
        
        class SupabaseClient {
            +auth: Auth
            +from(table): QueryBuilder
            +storage: Storage
            +realtime: RealtimeClient
            +functions: Functions
        }
        
        class PaymentService {
            +createOrder(amount, currency)
            +verifyPayment(paymentId)
            +releaseEscrow(orderId)
            +refundPayment(orderId)
        }
        
        class NotificationService {
            +sendPushNotification(userId, message)
            +sendEmailNotification(userEmail, template)
            +subscribeToRealtimeUpdates(userId)
            +markAsRead(notificationId)
        }
    }
    
    %% Relationships
    User ||--o{ Gig : creates
    User ||--o{ Order : places/buys
    User ||--o{ Message : sends
    User ||--o{ Review : writes
    Gig ||--o{ Order : generates
    Order ||--|| Message : contains
    Order ||--|| Review : receives
    Gig }|--|| Category : belongs_to
    
    Navigation --> User : uses
    GigCard --> Gig : displays
    HomePage --> GigCard : renders
    GigsPage --> GigCard : renders
    DashboardPage --> User : manages
    
    ServicesAPI --> DataService : calls
    OrdersAPI --> DataService : calls
    MessagesAPI --> DataService : calls
    PaymentsAPI --> PaymentService : uses
    
    DataService --> SupabaseClient : queries
    DataService --> PaymentService : processes
    DataService --> NotificationService : notifies
    
    User "1" -- "*" Gig : creates
    User "1" -- "*" Order : participates
    Gig "1" -- "*" Order : generates
    Order "1" -- "*" Message : contains
```

---

## 🔧 Component Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend Layer (Next.js)"
        A[App Router] --> B[Layout.tsx]
        B --> C[Navigation Component]
        B --> D[MobileNav Component]
        B --> E[ChatbotWidget]
        
        F[Pages] --> G[HomePage]
        F --> H[GigsPage]
        F --> I[DashboardPage]
        F --> J[MessagesPage]
        F --> K[ProfilePage]
        
        L[UI Components] --> M[shadcn/ui Components]
        L --> N[Custom Components]
        N --> O[GigCard]
        N --> P[CategoryCard]
        N --> Q[ReviewCard]
    end
    
    subgraph "API Layer (Next.js API Routes)"
        R[Services API] --> S[GET /api/services]
        R --> T[POST /api/services]
        U[Orders API] --> V[POST /api/orders]
        U --> W[PUT /api/orders/:id]
        X[Messages API] --> Y[GET /api/messages]
        X --> Z[POST /api/messages]
        AA[Payments API] --> BB[POST /api/payments]
        AA --> CC[Webhook Handler]
    end
    
    subgraph "Service Layer"
        DD[DataService] --> EE[User Management]
        DD --> FF[Gig Management]
        DD --> GG[Order Processing]
        DD --> HH[Messaging Service]
        II[PaymentService] --> JJ[Razorpay Integration]
        II --> KK[Escrow Management]
        LL[NotificationService] --> MM[Real-time Updates]
        LL --> NN[Email Notifications]
    end
    
    subgraph "Backend Layer (Supabase)"
        OO[PostgreSQL Database] --> PP[Users Table]
        OO --> QQ[Gigs Table]
        OO --> RR[Orders Table]
        OO --> SS[Messages Table]
        OO --> TT[Reviews Table]
        UU[Authentication] --> VV[JWT Auth]
        UU --> WW[Social Auth]
        XX[Realtime Engine] --> YY[Live Messaging]
        XX --> ZZ[Live Notifications]
        AAA[Storage] --> BBB[File Uploads]
        AAA --> CCC[Media Files]
    end
    
    A --> R
    F --> R
    R --> DD
    DD --> OO
    DD --> UU
    DD --> AAA
    DD --> II
    DD --> LL
```

---

## 📊 Data Flow Architecture

```mermaid
flowchart TD
    A[User Action] --> B{Action Type}
    
    B -->|Authentication| C[Supabase Auth]
    B -->|Data CRUD| D[API Routes]
    B -->|File Upload| E[Supabase Storage]
    B -->|Real-time| F[Supabase Realtime]
    
    C --> G[JWT Token]
    G --> H[Session Management]
    
    D --> I[Validation Layer]
    I --> J[DataService]
    J --> K[Supabase Client]
    K --> L[PostgreSQL DB]
    
    E --> M[File Processing]
    M --> N[Storage Bucket]
    
    F --> O[WebSocket Connection]
    O --> P[Live Updates]
    P --> Q[UI State Update]
    
    L --> R[Data Response]
    R --> S[Component Re-render]
    
    N --> T[File URL]
    T --> S
    
    Q --> S
    
    S --> U[User Interface Update]
```

---

## 🚀 Deployment Architecture

```mermaid
graph TB
    subgraph "Deployment Environment"
        A[Vercel Platform] --> B[Next.js Frontend]
        A --> C[API Routes]
        A --> D[Serverless Functions]
        
        E[Supabase Cloud] --> F[PostgreSQL Database]
        E --> G[Authentication Service]
        E --> H[Realtime Engine]
        E --> I[Storage Service]
        
        J[External Services] --> K[Razorpay Payment Gateway]
        J --> L[Email Service]
        J --> M[CDN for Assets]
    end
    
    subgraph "Development Environment"
        N[Local Development] --> O[Next.js Dev Server]
        O --> P[Supabase Local]
        P --> Q[Local Database]
    end
    
    B --> E
    C --> E
    D --> J
    E --> J
    
    style A fill:#3b82f6,color:white
    style E fill:#10b981,color:white
    style J fill:#f59e0b,color:white
```

---

## 📱 Mobile-First Architecture

```mermaid
graph LR
    A[Mobile Device] --> B[Progressive Web App]
    B --> C[Service Worker]
    C --> D[Offline Support]
    
    B --> E[Responsive Layout]
    E --> F[Mobile Navigation]
    E --> G[Touch-Friendly UI]
    
    B --> H[Push Notifications]
    H --> I[Real-time Alerts]
    
    B --> J[Device Features]
    J --> K[Camera Integration]
    J --> L[Geolocation Services]
    J --> M[File System Access]
```

---

## 🔒 Security Architecture

```mermaid
graph TB
    A[Security Layer] --> B[Authentication]
    A --> C[Authorization]
    A --> D[Data Validation]
    A --> E[Encryption]
    
    B --> F[Supabase Auth]
    F --> G[JWT Tokens]
    F --> H[Social Providers]
    
    C --> I[Row Level Security]
    I --> J[User-based Policies]
    I --> K[Role-based Access]
    
    D --> L[Zod Validation]
    D --> M[Input Sanitization]
    
    E --> N[SSL/TLS]
    E --> O[Data at Rest Encryption]
    E --> P[Environment Variables]
    
    Q[Payment Security] --> R[PCI Compliance]
    Q --> S[Escrow Protection]
    Q --> T[Fraud Detection]
```

---

## 🎨 UI/UX Architecture

```mermaid
graph TB
    A[Design System] --> B[Theme Provider]
    A --> C[Component Library]
    A --> D[Style Guidelines]
    
    B --> E[Dark/Light Mode]
    B --> F[Color Palette]
    B --> G[Typography]
    
    C --> H[shadcn/ui Components]
    C --> I[Custom Components]
    C --> J[Layout Components]
    
    D --> K[Responsive Design]
    D --> L[Accessibility Standards]
    D --> M[Animation Guidelines]
    
    N[User Experience] --> O[Progressive Enhancement]
    N --> P[Loading States]
    N --> Q[Error Handling]
    N --> R[Feedback Systems]
```

---

## 📈 Performance Architecture

```mermaid
graph TB
    A[Performance Optimization] --> B[Frontend Optimization]
    A --> C[Backend Optimization]
    A --> D[Database Optimization]
    
    B --> E[Code Splitting]
    B --> F[Lazy Loading]
    B --> G[Image Optimization]
    B --> H[Caching Strategy]
    
    C --> I[API Response Caching]
    C --> J[Connection Pooling]
    C --> K[Edge Functions]
    
    D --> L[Query Optimization]
    D --> M[Indexing Strategy]
    D --> N[Connection Management]
    
    O[Monitoring] --> P[Performance Metrics]
    O --> Q[Error Tracking]
    O --> R[User Analytics]
```

---

## 🔄 State Management Architecture

```mermaid
graph TB
    A[State Management] --> B[Client State]
    A --> C[Server State]
    A --> D[Global State]
    
    B --> E[React useState]
    B --> F[React useEffect]
    B --> G[Local Component State]
    
    C --> H[Supabase Realtime]
    C --> I[API Data Fetching]
    C --> J[SWR/React Query Pattern]
    
    D --> K[Context API]
    D --> L[Auth Context]
    D --> M[Theme Context]
    D --> N[Notification Context]
    
    O[State Synchronization] --> P[Real-time Subscriptions]
    O --> Q[Optimistic Updates]
    O --> R[Cache Invalidation]
```

---

## 🎯 Key Architectural Features

### 1. **Microservices Pattern**
- Separation of concerns between frontend, API, and backend services
- Modular API routes for different functionalities
- Service layer for business logic abstraction

### 2. **Real-time Architecture**
- WebSocket connections via Supabase Realtime
- Live messaging and notifications
- Optimistic UI updates

### 3. **Security-First Design**
- Row-level security in database
- JWT-based authentication
- Input validation and sanitization

### 4. **Mobile-First Progressive Web App**
- Responsive design with Tailwind CSS
- Service worker for offline functionality
- Touch-optimized interfaces

### 5. **Scalable Database Design**
- Normalized PostgreSQL schema
- Efficient indexing strategy
- Relationship integrity

### 6. **Payment Integration**
- Escrow-based payment system
- Multiple payment methods
- Secure transaction handling

---

## 📋 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15, React 19 | Full-stack framework |
| **Styling** | Tailwind CSS, shadcn/ui | Utility-first styling |
| **Backend** | Supabase | BaaS (Database, Auth, Realtime) |
| **Database** | PostgreSQL | Relational data storage |
| **Authentication** | Supabase Auth | User management |
| **Payments** | Razorpay | Payment processing |
| **Real-time** | Supabase Realtime | Live updates |
| **Storage** | Supabase Storage | File uploads |
| **Deployment** | Vercel | Hosting platform |

---

## 🔍 Design Patterns Used

1. **Repository Pattern**: Data service abstraction
2. **Observer Pattern**: Real-time subscriptions
3. **Factory Pattern**: Component creation
4. **Strategy Pattern**: Payment processing
5. **Singleton Pattern**: Service instances
6. **Decorator Pattern**: HOCs and middleware
7. **Command Pattern**: API route handlers

---

This architecture provides a robust, scalable, and maintainable foundation for the Student Market platform, following modern web development best practices and design patterns.
