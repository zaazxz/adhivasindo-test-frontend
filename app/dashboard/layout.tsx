import Sidebar from "@/components/modules/dashboard/Sidebar";
import Topbar from "@/components/modules/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-dashboard-bg">
      <Topbar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 p-3 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
