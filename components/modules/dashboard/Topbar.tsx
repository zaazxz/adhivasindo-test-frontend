import { FiSearch, FiBell, FiUser, FiMenu } from "react-icons/fi";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between h-[60px] bg-[#3b63f6] px-6 text-white shrink-0">
      <div className="flex items-center">
        {/* Logo Section */}
        <div className="w-[200px] flex flex-col justify-center">
          <div className="flex items-center gap-1">
            <span className="text-[26px] font-bold tracking-tight leading-none">
              <span className="text-[#a3e635]">a</span>
              <span className="text-white">W</span>
              <span className="text-white">H</span>
            </span>
          </div>
          <span className="text-[7px] text-white/80 leading-none mt-1">Integrate your dream</span>
        </div>
        
        {/* Hamburger Menu */}
        <button className="text-white text-xl hover:opacity-80 transition-opacity ml-4">
          <FiMenu />
        </button>
      </div>
      
      {/* Right Actions */}
      <div className="flex items-center gap-5">
        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-[#5176f7] rounded-md px-3 py-1.5 w-[280px]">
          <FiSearch className="text-white/80 text-sm" />
          <input
            type="text"
            placeholder="Search..."
            className="border-none outline-none text-[13px] text-white bg-transparent w-full placeholder-white/80"
          />
        </div>
        
        {/* Icons */}
        <button className="text-white hover:opacity-80 relative">
          <FiBell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>
        <button className="text-white hover:opacity-80">
          <FiUser size={18} />
        </button>
      </div>
    </header>
  );
}
