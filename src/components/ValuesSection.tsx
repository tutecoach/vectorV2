import { motion } from "framer-motion";
import { Brain, Zap, Target, ShieldCheck, Leaf } from "lucide-react";

const values = [
  {
    icon: Brain,
    title: "Inteligencia",
    description: "Soluciones predictivas con IA, no solo reactivas.",
  },
  {
    icon: Zap,
    title: "Eficiencia",
    description: "Cada módulo ahorra tiempo, reduce costos y simplifica procesos.",
  },
  {
    icon: Target,
    title: "Precisión",
    description: "Exactitud y control total desde la ruta hasta el inventario.",
  },
  {
    icon: ShieldCheck,
    title: "Confianza",
    description: "Trazabilidad y cumplimiento normativo garantizado.",
  },
  {
    icon: Leaf,
    title: "Sostenibilidad",
    description: "Reducción del uso de químicos e impacto ambiental.",
  },
];

const ValuesSection = () => {
  return (
    <section id="institucional" className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Nuestros <span className="text-gradient-vector">Valores</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Los pilares que guían cada decisión y cada línea de código en VECTOR.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-xl p-6 text-center shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover:border-primary/30"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-vector flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                <value.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
