import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck, FileText, ClipboardCheck, AlertOctagon,
  CheckCircle, Clock, Plus, Download, Search,
} from "lucide-react";

const documents = [
  { name: "Procedimiento de Desratización", type: "POES", version: "v3.2", updated: "2026-02-15", status: "Vigente" },
  { name: "Norma ISO 9001:2015", type: "Normativa", version: "-", updated: "2025-11-01", status: "Vigente" },
  { name: "Protocolo HACCP - Industria Alimentaria", type: "POES", version: "v2.1", updated: "2026-01-20", status: "Vigente" },
  { name: "Manual BRC Global Standards", type: "Normativa", version: "-", updated: "2025-09-20", status: "Vigente" },
  { name: "Procedimiento de Fumigación", type: "POES", version: "v4.0", updated: "2026-02-10", status: "En revisión" },
];

const audits = [
  { norm: "ISO 9001:2015", status: "Conforme", lastAudit: "2025-11-15", next: "2026-05-15", score: "94%", items: 28 },
  { norm: "BRC Global Standards", status: "Conforme", lastAudit: "2025-09-20", next: "2026-03-20", score: "91%", items: 45 },
  { norm: "HACCP", status: "En revisión", lastAudit: "2026-01-10", next: "2026-07-10", score: "88%", items: 32 },
];

const incidents = [
  { id: "NC-2026-012", title: "Punto de control #7 sin cebo en Frigorífico Norte", type: "No Conformidad", date: "2026-02-22", status: "Abierta", severity: "Mayor" },
  { id: "NC-2026-011", title: "MSDS de Cipermetrina sin firma de recepción", type: "Observación", date: "2026-02-18", status: "En proceso", severity: "Menor" },
  { id: "NC-2026-010", title: "Técnico sin certificación vigente asignado a planta", type: "No Conformidad", date: "2026-02-15", status: "Resuelta", severity: "Mayor" },
  { id: "AC-2026-005", title: "Implementar doble verificación en puntos HACCP", type: "Acción Correctiva", date: "2026-02-10", status: "En proceso", severity: "-" },
];

const traceEntry = [
  { service: "OT-2026-0451", client: "Alimentos del Sur S.A.", tech: "Carlos M.", vehicle: "VH-001", products: "Brodifacouma LOT-001 (1kg)", time: "08:15 - 09:45", signed: true },
  { service: "OT-2026-0452", client: "Hotel Pacífico", tech: "Ana R.", vehicle: "VH-002", products: "Deltametrina LOT-014 (2L)", time: "09:30 - 10:30", signed: true },
];

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="documents">
        <TabsList className="flex-wrap">
          <TabsTrigger value="documents" className="font-heading text-sm">Gestor Documental</TabsTrigger>
          <TabsTrigger value="audits" className="font-heading text-sm">Auditoría</TabsTrigger>
          <TabsTrigger value="incidents" className="font-heading text-sm">Incidentes</TabsTrigger>
          <TabsTrigger value="trace" className="font-heading text-sm">Trazabilidad Total</TabsTrigger>
        </TabsList>

        {/* Documents */}
        <TabsContent value="documents" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button size="sm" className="bg-primary font-heading text-sm"><Plus className="h-4 w-4 mr-1" /> Nuevo Documento</Button>
          </div>
          <Card className="border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Documento</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Tipo</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground hidden md:table-cell">Versión</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground hidden md:table-cell">Actualización</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="py-3 px-4 font-medium text-foreground flex items-center gap-2"><FileText className="h-4 w-4 text-secondary shrink-0" />{doc.name}</td>
                      <td className="py-3 px-4"><Badge variant="outline" className="text-[10px]">{doc.type}</Badge></td>
                      <td className="py-3 px-4 text-xs text-muted-foreground hidden md:table-cell">{doc.version}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground hidden md:table-cell">{doc.updated}</td>
                      <td className="py-3 px-4">
                        <Badge className={`text-[10px] ${doc.status === "Vigente" ? "bg-primary/10 text-primary border-0" : "bg-secondary/10 text-secondary border-0"}`}>{doc.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Audits */}
        <TabsContent value="audits" className="mt-4">
          <div className="grid md:grid-cols-3 gap-4">
            {audits.map((q) => (
              <Card key={q.norm} className="border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h3 className="font-heading font-bold text-sm">{q.norm}</h3>
                  </div>
                  <div className="space-y-2 text-sm font-body">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado</span>
                      <Badge className={`text-[10px] ${q.status === "Conforme" ? "bg-primary/10 text-primary border-0" : "bg-secondary/10 text-secondary border-0"}`}>{q.status}</Badge>
                    </div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Score</span><span className="font-heading font-bold text-primary">{q.score}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Items checklist</span><span>{q.items}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Última auditoría</span><span className="text-xs">{q.lastAudit}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Próxima</span><span className="text-xs font-medium">{q.next}</span></div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3 text-xs"><ClipboardCheck className="h-3 w-3 mr-1" /> Abrir Checklist</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Incidents */}
        <TabsContent value="incidents" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button size="sm" className="bg-primary font-heading text-sm"><Plus className="h-4 w-4 mr-1" /> Registrar Incidente</Button>
          </div>
          {incidents.map((inc) => (
            <Card key={inc.id} className={`border ${inc.severity === "Mayor" && inc.status !== "Resuelta" ? "border-destructive/30" : "border-border"}`}>
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertOctagon className={`h-5 w-5 shrink-0 mt-0.5 ${
                    inc.status === "Resuelta" ? "text-primary" :
                    inc.severity === "Mayor" ? "text-destructive" :
                    "text-secondary"
                  }`} />
                  <div>
                    <p className="font-heading font-semibold text-sm">{inc.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{inc.id} · {inc.date} · {inc.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {inc.severity !== "-" && <Badge variant="outline" className="text-[10px]">{inc.severity}</Badge>}
                  <Badge className={`text-[10px] ${
                    inc.status === "Resuelta" ? "bg-primary/10 text-primary border-0" :
                    inc.status === "Abierta" ? "bg-destructive/10 text-destructive border-0" :
                    "bg-secondary/10 text-secondary border-0"
                  }`}>{inc.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Full Traceability */}
        <TabsContent value="trace" className="mt-4">
          <Card className="border border-border overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <Search className="h-5 w-5 text-secondary" /> Trazabilidad Completa
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">OT</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Cliente</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Técnico</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground hidden md:table-cell">Vehículo</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground hidden lg:table-cell">Productos/Lote</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground hidden md:table-cell">Horario</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Firma</th>
                  </tr>
                </thead>
                <tbody>
                  {traceEntry.map((t, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-secondary">{t.service}</td>
                      <td className="py-3 px-4">{t.client}</td>
                      <td className="py-3 px-4 text-muted-foreground">{t.tech}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground hidden md:table-cell">{t.vehicle}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground hidden lg:table-cell">{t.products}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground hidden md:table-cell">{t.time}</td>
                      <td className="py-3 px-4">
                        {t.signed ? <CheckCircle className="h-4 w-4 text-primary" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
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
