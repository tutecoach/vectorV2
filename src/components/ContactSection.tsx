import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Nombre requerido").max(100),
  company: z.string().trim().min(1, "Empresa requerida").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().max(1000).optional(),
});

const ContactSection = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast({
        title: "Error",
        description: result.error.errors[0]?.message || "Revise los campos.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "¡Enviado!",
      description: "Nos pondremos en contacto pronto.",
    });
    setForm({ name: "", company: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="contacto" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Comience su <span className="text-gradient-vector">Transformación</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Solicite una demostración personalizada y descubra cómo VECTOR puede potenciar su operación.
            </p>

            <div className="space-y-6">
              <a
                href="https://wa.me/5492645792222"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-vector flex items-center justify-center text-primary-foreground">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-foreground">WhatsApp Directo</span>
                  <span className="text-muted-foreground text-sm">+54 9 264 5792222</span>
                </div>
              </a>

              <div className="p-4 rounded-xl bg-muted border border-border">
                <span className="block text-sm font-semibold text-foreground mb-1">Portal del Cliente</span>
                <p className="text-muted-foreground text-sm mb-2">
                  Autogestión 24/7: certificados, facturas y más.
                </p>
                <a href="/portal" className="text-secondary font-medium text-sm hover:underline">
                  Acceder al Portal →
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-2xl p-8 border border-border shadow-card space-y-5"
            >
              <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                Solicitar Demo
              </h3>
              {[
                { key: "name", label: "Nombre completo", type: "text", required: true },
                { key: "company", label: "Empresa", type: "text", required: true },
                { key: "email", label: "Email corporativo", type: "email", required: true },
                { key: "phone", label: "Teléfono (opcional)", type: "tel", required: false },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    required={field.required}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Mensaje (opcional)
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground shadow-cta hover:opacity-90 transition-opacity"
              >
                <Send size={16} />
                Enviar Solicitud
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
