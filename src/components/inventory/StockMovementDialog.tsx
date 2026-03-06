import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useCreateInventoryMovement, useSupplies } from "@/hooks/useInventory";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    supply_id: z.string().min(1, "Debe seleccionar un insumo"),
    movement_type: z.enum(["Entrada", "Salida", "Transferencia"]),
    quantity: z.coerce.number().min(0.01, "La cantidad debe ser mayor a 0"),
    source_location: z.string().optional(),
    destination_location: z.string().optional(),
    notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function StockMovementDialog() {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const { data: supplies, isLoading: loadingSupplies } = useSupplies();
    const createMovement = useCreateInventoryMovement();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            supply_id: "",
            movement_type: "Salida",
            quantity: 0,
            source_location: "Depósito Central",
            destination_location: "",
            notes: "",
        },
    });

    const movementType = form.watch("movement_type");

    const onSubmit = async (values: FormValues) => {
        try {
            await createMovement.mutateAsync({
                supply_id: values.supply_id,
                movement_type: values.movement_type,
                quantity: values.quantity,
                source_location: values.source_location || null,
                destination_location: values.destination_location || null,
                notes: values.notes || null,
            });

            toast({
                title: "Movimiento Registrado",
                description: "Se ha actualizado el stock correctamente.",
            });

            form.reset();
            setOpen(false);
        } catch (error: any) {
            console.error("Error creating movement:", error);
            toast({
                variant: "destructive",
                title: "Error al registrar movimiento",
                description: error?.message || "Ocurrió un error inesperado al actualizar el stock.",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="font-heading text-sm">
                    <ArrowLeftRight className="h-4 w-4 mr-1" /> Registrar Movimiento
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="font-heading">Movimiento de Stock</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="supply_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Insumo <span className="text-destructive">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger disabled={loadingSupplies}>
                                                <SelectValue placeholder="Seleccionar insumo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {supplies?.map((s) => (
                                                <SelectItem key={s.id} value={s.id}>
                                                    {s.name} ({s.stock || 0} {s.unit})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="movement_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo de Mov.</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Entrada">Entrada</SelectItem>
                                                <SelectItem value="Salida">Salida</SelectItem>
                                                <SelectItem value="Transferencia">Transferencia</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cantidad <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="number" step="any" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="source_location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Origen</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Depósito Central" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="destination_location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Destino</FormLabel>
                                        <FormControl>
                                            <Input placeholder={movementType === "Entrada" ? "Ej: Depósito Central" : "Ej: VH-001"} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notas</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Motivo o detalle opcional..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={createMovement.isPending}>
                                {createMovement.isPending ? "Procesando..." : "Confirmar Movimiento"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
