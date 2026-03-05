import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type WorkOrder = Tables<"work_orders"> & {
    client: Pick<Tables<"clients">, "name"> | null;
    site: Pick<Tables<"client_sites">, "name"> | null;
    technician: Pick<Tables<"profiles">, "name"> | null;
};
type WorkOrderInsert = TablesInsert<"work_orders">;

export function useWorkOrders() {
    return useQuery({
        queryKey: ["work_orders"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("work_orders")
                .select(`
          *,
          client: clients(name),
          site: client_sites(name),
          technician: profiles!work_orders_technician_id_fkey(name)
        `)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as unknown as WorkOrder[];
        },
    });
}

export function useCreateWorkOrder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (order: WorkOrderInsert) => {
            const { data, error } = await supabase
                .from("work_orders")
                .insert(order)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["work_orders"] }),
    });
}

export function useTechnicians() {
    return useQuery({
        queryKey: ["technicians"],
        queryFn: async () => {
            // Fetch all profiles to ensure we have data. For a real app,
            // we'd filter either by joining or doing a 2-step query.
            const { data, error } = await supabase
                .from("profiles")
                .select("id, user_id, name");

            if (error) throw error;
            // The foreign key on work_orders expects technician_id to match profiles.user_id
            return data.map(profile => ({
                id: profile.user_id, // Map user_id to id for the UI Select component
                name: profile.name,
                original_id: profile.id
            }));
        },
    });
}
