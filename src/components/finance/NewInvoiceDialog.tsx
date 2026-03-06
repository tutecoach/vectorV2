import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/hooks/useCRM";
import { useWorkOrders } from "@/hooks/usePlanning";
import { useCreateInvoice } from "@/hooks/useFinance";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    invoice_number: z.string().min(1, "El número de factura es obligatorio"),
    client_id: z.string().min(1, "Debe seleccionar un cliente"),
    amount: z.coerce.number().min(1, "El monto debe ser mayor a 0"),
    due_date: z.string().min(1, "La fecha de vencimiento es obligatoria"),
    status: z.enum(["Pagada", "Pendiente", "Vencida", "Anulada"]).default("Pendiente"),
    type: z.string().min(1, "El tipo es obligatorio"),
    work_order_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewInvoiceDialog() {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const { data: clients, isLoading: loadingClients } = useClients();
    const { data: workOrders, isLoading: loadingOrders } = useWorkOrders();
    const createInvoice = useCreateInvoice();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            invoice_number: "",
            client_id: "",
            amount: 0,
            due_date: "",
            status: "Pendiente",
            type: "Servicio",
            work_order_id: "",
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            await createInvoice.mutateAsync({
                invoice_number: values.invoice_number,
                client_id: values.client_id,
                amount: values.amount,
                due_date: values.due_date,
                status: values.status,
                type: values.type,
                work_order_id: values.work_order_id || null,
            });

            toast({
                title: "Factura Creada",
                description: "La factura se ha generado correctamente.",
            });

            form.reset();
            setOpen(false);
        } catch (error: any) {
            console.error("Error creating Invoice:", error);
            toast({
                variant: "destructive",
                title: "Error al crear factura",
                description: error?.message || "Hubo un problema al guardar la factura.",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-primary font-heading text-sm">
                    <Plus className="h-4 w-4 mr-1" /> Nueva Factura
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-heading">Crear Nueva Factura</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="invoice_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número de Factura <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: FAC-0001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="client_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cliente <span className="text-destructive">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger disabled={loadingClients}>
                                                <SelectValue placeholder="Seleccionar cliente" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {clients?.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.name}
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
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Monto ($) <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="due_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vencimiento <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo de Servicio</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Servicio">Servicio</SelectItem>
                                                <SelectItem value="Insumo">Insumo</SelectItem>
                                                <SelectItem value="Contrato">Contrato</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Pendiente">Pendiente</SelectItem>
                                                <SelectItem value="Pagada">Pagada</SelectItem>
                                                <SelectItem value="Vencida">Vencida</SelectItem>
                                                <SelectItem value="Anulada">Anulada</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="work_order_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Orden de Trabajo (Opcional)</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger disabled={loadingOrders}>
                                                <SelectValue placeholder="Sin OT asociada" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">Sin OT asociada</SelectItem>
                                            {workOrders?.map((wo) => (
                                                <SelectItem key={wo.id} value={wo.id}>
                                                    OT-{wo.id.split("-").pop()?.substring(0, 6)} ({wo.client?.name})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={createInvoice.isPending}>
                                {createInvoice.isPending ? "Guardando..." : "Crear Factura"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
