CREATE TYPE invoice_status AS ENUM ('Pagada', 'Pendiente', 'Vencida', 'Anulada');
CREATE TYPE inventory_movement_type AS ENUM ('Entrada', 'Salida', 'Transferencia', 'Ajuste');

CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    status invoice_status NOT NULL DEFAULT 'Pendiente',
    type TEXT NOT NULL DEFAULT 'Servicio',
    work_order_id UUID REFERENCES public.work_orders(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supply_id UUID NOT NULL REFERENCES public.supplies(id) ON DELETE CASCADE,
    movement_type inventory_movement_type NOT NULL,
    quantity NUMERIC(15, 2) NOT NULL,
    source_location TEXT,
    destination_location TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

-- Polices for invoices
CREATE POLICY "Allow read access for all authenticated users on invoices" ON public.invoices FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow insert access for authenticated users on invoices" ON public.invoices FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow update access for authenticated users on invoices" ON public.invoices FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow delete access for authenticated users on invoices" ON public.invoices FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for inventory_movements
CREATE POLICY "Allow read access for all authenticated users on inventory_movements" ON public.inventory_movements FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow insert access for authenticated users on inventory_movements" ON public.inventory_movements FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow update access for authenticated users on inventory_movements" ON public.inventory_movements FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow delete access for authenticated users on inventory_movements" ON public.inventory_movements FOR DELETE USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();
