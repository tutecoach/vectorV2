import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, LogIn, AlertCircle, UserPlus, ArrowLeft } from "lucide-react";
import logoVector from "@/assets/logo-vector.jpg";

type View = "login" | "signup" | "forgot";

const Login = () => {
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate("/dashboard", { replace: true });
    } else {
      setError(result.error || "Credenciales incorrectas.");
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const result = await signup(email, password, name);
    if (result.success) {
      setSuccess("Cuenta creada. Revise su email para confirmar el registro.");
      setView("login");
    } else {
      setError(result.error || "Error al crear la cuenta.");
    }
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const result = await resetPassword(email);
    if (result.success) {
      setSuccess("Se envió un link de recuperación a su email.");
    } else {
      setError(result.error || "Error al enviar el link.");
    }
    setLoading(false);
  };

  const switchView = (v: View) => {
    setView(v);
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-vector-silver p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardContent className="pt-10 pb-8 px-8">
          <div className="flex justify-center mb-8">
            <img src={logoVector} alt="VECTOR" className="h-14 object-contain" />
          </div>

          <h1 className="text-xl font-heading font-bold text-center text-foreground mb-1">
            {view === "login" && "Acceso al Sistema"}
            {view === "signup" && "Crear Cuenta"}
            {view === "forgot" && "Recuperar Contraseña"}
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            {view === "login" && "Ingrese sus credenciales para continuar"}
            {view === "signup" && "Complete los datos para registrarse"}
            {view === "forgot" && "Ingrese su email para recibir un link de recuperación"}
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 text-destructive rounded-md p-3 mb-6 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-primary/10 text-primary rounded-md p-3 mb-6 text-sm">
              {success}
            </div>
          )}

          {view === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-heading text-sm">Correo electrónico</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@empresa.com" required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-heading text-sm">Contraseña</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="h-11 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11 bg-secondary hover:bg-secondary/90 font-heading text-sm">
                {loading ? (
                  <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />Verificando...</span>
                ) : (
                  <span className="flex items-center gap-2"><LogIn className="h-4 w-4" />Ingresar</span>
                )}
              </Button>
              <div className="flex items-center justify-between text-xs">
                <button type="button" onClick={() => switchView("forgot")} className="text-muted-foreground hover:text-foreground transition-colors">¿Olvidó su contraseña?</button>
                <button type="button" onClick={() => switchView("signup")} className="text-secondary hover:text-secondary/80 font-medium transition-colors">Crear cuenta</button>
              </div>
            </form>
          )}

          {view === "signup" && (
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <Label className="font-heading text-sm">Nombre completo</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan Pérez" required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label className="font-heading text-sm">Correo electrónico</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@empresa.com" required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label className="font-heading text-sm">Contraseña</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} className="h-11 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11 bg-primary hover:bg-primary/90 font-heading text-sm">
                {loading ? "Creando cuenta..." : <span className="flex items-center gap-2"><UserPlus className="h-4 w-4" />Registrarse</span>}
              </Button>
              <button type="button" onClick={() => switchView("login")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground w-full justify-center">
                <ArrowLeft className="h-3 w-3" />Volver al inicio de sesión
              </button>
            </form>
          )}

          {view === "forgot" && (
            <form onSubmit={handleForgot} className="space-y-5">
              <div className="space-y-2">
                <Label className="font-heading text-sm">Correo electrónico</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@empresa.com" required className="h-11" />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11 bg-primary hover:bg-primary/90 font-heading text-sm">
                {loading ? "Enviando..." : "Enviar link de recuperación"}
              </Button>
              <button type="button" onClick={() => switchView("login")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground w-full justify-center">
                <ArrowLeft className="h-3 w-3" />Volver al inicio de sesión
              </button>
            </form>
          )}

          <p className="text-xs text-muted-foreground text-center mt-8">
            VECTOR © 2026 — Todos los derechos reservados
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
