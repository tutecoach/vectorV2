import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  Search, Plus, Building2, Phone, Mail, ChevronRight, MapPin,
  FileText, CreditCard, ClipboardList, Brain, Star, Users, Globe, Filter, Trash2, Edit,
  MessageSquare,
} from "lucide-react";
import { useClients, useCreateClient, useUpdateClient, useDeleteClient, useProspects, useCreateProspect, useUpdateProspect } from "@/hooks/useCRM";
import { toast } from "sonner";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Client = Tables<"clients">;

const statusColors: Record<string, string> = {
  activo: "bg-primary/10 text-primary border-0",
  pendiente: "bg-secondary/10 text-secondary border-0",
  inactivo: "bg-muted text-muted-foreground border-0",
};

const prospectStatusLabels: Record<string, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  convertido: "Convertido",
};

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [prospectModalOpen, setProspectModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientForm, setClientForm] = useState<Partial<TablesInsert<"clients">>>({});
  const [prospectForm, setProspectForm] = useState<Partial<TablesInsert<"prospects">>>({});
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const { data: clients = [], isLoading } = useClients();
  const { data: prospects = [] } = useProspects();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  const createProspect = useCreateProspect();
  const updateProspect = useUpdateProspect();

  const filtered = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const openNewClient = () => {
    setEditingClient(null);
    setClientForm({ status: "activo", plan: "Estándar" });
    setClientModalOpen(true);
  };

  const openEditClient = (client: Client) => {
    setEditingClient(client);
    setClientForm({ ...client });
    setClientModalOpen(true);
  };

  const handleSaveClient = async () => {
    if (!clientForm.name?.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    try {
      if (editingClient) {
        await updateClient.mutateAsync({ id: editingClient.id, ...clientForm });
        toast.success("Cliente actualizado");
      } else {
        const created = await createClient.mutateAsync(clientForm as TablesInsert<"clients">);
        setSelectedClient(created);
        toast.success("Cliente creado");
      }
      setClientModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Error al guardar");
    }
  };

  const handleDeleteClient = async (client: Client) => {
    setClientToDelete(client);
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;
    try {
      await deleteClient.mutateAsync(clientToDelete.id);
      if (selectedClient?.id === clientToDelete.id) setSelectedClient(null);
      toast.success("Cliente eliminado");
    } catch (e: any) {
      toast.error(e.message || "Error al eliminar");
    }
    setClientToDelete(null);
  };

  const openNewProspect = () => {
    setProspectForm({ status: "nuevo", source: "whatsapp", marketing_tags: [] });
    setProspectModalOpen(true);
  };

  const handleSaveProspect = async () => {
    if (!prospectForm.phone?.trim()) {
      toast.error("El teléfono es obligatorio");
      return;
    }
    try {
      await createProspect.mutateAsync(prospectForm as TablesInsert<"prospects">);
      toast.success("Prospecto creado");
      setProspectModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Error al guardar");
    }
  };

  const updateField = (key: string, value: any) => setClientForm((p) => ({ ...p, [key]: value }));
  const updateProspectField = (key: string, value: any) => setProspectForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="space-y-6">
      <Tabs defaultValue="accounts">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <TabsList>
            <TabsTrigger value="accounts" className="font-heading text-sm">Base de Datos</TabsTrigger>
            <TabsTrigger value="detail" className="font-heading text-sm">Ficha 360°</TabsTrigger>
            <TabsTrigger value="pipeline" className="font-heading text-sm">Pipeline / Leads</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={openNewProspect} className="font-heading text-sm">
              <MessageSquare className="h-4 w-4 mr-1" /> Nuevo Lead
            </Button>
            <Button size="sm" className="bg-primary font-heading text-sm" onClick={openNewClient}>
              <Plus className="h-4 w-4 mr-1" /> Nuevo Cliente
            </Button>
          </div>
        </div>

        {/* Client List */}
        <TabsContent value="accounts" className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar cliente..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground text-sm">Cargando clientes...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No hay clientes. Cree el primero.</p>
            </div>
          ) : (
            <Card className="border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase tracking-wide text-muted-foreground">Empresa</th>
                      <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase tracking-wide text-muted-foreground hidden md:table-cell">Tipo</th>
                      <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase tracking-wide text-muted-foreground hidden lg:table-cell">Zona</th>
                      <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase tracking-wide text-muted-foreground">Plan</th>
                      <th className="text-left py-3 px-4 font-heading font-semibold text-xs uppercase tracking-wide text-muted-foreground">Estado</th>
                      <th className="text-right py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedClient(c)}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div>
                              <span className="font-medium text-foreground block">{c.name}</span>
                              <span className="text-[11px] text-muted-foreground">{c.contact_name || c.email || ""}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-xs hidden md:table-cell">{c.type || "-"}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs hidden lg:table-cell">{c.zone || "-"}</td>
                        <td className="py-3 px-4"><Badge variant="outline" className="text-[10px]">{c.plan || "-"}</Badge></td>
                        <td className="py-3 px-4">
                          <Badge className={`text-[10px] ${statusColors[c.status] || ""}`}>{c.status}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); openEditClient(c); }}><Edit className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); handleDeleteClient(c); }}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Client Detail 360 */}
        <TabsContent value="detail" className="space-y-4">
          {!selectedClient ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Seleccione un cliente de la Base de Datos para ver su ficha.</p>
            </div>
          ) : (
            <>
              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="font-heading text-lg">{selectedClient.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{selectedClient.cuit || ""} · {selectedClient.type || ""} · {selectedClient.zone || ""}</p>
                      </div>
                    </div>
                    <Badge className={`${statusColors[selectedClient.status]}`}>{selectedClient.status}</Badge>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border border-border">
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-heading font-semibold text-sm">Datos de Contacto</h4>
                    <div className="space-y-2 text-sm font-body">
                      <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /><span>{selectedClient.contact_name || "-"}</span></div>
                      <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span>{selectedClient.phone || "-"}</span></div>
                      <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span>{selectedClient.email || "-"}</span></div>
                      <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{selectedClient.address || "-"}</span></div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-border">
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-heading font-semibold text-sm">Condiciones Comerciales</h4>
                    <div className="space-y-2 text-sm font-body">
                      <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><Badge variant="outline" className="text-[10px]">{selectedClient.plan || "-"}</Badge></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">CUIT</span><span className="font-medium">{selectedClient.cuit || "-"}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Zona</span><span>{selectedClient.zone || "-"}</span></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Pipeline / Leads */}
        <TabsContent value="pipeline" className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-semibold text-sm">Leads / Prospectos</h3>
            <Button size="sm" onClick={openNewProspect} className="text-xs"><Plus className="h-3 w-3 mr-1" /> Nuevo Lead</Button>
          </div>

          {prospects.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Sin leads aún. Agregue uno manualmente o conecte WhatsApp.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(["nuevo", "contactado", "convertido"] as const).map((status) => {
                const items = prospects.filter((p) => p.status === status);
                return (
                  <div key={status} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-semibold text-sm text-foreground">{prospectStatusLabels[status]}</h3>
                      <Badge variant="outline" className="text-[10px]">{items.length}</Badge>
                    </div>
                    <div className="space-y-2 min-h-[120px] bg-muted/20 rounded-lg p-2">
                      {items.map((item) => (
                        <Card key={item.id} className="border border-border cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-3">
                            <p className="font-heading font-semibold text-sm text-foreground">{item.name || "Sin nombre"}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.phone}</p>
                            {item.original_message && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">"{item.original_message}"</p>}
                            {item.marketing_tags && item.marketing_tags.length > 0 && (
                              <div className="flex gap-1 mt-2 flex-wrap">
                                {item.marketing_tags.map((tag, i) => (
                                  <Badge key={i} variant="outline" className="text-[9px]">{tag}</Badge>
                                ))}
                              </div>
                            )}
                            {status !== "convertido" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[10px] mt-2 h-6 px-2"
                                onClick={() => {
                                  const nextStatus = status === "nuevo" ? "contactado" : "convertido";
                                  updateProspect.mutate({ id: item.id, status: nextStatus as any });
                                }}
                              >
                                Avanzar →
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Client Modal */}
      <Dialog open={clientModalOpen} onOpenChange={setClientModalOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{editingClient ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-heading">Nombre / Razón Social *</Label>
              <Input value={clientForm.name || ""} onChange={(e) => updateField("name", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-heading">CUIT</Label>
                <Input value={clientForm.cuit || ""} onChange={(e) => updateField("cuit", e.target.value)} placeholder="20-12345678-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-heading">Email</Label>
                <Input type="email" value={clientForm.email || ""} onChange={(e) => updateField("email", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-heading">Teléfono</Label>
                <Input value={clientForm.phone || ""} onChange={(e) => updateField("phone", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-heading">Contacto</Label>
                <Input value={clientForm.contact_name || ""} onChange={(e) => updateField("contact_name", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-heading">Dirección</Label>
              <Input value={clientForm.address || ""} onChange={(e) => updateField("address", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-heading">Latitud</Label>
                <Input type="number" step="any" value={clientForm.geo_lat ?? ""} onChange={(e) => updateField("geo_lat", e.target.value ? parseFloat(e.target.value) : null)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-heading">Longitud</Label>
                <Input type="number" step="any" value={clientForm.geo_lng ?? ""} onChange={(e) => updateField("geo_lng", e.target.value ? parseFloat(e.target.value) : null)} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-heading">Tipo</Label>
                <Input value={clientForm.type || ""} onChange={(e) => updateField("type", e.target.value)} placeholder="Ej: Hotelería" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-heading">Zona</Label>
                <Input value={clientForm.zone || ""} onChange={(e) => updateField("zone", e.target.value)} placeholder="Ej: Zona Norte" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-heading">Plan</Label>
                <Select value={clientForm.plan || "Estándar"} onValueChange={(v) => updateField("plan", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Básico">Básico</SelectItem>
                    <SelectItem value="Estándar">Estándar</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-heading">Estado</Label>
              <Select value={clientForm.status || "activo"} onValueChange={(v) => updateField("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClientModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveClient} disabled={createClient.isPending || updateClient.isPending}>
              {createClient.isPending || updateClient.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Prospect Modal */}
      <Dialog open={prospectModalOpen} onOpenChange={setProspectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Nuevo Lead / Prospecto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-heading">Teléfono WhatsApp *</Label>
              <Input value={prospectForm.phone || ""} onChange={(e) => updateProspectField("phone", e.target.value)} placeholder="+54 9 264 5792222" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-heading">Nombre</Label>
              <Input value={prospectForm.name || ""} onChange={(e) => updateProspectField("name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-heading">Mensaje Original</Label>
              <Input value={prospectForm.original_message || ""} onChange={(e) => updateProspectField("original_message", e.target.value)} placeholder="Ej: Hola, tengo cucarachas..." />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-heading">Origen</Label>
              <Select value={prospectForm.source || "whatsapp"} onValueChange={(v) => updateProspectField("source", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="telefono">Teléfono</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="referido">Referido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-heading">Etiquetas (separar con coma)</Label>
              <Input
                value={(prospectForm.marketing_tags || []).join(", ")}
                onChange={(e) => updateProspectField("marketing_tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                placeholder="Ej: Cucaracha, Industria"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProspectModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveProspect} disabled={createProspect.isPending}>
              {createProspect.isPending ? "Guardando..." : "Guardar Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">¿Eliminar cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente a <strong>{clientToDelete?.name}</strong> y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteClient} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
