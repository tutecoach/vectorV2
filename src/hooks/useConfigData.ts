import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type TableName =
  | "species_categories" | "species" | "supply_types" | "supplies" | "action_programs"
  | "branches" | "certifications" | "cancellation_reasons" | "business_sectors"
  | "facility_sectors" | "application_methods" | "technical_directors";

type SupabaseTableName = keyof import("@/integrations/supabase/types").Database["public"]["Tables"];

function useTable<T extends Record<string, unknown>>(
  table: TableName,
  select = "*",
  orderBy = "created_at"
) {
  const qc = useQueryClient();
  const key = [table];

  const query = useQuery<T[]>({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select(select)
        .order(orderBy, { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as T[];
    },
  });

  const insertMut = useMutation({
    mutationFn: async (row: Partial<T>) => {
      const { error } = await supabase.from(table).insert(row as TablesInsert<typeof table & SupabaseTableName>);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success("Registro creado"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, ...rest }: { id: string } & Partial<T>) => {
      const { error } = await supabase.from(table).update(rest as TablesUpdate<typeof table & SupabaseTableName>).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success("Registro actualizado"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success("Registro eliminado"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return { data: query.data ?? [], isLoading: query.isLoading, insert: insertMut, update: updateMut, remove: deleteMut };
}

/* ---- Exported hooks ---- */
export function useSpeciesCategories() { return useTable<{ id: string; name: string }>("species_categories"); }
export function useSpecies() { return useTable<{ id: string; name: string; category_id: string }>("species", "*, species_categories(name)"); }
export function useSupplyTypes() { return useTable<{ id: string; name: string }>("supply_types"); }
export function useSupplies() { return useTable<{ id: string; name: string; type_id: string; unit: string; stock: number }>("supplies", "*, supply_types(name)"); }
export function useActionPrograms() { return useTable<{ id: string; name: string; description: string | null }>("action_programs"); }
export function useBranches() { return useTable<{ id: string; name: string; cuit: string; phone: string; email: string; province: string; city: string; address: string; shift_start: string; header_bg_color: string; header_text_color: string }>("branches"); }
export function useCertifications() { return useTable<{ id: string; jurisdiction: string; name: string; registration_number: string; expiry_date: string; pest_control: boolean; tank_cleaning: boolean; technical_director: string }>("certifications"); }
export function useCancellationReasons() { return useTable<{ id: string; name: string; chargeable: boolean }>("cancellation_reasons"); }
export function useBusinessSectors() { return useTable<{ id: string; name: string }>("business_sectors"); }
export function useFacilitySectors() { return useTable<{ id: string; name: string }>("facility_sectors"); }
export function useApplicationMethods() { return useTable<{ id: string; name: string }>("application_methods"); }
export function useTechnicalDirectors() { return useTable<{ id: string; name: string; title: string; license_number: string; license_expiry: string }>("technical_directors"); }

/* ---- Single-row settings hooks ---- */
export function useCompanyInfo() {
  const qc = useQueryClient();
  const key = ["company_info"];
  const query = useQuery<Tables<"company_info"> | null>({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("company_info").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const upsert = useMutation({
    mutationFn: async (row: TablesInsert<"company_info"> | TablesUpdate<"company_info">) => {
      if (query.data?.id) {
        const { error } = await supabase.from("company_info").update(row as TablesUpdate<"company_info">).eq("id", query.data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("company_info").insert(row as TablesInsert<"company_info">);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success("Datos de empresa actualizados"); },
    onError: (e: Error) => toast.error(e.message),
  });
  return { data: query.data, isLoading: query.isLoading, upsert };
}

export function useLegalRepresentative() {
  const qc = useQueryClient();
  const key = ["legal_representative"];
  const query = useQuery<Tables<"legal_representative"> | null>({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("legal_representative").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const upsert = useMutation({
    mutationFn: async (row: TablesInsert<"legal_representative"> | TablesUpdate<"legal_representative">) => {
      if (query.data?.id) {
        const { error } = await supabase.from("legal_representative").update(row as TablesUpdate<"legal_representative">).eq("id", query.data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("legal_representative").insert(row as TablesInsert<"legal_representative">);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success("Representante legal actualizado"); },
    onError: (e: Error) => toast.error(e.message),
  });
  return { data: query.data, isLoading: query.isLoading, upsert };
}

/* ---- Users & Roles hooks ---- */
interface UserWithRole {
  id: string;
  name: string;
  phone: string | null;
  role: string;
}

export function useUsers() {
  const query = useQuery<UserWithRole[]>({
    queryKey: ["users_with_roles"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase.from("profiles").select("user_id, name, phone");
      if (error) throw error;
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      const roleMap = new Map((roles || []).map(r => [r.user_id, r.role]));
      return (profiles || []).map(p => ({
        id: p.user_id,
        name: p.name,
        phone: p.phone,
        role: roleMap.get(p.user_id) || "sin_rol",
      }));
    },
  });
  return { data: query.data ?? [], isLoading: query.isLoading };
}

export function useUserRoles() {
  const qc = useQueryClient();
  const updateRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { data: existing } = await supabase.from("user_roles").select("id").eq("user_id", userId).maybeSingle();
      if (existing) {
        const { error } = await supabase.from("user_roles").update({ role } as TablesUpdate<"user_roles">).eq("user_id", userId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role } as TablesInsert<"user_roles">);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users_with_roles"] }); toast.success("Rol actualizado"); },
    onError: (e: Error) => toast.error(e.message),
  });
  return { updateRole };
}
