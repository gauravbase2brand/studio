
"use client";

import { withAuth } from "@/lib/auth";

function DashboardLayoutContent({
  children,
}) {
  return <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">{children}</div>
}

export default DashboardLayoutContent;
