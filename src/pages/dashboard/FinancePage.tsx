import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DollarSign, TrendingUp, CreditCard, Brain, AlertCircle,
  FileText, Plus, Landmark, Wallet, ShoppingCart, ArrowUpDown,
} from "lucide-react";

const invoices = [
  { id: "FAC-2026-0891", client: "Alimentos del Sur S.A.", amount: "$85,000", date: "2026-02-01", due: "2026-03-01", status: "Pagada", type: "Servicio" },
  { id: "FAC-2026-0892", client: "Hotel Pacífico", amount: "$55,000", date: "2026-02-01", due: "2026-03-01", status: "Pendiente", type: "Servicio" },
  { id: "FAC-2026-0893", client: "Frigorífico Norte", amount: "$120,000", date: "2026-02-01", due: "2026-03-01", status: "Pagada", type: "Contrato" },
  { id: "FAC-2026-0894", client: "Supermercado La Unión", amount: "$35,000", date: "2026-02-01", due: "2026-02-28", status: "Vencida", type: "Servicio" },
  { id: "FAC-2026-0895", client: "Restaurant El Roble", amount: "$42,000", date: "2026-02-15", due: "2026-03-15", status: "Pendiente", type: "Contrato" },
];

const suppliers = [
  { name: "QuímicosSur S.A.", category: "Rodenticidas", lastOrder: "$45,000", rating: "4.8" },
  { name: "InsumosMIP Ltda.", category: "Insecticidas", lastOrder: "$32,000", rating: "4.5" },
  { name: "TecnoPlag", category: "Equipamiento", lastOrder: "$120,000", rating: "4.2" },
];

