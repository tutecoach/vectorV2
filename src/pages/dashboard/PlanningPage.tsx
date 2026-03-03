import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays, ClipboardList, Users, Plus, MapPin, Clock, Brain,
  Route, Truck, Wrench, Shield, Fuel, Navigation,
} from "lucide-react";

const orders = [
  { id: "OT-2026-0451", client: "Alimentos del Sur S.A.", site: "Planta Principal", date: "2026-02-25", tech: "Carlos M.", status: "En curso", time: "08:00" },
  { id: "OT-2026-0452", client: "Hotel Pacífico", site: "Sede Central", date: "2026-02-25", tech: "Ana R.", status: "Pendiente", time: "09:30" },
  { id: "OT-2026-0453", client: "Supermercado La Unión", site: "Sucursal Norte", date: "2026-02-25", tech: "Luis P.", status: "Pendiente", time: "11:00" },
  { id: "OT-2026-0454", client: "Frigorífico Norte", site: "Planta Procesadora", date: "2026-02-25", tech: "Carlos M.", status: "Programado", time: "14:00" },
  { id: "OT-2026-0455", client: "Restaurant El Roble", site: "Local Principal", date: "2026-02-25", tech: "María G.", status: "Completado", time: "15:30" },
  { id: "OT-2026-0456", client: "Clínica Salud+", site: "Edificio A", date: "2026-02-26", tech: "Ana R.", status: "Cancelado", time: "08:00" },
];

const technicians = [
  { name: "Carlos Méndez", role: "Técnico Senior", status: "En campo", orders: 3, zone: "Zona Norte", certs: ["HACCP", "ISO 9001"], vehicle: "VH-001" },
  { name: "Ana Ríos", role: "Técnico", status: "Disponible", orders: 1, zone: "Zona Centro", certs: ["HACCP"], vehicle: "VH-002" },
  { name: "Luis Paredes", role: "Técnico Senior", status: "En campo", orders: 2, zone: "Zona Sur", certs: ["HACCP", "BRC"], vehicle: "VH-003" },
  { name: "María García", role: "Técnico Junior", status: "En tránsito", orders: 2, zone: "Zona Oeste", certs: ["HACCP"], vehicle: "VH-004" },
];

const fleet = [
  { id: "VH-001", type: "Kangoo", tech: "Carlos M.", fuel: "78%", nextService: "2026-03-15", vtv: "Vigente", insurance: "Vigente" },
  { id: "VH-002", type: "Partner", tech: "Ana R.", fuel: "45%", nextService: "2026-02-28", vtv: "Vigente", insurance: "Vigente" },
  { id: "VH-003", type: "Kangoo", tech: "Luis P.", fuel: "92%", nextService: "2026-04-01", vtv: "Por vencer", insurance: "Vigente" },
  { id: "VH-004", type: "Berlingo", tech: "María G.", fuel: "31%", nextService: "2026-03-10", vtv: "Vigente", insurance: "Vigente" },
];

