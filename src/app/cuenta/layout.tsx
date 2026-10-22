import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { AccountSidebar } from "@/features/account/components/AccountSidebar";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-transparent py-8 md:py-12 text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
