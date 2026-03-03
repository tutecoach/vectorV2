import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";

// Lazy-loaded dashboard pages — loaded on demand to reduce initial bundle
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"));
const ClientsPage = lazy(() => import("./pages/dashboard/ClientsPage"));
const PlanningPage = lazy(() => import("./pages/dashboard/PlanningPage"));
const FinancePage = lazy(() => import("./pages/dashboard/FinancePage"));
const InventoryPage = lazy(() => import("./pages/dashboard/InventoryPage"));
const ReportsPage = lazy(() => import("./pages/dashboard/ReportsPage"));
const CompliancePage = lazy(() => import("./pages/dashboard/CompliancePage"));
const ConfigPage = lazy(() => import("./pages/dashboard/ConfigPage"));
const PortalPage = lazy(() => import("./pages/dashboard/PortalPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const LazyFallback = () => (
  <div className="flex items-center justify-center py-20">
    <div className="h-6 w-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Suspense fallback={<LazyFallback />}><DashboardHome /></Suspense>} />
              <Route path="clients" element={<Suspense fallback={<LazyFallback />}><ClientsPage /></Suspense>} />
              <Route path="planning" element={<Suspense fallback={<LazyFallback />}><PlanningPage /></Suspense>} />
              <Route path="finance" element={<Suspense fallback={<LazyFallback />}><FinancePage /></Suspense>} />
              <Route path="inventory" element={<Suspense fallback={<LazyFallback />}><InventoryPage /></Suspense>} />
              <Route path="reports" element={<Suspense fallback={<LazyFallback />}><ReportsPage /></Suspense>} />
              <Route path="compliance" element={<Suspense fallback={<LazyFallback />}><CompliancePage /></Suspense>} />
              <Route path="config" element={<Suspense fallback={<LazyFallback />}><ProtectedRoute allowedRoles={["admin"]}><ConfigPage /></ProtectedRoute></Suspense>} />
              <Route path="portal" element={<Suspense fallback={<LazyFallback />}><PortalPage /></Suspense>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

