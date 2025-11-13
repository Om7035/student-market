# Student Market - Architecture Diagrams

## System Overview
Student Market is a full-stack web application built with Next.js 15, React 19, and Supabase, designed as a marketplace for students in Pune, India to offer and find various services.

---

## 📊 Activity Diagram - User Journey Flow

```mermaid
flowchart TD
    Start([Start]) --> Visit[User Visits Platform]
    
    subgraph Authentication [Authentication Module]
        Browse[Browse Services as Guest]
        Auth[User Authentication via Supabase]
    end
    
    Visit --> Browse
    Browse --> Auth
    
    subgraph RoleSelection [Role Selection Module]
        SelectRole[Select Role]
        Onboarding[Complete Onboarding]
        Profile[Profile Setup]
    end
    
    Auth --> SelectRole
    SelectRole --> Onboarding
    Onboarding --> Profile
    
    subgraph StudentFlow [Student Workflow]
        CreateGig[Create Gig/Service]
        SetPricing[Set Pricing & Delivery]
        UploadMedia[Upload Media]
        Publish[Publish Service]
        ManageBids[Manage Bids]
        Communicate1[Communicate with Clients]
        Deliver[Deliver Work]
        ReceivePayment[Receive Payment]
    end
    
    subgraph ClientFlow [Client Workflow]
        BrowseServices[Browse/Search Services]
        Filter[Filter by Category/Price]
        ViewDetails[View Service Details]
        PlaceOrder[Place Order/Submit Bid]
        MakePayment[Make Payment via Razorpay]
        Communicate2[Communicate with Student]
        ReceiveDelivery[Receive Delivery]
        Review[Review & Rate Service]
    end
    
    subgraph OfficerFlow [Officer Workflow]
        Dashboard[Access Analytics Dashboard]
        Monitor[Monitor Platform Metrics]
        ManageUsers[Manage Users]
        Reports[View Reports]
    end
    
    Profile --> StudentFlow
    Profile --> ClientFlow
    Profile --> OfficerFlow
    
    CreateGig --> SetPricing
    SetPricing --> UploadMedia
    UploadMedia --> Publish
    Publish --> ManageBids
    ManageBids --> Communicate1
    Communicate1 --> Deliver
    Deliver --> ReceivePayment
    
    BrowseServices --> Filter
    Filter --> ViewDetails
    ViewDetails --> PlaceOrder
    PlaceOrder --> MakePayment
    MakePayment --> Communicate2
    Communicate2 --> ReceiveDelivery
    ReceiveDelivery --> Review
    
    Dashboard --> Monitor
    Monitor --> ManageUsers
    ManageUsers --> Reports
    
    subgraph CommonFeatures [Common Features]
        Messaging[Real-time Messaging]
        Notifications[Notifications Management]
        ProfileMgmt[Profile Management]
        Wallet[Wallet & Payment History]
        Ratings[Reviews & Ratings]
    end
    
    StudentFlow --> CommonFeatures
    ClientFlow --> CommonFeatures
    OfficerFlow --> CommonFeatures
    
    CommonFeatures --> End([End])
    
    classDef authBox fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef studentBox fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef clientBox fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef officerBox fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef commonBox fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    
    class Browse,Auth authBox
    class CreateGig,SetPricing,UploadMedia,Publish,ManageBids,Communicate1,Deliver,ReceivePayment studentBox
    class BrowseServices,Filter,ViewDetails,PlaceOrder,MakePayment,Communicate2,ReceiveDelivery,Review clientBox
    class Dashboard,Monitor,ManageUsers,Reports officerBox
    class Messaging,Notifications,ProfileMgmt,Wallet,Ratings commonBox
```

---

## 🔄 Sequence Diagram - Service Creation & Order Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Next.js Frontend
    participant API as API Routes
    participant Supabase as Supabase Backend
    participant Razorpay as Razorpay Gateway
    
    User->>Frontend: Create Service Request
    Frontend->>API: POST /api/services
    API->>Supabase: Validate & Store Service
    Supabase-->>API: Service Created
    API-->>Frontend: Service ID Response
    Frontend-->>User: Service Published
    
    User->>Frontend: Browse Services
    Frontend->>API: GET /api/services
    API->>Supabase: Query Services
    Supabase-->>API: Service List
    API-->>Frontend: Filtered Services
    Frontend-->>User: Display Services
    
    User->>Frontend: Place Order
    Frontend->>API: POST /api/orders
    API->>Supabase: Create Order
    Supabase-->>API: Order Created
    API-->>Frontend: Order ID
    Frontend->>Razorpay: Initiate Payment
    Razorpay-->>Frontend: Payment Success
    Frontend->>API: Update Payment Status
    API->>Supabase: Mark Order Paid
    Supabase-->>API: Confirmation
    API-->>Frontend: Order Confirmed
    Frontend-->>User: Order Success
