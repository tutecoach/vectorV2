import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useCreateSupply } from "@/hooks/useInventory";
import { useSupplyTypes } from "@/hooks/useConfigData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

const formSchema = z.object({
    name: z.string().min(1, "El nombre del insumo es obligatorio"),
    type_id: z.string().min(1, "Debe seleccionar un tipo"),
    unit: z.string().min(1, "La unidad de medida es obligatoria"),
    stock: z.coerce.number().min(0, "El stock actual debe ser 0 o mayor"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewSupplyDialog() {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const createSupply = useCreateSupply();
    const { data: supplyTypes, isLoading: loadingTypes } = useSupplyTypes();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type_id: "",
            unit: "L",
            stock: 0,
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            await createSupply.mutateAsync({
                name: values.name,
                type_id: values.type_id,
                unit: values.unit,
                stock: values.stock,
            });

            toast({
                title: "Insumo Creado",
                description: "El insumo se ha guardado correctamente.",
            });

            form.reset();
            setOpen(false);
        } catch (error: any) {
            console.error("Error creating Supply:", error);
            toast({
                variant: "destructive",
                title: "Error al crear insumo",
                description: error?.message || "Ocurrió un error inesperado al guardar.",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-primary font-heading text-sm">
                    <Plus className="h-4 w-4 mr-1" /> Nuevo Insumo
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-heading">Registrar Nuevo Insumo</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre Comercial / Genérico <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Deltametrina 2.5%" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo / Categoría</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger disabled={loadingTypes}>
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {supplyTypes?.map((t) => (
                                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
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
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock Inicial</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="any" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unidad</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="L">Litros (L)</SelectItem>
                                                <SelectItem value="kg">Kilos (kg)</SelectItem>
                                                <SelectItem value="u">Unidades (u)</SelectItem>
                                                <SelectItem value="g">Gramos (g)</SelectItem>
                                                <SelectItem value="ml">Mililitros (ml)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={createSupply.isPending}>
                                {createSupply.isPending ? "Guardando..." : "Guardar Insumo"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
