import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package, Search, AlertTriangle, FileText, Truck, Brain,
  ArrowRightLeft, Warehouse, Plus,
} from "lucide-react";

const products = [
  { id: 1, name: "Brodifacouma 0.005%", category: "Rodenticida", lot: "LOT-2026-001", expiry: "2026-12-01", stock: 2, unit: "kg", min: 5, depot: 2, vehicles: { "VH-001": 0, "VH-003": 0 }, msds: true },
  { id: 2, name: "Deltametrina 2.5%", category: "Insecticida", lot: "LOT-2026-014", expiry: "2027-03-15", stock: 18, unit: "L", min: 10, depot: 12, vehicles: { "VH-001": 3, "VH-002": 3 }, msds: true },
  { id: 3, name: "Gel Cucarachicida", category: "Insecticida", lot: "LOT-2026-022", expiry: "2026-09-30", stock: 45, unit: "u", min: 20, depot: 30, vehicles: { "VH-002": 10, "VH-004": 5 }, msds: true },
  { id: 4, name: "Trampas adhesivas", category: "Mecánico", lot: "LOT-2026-030", expiry: "-", stock: 120, unit: "u", min: 50, depot: 80, vehicles: { "VH-001": 20, "VH-003": 20 }, msds: false },
  { id: 5, name: "Cipermetrina 25%", category: "Insecticida", lot: "LOT-2026-008", expiry: "2026-04-10", stock: 8, unit: "L", min: 15, depot: 5, vehicles: { "VH-001": 3 }, msds: true },
  { id: 6, name: "Cebo Hormiguicida", category: "Hormiguicida", lot: "LOT-2026-041", expiry: "2027-01-20", stock: 30, unit: "kg", min: 10, depot: 25, vehicles: { "VH-004": 5 }, msds: true },
];

