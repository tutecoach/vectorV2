import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

const clientSchema = z.object({
  name: z.string().min(1, "El nombre / Razón Social es obligatorio"),
  cuit: z.string().optional().nullable(),
  email: z.string().email("Email inválido").or(z.literal("")).optional().nullable(),
  phone: z.string().optional().nullable(),
  contact_name: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  geo_lat: z.coerce.number().optional().nullable(),
  geo_lng: z.coerce.number().optional().nullable(),
  type: z.string().optional().nullable(),
  zone: z.string().optional().nullable(),
  plan: z.string().optional().nullable().default("Estándar"),
  status: z.enum(["activo", "pendiente", "inactivo"]).default("activo"),
});

const prospectSchema = z.object({
  phone: z.string().min(1, "El teléfono es obligatorio"),
  name: z.string().optional().nullable(),
  original_message: z.string().optional().nullable(),
  source: z.string().default("whatsapp"),
  marketing_tags: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;
type ProspectFormValues = z.infer<typeof prospectSchema>;

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [prospectModalOpen, setProspectModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const { data: clients = [], isLoading } = useClients();
  const { data: prospects = [] } = useProspects();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  const createProspect = useCreateProspect();
  const updateProspect = useUpdateProspect();

  const filtered = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const clientForm = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "", cuit: "", email: "", phone: "", contact_name: "", address: "",
      geo_lat: null, geo_lng: null, type: "", zone: "", plan: "Estándar", status: "activo"
    }
  });

  const prospectForm = useForm<ProspectFormValues>({
    resolver: zodResolver(prospectSchema),
    defaultValues: {
      phone: "", name: "", original_message: "", source: "whatsapp", marketing_tags: ""
    }
  });

  const openNewClient = () => {
    setEditingClient(null);
    clientForm.reset({
      name: "", cuit: "", email: "", phone: "", contact_name: "", address: "",
      geo_lat: null, geo_lng: null, type: "", zone: "", plan: "Estándar", status: "activo"
    });
    setClientModalOpen(true);
  };

  const openEditClient = (client: Client) => {
    setEditingClient(client);
    clientForm.reset({
      name: client.name,
      cuit: client.cuit || "",
      email: client.email || "",
      phone: client.phone || "",
      contact_name: client.contact_name || "",
      address: client.address || "",
      geo_lat: client.geo_lat || null,
      geo_lng: client.geo_lng || null,
      type: client.type || "",
      zone: client.zone || "",
      plan: client.plan || "Estándar",
      status: client.status,
    });
    setClientModalOpen(true);
  };

  const onClientSubmit = async (values: ClientFormValues) => {
    try {
      if (editingClient) {
        await updateClient.mutateAsync({ id: editingClient.id, ...values } as any);
        toast.success("Cliente actualizado exitosamente");
      } else {
        const created = await createClient.mutateAsync(values as any);
        setSelectedClient(created);
        toast.success("Cliente creado exitosamente");
      }
      setClientModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Error al guardar cliente");
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
      toast.success("Cliente eliminado exitosamente");
    } catch (e: any) {
      toast.error(e.message || "Error al eliminar cliente");
    }
    setClientToDelete(null);
  };

  const openNewProspect = () => {
    prospectForm.reset({ phone: "", name: "", original_message: "", source: "whatsapp", marketing_tags: "" });
    setProspectModalOpen(true);
  };

  const onProspectSubmit = async (values: ProspectFormValues) => {
    try {
      const tags = values.marketing_tags
        ? values.marketing_tags.split(",").map(t => t.trim()).filter(Boolean)
        : [];

      await createProspect.mutateAsync({
        phone: values.phone,
        name: values.name || null,
        original_message: values.original_message || null,
        source: values.source,
        marketing_tags: tags,
        status: "nuevo"
      });
      toast.success("Prospecto creado exitosamente");
      setProspectModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Error al guardar prospecto");
    }
  };

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
          <Form {...clientForm}>
            <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-4">
              <FormField control={clientForm.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre / Razón Social <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField control={clientForm.control} name="cuit" render={({ field }) => (
                  <FormItem>
                    <FormLabel>CUIT</FormLabel>
                    <FormControl><Input placeholder="20-12345678-9" {...field} value={field.value || ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={clientForm.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" {...field} value={field.value || ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={clientForm.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={clientForm.control} name="contact_name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contacto</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={clientForm.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField control={clientForm.control} name="geo_lat" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitud</FormLabel>
                    <FormControl><Input type="number" step="any" {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={clientForm.control} name="geo_lng" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitud</FormLabel>
                    <FormControl><Input type="number" step="any" {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField control={clientForm.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl><Input placeholder="Ej: Hotelería" {...field} value={field.value || ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={clientForm.control} name="zone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zona</FormLabel>
                    <FormControl><Input placeholder="Ej: Zona Norte" {...field} value={field.value || ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={clientForm.control} name="plan" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan</FormLabel>
                    <Select value={field.value || "Estándar"} onValueChange={field.onChange}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Básico">Básico</SelectItem>
                        <SelectItem value="Estándar">Estándar</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={clientForm.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select value={field.value || "activo"} onValueChange={field.onChange}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setClientModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={createClient.isPending || updateClient.isPending}>
                  {createClient.isPending || updateClient.isPending ? "Guardando..." : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Prospect Modal */}
      <Dialog open={prospectModalOpen} onOpenChange={setProspectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Nuevo Lead / Prospecto</DialogTitle>
          </DialogHeader>
          <Form {...prospectForm}>
            <form onSubmit={prospectForm.handleSubmit(onProspectSubmit)} className="space-y-4">
              <FormField control={prospectForm.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono WhatsApp <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input placeholder="+54 9 264 5792222" {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={prospectForm.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={prospectForm.control} name="original_message" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensaje Original</FormLabel>
                  <FormControl><Input placeholder="Ej: Hola, tengo cucarachas..." {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={prospectForm.control} name="source" render={({ field }) => (
                <FormItem>
                  <FormLabel>Origen</FormLabel>
                  <Select value={field.value || "whatsapp"} onValueChange={field.onChange}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="telefono">Teléfono</SelectItem>
                      <SelectItem value="web">Web</SelectItem>
                      <SelectItem value="referido">Referido</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={prospectForm.control} name="marketing_tags" render={({ field }) => (
                <FormItem>
                  <FormLabel>Etiquetas (separar con coma)</FormLabel>
                  <FormControl><Input placeholder="Ej: Cucaracha, Industria" {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setProspectModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={createProspect.isPending}>
                  {createProspect.isPending ? "Guardando..." : "Guardar Lead"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
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
