import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Package,
  DollarSign,
  BarChart3,
  Settings,
} from "lucide-react";

const modules = [
  {
    icon: LayoutDashboard,
    title: "Puesto de Mando",
    subtitle: "Dashboard",
    description:
      "KPIs en tiempo real, Agenda Inteligente y Alertas Predictivas por IA para decisiones rápidas.",
    features: ["KPIs Principales", "Alertas por IA", "Mapa Táctico"],
  },
  {
    icon: Users,
    title: "Clientes y Ventas",
    subtitle: "CRM",
    description:
      "Ficha 360° del cliente, Pipeline Kanban y Asistente de Cotización potenciado con IA.",
    features: ["Ficha 360°", "Pipeline Kanban", "Cotización IA"],
  },
  {
    icon: MapPin,
    title: "Gestión de Campo",
    subtitle: "Operaciones",
    description:
      "Optimizador de Rutas por IA, gestión de técnicos, flota y calendario maestro.",
    features: ["Rutas Óptimas IA", "Calendario Maestro", "GPS en Vivo"],
  },
  {
    icon: Package,
    title: "Logística e Inventario",
    subtitle: "Stock",
    description:
      "Stock proactivo, trazabilidad de insumos con MSDS y planificación de compras inteligente.",
    features: ["Stock Proactivo", "Trazabilidad MSDS", "Compras IA"],
  },
  {
    icon: DollarSign,
    title: "Administración y Finanzas",
    subtitle: "Finanzas",
    description:
      "Facturación recurrente, cuentas corrientes y análisis de rentabilidad por IA.",
    features: ["Facturación", "Rentabilidad IA", "Cuentas Corrientes"],
  },
  {
    icon: BarChart3,
    title: "Inteligencia y Calidad",
    subtitle: "Reportes",
    description:
      "Reportes para auditorías ISO, BRC, HACCP, mapas de calor y análisis de tendencias.",
    features: ["Auditorías ISO/BRC", "Mapas de Calor", "Tendencias"],
  },
  {
    icon: Settings,
    title: "Configuración",
    subtitle: "Core",
    description:
      "Automatización de flujos de trabajo (Workflows), integraciones API y personalización total.",
    features: ["Workflows", "API REST", "Roles y Permisos"],
  },
];

const ModulesSection = () => {
  return (
    <section id="soluciones" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            7 Pilares <span className="text-gradient-vector">Operativos</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Un ecosistema completo para gestionar cada aspecto de su empresa MIP.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {modules.map((mod, index) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative bg-card rounded-2xl p-7 border border-border shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "var(--gradient-card-hover)" }} />

              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-vector flex items-center justify-center text-primary-foreground shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <mod.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground text-lg leading-tight">
                      {mod.title}
                    </h3>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {mod.subtitle}
                    </span>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  {mod.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {mod.features.map((f) => (
                    <span
                      key={f}
                      className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
