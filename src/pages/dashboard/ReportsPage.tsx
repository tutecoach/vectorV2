import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BarChart3, FileCheck, Bug, Award, Brain, Download,
  Users, TrendingUp, DollarSign, MapPin,
} from "lucide-react";

const certificates = [
  { id: "CERT-2026-0234", client: "Alimentos del Sur S.A.", type: "Certificado de Servicio", date: "2026-02-20", valid: "2026-03-20", status: "Vigente" },
  { id: "CERT-2026-0235", client: "Frigorífico Norte", type: "Certificado HACCP", date: "2026-02-22", valid: "2026-08-22", status: "Vigente" },
  { id: "CERT-2026-0231", client: "Supermercado La Unión", type: "Certificado de Servicio", date: "2026-01-10", valid: "2026-02-10", status: "Vencido" },
];

const pestTrends = [
  { pest: "Rattus norvegicus", zone: "Zona Industrial", incidence: "Alta", trend: "+15%", month: "Feb 2026" },
  { pest: "Blattella germanica", zone: "Zona Gastronómica", incidence: "Media", trend: "-8%", month: "Feb 2026" },
  { pest: "Musca domestica", zone: "Zona Residencial", incidence: "Baja", trend: "-22%", month: "Feb 2026" },
  { pest: "Periplaneta americana", zone: "Zona Comercial", incidence: "Media", trend: "+5%", month: "Feb 2026" },
];

const techPerformance = [
  { name: "Carlos Méndez", services: 48, satisfaction: "4.9/5", efficiency: "96%", revenue: "$380K" },
  { name: "Luis Paredes", services: 42, satisfaction: "4.7/5", efficiency: "92%", revenue: "$320K" },
  { name: "Ana Ríos", services: 35, satisfaction: "4.8/5", efficiency: "94%", revenue: "$270K" },
  { name: "María García", services: 28, satisfaction: "4.5/5", efficiency: "88%", revenue: "$210K" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="certificates">
        <TabsList className="flex-wrap">
          <TabsTrigger value="certificates" className="font-heading text-sm">Certificados</TabsTrigger>
          <TabsTrigger value="performance" className="font-heading text-sm">Rendimiento</TabsTrigger>
          <TabsTrigger value="trends" className="font-heading text-sm">Tendencias IA</TabsTrigger>
          <TabsTrigger value="profitability" className="font-heading text-sm">Rentabilidad</TabsTrigger>
        </TabsList>

        {/* Certificates */}
        <TabsContent value="certificates" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button size="sm" className="bg-primary font-heading text-sm"><FileCheck className="h-4 w-4 mr-1" /> Generar Certificado</Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <Card key={cert.id} className={`border ${cert.status === "Vencido" ? "border-destructive/30" : "border-border"}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Award className={`h-6 w-6 ${cert.status === "Vigente" ? "text-primary" : "text-destructive"}`} />
                    <Badge className={`text-[10px] ${cert.status === "Vigente" ? "bg-primary/10 text-primary border-0" : "bg-destructive/10 text-destructive border-0"}`}>{cert.status}</Badge>
                  </div>
                  <p className="font-heading font-semibold text-sm">{cert.client}</p>
                  <p className="text-xs text-muted-foreground mt-1">{cert.type}</p>
                  <p className="text-xs text-muted-foreground mt-1">Válido hasta: {cert.valid}</p>
                  <Button variant="outline" size="sm" className="mt-3 w-full text-xs font-heading"><Download className="h-3 w-3 mr-1" /> Descargar PDF</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="mt-4">
          <Card className="border border-border overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" /> Rendimiento Técnico
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Técnico</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Servicios</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Satisfacción</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground hidden md:table-cell">Eficiencia</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground hidden md:table-cell">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {techPerformance.map((t, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{t.name}</td>
                      <td className="py-3 px-4">{t.services}</td>
                      <td className="py-3 px-4 text-primary font-medium">{t.satisfaction}</td>
                      <td className="py-3 px-4 hidden md:table-cell">{t.efficiency}</td>
                      <td className="py-3 px-4 hidden md:table-cell font-medium">{t.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends" className="mt-4">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <Bug className="h-5 w-5 text-secondary" /> Tendencias de Plagas
                <Badge className="bg-secondary/10 text-secondary text-[10px] border-0"><Brain className="h-3 w-3 mr-1" /> IA</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Heat Map Placeholder */}
              <div className="bg-muted rounded-lg p-6 mb-4">
                <div className="grid grid-cols-4 gap-2">
                  {["Zona Norte", "Zona Sur", "Zona Centro", "Zona Industrial"].map((zone) => (
                    <div key={zone} className="text-center">
                      <div className={`h-16 rounded-md mb-2 ${
                        zone === "Zona Industrial" ? "bg-destructive/30" :
                        zone === "Zona Centro" ? "bg-secondary/30" :
                        "bg-primary/20"
                      }`} />
                      <span className="text-[10px] text-muted-foreground">{zone}</span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs text-muted-foreground mt-3">Mapa de calor interactivo de incidencias</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Plaga</th>
                      <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Zona</th>
                      <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Incidencia</th>
                      <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Tendencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pestTrends.map((t, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-3 px-4 font-medium italic">{t.pest}</td>
                        <td className="py-3 px-4 text-muted-foreground">{t.zone}</td>
                        <td className="py-3 px-4">
                          <Badge className={`text-[10px] ${t.incidence === "Alta" ? "bg-destructive/10 text-destructive border-0" : t.incidence === "Media" ? "bg-secondary/10 text-secondary border-0" : "bg-primary/10 text-primary border-0"}`}>{t.incidence}</Badge>
                        </td>
                        <td className={`py-3 px-4 font-mono font-bold text-xs ${t.trend.startsWith("+") ? "text-destructive" : "text-primary"}`}>{t.trend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profitability by Contract */}
        <TabsContent value="profitability" className="mt-4">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" /> Rentabilidad por Contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { contract: "Alimentos del Sur - Premium", monthly: "$85K", margin: "50.6%", trend: "up" },
                { contract: "Frigorífico Norte - Integral", monthly: "$120K", margin: "43.3%", trend: "up" },
                { contract: "Hotel Pacífico - Estándar", monthly: "$55K", margin: "30.9%", trend: "down" },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-md bg-muted/30">
                  <div>
                    <p className="font-heading font-semibold text-sm">{c.contract}</p>
                    <p className="text-xs text-muted-foreground">{c.monthly}/mes</p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <p className={`font-heading font-bold text-lg ${parseFloat(c.margin) > 35 ? "text-primary" : "text-destructive"}`}>{c.margin}</p>
                    <TrendingUp className={`h-4 w-4 ${c.trend === "up" ? "text-primary" : "text-destructive rotate-180"}`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
