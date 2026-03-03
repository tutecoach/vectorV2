import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ConfigModal from "@/components/config/ConfigModal";
import ConfigDataTable from "@/components/config/ConfigDataTable";
import {
  useSpeciesCategories, useSpecies, useSupplyTypes, useSupplies, useActionPrograms,
  useBranches, useCertifications, useCancellationReasons, useBusinessSectors,
  useFacilitySectors, useApplicationMethods, useTechnicalDirectors,
  useCompanyInfo, useLegalRepresentative, useUsers, useUserRoles,
} from "@/hooks/useConfigData";
import { Constants } from "@/integrations/supabase/types";
import {
  Building2, UserCheck, MapPin, Award, Bug, XCircle, Briefcase, LayoutGrid,
  Image, Wrench, Users, GraduationCap, FileUp, Layers, Clock, Shield, Package,
} from "lucide-react";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-heading">{label}</Label>
    {children}
  </div>
);

/* No more mock data - all connected to Supabase */
const appRoles = Constants.public.Enums.app_role;

const sections = [
  { value: "empresa", label: "Empresa", icon: Building2 },
  { value: "replegal", label: "Rep. Legal", icon: UserCheck },
  { value: "sucursales", label: "Sucursales", icon: MapPin },
  { value: "habilitaciones", label: "Habilitaciones", icon: Award },
  { value: "especies", label: "Especies", icon: Bug },
  { value: "cancelaciones", label: "Cancelaciones", icon: XCircle },
  { value: "rubros", label: "Rubros", icon: Briefcase },
  { value: "sectores", label: "Sectores", icon: LayoutGrid },
  { value: "insumos", label: "Insumos", icon: Package },
  { value: "logos", label: "Logos", icon: Image },
  { value: "metodos", label: "Métodos", icon: Wrench },
  { value: "usuarios", label: "Usuarios", icon: Users },
  { value: "directores", label: "Dir. Técnicos", icon: GraduationCap },
  { value: "importar", label: "Importar", icon: FileUp },
  { value: "programas", label: "Programas", icon: Layers },
];

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState("empresa");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalSection, setModalSection] = useState("");
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // All real hooks
  const speciesCats = useSpeciesCategories();
  const speciesHook = useSpecies();
  const supplyTypesHook = useSupplyTypes();
  const suppliesHook = useSupplies();
  const programsHook = useActionPrograms();
  const branchesHook = useBranches();
  const certsHook = useCertifications();
  const cancelHook = useCancellationReasons();
  const bizSectorsHook = useBusinessSectors();
  const facSectorsHook = useFacilitySectors();
  const methodsHook = useApplicationMethods();
  const directorsHook = useTechnicalDirectors();

  // Real hooks for empresa, repLegal, usuarios
  const companyHook = useCompanyInfo();
  const legalRepHook = useLegalRepresentative();
  const usersHook = useUsers();
  const userRolesHook = useUserRoles();
  const empresa = companyHook.data || { razon_social: "", cuit: "", address: "", phone: "", email: "", owner_name: "" };
  const repLegal = legalRepHook.data || { name: "", dni: "", position: "", signature_url: null };

  const updateField = (key: string, value: any) => setFormData((prev: any) => ({ ...prev, [key]: value }));

  const openAdd = (section: string, title: string, defaults: any = {}) => {
    setEditingItem(null); setFormData(defaults); setModalTitle(title); setModalSection(section); setModalOpen(true);
  };
  const openEdit = (section: string, title: string, item: any) => {
    setEditingItem(item); setFormData({ ...item }); setModalTitle(title); setModalSection(section); setModalOpen(true);
  };

  // No more mock helpers needed

  // Map section → hook
  const hookMap: Record<string, any> = {
    speciesCats: speciesCats, species: speciesHook, supplyTypes: supplyTypesHook,
    supplies: suppliesHook, programs: programsHook, branches: branchesHook,
    certs: certsHook, cancel: cancelHook, bizSectors: bizSectorsHook,
    facSectors: facSectorsHook, methods: methodsHook, directors: directorsHook,
  };

  const buildPayload = (): Record<string, any> => {
    const s = modalSection;
    if (s === "speciesCats") return { name: formData.name };
    if (s === "species") return { name: formData.name, category_id: formData.category_id };
    if (s === "supplyTypes") return { name: formData.name };
    if (s === "supplies") return { name: formData.name, type_id: formData.type_id, unit: formData.unit || "unidad", stock: Number(formData.stock) || 0 };
    if (s === "programs") return { name: formData.name, description: formData.description || null };
    if (s === "branches") return { name: formData.name, cuit: formData.cuit, phone: formData.phone, email: formData.email, province: formData.province, city: formData.city, address: formData.address, shift_start: formData.shift_start || "08:00", header_bg_color: formData.header_bg_color || "#33A867", header_text_color: formData.header_text_color || "#FFFFFF" };
    if (s === "certs") return { jurisdiction: formData.jurisdiction, name: formData.name, registration_number: formData.registration_number, expiry_date: formData.expiry_date || null, pest_control: formData.pest_control ?? false, tank_cleaning: formData.tank_cleaning ?? false, technical_director: formData.technical_director };
    if (s === "cancel") return { name: formData.name, chargeable: formData.chargeable ?? false };
    if (s === "bizSectors" || s === "facSectors" || s === "methods") return { name: formData.name };
    if (s === "directors") return { name: formData.name, title: formData.title, license_number: formData.license_number, license_expiry: formData.license_expiry || null };
    return {};
  };

  const realSections = Object.keys(hookMap);
  const isReal = realSections.includes(modalSection);

  const handleSaveReal = async () => {
    setSaving(true);
    try {
      const hook = hookMap[modalSection];
      const payload = buildPayload();
      if (editingItem) await hook.update.mutateAsync({ id: editingItem.id, ...payload });
      else await hook.insert.mutateAsync(payload);
      setModalOpen(false);
    } catch { /* toast handled */ } finally { setSaving(false); }
  };

  const handleDeleteReal = async (section: string, item: any) => {
    await hookMap[section].remove.mutateAsync(item.id);
  };

  const getModalSave = () => {
    if (isReal) return handleSaveReal;
    if (modalSection === "empresa") return async () => { setSaving(true); try { await companyHook.upsert.mutateAsync({ razon_social: formData.razon_social, cuit: formData.cuit, address: formData.address, phone: formData.phone, email: formData.email, owner_name: formData.owner_name }); setModalOpen(false); } finally { setSaving(false); } };
    if (modalSection === "repLegal") return async () => { setSaving(true); try { await legalRepHook.upsert.mutateAsync({ name: formData.name, dni: formData.dni, position: formData.position }); setModalOpen(false); } finally { setSaving(false); } };
    if (modalSection === "editRole") return async () => { setSaving(true); try { await userRolesHook.updateRole.mutateAsync({ userId: formData.userId, role: formData.role }); setModalOpen(false); } finally { setSaving(false); } };
    return () => setModalOpen(false);
  };

  /* ---- MODAL CONTENT ---- */
  const getModalContent = () => {
    const s = modalSection;
    if (s === "speciesCats") return <Field label="Nombre de la Categoría"><Input value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} placeholder="Ej: Insecto Rastrero, Aves" /></Field>;
    if (s === "species") return (<>
      <Field label="Categoría / Tipo"><Select value={formData.category_id || ""} onValueChange={(v) => updateField("category_id", v)}><SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger><SelectContent>{speciesCats.data.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></Field>
      <Field label="Nombre (científico y común)"><Input value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} placeholder="Ej: Blatella germanica (Cucaracha alemana)" /></Field>
    </>);
    if (s === "supplyTypes") return <Field label="Nombre del Tipo"><Input value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} placeholder="Ej: Gel, Bloque, EPP" /></Field>;
    if (s === "supplies") return (<>
      <Field label="Nombre del Insumo"><Input value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} /></Field>
      <Field label="Tipo de Insumo"><Select value={formData.type_id || ""} onValueChange={(v) => updateField("type_id", v)}><SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger><SelectContent>{supplyTypesHook.data.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Unidad"><Input value={formData.unit || "unidad"} onChange={(e) => updateField("unit", e.target.value)} /></Field>
        <Field label="Stock Actual"><Input type="number" value={formData.stock ?? 0} onChange={(e) => updateField("stock", e.target.value)} /></Field>
      </div>
    </>);
    if (s === "programs") return (<>
      <Field label="Nombre del Programa"><Input value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} placeholder="Ej: Desinsectación, MIP" /></Field>
      <Field label="Descripción"><Input value={formData.description || ""} onChange={(e) => updateField("description", e.target.value)} /></Field>
    </>);
    if (s === "branches") return (<>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre"><Input value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} /></Field>
        <Field label="CUIT"><Input value={formData.cuit || ""} onChange={(e) => updateField("cuit", e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Teléfono"><Input value={formData.phone || ""} onChange={(e) => updateField("phone", e.target.value)} /></Field>
        <Field label="Email"><Input value={formData.email || ""} onChange={(e) => updateField("email", e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Provincia"><Input value={formData.province || ""} onChange={(e) => updateField("province", e.target.value)} /></Field>
        <Field label="Ciudad"><Input value={formData.city || ""} onChange={(e) => updateField("city", e.target.value)} /></Field>
      </div>
      <Field label="Dirección"><Input value={formData.address || ""} onChange={(e) => updateField("address", e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Inicio de Turno"><Input type="time" value={formData.shift_start || "08:00"} onChange={(e) => updateField("shift_start", e.target.value)} /></Field>
        <Field label="Logo de Sucursal"><Input type="file" accept="image/*" className="text-sm" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Color Fondo Títulos PDF"><div className="flex items-center gap-2"><input type="color" value={formData.header_bg_color || "#33A867"} onChange={(e) => updateField("header_bg_color", e.target.value)} className="h-9 w-12 rounded border cursor-pointer" /><Input value={formData.header_bg_color || "#33A867"} onChange={(e) => updateField("header_bg_color", e.target.value)} className="flex-1" /></div></Field>
        <Field label="Color Texto Títulos PDF"><div className="flex items-center gap-2"><input type="color" value={formData.header_text_color || "#FFFFFF"} onChange={(e) => updateField("header_text_color", e.target.value)} className="h-9 w-12 rounded border cursor-pointer" /><Input value={formData.header_text_color || "#FFFFFF"} onChange={(e) => updateField("header_text_color", e.target.value)} className="flex-1" /></div></Field>
      </div>
    </>);
    if (s === "certs") return (<>
      <Field label="Jurisdicción"><Select value={formData.jurisdiction || ""} onValueChange={(v) => updateField("jurisdiction", v)}><SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger><SelectContent><SelectItem value="Provincial">Provincial</SelectItem><SelectItem value="Nacional">Nacional</SelectItem></SelectContent></Select></Field>
      <Field label="Nombre de la Habilitación"><Input value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nro. de Inscripción"><Input value={formData.registration_number || ""} onChange={(e) => updateField("registration_number", e.target.value)} /></Field>
        <Field label="Fecha de Vencimiento"><Input type="date" value={formData.expiry_date || ""} onChange={(e) => updateField("expiry_date", e.target.value)} /></Field>
      </div>
      <div className="flex items-center gap-6 py-2">
        <div className="flex items-center gap-2"><Checkbox checked={formData.pest_control ?? false} onCheckedChange={(v) => updateField("pest_control", v)} /><span className="text-sm">Control de Plagas</span></div>
        <div className="flex items-center gap-2"><Checkbox checked={formData.tank_cleaning ?? false} onCheckedChange={(v) => updateField("tank_cleaning", v)} /><span className="text-sm">Limpieza de Tanques</span></div>
      </div>
      <Field label="Director Técnico Responsable"><Input value={formData.technical_director || ""} onChange={(e) => updateField("technical_director", e.target.value)} /></Field>
    </>);
    if (s === "cancel") return (<>
      <Field label="Nombre del Motivo"><Input value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} /></Field>
      <div className="flex items-center gap-2 py-2"><Checkbox checked={formData.chargeable ?? false} onCheckedChange={(v) => updateField("chargeable", v)} /><span className="text-sm">Justifica el cobro (Efectividad)</span></div>
    </>);
    if (s === "bizSectors") return <Field label="Nombre del Rubro"><Input value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} placeholder="Ej: Industria Alimentaria" /></Field>;
    if (s === "facSectors") return <Field label="Nombre del Sector"><Input value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} placeholder="Ej: Cocina, Depósito" /></Field>;
    if (s === "methods") return <Field label="Nombre del Método"><Input value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} placeholder="Ej: Aspersión Localizada" /></Field>;
    if (s === "directors") return (<>
      <Field label="Nombre Completo"><Input value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Título Profesional"><Input value={formData.title || ""} onChange={(e) => updateField("title", e.target.value)} /></Field>
        <Field label="Nro. de Matrícula"><Input value={formData.license_number || ""} onChange={(e) => updateField("license_number", e.target.value)} /></Field>
      </div>
      <Field label="Vigencia de Matrícula"><Input type="date" value={formData.license_expiry || ""} onChange={(e) => updateField("license_expiry", e.target.value)} /></Field>
    </>);
    // Mock modals
    if (s === "empresa") return (<>
      <Field label="Razón Social"><Input value={formData.razonSocial || ""} onChange={(e) => updateField("razonSocial", e.target.value)} /></Field>
      <Field label="Razón Social"><Input value={formData.razon_social || ""} onChange={(e) => updateField("razon_social", e.target.value)} /></Field>
      <Field label="CUIT"><Input value={formData.cuit || ""} onChange={(e) => updateField("cuit", e.target.value)} /></Field>
      <Field label="Dirección Legal"><Input value={formData.address || ""} onChange={(e) => updateField("address", e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Teléfono"><Input value={formData.phone || ""} onChange={(e) => updateField("phone", e.target.value)} /></Field>
        <Field label="Email Corporativo"><Input value={formData.email || ""} onChange={(e) => updateField("email", e.target.value)} /></Field>
      </div>
      <Field label="Nombre del Dueño/Gerente"><Input value={formData.owner_name || ""} onChange={(e) => updateField("owner_name", e.target.value)} /></Field>
    </>);
    if (s === "repLegal") return (<>
      <Field label="Nombre Completo"><Input value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="DNI/CUIT Personal"><Input value={formData.dni || ""} onChange={(e) => updateField("dni", e.target.value)} /></Field>
        <Field label="Cargo"><Input value={formData.position || ""} onChange={(e) => updateField("position", e.target.value)} /></Field>
      </div>
      <Field label="Firma Digitalizada (PNG transparente)"><Input type="file" accept=".png" className="text-sm" /></Field>
    </>);
    if (s === "editRole") return (<>
      <Field label="Usuario"><Input value={formData.userName || ""} disabled /></Field>
      <Field label="Rol"><Select value={formData.role || ""} onValueChange={(v) => updateField("role", v)}><SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger><SelectContent>{appRoles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></Field>
    </>);
    return null;
  };

  const getCategoryName = (s: any) => s?.species_categories?.name || "—";
  const getSupplyTypeName = (s: any) => s?.supply_types?.name || "—";

  /* ---- RENDER ---- */
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0">
          {sections.map((s) => (
            <TabsTrigger key={s.value} value={s.value} className="font-heading text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5 border border-border data-[state=active]:border-primary">
              <s.icon className="h-3.5 w-3.5 mr-1.5" />{s.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* EMPRESA - REAL */}
        <TabsContent value="empresa" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><h3 className="font-heading font-bold text-sm">Datos de la Empresa</h3><p className="text-xs text-muted-foreground">Identidad fiscal y legal. Datos persistentes.</p></div>
              <Button size="sm" className="bg-primary hover:bg-primary/90 font-heading text-sm" onClick={() => { setEditingItem(empresa); setFormData({ ...empresa }); setModalTitle("Editar Datos de la Empresa"); setModalSection("empresa"); setModalOpen(true); }}>Editar</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4 border rounded-lg p-4">
              {([["Razón Social", empresa.razon_social], ["CUIT", empresa.cuit], ["Dirección Legal", empresa.address], ["Teléfono", empresa.phone], ["Email Corporativo", empresa.email], ["Responsable", empresa.owner_name]] as const).map(([l, v]) => (
                <div key={l}><p className="text-[11px] text-muted-foreground font-heading uppercase">{l}</p><p className="text-sm font-body font-medium">{v || "—"}</p></div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* REP LEGAL - REAL */}
        <TabsContent value="replegal" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><h3 className="font-heading font-bold text-sm">Representante Legal</h3><p className="text-xs text-muted-foreground">Firmante responsable. Datos persistentes.</p></div>
              <Button size="sm" className="bg-primary hover:bg-primary/90 font-heading text-sm" onClick={() => { setEditingItem(repLegal); setFormData({ ...repLegal }); setModalTitle("Editar Rep. Legal"); setModalSection("repLegal"); setModalOpen(true); }}>Editar</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4 border rounded-lg p-4">
              <div><p className="text-[11px] text-muted-foreground font-heading uppercase">Nombre Completo</p><p className="text-sm font-body font-medium">{repLegal.name || "—"}</p></div>
              <div><p className="text-[11px] text-muted-foreground font-heading uppercase">DNI/CUIT</p><p className="text-sm font-body font-medium">{repLegal.dni || "—"}</p></div>
              <div><p className="text-[11px] text-muted-foreground font-heading uppercase">Cargo</p><p className="text-sm font-body font-medium">{repLegal.position || "—"}</p></div>
              <div><p className="text-[11px] text-muted-foreground font-heading uppercase">Firma</p><p className="text-sm font-body">{repLegal.signature_url ? "Cargada ✓" : "No cargada"}</p></div>
            </div>
          </div>
        </TabsContent>

        {/* SUCURSALES - REAL */}
        <TabsContent value="sucursales" className="mt-4">
          <ConfigDataTable title="Sucursales" description="Puntos operativos. Datos persistentes." searchKey="name"
            columns={[
              { key: "name", label: "Nombre" }, { key: "province", label: "Provincia" }, { key: "city", label: "Ciudad" }, { key: "phone", label: "Teléfono" },
              { key: "shift_start", label: "Turno", render: (i) => <Badge variant="outline" className="text-[10px]"><Clock className="h-2.5 w-2.5 mr-1" />{i.shift_start}</Badge> },
              { key: "color", label: "Color", render: (i) => <div className="flex gap-1"><span className="inline-block h-5 w-5 rounded-sm border" style={{ backgroundColor: i.header_bg_color }} /><span className="inline-block h-5 w-5 rounded-sm border" style={{ backgroundColor: i.header_text_color }} /></div> },
            ]}
            data={branchesHook.data}
            onAdd={() => openAdd("branches", "Nueva Sucursal", { header_bg_color: "#33A867", header_text_color: "#FFFFFF" })}
            onEdit={(item) => openEdit("branches", "Editar Sucursal", item)}
            onDelete={(item) => handleDeleteReal("branches", item)}
          />
        </TabsContent>

        {/* HABILITACIONES - REAL */}
        <TabsContent value="habilitaciones" className="mt-4">
          <ConfigDataTable title="Habilitaciones" description="Validez legal para operar. Datos persistentes." searchKey="name"
            columns={[
              { key: "jurisdiction", label: "Jurisdicción", render: (i) => <Badge variant="outline" className="text-[10px]">{i.jurisdiction}</Badge> },
              { key: "name", label: "Habilitación" }, { key: "registration_number", label: "Nro. Inscripción" },
              { key: "expiry_date", label: "Vencimiento", render: (i) => { if (!i.expiry_date) return "—"; const d = new Date(i.expiry_date); const soon = d.getTime() - Date.now() < 90 * 24 * 60 * 60 * 1000; return <Badge className={`text-[10px] border-0 ${soon ? "bg-orange-100 text-orange-700" : "bg-primary/10 text-primary"}`}>{i.expiry_date}</Badge>; }},
              { key: "technical_director", label: "Dir. Técnico" },
            ]}
            data={certsHook.data}
            onAdd={() => openAdd("certs", "Nueva Habilitación")}
            onEdit={(item) => openEdit("certs", "Editar Habilitación", item)}
            onDelete={(item) => handleDeleteReal("certs", item)}
          />
        </TabsContent>

        {/* ESPECIES - REAL */}
        <TabsContent value="especies" className="mt-4">
          <div className="space-y-6">
            <ConfigDataTable title="Categorías de Especies" description="Clasificación jerárquica. Datos persistentes." searchKey="name"
              columns={[{ key: "name", label: "Nombre de la Categoría" }]}
              data={speciesCats.data}
              onAdd={() => openAdd("speciesCats", "Nueva Categoría de Especie")}
              onEdit={(item) => openEdit("speciesCats", "Editar Categoría de Especie", item)}
              onDelete={(item) => handleDeleteReal("speciesCats", item)}
            />
            <ConfigDataTable title="Especies" description="Plagas objetivo. Datos persistentes." searchKey="name"
              columns={[
                { key: "category", label: "Categoría", render: (i) => <Badge className="text-[10px] bg-secondary/10 text-secondary border-0">{getCategoryName(i)}</Badge> },
                { key: "name", label: "Nombre (Científico / Común)" },
              ]}
              data={speciesHook.data}
              onAdd={() => openAdd("species", "Nueva Especie")}
              onEdit={(item) => openEdit("species", "Editar Especie", item)}
              onDelete={(item) => handleDeleteReal("species", item)}
            />
          </div>
        </TabsContent>

        {/* CANCELACIONES - REAL */}
        <TabsContent value="cancelaciones" className="mt-4">
          <ConfigDataTable title="Motivos de Cancelación" description="Razones estandarizadas. Datos persistentes." searchKey="name"
            columns={[
              { key: "name", label: "Motivo" },
              { key: "chargeable", label: "Cobrable", render: (i) => <Badge className={`text-[10px] border-0 ${i.chargeable ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{i.chargeable ? "Sí" : "No"}</Badge> },
            ]}
            data={cancelHook.data}
            onAdd={() => openAdd("cancel", "Nuevo Motivo de Cancelación")}
            onEdit={(item) => openEdit("cancel", "Editar Motivo de Cancelación", item)}
            onDelete={(item) => handleDeleteReal("cancel", item)}
          />
        </TabsContent>

        {/* RUBROS - REAL */}
        <TabsContent value="rubros" className="mt-4">
          <ConfigDataTable title="Rubros" description="Categorización comercial. Datos persistentes." searchKey="name"
            columns={[{ key: "name", label: "Nombre del Rubro" }]}
            data={bizSectorsHook.data}
            onAdd={() => openAdd("bizSectors", "Nuevo Rubro")}
            onEdit={(item) => openEdit("bizSectors", "Editar Rubro", item)}
            onDelete={(item) => handleDeleteReal("bizSectors", item)}
          />
        </TabsContent>

        {/* SECTORES - REAL */}
        <TabsContent value="sectores" className="mt-4">
          <ConfigDataTable title="Sectores de Instalaciones" description="Áreas de trabajo. Datos persistentes." searchKey="name"
            columns={[{ key: "name", label: "Nombre del Sector" }]}
            data={facSectorsHook.data}
            onAdd={() => openAdd("facSectors", "Nuevo Sector")}
            onEdit={(item) => openEdit("facSectors", "Editar Sector", item)}
            onDelete={(item) => handleDeleteReal("facSectors", item)}
          />
        </TabsContent>

        {/* INSUMOS - REAL */}
        <TabsContent value="insumos" className="mt-4">
          <div className="space-y-6">
            <ConfigDataTable title="Tipos de Insumo" description="Categorías para inventario. Datos persistentes." searchKey="name"
              columns={[{ key: "name", label: "Nombre del Tipo" }]}
              data={supplyTypesHook.data}
              onAdd={() => openAdd("supplyTypes", "Nuevo Tipo de Insumo")}
              onEdit={(item) => openEdit("supplyTypes", "Editar Tipo de Insumo", item)}
              onDelete={(item) => handleDeleteReal("supplyTypes", item)}
            />
            <ConfigDataTable title="Insumos / Plaguicidas" description="Inventario vinculado. Datos persistentes." searchKey="name"
              columns={[
                { key: "name", label: "Nombre" }, { key: "unit", label: "Unidad" },
                { key: "stock", label: "Stock", render: (i) => <span className="font-medium">{i.stock}</span> },
                { key: "type", label: "Tipo", render: (i) => <Badge variant="outline" className="text-[10px]">{getSupplyTypeName(i)}</Badge> },
              ]}
              data={suppliesHook.data}
              onAdd={() => openAdd("supplies", "Nuevo Insumo / Plaguicida")}
              onEdit={(item) => openEdit("supplies", "Editar Insumo / Plaguicida", item)}
              onDelete={(item) => handleDeleteReal("supplies", item)}
            />
          </div>
        </TabsContent>

        {/* LOGOS */}
        <TabsContent value="logos" className="mt-4">
          <div className="space-y-4">
            <div><h3 className="font-heading font-bold text-sm">Gestión de Logos</h3><p className="text-xs text-muted-foreground">Archivos visuales centralizados.</p></div>
            <div className="grid md:grid-cols-3 gap-4">
              {["Logo de Sistema", "Logo de Facturación", "Logo de Sucursal"].map((uso) => (
                <div key={uso} className="border rounded-lg p-4 text-center space-y-3">
                  <div className="h-24 bg-muted rounded flex items-center justify-center"><Image className="h-10 w-10 text-muted-foreground" /></div>
                  <p className="text-sm font-heading font-semibold">{uso}</p>
                  <Button size="sm" variant="outline" className="text-xs w-full"><FileUp className="h-3 w-3 mr-1" /> Cargar imagen</Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* MÉTODOS - REAL */}
        <TabsContent value="metodos" className="mt-4">
          <ConfigDataTable title="Métodos de Aplicación" description="Técnicas de ejecución. Datos persistentes." searchKey="name"
            columns={[{ key: "name", label: "Nombre del Método" }]}
            data={methodsHook.data}
            onAdd={() => openAdd("methods", "Nuevo Método de Aplicación")}
            onEdit={(item) => openEdit("methods", "Editar Método de Aplicación", item)}
            onDelete={(item) => handleDeleteReal("methods", item)}
          />
        </TabsContent>

        {/* USUARIOS - REAL */}
        <TabsContent value="usuarios" className="mt-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <div><h3 className="font-heading font-bold text-sm">Roles del Sistema</h3><p className="text-xs text-muted-foreground">Roles definidos en el sistema.</p></div>
              <div className="flex flex-wrap gap-2">
                {appRoles.map((r) => (
                  <Badge key={r} variant="outline" className="text-xs"><Shield className="h-3 w-3 mr-1" />{r}</Badge>
                ))}
              </div>
            </div>
            <ConfigDataTable title="Usuarios Registrados" description="Usuarios del sistema y sus roles. Datos persistentes." searchKey="name"
              columns={[
                { key: "name", label: "Nombre" },
                { key: "role", label: "Rol", render: (i: any) => <Badge className={`text-[10px] border-0 ${i.role === "admin" ? "bg-primary/10 text-primary" : i.role === "supervisor" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}>{i.role}</Badge> },
              ]}
              data={usersHook.data}
              onEdit={(item: any) => { setEditingItem(item); setFormData({ userId: item.id, userName: item.name, role: item.role }); setModalTitle("Cambiar Rol de Usuario"); setModalSection("editRole"); setModalOpen(true); }}
            />
          </div>
        </TabsContent>

        {/* DIRECTORES - REAL */}
        <TabsContent value="directores" className="mt-4">
          <ConfigDataTable title="Directores Técnicos" description="Profesionales que avalan el servicio. Datos persistentes." searchKey="name"
            columns={[
              { key: "name", label: "Nombre" }, { key: "title", label: "Título" }, { key: "license_number", label: "Matrícula" },
              { key: "license_expiry", label: "Vigencia", render: (i) => { if (!i.license_expiry) return "—"; const d = new Date(i.license_expiry); const soon = d.getTime() - Date.now() < 180 * 24 * 60 * 60 * 1000; return <Badge className={`text-[10px] border-0 ${soon ? "bg-orange-100 text-orange-700" : "bg-primary/10 text-primary"}`}>{i.license_expiry}</Badge>; }},
            ]}
            data={directorsHook.data}
            onAdd={() => openAdd("directors", "Nuevo Director Técnico")}
            onEdit={(item) => openEdit("directors", "Editar Director Técnico", item)}
            onDelete={(item) => handleDeleteReal("directors", item)}
          />
        </TabsContent>

        {/* IMPORTAR */}
        <TabsContent value="importar" className="mt-4">
          <div className="space-y-4">
            <div><h3 className="font-heading font-bold text-sm">Importar Listado de Clientes</h3><p className="text-xs text-muted-foreground">Migración masiva desde Excel.</p></div>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
              <FileUp className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Arrastra un archivo .XLSX aquí o haz clic para seleccionar</p>
              <Input type="file" accept=".xlsx,.xls" className="max-w-xs mx-auto text-sm" />
            </div>
          </div>
        </TabsContent>

        {/* PROGRAMAS - REAL */}
        <TabsContent value="programas" className="mt-4">
          <ConfigDataTable title="Programas de Acción" description="Constructor de servicios. Datos persistentes." searchKey="name"
            columns={[
              { key: "name", label: "Nombre" },
              { key: "description", label: "Descripción", render: (i) => <span className="text-muted-foreground">{i.description || "—"}</span> },
            ]}
            data={programsHook.data}
            onAdd={() => openAdd("programs", "Nuevo Programa de Acción")}
            onEdit={(item) => openEdit("programs", "Editar Programa de Acción", item)}
            onDelete={(item) => handleDeleteReal("programs", item)}
          />
        </TabsContent>
      </Tabs>

      <ConfigModal open={modalOpen} onOpenChange={setModalOpen} title={modalTitle} onSave={getModalSave()} saving={saving}>
        {getModalContent()}
      </ConfigModal>
    </div>
  );
}
