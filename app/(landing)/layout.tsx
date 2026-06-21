import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import CartDrawer from "@/components/shared/CartDrawer";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-sans">
      <Header />
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 py-12 print:py-0 print:px-0">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
