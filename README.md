# Student Market - Pune's Premier Student Services Platform

Welcome to Student Market, a comprehensive marketplace designed to connect students in Pune, India, for various services like tutoring, design, coding, and more. This platform aims to foster a competitive and collaborative environment, enabling students to easily offer their skills and find opportunities.

## ✨ Features

### 1. Gig Creation & Management
- **Intuitive Gig Creation Wizard**: A four-step guided process for students to create new gig offerings.
- **Service vs. Request Gigs**: Differentiate between services offered (e.g., "I will tutor math") and requests for services (e.g., "I need a logo designed").
- **Smart Pricing Tiers**: Flexible pricing options with support for Indian Rupees (₹).
- **Skill Level & Collaboration Type**: Define expertise levels and preferred collaboration methods.
- **Media Upload & Preview**: Easily upload images and other media with real-time previews.
- **Real-time Gig Preview**: See how your gig will look before publishing.

### 2. Advanced Bidding System
- **Competitive Bidding**: For request-type gigs, students can submit bids, fostering a competitive environment.
- **Bid Management Dashboard**: A dedicated section for gig creators to view, manage, accept, or reject bids.
- **Bid Proposals**: Students can submit detailed proposals along with their bids.
- **Bid Withdrawal**: Students can withdraw their bids if needed.
- **Real-time Bid Notifications**: Instant alerts for new bids, accepted bids, or rejected bids.

### 3. Secure Payment System
- **Multiple Payment Methods**: Supports UPI, Wallet, Credit/Debit Cards, and Net Banking for seamless transactions.
- **Escrow Protection**: Funds are held securely until the gig is completed and approved by both parties, ensuring trust and security.
- **Indian Payment Integration**: Optimized for local payment gateways and currency.
- **Transaction Security**: Implements SSL encryption and fraud detection mechanisms.

### 4. Real-time Messaging System
- **Instant Communication**: Direct messaging between students and gig creators for clarity and collaboration.
- **File & Image Sharing**: Share relevant documents, designs, or project files within the chat.
- **Online Status & Typing Indicators**: Enhance the real-time communication experience.
- **Conversation Management**: Search, filter, and archive conversations for easy access.

### 5. Comprehensive Review System
- **5-Star Rating & Detailed Feedback**: Students can provide ratings and written reviews for completed gigs.
- **Review Analytics**: Insights into average ratings, review distribution, and overall feedback trends.
- **Seller Response Functionality**: Gig creators can respond to reviews, addressing feedback and building reputation.
- **Helpful Voting**: Users can mark reviews as helpful, promoting valuable feedback.

### 6. Analytics Dashboard
- **Earnings & Performance Tracking**: Monitor income, gig views, conversion rates, and other key metrics.
- **Bidding Success Analytics**: Analyze bid acceptance rates and identify trends to improve future bids.
- **AI-Powered Insights**: Gain recommendations for optimizing gig offerings and pricing.
- **Market Trend Analysis**: Understand popular services and demand in the Pune student market.

### 7. Mobile-First Design
- **Responsive Layouts**: Optimized for seamless experience across all mobile devices.
- **Bottom Navigation**: Intuitive navigation bar at the bottom for easy one-handed access.
- **Touch-Friendly Interfaces**: Large, well-spaced buttons and interactive elements.
- **Progressive Web App (PWA) Features**: Installable on home screen, offline capabilities for basic functions, and push notifications.

### 8. User Authentication & Profiles
- **Secure Sign-in/Sign-up**: Robust authentication system.
- **User Profiles**: Personalized profiles displaying skills, completed gigs, reviews, and wallet balance.

## 🛠️ Technologies Used

-   **Next.js (App Router)**: React framework for building full-stack web applications.
-   **React**: JavaScript library for building user interfaces.
-   **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
-   **shadcn/ui**: Reusable UI components built with Radix UI and Tailwind CSS.
-   **Lucide React**: Beautifully crafted open-source icons.
-   **Supabase**: Backend-as-a-Service for database, authentication, and real-time subscriptions.
-   **Framer Motion**: For smooth animations and transitions.

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18.x or higher)
-   npm or Yarn
-   A Supabase project (for database and authentication)

### Installation

1.  **Clone the repository:**
    \`\`\`bash
    git clone [repository-url]
    cd student-market
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`

3.  **Set up Supabase:**
    *   Go to [Supabase](https://supabase.com/) and create a new project.
    *   Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from your project settings (API section).
    *   Set up your database schema using the SQL script provided in `scripts/database-setup.sql`. You can run this directly in your Supabase SQL Editor.

4.  **Configure Environment Variables:**
    Create a `.env.local` file in the root of your project and add your Supabase credentials:
    \`\`\`
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY" # For server-side operations if needed
    \`\`\`

### Running the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

This will create an optimized production build in the `.next` folder.

### Running the Production Build

\`\`\`bash
npm start
# or
yarn start
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you find any bugs or have suggestions for improvements.

## 📄 License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).
