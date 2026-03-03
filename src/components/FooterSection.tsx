import isologo from "@/assets/isologo-vector.jpg";

const FooterSection = () => {
  return (
    <footer className="bg-vector-carbon py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img src={isologo} alt="VECTOR" className="h-10 w-10 rounded-lg" />
            <div>
              <span className="block font-heading font-bold text-primary-foreground text-lg">
                VECTOR
              </span>
              <span className="text-xs text-vector-silver">
                El Sistema Operativo del MIP
              </span>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-6">
            {[
              { label: "Soluciones", href: "#soluciones" },
              { label: "Institucional", href: "#institucional" },
              { label: "Contacto", href: "#contacto" },
              { label: "Portal del Cliente", href: "/portal" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-vector-silver hover:text-primary-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p className="text-xs text-vector-silver">
            © {new Date().getFullYear()} VECTOR. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