export default function PlanningPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="orders">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <TabsList>
            <TabsTrigger value="orders" className="font-heading text-sm">Órdenes de Trabajo</TabsTrigger>
            <TabsTrigger value="calendar" className="font-heading text-sm">Agenda Maestra</TabsTrigger>
            <TabsTrigger value="routes" className="font-heading text-sm">Rutas IA</TabsTrigger>
            <TabsTrigger value="technicians" className="font-heading text-sm">Técnicos</TabsTrigger>
            <TabsTrigger value="fleet" className="font-heading text-sm">Flota</TabsTrigger>
          </TabsList>
          <Button size="sm" className="bg-primary font-heading text-sm">
            <Plus className="h-4 w-4 mr-1" /> Nueva OT
          </Button>
        </div>

        {/* OT Table */}
        <TabsContent value="orders">
          <Card className="border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">OT</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Cliente</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground hidden md:table-cell">Sede</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground hidden lg:table-cell">Fecha</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Técnico</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="py-3 px-4 font-medium text-secondary">{o.id}</td>
                      <td className="py-3 px-4 text-foreground">{o.client}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs hidden md:table-cell">{o.site}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs hidden lg:table-cell flex items-center gap-1"><Clock className="h-3 w-3 inline" /> {o.date} {o.time}</td>
                      <td className="py-3 px-4 text-muted-foreground">{o.tech}</td>
                      <td className="py-3 px-4">
                        <Badge className={`text-[10px] ${
                          o.status === "En curso" ? "bg-primary/10 text-primary border-0" :
                          o.status === "Pendiente" ? "bg-secondary/10 text-secondary border-0" :
                          o.status === "Completado" ? "bg-primary/10 text-primary border-0" :
                          o.status === "Cancelado" ? "bg-destructive/10 text-destructive border-0" :
                          "bg-muted text-muted-foreground border-0"
                        }`}>{o.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Agenda Maestra */}
        <TabsContent value="calendar">
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-secondary" />
                Febrero 2026
                <Badge variant="outline" className="text-[10px] ml-2">Drag & Drop habilitado</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1 text-center">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
                  <div key={d} className="font-heading font-semibold text-xs text-muted-foreground py-2">{d}</div>
                ))}
                {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => {
                  const hasEvents = [2, 5, 9, 12, 16, 19, 23, 25, 26].includes(day);
                  const isToday = day === 26;
                  return (
                    <div key={day} className={`py-3 text-sm font-body rounded-md cursor-pointer transition-colors relative ${isToday ? "bg-secondary text-secondary-foreground font-bold" : "hover:bg-muted"}`}>
                      {day}
                      {hasEvents && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 bg-primary rounded-full" />}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rutas IA */}
        <TabsContent value="routes">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <Route className="h-5 w-5 text-secondary" />
                Planificación de Rutas
                <Badge className="bg-secondary/10 text-secondary text-[10px] border-0"><Brain className="h-3 w-3 mr-1" /> IA</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground font-body">Rutas optimizadas considerando tráfico, habilidades del técnico y ventanas horarias del cliente.</p>
              {technicians.filter(t => t.status !== "Disponible").map((tech, i) => (
                <div key={i} className="p-4 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-secondary" />
                      <span className="font-heading font-semibold text-sm">{tech.name}</span>
                      <Badge variant="outline" className="text-[9px]">{tech.vehicle}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{tech.orders} paradas · Zona {tech.zone}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {Array.from({ length: tech.orders }, (_, j) => (
                      <div key={j} className="flex items-center gap-1">
                        <div className="h-6 w-6 rounded-full bg-secondary/10 flex items-center justify-center text-[10px] font-bold text-secondary">{j + 1}</div>
                        {j < tech.orders - 1 && <div className="w-6 h-px bg-border" />}
                      </div>
                    ))}
                    <span className="text-[10px] text-primary font-medium ml-2">Ruta optimizada ✓</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Técnicos */}
        <TabsContent value="technicians">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {technicians.map((t) => (
              <Card key={t.name} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm font-body">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado</span>
                      <Badge className={`text-[10px] ${t.status === "En campo" ? "bg-primary/10 text-primary border-0" : t.status === "Disponible" ? "bg-secondary/10 text-secondary border-0" : "bg-muted text-muted-foreground border-0"}`}>{t.status}</Badge>
                    </div>
                    <div className="flex justify-between"><span className="text-muted-foreground">OTs hoy</span><span className="font-medium">{t.orders}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Zona</span><span className="text-xs flex items-center gap-1"><MapPin className="h-3 w-3" />{t.zone}</span></div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {t.certs.map(c => <Badge key={c} variant="outline" className="text-[9px]"><Shield className="h-2 w-2 mr-0.5" />{c}</Badge>)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Flota */}
        <TabsContent value="fleet">
          <Card className="border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Vehículo</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Tipo</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Técnico</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Combustible</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground hidden md:table-cell">Próx. Service</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground hidden lg:table-cell">VTV</th>
                  </tr>
                </thead>
                <tbody>
                  {fleet.map((v) => (
                    <tr key={v.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-secondary">{v.id}</td>
                      <td className="py-3 px-4 text-foreground">{v.type}</td>
                      <td className="py-3 px-4 text-muted-foreground">{v.tech}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Fuel className="h-3 w-3 text-muted-foreground" />
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${parseInt(v.fuel) > 50 ? "bg-primary" : parseInt(v.fuel) > 25 ? "bg-secondary" : "bg-destructive"}`} style={{ width: v.fuel }} />
                          </div>
                          <span className="text-xs">{v.fuel}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground hidden md:table-cell">{v.nextService}</td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <Badge className={`text-[10px] ${v.vtv === "Vigente" ? "bg-primary/10 text-primary border-0" : "bg-destructive/10 text-destructive border-0"}`}>{v.vtv}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