export default function FinancePage() {
  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: DollarSign, label: "Facturación Mes", value: "$1.2M", color: "text-primary" },
          { icon: CreditCard, label: "Cuentas por Cobrar", value: "$132K", color: "text-secondary" },
          { icon: TrendingUp, label: "Margen de Ganancia", value: "34%", color: "text-primary" },
          { icon: AlertCircle, label: "Facturas Vencidas", value: "1", color: "text-destructive" },
          { icon: Wallet, label: "Caja y Bancos", value: "$890K", color: "text-primary" },
        ].map((kpi, i) => (
          <Card key={i} className="border border-border">
            <CardContent className="p-4">
              <kpi.icon className={`h-5 w-5 ${kpi.color} mb-2`} />
              <p className="text-2xl font-heading font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="invoices">
        <TabsList className="flex-wrap">
          <TabsTrigger value="invoices" className="font-heading text-sm">Facturación</TabsTrigger>
          <TabsTrigger value="collections" className="font-heading text-sm">Cobranza IA</TabsTrigger>
          <TabsTrigger value="cashflow" className="font-heading text-sm">Caja y Bancos</TabsTrigger>
          <TabsTrigger value="profitability" className="font-heading text-sm">Rentabilidad IA</TabsTrigger>
          <TabsTrigger value="procurement" className="font-heading text-sm">Compras</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Button size="sm" className="bg-primary font-heading text-sm"><Plus className="h-4 w-4 mr-1" /> Nueva Factura</Button>
          </div>
          <Card className="border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Factura</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Cliente</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Monto</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground hidden md:table-cell">Tipo</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground hidden md:table-cell">Vencimiento</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-secondary">{inv.id}</td>
                      <td className="py-3 px-4 text-foreground">{inv.client}</td>
                      <td className="py-3 px-4 font-medium">{inv.amount}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground hidden md:table-cell">{inv.type}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs hidden md:table-cell">{inv.due}</td>
                      <td className="py-3 px-4">
                        <Badge className={`text-[10px] ${inv.status === "Pagada" ? "bg-primary/10 text-primary border-0" : inv.status === "Vencida" ? "bg-destructive/10 text-destructive border-0" : "bg-secondary/10 text-secondary border-0"}`}>{inv.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="mt-4">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <Brain className="h-5 w-5 text-secondary" />
                Cobranza Inteligente
                <Badge className="bg-secondary/10 text-secondary text-[10px] border-0">IA</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground font-body">Predicción de facturas con riesgo de mora y automatización de recordatorios.</p>
              {invoices.filter((i) => i.status !== "Pagada").map((inv) => (
                <div key={inv.id} className={`p-4 rounded-lg border ${inv.status === "Vencida" ? "border-destructive/30 bg-destructive/5" : "border-border bg-muted/20"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-heading font-semibold text-sm">{inv.client}</p>
                      <p className="text-xs text-muted-foreground mt-1">{inv.id} · Vence: {inv.due}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-bold text-lg">{inv.amount}</p>
                      <Badge className={`text-[10px] ${inv.status === "Vencida" ? "bg-destructive/10 text-destructive border-0" : "bg-secondary/10 text-secondary border-0"}`}>{inv.status === "Vencida" ? "Riesgo Alto" : "Riesgo Medio"}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="text-xs h-7">Enviar Recordatorio</Button>
                    <Button size="sm" variant="outline" className="text-xs h-7">Escalar</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="mt-4">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Landmark, label: "Banco Nación", balance: "$520,000", type: "Cuenta Corriente" },
              { icon: Landmark, label: "Banco Galicia", balance: "$370,000", type: "Caja de Ahorro" },
              { icon: Wallet, label: "Mercado Pago", balance: "$45,000", type: "Billetera Virtual" },
            ].map((acc, i) => (
              <Card key={i} className="border border-border">
                <CardContent className="p-4">
                  <acc.icon className="h-6 w-6 text-secondary mb-3" />
                  <p className="font-heading font-bold text-lg">{acc.balance}</p>
                  <p className="font-heading font-semibold text-sm mt-1">{acc.label}</p>
                  <p className="text-xs text-muted-foreground">{acc.type}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="profitability" className="mt-4">
          <Card className="border border-border">
            <CardHeader><CardTitle className="font-heading text-base flex items-center gap-2"><Brain className="h-5 w-5 text-secondary" /> Analista de Rentabilidad <Badge className="bg-secondary/10 text-secondary text-[10px] border-0">IA</Badge></CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { client: "Alimentos del Sur S.A.", revenue: "$85,000", cost: "$42,000", margin: "50.6%", suggestion: "Margen saludable. Considerar upsell de monitoreo IoT." },
                { client: "Frigorífico Norte", revenue: "$120,000", cost: "$68,000", margin: "43.3%", suggestion: "Optimizar ruta para reducir costos logísticos en 8%." },
                { client: "Hotel Pacífico", revenue: "$55,000", cost: "$38,000", margin: "30.9%", suggestion: "Margen bajo. Revisar frecuencia de visitas vs. contrato." },
                { client: "Restaurant El Roble", revenue: "$42,000", cost: "$31,000", margin: "26.2%", suggestion: "Renegociar precio o sustituir insumos por alternativas genéricas." },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-heading font-semibold text-sm">{item.client}</p>
                    <p className={`font-heading font-bold text-lg ${parseFloat(item.margin) > 35 ? "text-primary" : "text-destructive"}`}>{item.margin}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Ingreso: {item.revenue} | Costo: {item.cost}</p>
                  <p className="text-xs text-secondary mt-2 font-medium">💡 {item.suggestion}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procurement" className="mt-4">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-secondary" />
                CRM de Proveedores
                <Badge className="bg-secondary/10 text-secondary text-[10px] border-0"><Brain className="h-3 w-3 mr-1" /> Predicción IA</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {suppliers.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-md bg-muted/30">
                  <div>
                    <p className="font-heading font-semibold text-sm">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.category} · Última orden: {s.lastOrder}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-primary font-medium">★ {s.rating}</span>
                    <Button size="sm" variant="outline" className="text-xs h-7"><ArrowUpDown className="h-3 w-3 mr-1" /> Comparar</Button>
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
