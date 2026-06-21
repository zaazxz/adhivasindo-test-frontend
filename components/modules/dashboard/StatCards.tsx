import { FiCalendar, FiFileText, FiThumbsUp } from "react-icons/fi";
import { AiOutlineDollarCircle } from "react-icons/ai";

interface StatCardProps {
  value: string;
  label: string;
  valueColor: string;
  bottomColor: string;
  icon: React.ReactNode;
}

function StatCard({ value, label, valueColor, bottomColor, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col relative overflow-hidden h-[105px]">
      <div className="flex-1 flex justify-between items-center px-6">
        <div>
          <div className={`text-[22px] font-bold tracking-tight ${valueColor}`}>{value}</div>
          <div className="text-[11px] text-gray-500 mt-1 font-semibold">{label}</div>
        </div>
        <div>{icon}</div>
      </div>
      {/* Bottom thick border matching reference */}
      <div className={`h-2.5 w-full ${bottomColor}`} />
    </div>
  );
}

const cards: StatCardProps[] = [
  {
    value: "Rp. 50.000.000",
    label: "Total Semua Pendapatan",
    valueColor: "text-[#f59e0b]",
    bottomColor: "bg-[#f59e0b]",
    icon: (
      <div className="w-10 h-10 rounded-full border-2 border-[#f59e0b] flex items-center justify-center text-[#f59e0b]">
        <AiOutlineDollarCircle size={22} />
      </div>
    ),
  },
  {
    value: "145",
    label: "Stok Barang",
    valueColor: "text-[#ef4444]",
    bottomColor: "bg-[#ef4444]",
    icon: <FiCalendar className="text-[#ef4444]" size={32} />,
  },
  {
    value: "290+",
    label: "Barang Telah Terjual",
    valueColor: "text-[#10b981]",
    bottomColor: "bg-[#10b981]",
    icon: <FiFileText className="text-[#10b981]" size={32} />,
  },
  {
    value: "5",
    label: "Kategori Barang",
    valueColor: "text-[#3b82f6]",
    bottomColor: "bg-[#3b82f6]",
    icon: <FiThumbsUp className="text-[#3b82f6]" size={32} />,
  },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-4 gap-5 mb-5">
      {cards.map((card, i) => (
        <StatCard key={i} {...card} />
      ))}
    </div>
  );
}
