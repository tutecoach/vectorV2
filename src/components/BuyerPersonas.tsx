import { motion } from "framer-motion";
import { TrendingUp, ClipboardCheck, Route } from "lucide-react";

const personas = [
  {
    icon: TrendingUp,
    name: "Carlos",
    role: "Dueño de PYME MIP",
    challenge: "Necesita visibilidad total de su negocio y maximizar rentabilidad.",
    benefits: [
      "Dashboard con KPIs en tiempo real",
      "Análisis de rentabilidad por cliente y servicio",
      "Control financiero centralizado",
    ],
    color: "from-vector-green to-vector-blue",
  },
  {
    icon: ClipboardCheck,
    name: "Laura",
    role: "Jefa de Calidad",
    challenge: "Debe garantizar trazabilidad total y aprobar auditorías sin estrés.",
    benefits: [
      "Reportes automáticos ISO, BRC, HACCP",
      "Trazabilidad de cada producto y servicio",
      "Certificados digitales al instante",
    ],
    color: "from-vector-blue to-vector-green",
  },
  {
    icon: Route,
    name: "Marcos",
    role: "Planificador de Servicios",
    challenge: "Necesita rutas eficientes y una agenda sin conflictos.",
    benefits: [
      "Optimización de rutas con IA",
      "Calendario inteligente sin solapamientos",
      "Asignación automática de técnicos",
    ],
    color: "from-vector-green to-vector-blue",
  },
];

const BuyerPersonas = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Diseñado para <span className="text-gradient-vector">su Rol</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cada perfil encuentra en VECTOR las herramientas exactas para alcanzar sus objetivos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {personas.map((persona, index) => (
            <motion.div
              key={persona.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-card rounded-2xl p-8 border border-border shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${persona.color} flex items-center justify-center text-primary-foreground mb-5`}>
                <persona.icon size={28} strokeWidth={1.5} />
              </div>

              <h3 className="font-heading font-bold text-xl text-foreground mb-1">
                {persona.name}
              </h3>
              <p className="text-sm font-medium text-secondary mb-4">
                {persona.role}
              </p>
              <p className="text-muted-foreground text-sm mb-6 italic">
                "{persona.challenge}"
              </p>

              <ul className="space-y-3">
                {persona.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-vector-green mt-2 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuyerPersonas;