```

---

## 🏗️ Class Diagram - System Architecture

```mermaid
classDiagram
    class User {
        +id: string
        +email: string
        +name: string
        +role: Role
        +profile: UserProfile
        +wallet: Wallet
        +signIn()
        +signOut()
        +updateProfile()
    }
    
    class Service {
        +id: string
        +title: string
        +description: string
        +price: number
        +category: Category
        +studentId: string
        +media: Media[]
        +status: ServiceStatus
        +create()
        +update()
        +delete()
    }
    
    class Order {
        +id: string
        +serviceId: string
        +clientId: string
        +amount: number
        +status: OrderStatus
        +payment: Payment
        +create()
        +updateStatus()
        +complete()
    }
    
    class Payment {
        +id: string
        +orderId: string
        +amount: number
        +razorpayId: string
        +status: PaymentStatus
        +process()
        +refund()
    }
    
    class Message {
        +id: string
        +senderId: string
        +receiverId: string
        +content: string
        +timestamp: Date
        +send()
        +markAsRead()
    }
    
    class Review {
        +id: string
        +orderId: string
        +rating: number
        +comment: string
        +reviewerId: string
        +submit()
        +update()
    }
    
    User "1" --> "*" Service : creates
    User "1" --> "*" Order : places
    User "1" --> "*" Message : sends
    User "1" --> "*" Review : writes
    Service "1" --> "*" Order : generates
    Order "1" --> "1" Payment : has
    Order "1" --> "1" Review : receives
    
    class Category {
        +id: string
        +name: string
        +description: string
    }
    
    Service --> Category : belongs to
    
    class Notification {
        +id: string
    }
    
    User "1" --> "*" Notification : receives
```

---

## 🔧 Component Architecture Diagram

```mermaid
graph TB
    subgraph Frontend [Frontend Layer - Next.js]
        App[App Router]
        Layout[Layout Component]
        Pages[Page Components]
        Components[UI Components]
        Hooks[Custom Hooks]
        Utils[Utilities]
        
        App --> Layout
        Layout --> Pages
        Pages --> Components
        Components --> Hooks
        Hooks --> Utils
    end
    
    subgraph Backend [Backend Layer - Supabase]
        Auth[Authentication]
        DB[PostgreSQL Database]
        Storage[File Storage]
        Realtime[Real-time Engine]
        Functions[Edge Functions]
        
        Auth --> DB
        DB --> Storage
        Storage --> Realtime
        Realtime --> Functions
    end
    
    subgraph External [External Services]
        Razorpay[Payment Gateway]
        Email[Email Service]
        CDN[Content Delivery]
        
        Razorpay --> Functions
        Email --> Functions
        CDN --> Storage
    end
    
    Frontend --> Backend
    Backend --> External
    
    classDef frontendBox fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef backendBox fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef externalBox fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    
    class App,Layout,Pages,Components,Hooks,Utils frontendBox
    class Auth,DB,Storage,Realtime,Functions backendBox
    class Razorpay,Email,CDN externalBox
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
    subgraph Production [Production Environment]
        Vercel[Vercel Hosting]
        Supabase[Supabase Cloud]
        External[External Services]
        
        Vercel --> Frontend[Next.js App]
        Vercel --> API[API Routes]
        
        Supabase --> Database[(PostgreSQL)]
        Supabase --> Auth[Auth Service]
        Supabase --> Storage[File Storage]
        
        External --> Razorpay[Payment Gateway]
        External --> Email[Email Service]
    end
    
    subgraph Development [Development Environment]
        Local[Local Dev]
        DevServer[Next.js Dev Server]
        LocalSupabase[Supabase Local]
        
        Local --> DevServer
        DevServer --> LocalSupabase
    end
    
    Frontend --> Database
    API --> Database
    API --> Razorpay
    
    classDef prodBox fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef devBox fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    
    class Vercel,Supabase,External,Frontend,API,Database,Auth,Storage,Razorpay,Email prodBox
    class Local,DevServer,LocalSupabase devBox
```

---

## 📱 Mobile-First Architecture

```mermaid
graph LR
    Mobile[Mobile Device] --> PWA[PWA Features]
    
    subgraph PWA [Progressive Web App]
        ServiceWorker[Service Worker]
        Responsive[Responsive Design]
        Offline[Offline Support]
        Push[Push Notifications]
    end
    
    PWA --> UI[Mobile UI Components]
    
    subgraph UI [Mobile Interface]
        Navigation[Mobile Navigation]
        Touch[Touch-Friendly]
        Gestures[Gesture Support]
        Camera[Camera Integration]
    end
    
    ServiceWorker --> Offline
    Responsive --> Touch
    Push --> Notifications
    
    classDef mobileBox fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef pwaBox fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef uiBox fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    
    class Mobile mobileBox
    class ServiceWorker,Responsive,Offline,Push pwaBox
    class Navigation,Touch,Gestures,Camera uiBox
