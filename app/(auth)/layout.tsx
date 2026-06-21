import Link from "next/link";
import { Coffee, ShoppingBag, Heart } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Brand / Image (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#f59e0b] relative flex-col justify-between p-12 overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-600/20 rounded-full blur-3xl"></div>
        
        {/* Top Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-block cursor-pointer">
            <div className="flex flex-col">
              <span className="text-5xl font-bold text-white tracking-tighter drop-shadow-md" style={{ fontFamily: "cursive" }}>Kkomi</span>
              <span className="text-xs font-semibold text-amber-100 -mt-1 ml-1 tracking-widest uppercase">Korean Cafe 1989</span>
            </div>
          </Link>
        </div>

        {/* Center Content */}
        <div className="relative z-10 my-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Sip, Savor, <br /> and Smile.
          </h1>
          <p className="text-lg text-amber-50 max-w-md font-medium leading-relaxed mb-10">
            Join Kkomi today to unlock exclusive rewards, track your favorite orders, and enjoy the true taste of Korea right at your doorstep.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-inner border border-white/30">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <div className="text-base font-bold text-white">Premium Quality</div>
                <div className="text-sm text-amber-100">Only the best ingredients</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-inner border border-white/30">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <div className="text-base font-bold text-white">Fast Delivery</div>
                <div className="text-sm text-amber-100">Fresh to your door</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-inner border border-white/30">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <div className="text-base font-bold text-white">Member Rewards</div>
                <div className="text-sm text-amber-100">Earn points on every cup</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="relative z-10 text-sm font-medium text-amber-200">
          © {new Date().getFullYear()} Kkomi. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-20 bg-gray-50/50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 text-center">
            <Link href="/" className="inline-block cursor-pointer">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-[#f59e0b] tracking-tighter drop-shadow-sm" style={{ fontFamily: "cursive" }}>Kkomi</span>
                <span className="text-[10px] font-bold text-gray-400 -mt-1 tracking-widest uppercase">Korean Cafe</span>
              </div>
            </Link>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
