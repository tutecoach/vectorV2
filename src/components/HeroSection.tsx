import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-vector-carbon/60 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-primary/15 text-vector-green text-sm font-medium border border-primary/20">
              El Sistema Operativo del MIP
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6" style={{ color: "white" }}>
              Potencie su empresa MIP con{" "}
              <span className="text-gradient-vector">Inteligencia Estratégica</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 max-w-2xl" style={{ color: "hsl(0 0% 80%)" }}>
              Optimice operaciones, maximice rentabilidad y garantice
              cumplimiento normativo con la plataforma más completa de
              Latinoamérica.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#contacto"
              className="inline-flex items-center justify-center rounded-lg bg-secondary px-8 py-4 text-base font-semibold text-secondary-foreground shadow-cta hover:opacity-90 transition-all"
            >
              Solicitar Demo Personalizada
            </a>
            <a
              href="#soluciones"
              className="inline-flex items-center justify-center rounded-lg border border-border/30 px-8 py-4 text-base font-medium transition-colors hover:bg-muted/10"
              style={{ color: "hsl(0 0% 85%)" }}
            >
              Ver Soluciones
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 flex flex-wrap items-center gap-8"
            style={{ color: "hsl(0 0% 55%)" }}
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-vector-green" />
              ISO 9001 Compatible
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-vector-green" />
              HACCP Ready
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-vector-green" />
              BRC Certified
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
