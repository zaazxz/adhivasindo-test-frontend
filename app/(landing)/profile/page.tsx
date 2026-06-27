import ProfileSidebar from "@/components/modules/landing/ProfileSidebar";
import ProfileClient from "@/components/modules/landing/ProfileClient";

export const metadata = {
  title: "My Profile - Adivashindo",
};

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">My Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <ProfileSidebar />
        <ProfileClient />
      </div>
    </div>
  );
}
