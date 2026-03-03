import {
  LayoutDashboard,
  Users,
  CalendarClock,
  DollarSign,
  Package,
  BarChart3,
  ShieldCheck,
  Settings,
  Globe,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import logoVector from "@/assets/isologo-vector.jpg";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

const modules = [
  { title: "Inicio", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Clientes (CRM)", icon: Users, path: "/dashboard/clients" },
  { title: "Planificación", icon: CalendarClock, path: "/dashboard/planning" },
  { title: "Finanzas", icon: DollarSign, path: "/dashboard/finance" },
  { title: "Inventario", icon: Package, path: "/dashboard/inventory" },
  { title: "Reportes y BI", icon: BarChart3, path: "/dashboard/reports" },
  { title: "Calidad", icon: ShieldCheck, path: "/dashboard/compliance" },
  { title: "Configuración", icon: Settings, path: "/dashboard/config" },
];

const external = [
  { title: "Portal del Cliente", icon: Globe, path: "/dashboard/portal" },
];

export default function DashboardSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={logoVector} alt="VECTOR" className="h-9 w-9 rounded-md object-cover" />
          <div className="flex flex-col">
            <span className="font-heading font-bold text-sm text-foreground leading-tight">VECTOR</span>
            <span className="text-[11px] text-muted-foreground leading-tight">Sistema MIP</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading mb-1">
            Módulos
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {modules.map((mod) => (
                <SidebarMenuItem key={mod.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={mod.path}
                      end={mod.path === "/dashboard"}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-body text-foreground transition-colors hover:bg-muted"
                      activeClassName="bg-secondary/10 text-secondary font-medium"
                    >
                      <mod.icon className="h-[18px] w-[18px] shrink-0" />
                      <span>{mod.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading mb-1 mt-2">
            Externo
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {external.map((mod) => (
                <SidebarMenuItem key={mod.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={mod.path}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-body text-foreground transition-colors hover:bg-muted"
                      activeClassName="bg-secondary/10 text-secondary font-medium"
                    >
                      <mod.icon className="h-[18px] w-[18px] shrink-0" />
                      <span>{mod.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="h-[18px] w-[18px]" />
          <span>Cerrar sesión</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
