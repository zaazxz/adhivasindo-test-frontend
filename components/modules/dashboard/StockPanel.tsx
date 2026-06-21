const stockData = [
  { name: "Sunstar Fresh Melon Juice", qty: 80, color: "bg-[#3b82f6]" },
  { name: "Sunstar Fresh Fruit Juice", qty: 50, color: "bg-[#4b5563]" },
  { name: "Sunstar Fresh Strawberry Juice", qty: 20, color: "bg-[#60a5fa]" },
  { name: "Sunstar Fresh Banana Juice", qty: 60, color: "bg-[#4b5563]" },
  { name: "Chocolate", qty: 40, color: "bg-[#3b82f6]" },
];

export default function StockPanel() {
  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 h-[340px]">
      <div className="font-bold text-[13px] text-gray-800 mb-6">Stok Barang</div>
      
      <div className="flex flex-col gap-[18px]">
        {stockData.map(item => (
          <div key={item.name}>
            <div className="flex justify-between items-center text-[11px] mb-1.5">
              <span className="font-semibold text-gray-700">{item.name}</span>
              <span className="font-medium text-gray-400">{item.qty}</span>
            </div>
            <div className="w-full h-[3px] bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${item.color}`} 
                style={{ width: `${item.qty}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
