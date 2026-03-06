import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Supply = Tables<"supplies">;

export function useSupplies() {
    return useQuery({
        queryKey: ["supplies"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("supplies")
                .select("*")
                .order("name");

            if (error) throw error;
            return data as Supply[];
        },
    });
}

export function useCreateSupply() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (supply: TablesInsert<"supplies">) => {
            const { data, error } = await supabase
                .from("supplies")
                .insert(supply)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["supplies"] }),
    });
}

export function useUpdateSupply() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updates }: TablesUpdate<"supplies"> & { id: string }) => {
            const { data, error } = await supabase
                .from("supplies")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["supplies"] }),
    });
}

export function useInventoryMovements(supplyId?: string) {
    return useQuery({
        queryKey: ["inventory_movements", supplyId],
        queryFn: async () => {
            let query = supabase
                .from("inventory_movements")
                .select(`
                    *,
                    supply: supplies(name)
                `)
                .order("created_at", { ascending: false });

            if (supplyId) {
                query = query.eq("supply_id", supplyId);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data;
        },
    });
}

export function useCreateInventoryMovement() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (movement: TablesInsert<"inventory_movements">) => {
            // First, get the current supply to update its stock
            const { data: supply, error: supplyErr } = await supabase
                .from("supplies")
                .select("current_stock")
                .eq("id", movement.supply_id)
                .single();

            if (supplyErr) throw supplyErr;

            let newStock = Number(supply.current_stock || 0);
            if (movement.movement_type === "Entrada") {
                newStock += Number(movement.quantity);
            } else if (movement.movement_type === "Salida" || movement.movement_type === "Transferencia") {
                newStock -= Number(movement.quantity);
            }

            // Update the supply stock
            const { error: updateErr } = await supabase
                .from("supplies")
                .update({ current_stock: newStock })
                .eq("id", movement.supply_id);

            if (updateErr) throw updateErr;

            // Log the movement
            const { data, error } = await supabase
                .from("inventory_movements")
                .insert(movement)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["inventory_movements"] });
            qc.invalidateQueries({ queryKey: ["supplies"] });
        },
    });
}
