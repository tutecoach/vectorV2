import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe, Download, FileText, CreditCard, Settings, ExternalLink,
  CalendarDays, MapPin, Bug, TrendingUp, AlertCircle, Plus,
} from "lucide-react";

const portalServices = [
  { date: "2026-03-05", type: "Desratización", tech: "Carlos M.", status: "Programado" },
  { date: "2026-03-12", type: "Fumigación General", tech: "Ana R.", status: "Programado" },
  { date: "2026-02-20", type: "Inspección HACCP", tech: "Luis P.", status: "Completado" },
];

export default function PortalPage() {
  return (
    <div className="space-y-6">
      {/* Portal Config Overview */}
      <Card className="border border-border bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-6 w-6 text-secondary" />
                <h2 className="font-heading font-bold text-lg">Portal del Cliente</h2>
                <Badge className="bg-primary/10 text-primary text-[10px] border-0">Activo</Badge>
              </div>
              <p className="text-sm text-muted-foreground max-w-lg">
                Plataforma conectada para que sus clientes consulten servicios, descarguen documentos y reporten incidencias 24/7.
              </p>
              <p className="text-xs text-muted-foreground mt-2">URL: <span className="text-secondary font-mono">portal.vectormip.com</span></p>
            </div>
            <Button variant="outline" size="sm" className="font-heading text-sm"><ExternalLink className="h-4 w-4 mr-1" /> Vista Previa</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="services">
        <TabsList className="flex-wrap">
          <TabsTrigger value="services" className="font-heading text-sm">Servicios</TabsTrigger>
          <TabsTrigger value="documents" className="font-heading text-sm">Certificados y Facturas</TabsTrigger>
          <TabsTrigger value="sites" className="font-heading text-sm">Planos y Controles</TabsTrigger>
          <TabsTrigger value="trends" className="font-heading text-sm">Tendencias</TabsTrigger>
          <TabsTrigger value="requests" className="font-heading text-sm">Solicitudes</TabsTrigger>
          <TabsTrigger value="branding" className="font-heading text-sm">Marca Blanca</TabsTrigger>
        </TabsList>

        {/* Service Status */}
        <TabsContent value="services" className="mt-4">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-secondary" /> Servicios Programados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {portalServices.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-md bg-muted/30">
                  <div>
                    <p className="font-heading font-semibold text-sm">{s.type}</p>
                    <p className="text-xs text-muted-foreground">{s.date} · Técnico: {s.tech}</p>
                  </div>
                  <Badge className={`text-[10px] ${s.status === "Completado" ? "bg-primary/10 text-primary border-0" : "bg-secondary/10 text-secondary border-0"}`}>{s.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificates & Invoices */}
        <TabsContent value="documents" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border border-border">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-sm flex items-center gap-2"><FileText className="h-4 w-4" /> Certificados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {["Certificado de Servicio - Feb 2026", "Certificado HACCP - Feb 2026", "Informe Mensual - Ene 2026"].map((doc) => (
                  <div key={doc} className="flex justify-between items-center p-2 rounded-md bg-muted/30 text-sm">
                    <span className="font-body">{doc}</span>
                    <Download className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-secondary" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-sm flex items-center gap-2"><CreditCard className="h-4 w-4" /> Facturas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { id: "FAC-0891", date: "Feb 2026", status: "Pagada" },
                  { id: "FAC-0878", date: "Ene 2026", status: "Pagada" },
                  { id: "FAC-0865", date: "Dic 2025", status: "Pagada" },
                ].map((inv) => (
                  <div key={inv.id} className="flex justify-between items-center p-2 rounded-md bg-muted/30 text-sm">
                    <div>
                      <span className="font-body font-medium">{inv.id}</span>
                      <span className="text-xs text-muted-foreground ml-2">{inv.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/10 text-primary text-[10px] border-0">{inv.status}</Badge>
                      <Download className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-secondary" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sites & Control Points */}
        <TabsContent value="sites" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {["Planta Principal - Av. Industrial 1200", "Depósito Norte - Ruta 40 Km 8"].map((site, i) => (
              <Card key={i} className="border border-border">
                <CardContent className="p-4">
                  <MapPin className="h-5 w-5 text-secondary mb-2" />
                  <p className="font-heading font-semibold text-sm">{site.split(" - ")[0]}</p>
                  <p className="text-xs text-muted-foreground mt-1">{site.split(" - ")[1]}</p>
                  <div className="bg-muted rounded-lg h-32 mt-3 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">Plano de instalación con puntos de control</p>
                  </div>
                  <Badge variant="outline" className="text-[9px] mt-2">12 puntos de control activos</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pest Trends */}
        <TabsContent value="trends" className="mt-4">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base flex items-center gap-2"><Bug className="h-5 w-5 text-secondary" /> Tendencias en sus Instalaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {[
                  { pest: "Roedores", trend: "-12%", status: "Bajo control" },
                  { pest: "Cucarachas", trend: "-8%", status: "Bajo control" },
                  { pest: "Moscas", trend: "+3%", status: "Monitoreo" },
                  { pest: "Hormigas", trend: "-15%", status: "Bajo control" },
                ].map((t, i) => (
                  <div key={i} className="text-center p-3 rounded-lg bg-muted/30">
                    <p className="font-heading font-semibold text-sm">{t.pest}</p>
                    <p className={`text-lg font-bold ${t.trend.startsWith("-") ? "text-primary" : "text-secondary"}`}>{t.trend}</p>
                    <Badge className={`text-[9px] mt-1 ${t.status === "Bajo control" ? "bg-primary/10 text-primary border-0" : "bg-secondary/10 text-secondary border-0"}`}>{t.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requests */}
        <TabsContent value="requests" className="mt-4">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading text-base flex items-center gap-2"><AlertCircle className="h-5 w-5 text-secondary" /> Solicitudes e Incidencias</CardTitle>
                <Button size="sm" className="bg-primary font-heading text-sm"><Plus className="h-4 w-4 mr-1" /> Nueva Solicitud</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { title: "Solicitud de servicio adicional - Área de carga", date: "2026-02-24", status: "En proceso" },
                { title: "Reporte: avistamiento de roedores en depósito", date: "2026-02-20", status: "Resuelto" },
              ].map((req, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-md bg-muted/30">
                  <div>
                    <p className="font-heading font-semibold text-sm">{req.title}</p>
                    <p className="text-xs text-muted-foreground">{req.date}</p>
                  </div>
                  <Badge className={`text-[10px] ${req.status === "Resuelto" ? "bg-primary/10 text-primary border-0" : "bg-secondary/10 text-secondary border-0"}`}>{req.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding */}
        <TabsContent value="branding" className="mt-4">
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-sm flex items-center gap-2"><Settings className="h-4 w-4" /> Personalización de Marca Blanca</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm font-body">
              {[
                { label: "Logo personalizado", value: "Configurado" },
                { label: "Colores de marca", value: "custom" },
                { label: "Dominio propio", value: "Pendiente" },
                { label: "Plantilla de emails", value: "Configurado" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{item.label}</span>
                  {item.value === "custom" ? (
                    <div className="flex gap-1"><span className="h-4 w-4 rounded-full bg-primary" /><span className="h-4 w-4 rounded-full bg-secondary" /></div>
                  ) : (
                    <Badge className={`text-[10px] ${item.value === "Configurado" ? "bg-primary/10 text-primary border-0" : "bg-muted text-muted-foreground border-0"}`}>{item.value}</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stats */}
      <Card className="border border-border">
        <CardHeader><CardTitle className="font-heading text-base">Estadísticas del Portal</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: "Clientes Registrados", value: "32" },
              { label: "Descargas este Mes", value: "145" },
              { label: "Accesos Mensuales", value: "89" },
              { label: "Satisfacción", value: "4.8/5" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
