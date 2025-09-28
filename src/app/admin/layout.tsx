"use client";

import { AppProvider } from "../providers/AppProvider";
import { AdminLayout } from "../../components/AdminLayout";
import { ErrorBoundary } from "../../components/ErrorBoundary";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <AdminLayout>{children}</AdminLayout>
        </div>
      </ErrorBoundary>
    </AppProvider>
  );
}