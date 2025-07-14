"use client";
import { useState } from "react";
import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { UserRole } from "@/components/dashboard/role-selector";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("General");

  return (
    <div className="flex min-h-screen w-full bg-[#0A0F26]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header currentRole={currentRole} onRoleChange={setCurrentRole} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
} 