```

---

## 🔒 Security Architecture

```mermaid
graph TB
    Security[Security Layer] --> Auth[Authentication]
    Security --> Authz[Authorization]
    Security --> Validation[Data Validation]
    Security --> Encryption[Encryption]
    
    Auth --> SupabaseAuth[Supabase Auth]
    SupabaseAuth --> JWT[JWT Tokens]
    SupabaseAuth --> Social[Social Providers]
    
    Authz --> RLS[Row Level Security]
    RLS --> UserPolicies[User Policies]
    RLS --> RolePolicies[Role Policies]
    
    Validation --> Zod[Zod Validation]
    Validation --> Sanitization[Input Sanitization]
    
    Encryption --> SSL[SSL/TLS]
    Encryption --> DataAtRest[Data at Rest]
    Encryption --> EnvVars[Environment Variables]
    
    PaymentSecurity[Payment Security] --> PCI[PCI Compliance]
    PaymentSecurity --> Escrow[Escrow Protection]
    
    classDef securityBox fill:#ffebee,stroke:#c62828,stroke-width:2px
    classDef authBox fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef dataBox fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    
    class Security securityBox
    class Auth,Authz,SupabaseAuth,JWT,Social,RLS,UserPolicies,RolePolicies authBox
    class Validation,Encryption,Zod,Sanitization,SSL,DataAtRest,EnvVars,PaymentSecurity,PCI,Escrow dataBox
```

---

## 🎨 UI/UX Architecture

```mermaid
graph TB
    DesignSystem[Design System] --> Theme[Theme Provider]
    DesignSystem --> Components[Component Library]
    DesignSystem --> Guidelines[Style Guidelines]
    
    Theme --> DarkMode[Dark/Light Mode]
    Theme --> Colors[Color Palette]
    Theme --> Typography[Typography System]
    
    Components --> Shadcn[shadcn/ui]
    Components --> Custom[Custom Components]
    Components --> Layout[Layout Components]
    
    Guidelines --> Responsive[Responsive Design]
    Guidelines --> Accessibility[Accessibility WCAG]
    Guidelines --> Animations[Animation Guidelines]
    
    UX[User Experience] --> Loading[Loading States]
    UX --> Errors[Error Handling]
    UX --> Feedback[Feedback Systems]
    
    classDef designBox fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef themeBox fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef uxBox fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    
    class DesignSystem designBox
    class Theme,DarkMode,Colors,Typography themeBox
    class Components,Shadcn,Custom,Layout,Guidelines,Responsive,Accessibility,Animations,UX,Loading,Errors,Feedback uxBox
```

---

## 📈 Performance Architecture

```mermaid
graph TB
    Performance[Performance Optimization] --> Frontend[Frontend Optimization]
    Performance --> Backend[Backend Optimization]
    Performance --> Database[Database Optimization]
    
    Frontend --> CodeSplit[Code Splitting]
    Frontend --> LazyLoad[Lazy Loading]
    Frontend --> Images[Image Optimization]
    Frontend --> Cache[Browser Caching]
    
    Backend --> API[API Caching]
    Backend --> Connection[Connection Pooling]
    Backend --> Edge[Edge Functions]
    
    Database --> Queries[Query Optimization]
    Database --> Indexes[Database Indexing]
    Database --> Connections[Connection Management]
    
    Monitoring[Performance Monitoring] --> Metrics[Core Web Vitals]
    Monitoring --> Tracking[Error Tracking]
    Monitoring --> Analytics[User Analytics]
    
    classDef perfBox fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef frontendBox fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef backendBox fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef monitorBox fill:#fff3e0,stroke:#e65100,stroke-width:2px
    
    class Performance perfBox
    class Frontend,CodeSplit,LazyLoad,Images,Cache frontendBox
    class Backend,API,Connection,Edge,Database,Queries,Indexes,Connections backendBox
    class Monitoring,Metrics,Tracking,Analytics monitorBox
```

---

## 🔄 State Management Architecture

```mermaid
graph TB
    State[State Management] --> Client[Client State]
    State --> Server[Server State]
    State --> Global[Global State]
    
    Client --> Local[Component State]
    Client --> Forms[Form State]
    Client --> UI[UI State]
    
    Server --> Supabase[Supabase Client]
    Server --> API[API State]
    Server --> Cache[Query Cache]
    
    Global --> Auth[Authentication]
    Global --> User[User Profile]
    Global --> Theme[Theme Settings]
    
    Realtime[Real-time Updates] --> Subscriptions[WebSocket Subscriptions]
    Realtime --> Sync[State Synchronization]
    
    classDef stateBox fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef clientBox fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef serverBox fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef realtimeBox fill:#fff3e0,stroke:#e65100,stroke-width:2px
    
    class State stateBox
    class Client,Local,Forms,UI clientBox
    class Server,Supabase,API,Cache serverBox
    class Global,Auth,User,Theme,Realtime,Subscriptions,Sync realtimeBox
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
