import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Invoice = Tables<"invoices"> & {
    client: Pick<Tables<"clients">, "name"> | null;
    work_order: Pick<Tables<"work_orders">, "id"> | null;
};

export function useInvoices() {
    return useQuery({
        queryKey: ["invoices"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("invoices")
                .select(`
                    *,
                    client: clients(name),
                    work_order: work_orders(id)
                `)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as unknown as Invoice[];
        },
    });
}

export function useCreateInvoice() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (invoice: TablesInsert<"invoices">) => {
            const { data, error } = await supabase
                .from("invoices")
                .insert(invoice)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
    });
}

export function useUpdateInvoice() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updates }: TablesUpdate<"invoices"> & { id: string }) => {
            const { data, error } = await supabase
                .from("invoices")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
    });
}
