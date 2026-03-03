import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

const titleMap: Record<string, string> = {
  "/dashboard": "Centro de Control",
  "/dashboard/clients": "Clientes (CRM)",
  "/dashboard/planning": "Planificación y Operaciones",
  "/dashboard/finance": "Administración y Finanzas",
  "/dashboard/inventory": "Inventario",
  "/dashboard/reports": "Reportes y Analíticas",
  "/dashboard/compliance": "Calidad y Cumplimiento",
  "/dashboard/config": "Configuración del Sistema",
  "/dashboard/portal": "Portal del Cliente",
};

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const title = titleMap[pathname] || "VECTOR";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader title={title} />
          <main className="flex-1 overflow-auto bg-muted/30 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
