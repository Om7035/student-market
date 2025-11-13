# Student Market - Architecture Diagrams

## System Overview
Student Market is a full-stack web application built with Next.js 15, React 19, and Supabase, designed as a marketplace for students in Pune, India to offer and find various services.

---

## 📊 Activity Diagram - User Journey Flow

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'background': '#ffffff', 'primaryColor': '#ffffff', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'primaryTextColor': '#111827', 'textColor': '#111827', 'titleColor': '#111827', 'lineColor': '#1f2937', 'primaryBorderColor': '#1f2937', 'defaultLinkColor': '#1f2937', 'edgeLabelBackground': '#ffffff', 'arrowheadColor': '#1f2937', 'clusterBkg': '#ffffff', 'clusterBorder': '#1f2937', 'fontFamily': 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"', 'fontSize': '14px' }, 'flowchart': { 'nodeSpacing': 40, 'rankSpacing': 60, 'padding': 12 } }}%%
flowchart TD
    Start([Start]) --> Visit[User Visits Platform]
    
    Visit --> Browse[Browse Services as Guest]
    Browse --> Auth[User Authentication]
    
    Auth --> SelectRole{Select Role}
    
    SelectRole -->|Student| StudentFlow[Student Workflow]
    SelectRole -->|Client| ClientFlow[Client Workflow]
    SelectRole -->|Officer| OfficerFlow[Officer Workflow]
    
    StudentFlow --> CreateGig[Create Gig/Service]
    CreateGig --> SetPricing[Set Pricing & Delivery]
    SetPricing --> Publish[Publish Service]
    Publish --> ManageBids[Manage Bids]
    ManageBids --> Deliver[Deliver Work]
    Deliver --> ReceivePayment[Receive Payment]
    
    ClientFlow --> BrowseServices[Browse/Search Services]
    BrowseServices --> ViewDetails[View Service Details]
    ViewDetails --> PlaceOrder[Place Order]
    PlaceOrder --> MakePayment[Make Payment]
    MakePayment --> ReceiveDelivery[Receive Delivery]
    ReceiveDelivery --> Review[Review & Rate]
    
    OfficerFlow --> Dashboard[Access Analytics Dashboard]
    Dashboard --> Monitor[Monitor Platform]
    Monitor --> ManageUsers[Manage Users]
    
    ReceivePayment --> End([End])
    Review --> End
    ManageUsers --> End
    
    classDef startEnd fill:#ffffff,stroke:#1f2937,stroke-width:2px,color:#111827
    classDef studentBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    classDef clientBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    classDef officerBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    
    class Start,End startEnd
    class StudentFlow,CreateGig,SetPricing,Publish,ManageBids,Deliver,ReceivePayment studentBox
    class ClientFlow,BrowseServices,ViewDetails,PlaceOrder,MakePayment,ReceiveDelivery,Review clientBox
    class OfficerFlow,Dashboard,Monitor,ManageUsers officerBox
```

---

## 🔄 Sequence Diagram - Service Creation & Order Flow

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'background': '#ffffff', 'primaryColor': '#ffffff', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'primaryTextColor': '#111827', 'textColor': '#111827', 'titleColor': '#111827', 'lineColor': '#1f2937', 'primaryBorderColor': '#1f2937', 'defaultLinkColor': '#1f2937', 'edgeLabelBackground': '#ffffff', 'arrowheadColor': '#1f2937', 'clusterBkg': '#ffffff', 'clusterBorder': '#1f2937', 'fontFamily': 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"', 'fontSize': '14px' }, 'sequence': { 'mirrorActors': false, 'actorMargin': 40, 'messageMargin': 40, 'boxMargin': 20, 'noteMargin': 20, 'messageFontSize': 14, 'noteFontSize': 13, 'actorFontSize': 14 } }}%%
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Routes
    participant S as Supabase
    participant R as Razorpay
    
    Note over U,R: Service Creation Flow
    U->>F: Create Service Request
    F->>A: POST /api/services
    A->>S: Validate & Store Service
    S-->>A: Service Created
    A-->>F: Service ID Response
    F-->>U: Service Published
    
    Note over U,R: Order & Payment Flow
    U->>F: Browse & Select Service
    F->>A: GET /api/services
    A->>S: Query Services
    S-->>A: Service List
    A-->>F: Filtered Services
    F-->>U: Display Services
    
    U->>F: Place Order
    F->>A: POST /api/orders
    A->>S: Create Order
    S-->>A: Order Created
    A-->>F: Order ID
    
    F->>R: Initiate Payment
    R-->>F: Payment Success
    F->>A: Update Payment Status
    A->>S: Mark Order Paid
    S-->>A: Confirmation
    A-->>F: Order Confirmed
    F-->>U: Order Success
```

---

