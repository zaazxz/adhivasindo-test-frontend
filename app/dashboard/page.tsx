import StatCards from "@/components/modules/dashboard/StatCards";
import SalesChartPanel from "@/components/modules/dashboard/SalesChartPanel";
import BestSellerPanel from "@/components/modules/dashboard/BestSellerPanel";
import StockPanel from "@/components/modules/dashboard/StockPanel";

export const metadata = {
  title: "Dashboard - Adivashindo",
  description: "Dashboard panel for Adivashindo Online Shop",
};

export default function DashboardPage() {
  return (
    <>
      <StatCards />
      <div className="grid grid-cols-10 gap-5 items-stretch">
        <div className="col-span-4 h-full">
          <SalesChartPanel />
        </div>
        <div className="col-span-3 h-full">
          <BestSellerPanel />
        </div>
        <div className="col-span-3 h-full">
          <StockPanel />
        </div>
      </div>
    </>
  );
}
