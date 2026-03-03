import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

export interface ConfigDataTableProps<T> {
  title: string;
  description: string;
  columns: Column<T>[];
  data: T[];
  onAdd?: () => void;
  onEdit: (item: T) => void;
  onDelete?: (item: T) => void;
  searchKey?: string;
}

export default function ConfigDataTable<T extends Record<string, any>>({
  title,
  description,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  searchKey,
}: ConfigDataTableProps<T>) {
  const [search, setSearch] = useState("");

  const filtered = searchKey
    ? data.filter((item) =>
        String(item[searchKey] ?? "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : data;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-heading font-bold text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground font-body">{description}</p>
        </div>
        {onAdd && (
          <Button size="sm" className="bg-primary hover:bg-primary/90 font-heading text-sm" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-1" /> Agregar
          </Button>
        )}
      </div>

      {searchKey && (
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-9 h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((col) => (
                <TableHead key={col.key} className="font-heading text-xs">
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="font-heading text-xs w-24 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8 text-sm text-muted-foreground">
                  No hay registros. Haz clic en "Agregar" para crear uno.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-sm font-body">
                      {col.render ? col.render(item) : String(item[col.key] ?? "")}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(item)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      {onDelete && (
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(item)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