## 🏗️ Class Diagram - System Architecture

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'background': '#ffffff', 'primaryColor': '#ffffff', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'primaryTextColor': '#111827', 'textColor': '#111827', 'titleColor': '#111827', 'lineColor': '#1f2937', 'primaryBorderColor': '#1f2937', 'defaultLinkColor': '#1f2937', 'edgeLabelBackground': '#ffffff', 'arrowheadColor': '#1f2937', 'clusterBkg': '#ffffff', 'clusterBorder': '#1f2937', 'fontFamily': 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"', 'fontSize': '14px' }, 'classDiagram': { 'diagramPadding': 12, 'titleTopMargin': 25, 'nodeSpacing': 40, 'rankSpacing': 60 } }}%%
classDiagram
    class User {
        +id: string
        +email: string
        +name: string
        +role: Role
        +profile: UserProfile
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
    
    class Category {
        +id: string
        +name: string
        +description: string
    }
    
    class Notification {
        +id: string
        +userId: string
        +type: string
        +message: string
        +read: boolean
        +send()
        +markAsRead()
    }
    
    %% Relationships
    User "1" --> "*" Service : creates
    User "1" --> "*" Order : places
    User "1" --> "*" Message : sends
    User "1" --> "*" Review : writes
    User "1" --> "*" Notification : receives
    
    Service "1" --> "*" Order : generates
    Service --> Category : belongs to
    
    Order "1" --> "1" Payment : has
    Order "1" --> "0..1" Review : receives
    
    %% Enumerations
    class Role {
        <<enumeration>>
        STUDENT
        CLIENT
        OFFICER
    }
    
    class ServiceStatus {
        <<enumeration>>
        DRAFT
        PUBLISHED
        PAUSED
    }
    
    class OrderStatus {
        <<enumeration>>
        PENDING
        PAID
        IN_PROGRESS
        COMPLETED
        CANCELLED
    }
    
    class PaymentStatus {
        <<enumeration>>
        PENDING
        COMPLETED
        FAILED
        REFUNDED
    }
```

---

## 🔧 Component Architecture Diagram

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'background': '#ffffff', 'primaryColor': '#ffffff', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'primaryTextColor': '#111827', 'textColor': '#111827', 'titleColor': '#111827', 'lineColor': '#1f2937', 'primaryBorderColor': '#1f2937', 'defaultLinkColor': '#1f2937', 'edgeLabelBackground': '#ffffff', 'arrowheadColor': '#1f2937', 'clusterBkg': '#ffffff', 'clusterBorder': '#1f2937', 'fontFamily': 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"', 'fontSize': '14px' }, 'flowchart': { 'nodeSpacing': 40, 'rankSpacing': 60, 'padding': 12 } }}%%
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
    
    classDef frontendBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    classDef backendBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    classDef externalBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    
    class App,Layout,Pages,Components,Hooks,Utils frontendBox
    class Auth,DB,Storage,Realtime,Functions backendBox
    class Razorpay,Email,CDN externalBox
```

---

## 📊 Data Flow Architecture

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'background': '#ffffff', 'primaryColor': '#ffffff', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'primaryTextColor': '#111827', 'textColor': '#111827', 'titleColor': '#111827', 'lineColor': '#1f2937', 'primaryBorderColor': '#1f2937', 'defaultLinkColor': '#1f2937', 'edgeLabelBackground': '#ffffff', 'arrowheadColor': '#1f2937', 'clusterBkg': '#ffffff', 'clusterBorder': '#1f2937', 'fontFamily': 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"', 'fontSize': '14px' }, 'flowchart': { 'nodeSpacing': 40, 'rankSpacing': 60, 'padding': 12 } }}%%
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
%%{init: { 'theme': 'base', 'themeVariables': { 'background': '#ffffff', 'primaryColor': '#ffffff', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'primaryTextColor': '#111827', 'textColor': '#111827', 'titleColor': '#111827', 'lineColor': '#1f2937', 'primaryBorderColor': '#1f2937', 'defaultLinkColor': '#1f2937', 'edgeLabelBackground': '#ffffff', 'arrowheadColor': '#1f2937', 'clusterBkg': '#ffffff', 'clusterBorder': '#1f2937', 'fontFamily': 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"', 'fontSize': '14px' }, 'flowchart': { 'nodeSpacing': 40, 'rankSpacing': 60, 'padding': 12 } }}%%
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
    
    classDef prodBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    classDef devBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    
    class Vercel,Supabase,External,Frontend,API,Database,Auth,Storage,Razorpay,Email prodBox
    class Local,DevServer,LocalSupabase devBox
```

---

## 📱 Mobile-First Architecture

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'background': '#ffffff', 'primaryColor': '#ffffff', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'primaryTextColor': '#111827', 'textColor': '#111827', 'titleColor': '#111827', 'lineColor': '#1f2937', 'primaryBorderColor': '#1f2937', 'defaultLinkColor': '#1f2937', 'edgeLabelBackground': '#ffffff', 'arrowheadColor': '#1f2937', 'clusterBkg': '#ffffff', 'clusterBorder': '#1f2937', 'fontFamily': 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"', 'fontSize': '14px' }, 'flowchart': { 'nodeSpacing': 40, 'rankSpacing': 60, 'padding': 12 } }}%%
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
    
    classDef mobileBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    classDef pwaBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    classDef uiBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    
    class Mobile mobileBox
    class ServiceWorker,Responsive,Offline,Push pwaBox
    class Navigation,Touch,Gestures,Camera uiBox
```

---

## 🔒 Security Architecture

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'background': '#ffffff', 'primaryColor': '#ffffff', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'primaryTextColor': '#111827', 'textColor': '#111827', 'titleColor': '#111827', 'lineColor': '#1f2937', 'primaryBorderColor': '#1f2937', 'defaultLinkColor': '#1f2937', 'edgeLabelBackground': '#ffffff', 'arrowheadColor': '#1f2937', 'clusterBkg': '#ffffff', 'clusterBorder': '#1f2937', 'fontFamily': 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"', 'fontSize': '14px' }, 'flowchart': { 'nodeSpacing': 40, 'rankSpacing': 60, 'padding': 12 } }}%%
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
    
    classDef securityBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    classDef authBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    classDef dataBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    
    class Security securityBox
    class Auth,Authz,SupabaseAuth,JWT,Social,RLS,UserPolicies,RolePolicies authBox
    class Validation,Encryption,Zod,Sanitization,SSL,DataAtRest,EnvVars,PaymentSecurity,PCI,Escrow dataBox
```

---

## 🎨 UI/UX Architecture

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'background': '#ffffff', 'primaryColor': '#ffffff', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'primaryTextColor': '#111827', 'textColor': '#111827', 'titleColor': '#111827', 'lineColor': '#1f2937', 'primaryBorderColor': '#1f2937', 'defaultLinkColor': '#1f2937', 'edgeLabelBackground': '#ffffff', 'arrowheadColor': '#1f2937', 'clusterBkg': '#ffffff', 'clusterBorder': '#1f2937', 'fontFamily': 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"', 'fontSize': '14px' }, 'flowchart': { 'nodeSpacing': 40, 'rankSpacing': 60, 'padding': 12 } }}%%
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
    
    classDef designBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    classDef themeBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    classDef uxBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    
    class DesignSystem designBox
    class Theme,DarkMode,Colors,Typography themeBox
    class Components,Shadcn,Custom,Layout,Guidelines,Responsive,Accessibility,Animations,UX,Loading,Errors,Feedback uxBox
```

---

## 📈 Performance Architecture

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'background': '#ffffff', 'primaryColor': '#ffffff', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'primaryTextColor': '#111827', 'textColor': '#111827', 'titleColor': '#111827', 'lineColor': '#1f2937', 'primaryBorderColor': '#1f2937', 'defaultLinkColor': '#1f2937', 'edgeLabelBackground': '#ffffff', 'arrowheadColor': '#1f2937', 'clusterBkg': '#ffffff', 'clusterBorder': '#1f2937', 'fontFamily': 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"', 'fontSize': '14px' }, 'flowchart': { 'nodeSpacing': 40, 'rankSpacing': 60, 'padding': 12 } }}%%
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
    
    classDef perfBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    classDef frontendBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    classDef backendBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    classDef monitorBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    
    class Performance perfBox
    class Frontend,CodeSplit,LazyLoad,Images,Cache frontendBox
    class Backend,API,Connection,Edge,Database,Queries,Indexes,Connections backendBox
    class Monitoring,Metrics,Tracking,Analytics monitorBox
```

---

## 🔄 State Management Architecture

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'background': '#ffffff', 'primaryColor': '#ffffff', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'primaryTextColor': '#111827', 'textColor': '#111827', 'titleColor': '#111827', 'lineColor': '#1f2937', 'primaryBorderColor': '#1f2937', 'defaultLinkColor': '#1f2937', 'edgeLabelBackground': '#ffffff', 'arrowheadColor': '#1f2937', 'clusterBkg': '#ffffff', 'clusterBorder': '#1f2937', 'fontFamily': 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"', 'fontSize': '14px' }, 'flowchart': { 'nodeSpacing': 40, 'rankSpacing': 60, 'padding': 12 } }}%%
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
    
    classDef stateBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    classDef clientBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    classDef serverBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    classDef realtimeBox fill:#ffffff,stroke:#1f2937,stroke-width:1.5px,color:#111827
    
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
