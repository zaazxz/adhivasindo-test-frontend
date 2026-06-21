"use client";

import { useState } from "react";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import { toast } from "@/store/useToastStore";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = () => {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribing(true);
    setTimeout(() => {
      setSubscribing(false);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }, 1000);
  };

  const handleSocial = (platform: string) => {
    toast.info(`${platform} page coming soon!`);
  };

  const handleLink = (label: string) => {
    toast.info(`${label} coming soon!`);
  };

  return (
    <footer className="border-t border-gray-100 py-16 mt-10 print:hidden">
      <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-10 text-center md:text-left">
        <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start">
          <div className="flex flex-col mb-8 items-center md:items-start">
            <span className="text-4xl font-bold text-[#f59e0b] tracking-tighter" style={{ fontFamily: "cursive" }}>Kkomi</span>
            <span className="text-[10px] font-medium text-gray-400 -mt-1 ml-1">Korean Cafe - 1989</span>
          </div>
          <div className="flex gap-4 text-gray-400 justify-center md:justify-start">
            <button onClick={() => handleSocial("Facebook")} className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center hover:text-white hover:bg-[#1877f2] hover:border-[#1877f2] transition-all active:scale-90 cursor-pointer"><FaFacebookF className="w-[14px] h-[14px]" /></button>
            <button onClick={() => handleSocial("YouTube")} className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center hover:text-white hover:bg-[#ff0000] hover:border-[#ff0000] transition-all active:scale-90 cursor-pointer"><FaYoutube className="w-[14px] h-[14px]" /></button>
            <button onClick={() => handleSocial("Instagram")} className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center hover:text-white hover:bg-gradient-to-br hover:from-[#f58529] hover:via-[#dd2a7b] hover:to-[#8134af] hover:border-[#dd2a7b] transition-all active:scale-90 cursor-pointer"><FaInstagram className="w-[14px] h-[14px]" /></button>
          </div>
        </div>
        
        <div>
          <h4 className="text-[13px] font-bold text-gray-800 mb-5">Ultras</h4>
          <ul className="flex flex-col gap-3 text-[11px] font-medium text-gray-500">
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("About Us"); }} className="hover:text-[#f59e0b] transition-colors">About Us</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("Conditions"); }} className="hover:text-[#f59e0b] transition-colors">Conditions</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("Our Journals"); }} className="hover:text-[#f59e0b] transition-colors">Our Journals</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("Careers"); }} className="hover:text-[#f59e0b] transition-colors">Careers</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("Affiliate Programme"); }} className="hover:text-[#f59e0b] transition-colors">Affiliate Programme</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("Ultras Press"); }} className="hover:text-[#f59e0b] transition-colors">Ultras Press</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[13px] font-bold text-gray-800 mb-5">Customer Service</h4>
          <ul className="flex flex-col gap-3 text-[11px] font-medium text-gray-500">
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("FAQ"); }} className="hover:text-[#f59e0b] transition-colors">FAQ</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("Contact"); }} className="hover:text-[#f59e0b] transition-colors">Contact</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("Privacy Policy"); }} className="hover:text-[#f59e0b] transition-colors">Privacy Policy</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("Returns & Refunds"); }} className="hover:text-[#f59e0b] transition-colors">Returns & Refunds</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("Cookie Guidelines"); }} className="hover:text-[#f59e0b] transition-colors">Cookie Guidelines</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("Delivery Information"); }} className="hover:text-[#f59e0b] transition-colors">Delivery Information</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[13px] font-bold text-gray-800 mb-5">Information</h4>
          <ul className="flex flex-col gap-3 text-[11px] font-medium text-gray-500">
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("Store Locations"); }} className="hover:text-[#f59e0b] transition-colors">Store Locations</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("Order Tracking"); }} className="hover:text-[#f59e0b] transition-colors">Order Tracking</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("Size Guide"); }} className="hover:text-[#f59e0b] transition-colors">Size Guide</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("Payment Methods"); }} className="hover:text-[#f59e0b] transition-colors">Payment Methods</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("Gift Cards"); }} className="hover:text-[#f59e0b] transition-colors">Gift Cards</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink("Promotions"); }} className="hover:text-[#f59e0b] transition-colors">Promotions</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[13px] font-bold text-gray-800 mb-5">Subscribe Us</h4>
          <p className="text-[11px] font-medium text-gray-500 mb-4 leading-loose">Subscribe to our newsletter to get updates about our grand offers.</p>
          <div className="flex h-10">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              placeholder="Email Address"
              disabled={subscribing}
              className="bg-[#f8f9fa] px-4 py-2 text-[11px] font-medium w-full outline-none placeholder-gray-400 disabled:opacity-50"
            />
            <button
              onClick={handleSubscribe}
              disabled={subscribing || !email}
              className="bg-gray-900 text-white text-[11px] font-bold px-6 py-2 hover:bg-[#f59e0b] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all whitespace-nowrap active:scale-95 cursor-pointer"
            >
              {subscribing ? "..." : "Subscribe"}
            </button>
          </div>
          {subscribed && (
            <div className="mt-2 text-[10px] font-semibold text-green-500 animate-[fadeIn_0.3s_ease-out]">
              ✓ Successfully subscribed! Check your inbox.
            </div>
          )}
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-4 mt-16 text-[11px] font-medium text-gray-400 text-center md:text-left">
        © 2025 Adivashindo. All rights reserved.
      </div>
    </footer>
  );
}
