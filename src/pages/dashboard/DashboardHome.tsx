import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  DollarSign,
  AlertTriangle,
  CheckSquare,
  CalendarDays,
  Brain,
  MapPin,
  Plus,
  Users,
  FileText,
  TrendingUp,
  Clock,
} from "lucide-react";

const kpis = [
  { label: "Servicios para Hoy", value: "24", change: "+3 vs ayer", icon: ClipboardList, color: "text-primary" },
  { label: "Facturas Vencidas", value: "3", change: "$132K total", icon: DollarSign, color: "text-destructive" },
  { label: "Tareas Pendientes", value: "11", change: "5 urgentes", icon: CheckSquare, color: "text-secondary" },
  { label: "Alertas de Stock", value: "4", change: "2 críticos", icon: AlertTriangle, color: "text-destructive" },
];

const agenda = [
  { time: "08:00", client: "Alimentos del Sur S.A.", service: "Desratización", tech: "Carlos M.", status: "En curso", priority: "alta" },
  { time: "09:30", client: "Hotel Pacífico", service: "Fumigación General", tech: "Ana R.", status: "Pendiente", priority: "media" },
  { time: "11:00", client: "Supermercado La Unión", service: "Inspección HACCP", tech: "Luis P.", status: "Pendiente", priority: "alta" },
  { time: "14:00", client: "Frigorífico Norte", service: "Control Integral", tech: "Carlos M.", status: "Programado", priority: "media" },
  { time: "15:30", client: "Restaurant El Roble", service: "Desinsectación", tech: "María G.", status: "Programado", priority: "baja" },
];

const technicians = [
  { name: "Carlos M.", lat: -31.42, lng: -68.53, status: "En campo" },
  { name: "Ana R.", lat: -31.44, lng: -68.51, status: "En tránsito" },
  { name: "Luis P.", lat: -31.40, lng: -68.55, status: "Disponible" },
  { name: "María G.", lat: -31.43, lng: -68.49, status: "En campo" },
];

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button size="sm" className="bg-primary font-heading text-sm">
          <Plus className="h-4 w-4 mr-1" /> Nuevo Servicio
        </Button>
        <Button size="sm" variant="outline" className="font-heading text-sm border-secondary text-secondary hover:bg-secondary/10">
          <Users className="h-4 w-4 mr-1" /> Nuevo Cliente
        </Button>
        <Button size="sm" variant="outline" className="font-heading text-sm">
          <FileText className="h-4 w-4 mr-1" /> Generar Factura
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                <span className="text-[10px] text-muted-foreground font-body">{kpi.change}</span>
              </div>
              <p className="text-2xl font-heading font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Agenda Dinámica + IA Priorización */}
        <Card className="lg:col-span-2 border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-secondary" />
              Agenda del Día
              <Badge className="bg-secondary/10 text-secondary text-[10px] border-0">
                <Brain className="h-3 w-3 mr-1" /> Priorización IA
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-6 text-[11px] font-heading font-semibold text-muted-foreground uppercase tracking-wide pb-2 border-b border-border">
                <span>Hora</span><span>Cliente</span><span>Servicio</span><span>Técnico</span><span>Prioridad</span><span>Estado</span>
              </div>
              {agenda.map((item, i) => (
                <div key={i} className="grid grid-cols-6 text-sm py-2.5 border-b border-border/50 last:border-0 font-body items-center">
                  <span className="font-medium text-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" /> {item.time}
                  </span>
                  <span className="text-foreground truncate">{item.client}</span>
                  <span className="text-muted-foreground text-xs">{item.service}</span>
                  <span className="text-muted-foreground text-xs">{item.tech}</span>
                  <Badge variant="outline" className={`text-[10px] w-fit ${
                    item.priority === "alta" ? "border-destructive text-destructive" :
                    item.priority === "media" ? "border-secondary text-secondary" :
                    "border-muted-foreground text-muted-foreground"
                  }`}>
                    {item.priority}
                  </Badge>
                  <Badge variant="outline" className={`text-[10px] w-fit ${
                    item.status === "En curso" ? "border-primary text-primary" :
                    item.status === "Pendiente" ? "border-secondary text-secondary" :
                    "border-muted-foreground text-muted-foreground"
                  }`}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas Predictivas IA */}
        <div className="space-y-4">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Alertas Predictivas
                <Badge className="bg-secondary/10 text-secondary text-[10px] border-0">
                  <Brain className="h-3 w-3 mr-1" /> IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { msg: "Stock de Brodifacouma bajo mínimo (2 unidades restantes)", level: "critical" },
                { msg: "Contrato Supermercado La Unión vence en 8 días", level: "warning" },
                { msg: "3 facturas con riesgo de mora detectado", level: "warning" },
                { msg: "Cipermetrina 25%: lote LOT-2026-008 vence en 15 días", level: "info" },
              ].map((alert, i) => (
                <div key={i} className={`p-3 rounded-md text-sm font-body ${
                  alert.level === "critical" ? "bg-destructive/10 text-destructive" :
                  alert.level === "warning" ? "bg-secondary/10 text-secondary" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {alert.msg}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Mapa de Operaciones */}
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Mapa de Operaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg h-48 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                <div className="text-center z-10">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-2 opacity-40" />
                  <p className="text-xs text-muted-foreground">Mapa GPS en tiempo real</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{technicians.length} técnicos activos</p>
                </div>
                {/* Simulated pins */}
                {technicians.map((t, i) => (
                  <div key={i} className="absolute" style={{ top: `${25 + i * 15}%`, left: `${20 + i * 18}%` }}>
                    <div className={`h-3 w-3 rounded-full ${t.status === "En campo" ? "bg-primary" : t.status === "En tránsito" ? "bg-secondary" : "bg-muted-foreground"} animate-pulse`} />
                  </div>
                ))}
              </div>
              <div className="mt-3 space-y-1">
                {technicians.map((t, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-body">
                    <span className="text-foreground">{t.name}</span>
                    <Badge variant="outline" className={`text-[9px] ${
                      t.status === "En campo" ? "border-primary text-primary" :
                      t.status === "En tránsito" ? "border-secondary text-secondary" :
                      "border-muted-foreground text-muted-foreground"
                    }`}>{t.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
