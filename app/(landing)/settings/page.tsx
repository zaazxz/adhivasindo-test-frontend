import ProfileSidebar from "@/components/modules/landing/ProfileSidebar";
import SettingsClient from "@/components/modules/landing/SettingsClient";

export const metadata = {
  title: "Account Settings - Adivashindo",
};

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Account Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <ProfileSidebar />
        <SettingsClient />
      </div>
    </div>
  );
}
