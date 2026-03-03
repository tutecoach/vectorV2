import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  saving?: boolean;
}

export default function ConfigModal({
  open,
  onOpenChange,
  title,
  children,
  onSave,
  saving,
}: ConfigModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto p-0">
        {/* Orange warning header */}
        <div className="bg-orange-500 text-white px-6 py-3 flex items-center gap-2 rounded-t-lg">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-heading font-semibold">
            ¡Un momento! Te recomendamos tener precaución extra al editar estos elementos.
          </span>
        </div>

        <DialogHeader className="px-6 pt-4">
          <DialogTitle className="font-heading text-lg">{title}</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-2 space-y-4">{children}</div>

        <DialogFooter className="px-6 pb-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading"
          >
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
