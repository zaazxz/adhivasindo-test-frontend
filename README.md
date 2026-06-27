# Adhivasindo E-Commerce Frontend Assessment

This project is the Frontend application for the recruitment test at **PT. Adhikari Inovasi Indonesia (Adhivasindo)**. It is a full-fledged Next.js E-Commerce storefront and an admin dashboard, tightly integrated with a Laravel API backend.

## 🔗 Related Repository
* **Backend Repository:** [https://github.com/zaazxz/adhivasindo-test-backend](https://github.com/zaazxz/adhivasindo-test-backend)

## 🛠 Tech Stack
This project leverages modern frontend technologies for high performance and excellent developer experience:
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand (for Cart, Auth, and UI state)
- **HTTP Client:** Axios (configured with interceptors and cookie management)
- **Icons:** Lucide React & React Icons
- **Date Management:** date-fns

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
- Node.js (v18.17 or higher recommended)
- The backend API must be running locally (default: `http://localhost:8000`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd fe-olshop-adivashindo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and specify the backend API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Open the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Features & Usage Tutorial

### Storefront & Customer Features
- **Browsing Products:** View all available products directly on the landing page with interactive pagination.
- **Smart Category Filtering:** Dynamically filter products by category. The category section automatically truncates (Show More/Less) for a cleaner UI, and textual tabs are hidden for a streamlined look.
- **Cart System:** Click "Add to Cart" on any product. A floating shopping cart will store your items persistently using Zustand.
- **Checkout:** Once you have items in your cart, click the Cart icon to review and click "Checkout" to place an order (requires login).
- **Customer Profile:** Customers can manage their personal information (Name, Email) via the "My Profile" page.
- **Security & Settings:** Customers can securely change their password directly from the Account Settings page.

### Admin Dashboard (`/dashboard`)
To access the dashboard, log in with an administrator account.
- **Master Barang:** Manage your product catalog. You can add new products, edit descriptions and prices, upload images, and manage stock.
  - *New Workflow:* Added automated product statuses (`draft`, `active`, `out-of-stock`). New products or restocked empty products automatically go to `draft` first before being manually activated.
  - *Status Badges:* Products in the landing page show real-time UI badges like `Draft`, `Out of Stock`, `New`, and `Best Seller` (derived directly from real transaction data).
- **Tipe Produk:** Create and manage product categories.
- **Riwayat Transaksi:** View a comprehensive list of all customer orders. You can print invoices, change order statuses (e.g., from "Pending" to "Paid"), and track shipments.
- **Dashboard Analytics:** View real-time statistics, a sales chart, and a Best Seller list based on completed transactions.

## 💡 Notes & Disclaimer

*First of all, I sincerely apologize if there are any undiscovered bugs or incomplete edge cases due to the limited time given for this technical test. I have prioritized robust architecture, clean code (custom hooks, constants separation, centralized types), and completing the core requirements.*

I am highly open to constructive **criticism and suggestions**. I view this test as a great learning opportunity and I am eager to improve my skills and learn the best practices used at PT. Adhikari Inovasi Indonesia. 

Thank you for your time and consideration!
