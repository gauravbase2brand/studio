

"use client";

import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardTopNav } from "@/components/dashboard-top-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function DashboardLayoutContent({ children }) {
    return (
        <div className="flex flex-col">
            <DashboardTopNav />
            <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto">
                {children}
            </div>
        </div>
    )
}

export default function DashboardLayout({
  children,
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div>Loading...</div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="bg-muted/40">
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </SidebarInset>
    </SidebarProvider>
  );
}