const movements = [
  { date: "2026-02-25", product: "Deltametrina 2.5%", type: "Salida", from: "Depósito Central", to: "VH-001", qty: "3 L", user: "Admin" },
  { date: "2026-02-24", product: "Gel Cucarachicida", type: "Entrada", from: "Proveedor", to: "Depósito Central", qty: "50 u", user: "Admin" },
  { date: "2026-02-24", product: "Trampas adhesivas", type: "Transferencia", from: "VH-002", to: "VH-003", qty: "10 u", user: "Carlos M." },
  { date: "2026-02-23", product: "Brodifacouma 0.005%", type: "Salida", from: "Depósito Central", to: "VH-001", qty: "1 kg", user: "Admin" },
];

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Package, label: "Productos Activos", value: "6", color: "text-primary" },
          { icon: AlertTriangle, label: "Stock Crítico", value: "2", color: "text-destructive" },
          { icon: FileText, label: "MSDS Vigentes", value: "5", color: "text-secondary" },
          { icon: Truck, label: "Vehículos con Stock", value: "4", color: "text-primary" },
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

      <Tabs defaultValue="catalog">
        <TabsList>
          <TabsTrigger value="catalog" className="font-heading text-sm">Catálogo</TabsTrigger>
          <TabsTrigger value="ai" className="font-heading text-sm">Compras IA</TabsTrigger>
          <TabsTrigger value="locations" className="font-heading text-sm">Almacenes</TabsTrigger>
          <TabsTrigger value="traceability" className="font-heading text-sm">Trazabilidad</TabsTrigger>
          <TabsTrigger value="msds" className="font-heading text-sm">MSDS</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4 mt-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
            </div>
            <Button size="sm" className="bg-primary font-heading text-sm"><Plus className="h-4 w-4 mr-1" /> Nuevo Producto</Button>
          </div>
          <Card className="border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Producto</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground hidden md:table-cell">Categoría</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground hidden lg:table-cell">Lote</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground hidden lg:table-cell">Vencimiento</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Stock Total</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">{p.name}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs hidden md:table-cell">{p.category}</td>
                      <td className="py-3 px-4 text-muted-foreground font-mono text-xs hidden lg:table-cell">{p.lot}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs hidden lg:table-cell">{p.expiry}</td>
                      <td className="py-3 px-4"><span className={p.stock < p.min ? "text-destructive font-bold" : "text-foreground"}>{p.stock} {p.unit}</span></td>
                      <td className="py-3 px-4">
                        <Badge className={`text-[10px] ${p.stock < p.min ? "bg-destructive/10 text-destructive border-0" : "bg-primary/10 text-primary border-0"}`}>{p.stock < p.min ? "Bajo mínimo" : "OK"}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="mt-4">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <Brain className="h-5 w-5 text-secondary" /> Recomendaciones de Compra
                <Badge className="bg-secondary/10 text-secondary text-[10px] border-0">IA</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground font-body">Predicción de demanda según estacionalidad y servicios programados para las próximas 4 semanas.</p>
              {[
                { product: "Brodifacouma 0.005%", current: "2 kg", predicted: "8 kg", urgency: "Crítico", reason: "12 servicios de desratización programados. Stock se agota en 2 días." },
                { product: "Cipermetrina 25%", current: "8 L", predicted: "20 L", urgency: "Alto", reason: "Temporada alta de insectos. Demanda estimada +150% en marzo." },
                { product: "Gel Cucarachicida", current: "45 u", predicted: "30 u", urgency: "Normal", reason: "Stock adecuado para 3 semanas. Reposición recomendada en 15 días." },
              ].map((rec, i) => (
                <div key={i} className={`p-4 rounded-lg border ${rec.urgency === "Crítico" ? "border-destructive/30 bg-destructive/5" : rec.urgency === "Alto" ? "border-secondary/30 bg-secondary/5" : "border-border bg-muted/20"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-heading font-semibold text-sm">{rec.product}</p>
                    <Badge className={`text-[10px] ${rec.urgency === "Crítico" ? "bg-destructive/10 text-destructive border-0" : rec.urgency === "Alto" ? "bg-secondary/10 text-secondary border-0" : "bg-muted text-muted-foreground border-0"}`}>{rec.urgency}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Actual: {rec.current} · Recomendado: {rec.predicted}</p>
                  <p className="text-xs text-secondary mt-1">💡 {rec.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="mt-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border border-border">
              <CardContent className="p-4">
                <Warehouse className="h-6 w-6 text-primary mb-2" />
                <p className="font-heading font-bold text-sm">Depósito Central</p>
                <p className="text-xs text-muted-foreground mt-1">6 productos · Stock completo</p>
                <div className="mt-3 space-y-1">
                  {products.slice(0, 4).map(p => (
                    <div key={p.id} className="flex justify-between text-xs"><span>{p.name}</span><span className="font-medium">{p.depot} {p.unit}</span></div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {["VH-001 (Carlos M.)", "VH-002 (Ana R.)", "VH-003 (Luis P.)", "VH-004 (María G.)"].map((v, i) => (
              <Card key={i} className="border border-border">
                <CardContent className="p-4">
                  <Truck className="h-6 w-6 text-secondary mb-2" />
                  <p className="font-heading font-bold text-sm">{v}</p>
                  <p className="text-xs text-muted-foreground mt-1">Stock móvil</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="traceability" className="mt-4">
          <Card className="border border-border overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-secondary" /> Movimientos
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Fecha</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Producto</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Tipo</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground hidden md:table-cell">Origen → Destino</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase text-muted-foreground">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((m, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-xs text-muted-foreground">{m.date}</td>
                      <td className="py-3 px-4 font-medium">{m.product}</td>
                      <td className="py-3 px-4">
                        <Badge className={`text-[10px] ${m.type === "Entrada" ? "bg-primary/10 text-primary border-0" : m.type === "Salida" ? "bg-secondary/10 text-secondary border-0" : "bg-muted text-muted-foreground border-0"}`}>{m.type}</Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground hidden md:table-cell">{m.from} → {m.to}</td>
                      <td className="py-3 px-4 font-medium">{m.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="msds" className="mt-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.filter((p) => p.msds).map((p) => (
              <Card key={p.id} className="border border-border hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="h-8 w-8 text-secondary shrink-0" />
                    <div>
                      <p className="font-heading font-semibold text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{p.category} — {p.lot}</p>
                      <Button variant="link" size="sm" className="px-0 text-secondary text-xs mt-2 h-auto">Ver Hoja de Seguridad →</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
