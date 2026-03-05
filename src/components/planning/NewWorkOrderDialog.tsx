import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useClients, useClientSites } from "@/hooks/useCRM";
import { useCreateWorkOrder, useTechnicians } from "@/hooks/usePlanning";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
    client_id: z.string().min(1, "Debe seleccionar un cliente"),
    site_id: z.string().optional(),
    technician_id: z.string().optional(),
    scheduled_date: z.string().optional(),
    flexible_schedule: z.boolean().default(false),
    status: z.enum(["pendiente", "en_progreso", "completada", "cancelada"]).default("pendiente"),
    notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewWorkOrderDialog() {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const { data: clients, isLoading: loadingClients } = useClients();
    const { data: technicians, isLoading: loadingTechs } = useTechnicians();
    const createWorkOrder = useCreateWorkOrder();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            client_id: "",
            site_id: "",
            technician_id: "",
            scheduled_date: "",
            flexible_schedule: false,
            status: "pendiente",
            notes: "",
        },
    });

    const selectedClientId = form.watch("client_id");
    const { data: sites, isLoading: loadingSites } = useClientSites(selectedClientId || null);

    // Resetear sitio si cambia de cliente
    useEffect(() => {
        form.setValue("site_id", "");
    }, [selectedClientId, form]);

    const onSubmit = async (values: FormValues) => {
        try {
            await createWorkOrder.mutateAsync({
                client_id: values.client_id,
                site_id: values.site_id,
                technician_id: values.technician_id || null,
                scheduled_date: values.scheduled_date || null,
                flexible_schedule: values.flexible_schedule,
                status: values.status,
                notes: values.notes,
            });

            toast({
                title: "Orden de Trabajo Creada",
                description: "La OT se generó correctamente.",
            });

            form.reset();
            setOpen(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error al crear OT",
                description: "Ha ocurrido un error inesperado al guardar la orden.",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-primary font-heading text-sm">
                    <Plus className="h-4 w-4 mr-1" /> Nueva OT
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="font-heading">Crear Orden de Trabajo</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

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
                                            {clients?.filter(c => c.status === "activo").map((c) => (
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

                        <FormField
                            control={form.control}
                            name="site_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sede / Locación</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedClientId || loadingSites}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar sede" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sites?.map((s) => (
                                                <SelectItem key={s.id} value={s.id}>
                                                    {s.name}
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
                                name="technician_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Técnico Asignado</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger disabled={loadingTechs}>
                                                    <SelectValue placeholder="Sin asignar" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {technicians?.map((t: any) => (
                                                    <SelectItem key={t.id} value={t.id}>
                                                        {t.name || "Sin Nombre"}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="scheduled_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha Programada</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="flexible_schedule"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Horario Flexible</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notas u Observaciones</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Instrucciones especiales para la orden..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={createWorkOrder.isPending}>
                                {createWorkOrder.isPending ? "Guardando..." : "Crear Orden"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
